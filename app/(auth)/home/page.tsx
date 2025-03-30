import GenerateResume from "@/components/shared/generateResume";
import JobSearch from "@/components/shared/jobSearch";
import ResumeUploader from "@/components/shared/resumeUploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@clerk/nextjs/server";
import { FileUp } from "lucide-react";
import { redirect } from "next/navigation";

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
