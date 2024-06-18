// utils/fetchHtml.ts

import playwright from "playwright";

export async function fetchHtml(url: string): Promise<string> {
  try {
    const browser = await playwright.chromium.launch({
      headless: false, // setting this to true will not run the UI
    });

    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    // Get the entire HTML content of the page
    const html = await page.content();
    await browser.close();

    console.log(`Fetched HTML from ${url}`);
    return html;
  } catch (error) {
    console.error("Error fetching HTML:", error);
    throw new Error("Failed to fetch HTML content");
  }
}
