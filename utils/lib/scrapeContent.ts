import Exa from "exa-js";

export async function scrapeContent(urls: string[]) {
  try {
    // Initialize Exa client with API key from environment variables
    const exa = new Exa(process.env.EXA_API_KEY || "");

    // Validate input
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      throw new Error("Please provide an array of URLs to scrape");
    }

    // Call Exa API to get contents from the provided URLs
    const results = await exa.getContents(urls, { text: true });

    return { results };
  } catch (error) {
    console.error("Error scraping content:", error);
    throw new Error("Failed to scrape content");
  }
}
