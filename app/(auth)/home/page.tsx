import GenerateResume from "@/components/shared/generateResume";
import ResumeUploader from "@/components/shared/resumeUploader";
import { auth } from "@clerk/nextjs/server";

// make sure the user is authenticated
export default async function Home() {
  const user = await auth();
  return (
    <div className="flex flex-col space-y-16 w-full h-full py-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Welcome to ResumeNow</h1>
        <p className="text-sm text-gray-500">
          The easiest way to create unique resumes tailored to specific jobs.
        </p>
      </div>
      <ul className="space-y-8">
        <li>
          <ResumeUploader userId={user?.userId ?? ""} />
        </li>
        <li>
          <GenerateResume userId={user?.userId ?? ""} />
        </li>
      </ul>
    </div>
  );
}
