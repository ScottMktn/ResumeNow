import buildDoc, { ResumeData } from "@/utils/doc/buildDoc";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // get the resumeData from the body
  const body = await request.json();
  const resumeData = body as ResumeData;

  const buffer = await buildDoc(resumeData);

  // Return the resume as a downloadable file
  return new Response(buffer, {
    headers: {
      "Content-Disposition": "attachment; filename=resume.docx",
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
  });
}
