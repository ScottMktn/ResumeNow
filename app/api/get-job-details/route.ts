import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getJobByGenerationId } from "@/utils/db/dynamoDb";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get generationId from query params
    const generationId = request.nextUrl.searchParams.get("generationId");
    if (!generationId) {
      return NextResponse.json(
        { error: "Generation ID is required" },
        { status: 400 }
      );
    }

    // Get job details
    const jobDetails = await getJobByGenerationId(userId, generationId);

    return NextResponse.json({ job: jobDetails });
  } catch (error) {
    console.error("Error retrieving job details:", error);
    return NextResponse.json(
      { error: "Failed to retrieve job details" },
      { status: 500 }
    );
  }
}
