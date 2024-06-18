// app/api/scrape/route.ts

import { NextRequest, NextResponse } from "next/server";
import { fetchHtml } from "../../../utils/fetchHtml";
import { extractBullets } from "../../../utils/extractBullets";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json(
      { error: "Missing URL parameter" },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching job details from URL: ${url}`);

    // Fetch the HTML content and extract bullet points
    const html = await fetchHtml(url);
    const bullets = extractBullets(html);

    console.log("Successfully extracted bullet points");
    // Send the bullet points as a JSON response
    return NextResponse.json({ bullets });
  } catch (error) {
    console.error("Error processing the job listing:", error);
    return NextResponse.json({ error: "XXXTentatacion" }, { status: 500 });
  }
}
