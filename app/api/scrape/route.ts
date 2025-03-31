import { NextRequest, NextResponse } from "next/server";
import { scrapeContent } from "@/utils/lib/scrapeContent";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { saveJobData } from "@/utils/db/dynamoDb";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body to get the URLs to scrape and the generation ID
    const body = await request.json();
    const { urls, generationId } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
    }

    const jobUrl = urls[0]; // Assuming the first URL is the job URL

    // Use the scrapeContent utility function
    const { results } = await scrapeContent(urls);

    if (!results || !results.results || results.results.length === 0) {
      return NextResponse.json(
        { error: "Failed to scrape content from URL" },
        { status: 400 }
      );
    }

    const prompt = `
    *Your Role*: You are a job page synthesizer. You are given the contents of a job listing online 

    *Your Task: You are given the contents of a job listing online  and you are tasked with returning
    a summary of the job listing as well as key skills and requirements. The returned contents will 
    be used to generate a tailored resume for this specific job, so carefully identify key words and 
    requirements that are relevant to the job to make the resume more relevant to the job.

    *Your Output*: You are to return a JSON object with the following fields:
    - companyName: The name of the company.
    - jobTitle: The title of the job listing.
    - summary: A summary of the job listing. only 2-3 sentences max.
    - keySkills: A list of key skills that are relevant to the job. 
    - keyRequirements: A list of key requirements that are relevant to the job. (['requirement1', 'requirement2', 'requirement3'])

    Here is the job listing:

    ${results.results[0].text}
    `;

    const response = await openai.beta.chat.completions.parse({
      model: "o3-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: zodResponseFormat(
        z.object({
          companyName: z.string().nullable(),
          jobTitle: z.string().nullable(),
          summary: z.string().nullable(),
          keySkills: z.array(z.string()).nullable(),
          keyRequirements: z.array(z.string()).nullable(),
        }),
        "event"
      ),
    });

    const event = response.choices[0].message.parsed;

    // Save job data to DynamoDB with the generation ID if provided
    const jobData = await saveJobData(generationId, {
      jobUrl,
      userId,
      companyName: event?.companyName || "Unknown Company",
      jobTitle: event?.jobTitle || "Unknown Position",
      summary: event?.summary || "",
      keySkills: event?.keySkills || [],
      keyRequirements: event?.keyRequirements || [],
    });

    // Return the job data
    return NextResponse.json({
      success: true,
      jobId: jobData.jobId,
      companyName: jobData.companyName,
      jobTitle: jobData.jobTitle,
      summary: jobData.summary,
      keySkills: jobData.keySkills,
      keyRequirements: jobData.keyRequirements,
      generationId: jobData.generationId,
    });
  } catch (error) {
    console.error("Error scraping content:", error);
    return NextResponse.json(
      { error: "Failed to scrape content" },
      { status: 500 }
    );
  }
}
