import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { saveUserResume } from "@/utils/db/dynamoDb";

export const maxDuration = 60; // Set maximum duration to 60 seconds
export const dynamic = "force-dynamic";

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

  return s3Client.send(command);
}

// Helper function to process PDF with Gemini
async function processPdfWithGemini(fileBuffer: ArrayBuffer) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        // @ts-ignore
        responseSchema: {
          description: "The extracted data from the resume",
          type: SchemaType.OBJECT,
          properties: {
            name: {
              description: "The name of the person",
              type: SchemaType.STRING,
            },
            jobRole: {
              description: "The current job role or job title of the person",
              type: SchemaType.STRING,
            },
            address: {
              description: "The address of the person",
              type: SchemaType.STRING,
            },
            emailAddress: {
              description: "The email address of the person",
              type: SchemaType.STRING,
            },
            phoneNumber: {
              description: "The phone number of the person",
              type: SchemaType.STRING,
            },
            professionalExperience: {
              description: "The professional experience of the person",
              type: SchemaType.ARRAY,
              items: {
                description: "The professional experience of the person",
                type: SchemaType.OBJECT,
                properties: {
                  companyName: {
                    description: "The name of the company",
                    type: SchemaType.STRING,
                  },
                  jobTitle: {
                    description: "The job title of the person",
                    type: SchemaType.STRING,
                  },
                  jobBullets: {
                    description: "The job bullets of the person",
                    type: SchemaType.ARRAY,
                    items: {
                      description: "The job bullets of the person",
                      type: SchemaType.STRING,
                    },
                  },
                  jobLocation: {
                    description: "The location of the job",
                    type: SchemaType.STRING,
                  },
                  jobDateRange: {
                    description: "The date range of the job",
                    type: SchemaType.STRING,
                  },
                },
                required: [
                  "companyName",
                  "jobTitle",
                  "jobBullets",
                  "jobLocation",
                  "jobDateRange",
                ],
              },
            },
            education: {
              description: "The education of the person",
              type: SchemaType.OBJECT,
              properties: {
                collegeName: {
                  description: "The name of the college",
                  type: SchemaType.STRING,
                },
                degree: {
                  description: "The degree of the person",
                  type: SchemaType.STRING,
                },
                dateRange: {
                  description: "The date range of the education",
                  type: SchemaType.STRING,
                },
                gpa: {
                  description: "The GPA of the person",
                  type: SchemaType.NUMBER,
                },
              },
            },
            extraCurriculars: {
              description: "The extra curricular activities of the person",
              type: SchemaType.ARRAY,
              items: {
                description: "The extra curricular activities of the person",
                type: SchemaType.OBJECT,
                properties: {
                  activityName: {
                    description: "The name of the activity",
                    type: SchemaType.STRING,
                  },
                  dateRange: {
                    description: "The date range of the activity",
                    type: SchemaType.STRING,
                  },
                  description: {
                    description: "The description of the activity",
                    type: SchemaType.STRING,
                  },
                },
                required: ["activityName", "dateRange", "description"],
              },
            },
            technicalSkills: {
              description: "The technical skills of the person",
              type: SchemaType.ARRAY,
              items: {
                description: "The technical skills of the person",
                type: SchemaType.STRING,
              },
            },
            toolsAndTechnologies: {
              description: "The tools and technologies of the person",
              type: SchemaType.ARRAY,
              items: {
                description: "The tools and technologies of the person",
                type: SchemaType.STRING,
              },
            },
          },
          required: [
            "name",
            "jobRole",
            "address",
            "emailAddress",
            "phoneNumber",
            "professionalExperience",
            "education",
            "extraCurriculars",
            "technicalSkills",
            "toolsAndTechnologies",
          ],
        },
      },
      systemInstruction: `Extract the data from the resume and return it in the format of the schema. Be very carefuly about
      only extracting the data that is present in the resume. Do not make up data that is not present in the resume.

      If the resume is not clear, then return a empty strings, objects, arrays, etc.
      `,
    });

    // Convert ArrayBuffer to Base64
    const base64Data = Buffer.from(fileBuffer).toString("base64");

    console.log("Processing PDF with Gemini...");
    // Process the entire PDF at once
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf",
        },
      },
    ]);

    const results = JSON.parse(result.response.text());
    console.log("Results:", results);

    return results;
  } catch (error) {
    console.error("Error processing PDF with Gemini:", error);
    throw new Error("Failed to process PDF with Gemini");
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF or DOCX file" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer();
    const fileKey = `${userId}/resume/${file.name}`;

    // Upload original file to S3
    await uploadToS3(fileKey, Buffer.from(fileBuffer), file.type);

    // Create S3 client for generating signed URL
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });

    // Generate a pre-signed URL for the file
    const getCommand = new PutObjectCommand({
      Bucket: "resume-now",
      Key: fileKey,
    });

    const presignedUrl = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 3600,
    });

    let processedData = null;

    // Process PDF with Gemini if it's a PDF
    if (file.type === "application/pdf") {
      // Generate processed data
      processedData = await processPdfWithGemini(fileBuffer);
    }

    // Save resume data to DynamoDB
    const resumeData = await saveUserResume(userId, {
      fileName: file.name,
      s3Key: fileKey,
      s3Url: presignedUrl,
      processedData: processedData,
    });

    return NextResponse.json({
      success: true,
      message: "Resume uploaded and processed successfully",
      resumeId: resumeData.resumeId,
      filePath: fileKey,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
