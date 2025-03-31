import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getUserResume } from "@/utils/lib/getUserResume";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get userId from query params (for validation)
    const requestedUserId = request.nextUrl.searchParams.get("userId");

    // Only allow users to access their own resumes
    if (requestedUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use the getUserResume utility function
    const result = await getUserResume(userId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error retrieving resume:", error);
    return NextResponse.json(
      { error: "Failed to retrieve resume" },
      { status: 500 }
    );
  }
}
