import { OpenAI } from "openai";
import fs from "fs";
import { ImageURL } from "openai/resources/beta/threads/messages.mjs";
import { ResumeType } from "@/components/homePage/resumeForm";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: "https://oai.helicone.ai/v1",
  defaultHeaders: {
    "Helicone-Auth": `Bearer ${process.env.NEXT_PUBLIC_HELICONE_API_KEY}`,
  },
});

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

        Rewrite the resume experience section to match the key skills and requirements provided. The goal is to personalize the resume for the specific job application.

 Please respond with a JSON-type object containing the identified key skills and requirements in this format: 
        {
          "Experience": [
            {
              "Company": "Company Name",
              "Title": "Job Title",
              "StartDate": "Start Date",
              "EndDate": "End Date",
              "Responsibilities: ["Responsibility1", "Responsibility2", ...],
              "Technologies": ["Technology1", "Technology2", ...]
            }, 
            ...
          ]
        }

        Do not put the leading or trailing backticks in your response.
        `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Use 'gpt-4' or 'gpt-4-turbo' if available
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000, // Adjust token limit as necessary
    });

    const content = response.choices[0].message?.content || "{}";
    console.log("Received response from GPT-4");
    // Parse the JSON response from GPT-4
    const resume = JSON.parse(content) as ResumeType;

    console.log("Generated personalized resume with GPT-4", resume);

    return new Response(JSON.stringify(resume), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating personalized resume with GPT-4:", error);
    throw new Error("Failed to generate personalized resume");
  }
}
