// utils/fetchHtml.ts

import puppeteer from "puppeteer";

export async function fetchHtml(url: string): Promise<string> {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

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
