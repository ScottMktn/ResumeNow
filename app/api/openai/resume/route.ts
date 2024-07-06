import { OpenAI } from "openai";
import fs from "fs";
import { ImageURL } from "openai/resources/beta/threads/messages.mjs";
import { ResumeData } from "@/utils/doc/buildDoc";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: "https://oai.helicone.ai/v1",
  defaultHeaders: {
    "Helicone-Auth": `Bearer ${process.env.NEXT_PUBLIC_HELICONE_API_KEY}`,
  },
});

export const maxDuration = 60; // This function can run for a maximum of 5 seconds
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const textResume = body.textResume as string;
  const keyWords = body.keyWords as {
    keySkills: string[];
    requirements: string[];
  };

  const prompt = `
        Below are the key skills and requirements extracted from a job listing. Please generate a personalized resume based on the job details and the resume text provided.

        Key Skills:
        ${keyWords.keySkills.join("\n")}

        Requirements:
        ${keyWords.requirements.join("\n")}

        Resume Text:
        ${textResume}

        Here are your instructions

        Rewrite the resume experience section to match the key skills and requirements provided. The goal is to personalize the resume for the specific job application.

        Rewrite the bullets in the experience section for each job experience, but DO NOT add or remove any bullets. Make sure to keep the same number of bullets for each job experience.

        Make sure to add key words from the job listing to the experience section of the resume to increase the chances of passing the initial screening.

        The Extracurricular section is also sometimes labelled "Projects", "Volunteer Experience", or "Leadership Experience". Rewrite the bullets in the Extracurricular section to match the key skills and requirements provided.

 Please respond with a JSON-type object containing the identified key skills and requirements in this format: 

{
  PersonalInfo: {
    Name: string;
    Title: string;
    Location: string;
    Email: string;
    Phone: string;
  };
  Experience: {
    Company: string;
    Title: string;
    Location: string;
    StartDate: string;
    EndDate: string;
    Responsibilities: string[];
  }[];
  Extracurricular: {
    Title: string;
    Description: string[];
  }[];
  Education: {
    Institution: string;
    Degree: string;
    GPA: string;
    Dates: string;
  };
  Skills: {
    TechnicalSkills: string;
    Interests: string;
  };
}

        `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Use 'gpt-4' or 'gpt-4-turbo' if available
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000, // Adjust token limit as necessary
      response_format: {
        type: "json_object",
      },
    });

    const content = response.choices[0].message?.content || "{}";

    // // Parse the JSON response from GPT-4
    const resume = JSON.parse(content) as ResumeData;

    return new Response(JSON.stringify(resume), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating personalized resume with GPT-4:", error);
    throw new Error("Failed to generate personalized resume");
  }
}
