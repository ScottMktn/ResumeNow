import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getLatestUserResume } from "@/utils/db/dynamoDb";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the latest resume
    const latestResume = await getLatestUserResume(userId);

    return NextResponse.json({ resume: latestResume });
  } catch (error) {
    console.error("Error retrieving latest resume:", error);
    return NextResponse.json(
      { error: "Failed to retrieve latest resume" },
      { status: 500 }
    );
  }
}
