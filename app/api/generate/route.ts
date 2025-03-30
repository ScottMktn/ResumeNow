import {
  ExtraCurricular,
  Job,
  ProfessionalExperience,
  Resume,
  saveGeneratedResume,
} from "@/utils/db/dynamoDb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import buildDoc, { ResumeData } from "@/utils/doc/buildDoc";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

// Helper function to upload a file to S3
async function uploadToS3(key: string, data: Buffer, contentType: string) {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });

  const command = new PutObjectCommand({
    Bucket: "resume-now",
    Key: key,
    Body: data,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Generate a pre-signed URL for the file
  const getCommand = new GetObjectCommand({
    Bucket: "resume-now",
    Key: key,
  });

  const presignedUrl = await getSignedUrl(s3Client, getCommand, {
    expiresIn: 3600,
  });

  return presignedUrl;
}

// Convert Resume to ResumeData format for DOCX generation
function convertToResumeData(resume: Resume, jobTitle: string): ResumeData {
  return {
    PersonalInfo: {
      Name: resume.name,
      Title: jobTitle || resume.jobRole,
      Location: resume.address,
      Email: resume.emailAddress,
      Phone: resume.phoneNumber,
    },
    Experience: resume.professionalExperience.map((exp) => ({
      Company: exp.companyName,
      Title: exp.jobTitle,
      Location: exp.jobLocation,
      StartDate: exp.jobDateRange.split("-")[0].trim(),
      EndDate: exp.jobDateRange.split("-")[1]?.trim() || "Present",
      Responsibilities: exp.jobBullets,
    })),
    Extracurricular: resume.extraCurriculars.map((activity) => ({
      Title: activity.activityName,
      Description: [activity.description],
    })),
    Education: {
      Institution: resume.education.collegeName,
      Degree: resume.education.degree,
      GPA: resume.education.gpa.toString(),
      Dates: resume.education.dateRange,
    },
    Skills: {
      TechnicalSkills: resume.technicalSkills.join(", "),
      Interests: resume.toolsAndTechnologies.join(", "),
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resume, job } = await request.json();

    const jobDetails = job as Omit<Job, "id" | "userId" | "createdAt">;

    const resumeDetails = resume as Resume;

    const professionalExperience = resumeDetails.professionalExperience;
    const extraCurriculars = resumeDetails.extraCurriculars;
    const technicalSkills = resumeDetails.technicalSkills;
    const toolsAndTechnologies = resumeDetails.toolsAndTechnologies;

    console.log("getting job and resume details...");

    const prompt = `
    *Your Role*: You are an expert resume optimizer with deep knowledge of applicant tracking systems (ATS) and hiring practices.

    *Your Task*: Analyze both the job listing and the candidate's existing resume, then create an optimized version that:
    1. Aligns the candidate's experience with the job requirements
    2. Incorporates relevant keywords to pass ATS screening
    3. Quantifies achievements where possible
    4. Highlights transferable skills that match the job
    5. Uses industry-standard formatting and terminology

    *Important Guidelines*:
    - Maintain truthfulness - only enhance existing experience, never fabricate
    - Use action verbs and specific metrics when possible
    - Match keywords from the job description naturally
    - Focus on achievements rather than responsibilities
    - Prioritize recent and relevant experience
    - Be concise and impactful in all bullet points
    - Make sure the number of bullets is exactly the same as the number of bullets in the original resume. no more, no less.

    *Your Output*: Return a JSON object with the following optimized resume sections:
      - professionalExperience: Array of work experiences with improved bullets that highlight relevant skills
      - extraCurriculars: Array of activities that demonstrate relevant soft skills or interests
      - technicalSkills: Array of technical skills prioritized to match job requirements
      - toolsAndTechnologies: Array of tools and technologies aligned with job needs

    *Job Details*:
    - companyName: ${jobDetails.companyName}
    - jobTitle: ${jobDetails.jobTitle}
    - summary: ${jobDetails.summary}
    - keySkills: ${jobDetails.keySkills}
    - keyRequirements: ${jobDetails.keyRequirements}

    *Candidate's Current Resume*:
    Professional Experience: ${JSON.stringify(professionalExperience)}
    Extra Curriculars: ${JSON.stringify(extraCurriculars)}
    Technical Skills: ${JSON.stringify(technicalSkills)}
    Tools and Technologies: ${JSON.stringify(toolsAndTechnologies)}
    `;
    console.log("sending to openai...");

    const response = await openai.beta.chat.completions.parse({
      model: "o3-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: zodResponseFormat(
        z.object({
          professionalExperience: z
            .array(
              z.object({
                companyName: z.string(),
                jobTitle: z.string(),
                jobBullets: z.array(z.string()),
                jobLocation: z.string(),
                jobDateRange: z.string(),
              })
            )
            .nullable(),
          extraCurriculars: z
            .array(
              z.object({
                activityName: z.string(),
                dateRange: z.string(),
                description: z.string(),
              })
            )
            .nullable(),
          technicalSkills: z.array(z.string()).nullable(),
          toolsAndTechnologies: z.array(z.string()).nullable(),
        }),
        "event"
      ),
    });

    const event = response.choices[0].message.parsed;

    // create a copy of the resume with the new returned data from openai
    const newResume: Resume = {
      ...resumeDetails,
      professionalExperience:
        event?.professionalExperience as ProfessionalExperience[],
      extraCurriculars: event?.extraCurriculars as ExtraCurricular[],
      technicalSkills: event?.technicalSkills as string[],
      toolsAndTechnologies: event?.toolsAndTechnologies as string[],
    };

    // Generate DOCX file
    console.log("generating DOCX file...");
    const resumeData = convertToResumeData(newResume, jobDetails.jobTitle);
    const docxBuffer = await buildDoc(resumeData);

    // Create a filename with company and job title
    const sanitizedCompany = jobDetails.companyName.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    const sanitizedJobTitle = jobDetails.jobTitle.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `${sanitizedCompany}_${sanitizedJobTitle}_resume.docx`;

    // Upload to S3
    console.log("uploading DOCX to S3...");
    const s3Key = `${userId}/generated-resumes/${job.generationId}/${filename}`;
    await uploadToS3(
      s3Key,
      docxBuffer,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    console.log("uploading to dynamodb...");

    // upload the new resume details to dynamodb
    const newResumeData = await saveGeneratedResume(
      job.generationId,
      userId,
      newResume,
      s3Key,
      filename
    );

    console.log("resume uploaded to dynamodb successfully");

    return NextResponse.json({
      success: true,
      message: "Resume generated successfully",
      resume: newResumeData.resumeData,
      s3Key: s3Key,
      filename: filename,
    });
  } catch (error) {
    console.error("Error generating resume:", error);
    return NextResponse.json({
      success: false,
      message: "Error generating resume",
      error: error,
    });
  }
}
