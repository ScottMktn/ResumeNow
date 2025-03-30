import { auth } from "@clerk/nextjs/server";
import {
  getUserGeneratedResumes,
  getJobByGenerationId,
} from "@/utils/db/dynamoDb";
import { redirect } from "next/navigation";
import HistoryTable from "@/components/shared/historyTable";

export default async function HistoryPage() {
  // Get authenticated user
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Fetch user's generated resumes
  const generatedResumes = await getUserGeneratedResumes(userId);

  // For each generated resume, fetch the associated job details
  const historyItems = await Promise.all(
    generatedResumes.map(async (resume) => {
      const job = await getJobByGenerationId(userId, resume.generationId);
      return {
        ...resume,
        job,
      };
    })
  );

  return (
    <div className="flex flex-col space-y-8 w-full h-full py-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Resume History</h1>
        <p className="text-sm text-gray-500">
          View all your previously generated resumes
        </p>
      </div>

      {historyItems.length > 0 ? (
        <HistoryTable historyItems={historyItems} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No resume generations found</p>
          <p className="text-sm text-gray-400 mt-2">
            Generate your first resume on the home page
          </p>
        </div>
      )}
    </div>
  );
}
