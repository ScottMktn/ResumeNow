// utils/parseHtmlWithGPT.ts

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: "https://oai.helicone.ai/v1",
  defaultHeaders: {
    "Helicone-Auth": `Bearer ${process.env.NEXT_PUBLIC_HELICONE_API_KEY}`,
    "Helicone-Retry-Enabled": "false",
  },
});

export async function parseHtmlWithGPT(html: string): Promise<any> {
  // make sure the html is below 30000 tokens. if it is above, grab the latter 25000 tokens
  if (html.length > 30000) {
    html = html.slice(20000);
  }
  const prompt = `
    Below is the HTML content of a job posting page. Please extract the following details:
    - Job Title
    - Company Name
    - Job Description
    - Responsibilities
    - Minimum Requirements
    - Preferred Qualifications

    HTML content:
    ${html}

    Please respond with a JSON object containing the extracted details.
    `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Use 'gpt-4' or 'gpt-4-turbo' if available
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000, // Adjust token limit as necessary
    });

    const content = response.choices[0].message?.content || "{}";
    console.log("Received response from GPT-4");
    return JSON.parse(content);
  } catch (error) {
    console.error("Error parsing HTML with GPT-4:", error);
    throw new Error("Failed to parse HTML content with GPT-4");
  }
}
