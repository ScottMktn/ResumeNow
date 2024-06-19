// Importing Puppeteer core as default otherwise
// it won't function correctly with "launch()"
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";

export const dynamic = "force-dynamic";

async function getBrowser() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    const executablePath = await chromium.executablePath();

    const browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
    return browser;
  } else {
    const browser = await puppeteer.launch();
    return browser;
  }
}

export async function fetchHtml(url: string): Promise<string> {
  try {
    const browser = await getBrowser();

    const page = await browser.newPage();

    await page.goto(url);

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
