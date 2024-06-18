import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: "https://oai.helicone.ai/v1",
  defaultHeaders: {
    "Helicone-Auth": `Bearer ${process.env.NEXT_PUBLIC_HELICONE_API_KEY}`,
  },
});

async function identifyKeyWords(
  bullets: string[]
): Promise<{ keySkills: string[]; requirements: string[] }> {
  const prompt = `
        Below are the bullet points extracted from a job listing. Please identify the key skills and requirements mentioned in the job description.

        Bullet Points:
        ${bullets.join("\n")}

        Please respond with a JSON-type object containing the identified key skills and requirements in this format: 
        {
          "keySkills": ["skill1", "skill2", "skill3", ...],
          "requirements": ["requirement1", "requirement2", "requirement3", ...]
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
    const keyWords = JSON.parse(content) as {
      keySkills: string[];
      requirements: string[];
    };

    return keyWords;
  } catch (error) {
    console.error("Error identifying key skills with GPT-4:", error);
    throw new Error("Failed to identify key skills and requirements");
  }
}

export async function POST(request: Request) {
  const { bullets } = await request.json();
  console.log(bullets);

  const keyWords = await identifyKeyWords(bullets);

  return new Response(JSON.stringify(keyWords), {
    headers: { "Content-Type": "application/json" },
  });
}
