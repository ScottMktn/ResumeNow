"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import DefaultLoading from "./defaultLoading";
import useSWRMutation from "swr/mutation";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";
import defaultFetcher from "@/utils/defaultFetcher";
import { Job, Resume } from "@/utils/db/dynamoDb";
import { Separator } from "../ui/separator";
import { Download, FileDown } from "lucide-react";

// Define fetcher function for SWR
const fetcher = async (
  url: string,
  { arg }: { arg: { urls: string[]; generationId: string } }
) => {
  const { urls, generationId } = arg;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      urls: urls,
      generationId: generationId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch job data");
  }

  return response.json();
};

export default function GenerateResume({ userId }: { userId: string }) {
  const [jobUrl, setJobUrl] = useState("");
  const [filename, setFilename] = useState<string | null>(null);
  const [s3Key, setS3Key] = useState<string | null>(null);
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const { trigger, data, error, isMutating } = useSWRMutation(
    "/api/scrape",
    fetcher
  );

  const handleGenerateResume = async () => {
    if (jobUrl.trim() === "") {
      alert("Please enter a job URL");
      return;
    }

    setIsLoading(true);

    // 1. generate a generation id
    const generationId = uuidv4();
    setCurrentGenerationId(generationId);
    // 2. scrape the job details
    try {
      await trigger({ urls: [jobUrl], generationId });

      console.log("Scraped job data:", data);
    } catch (err) {
      console.error("Error generating resume:", err);
    }

    // 3. generate the resume
    try {
      // fetch the latest resume details
      const latestResumeDetails = await fetch(`/api/get-latest-resume-details`);
      const latestResumeDetailsData = await latestResumeDetails.json();

      // fetch the job details
      const jobDetails = await fetch(
        `/api/get-job-details?generationId=${generationId}`
      );
      const jobDetailsData = await jobDetails.json();
      const job = jobDetailsData.job as Job;

      // generate the resume
      const generateResume = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({
          resume: latestResumeDetailsData.resume.processedData as Resume,
          job: {
            generationId: generationId,
            companyName: job.companyName,
            jobTitle: job.jobTitle,
            summary: job.summary,
            keySkills: job.keySkills,
            keyRequirements: job.keyRequirements,
          } as Omit<Job, "id" | "userId" | "createdAt">,
        }),
      });

      const generateResumeData = await generateResume.json();

      setFilename(generateResumeData.filename);
      setS3Key(generateResumeData.s3Key);
    } catch (error) {
      console.error("Error generating resume:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!s3Key || !filename) return;

    try {
      const response = await fetch(
        `/api/download-generated-resume?generationId=${currentGenerationId}&filename=${filename}`
      );

      if (!response.ok) {
        throw new Error("Failed to generate download URL");
      }

      const data = await response.json();

      if (data.success && data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      } else {
        console.error("Failed to get download URL");
      }
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <p className="text-sm font-medium">Paste the job link here</p>
        <Input
          className="yellow"
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
          placeholder="https://example.com/job-posting"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">
          Error fetching job data. Please try again.
        </p>
      )}

      <div className="flex justify-center w-full items-center gap-4">
        <Button
          onClick={handleGenerateResume}
          disabled={isLoading || jobUrl.trim() === ""}
        >
          {isLoading && <DefaultLoading />}
          Generate Resume
        </Button>
      </div>
      {s3Key && (
        <>
          <div className="my-4">
            <Separator />
          </div>
          <p className="text-sm font-medium">Generated Resume</p>
          <div className="relative p-8 w-full border border-dashed border-yellow-500 rounded-lg flex items-center justify-center h-36">
            <span className="text-sm text-yellow-900 flex items-center gap-2">
              <FileDown className="h-4 w-4 shrink-0 text-yellow-900" />
              <span className="text-sm">{filename}</span>
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleDownloadResume}
            >
              <Download className="h-4 w-4 shrink-0 text-yellow-900" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
