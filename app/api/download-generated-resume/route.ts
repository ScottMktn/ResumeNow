import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the generationId from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const generationId = searchParams.get("generationId");
    const filename = searchParams.get("filename");

    if (!generationId || !filename) {
      return NextResponse.json(
        { error: "Missing generationId or filename" },
        { status: 400 }
      );
    }

    // Configure S3 client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });

    // Create the S3 key for the file
    const s3Key = `${userId}/generated-resumes/${generationId}/${filename}`;

    // Generate a pre-signed URL for downloading the file
    const getCommand = new GetObjectCommand({
      Bucket: "resume-now",
      Key: s3Key,
    });

    const presignedUrl = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    return NextResponse.json({
      success: true,
      downloadUrl: presignedUrl,
    });
  } catch (error) {
    console.error("Error generating download URL:", error);
    return NextResponse.json(
      { error: "Failed to generate download URL" },
      { status: 500 }
    );
  }
}
