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
import CheckMark from "./checkMark";

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
  const [loadingState, setLoadingState] = useState<
    "idle" | "scraping" | "generating"
  >("idle");

  const { trigger, data, error, isMutating } = useSWRMutation(
    "/api/scrape",
    fetcher
  );

  const handleGenerateResume = async () => {
    if (jobUrl.trim() === "") {
      alert("Please enter a job URL");
      return;
    }

    setLoadingState("scraping");
    // 1. clear the existing resume and statuses
    setFilename(null);
    setS3Key(null);
    setCurrentGenerationId(null);

    // 2. generate a generation id
    const generationId = uuidv4();
    setCurrentGenerationId(generationId);
    // 3. scrape the job details
    try {
      await trigger({ urls: [jobUrl], generationId });
    } catch (err) {
      console.error("Error generating resume:", err);
    }

    // 4. generate the resume
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
      setLoadingState("generating");
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
      setLoadingState("idle");
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
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Paste the job link here</p>
          {jobUrl && <CheckMark />}
        </div>
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

      <div className="flex justify-center w-full items-center gap-4 py-8">
        <Button
          onClick={handleGenerateResume}
          disabled={loadingState !== "idle" || jobUrl.trim() === ""}
        >
          {(loadingState === "scraping" || loadingState === "generating") && (
            <DefaultLoading />
          )}
          {loadingState === "idle" && "Generate Resume"}
          {loadingState === "scraping" && "Scraping job details..."}
          {loadingState === "generating" && "Generating resume..."}
        </Button>
      </div>
      {s3Key && (
        <>
          <div className="my-8">
            <Separator />
          </div>
          <p className="text-sm font-medium pt-4 text-green-500">
            Successfully generated resume
          </p>
          <div
            className="relative p-8 w-full border border-green-500 rounded-lg flex items-center justify-center h-36 cursor-pointer bg-green-100 hover:bg-green-200 transition-colors"
            onClick={handleDownloadResume}
          >
            <span className="text-sm text-green-900 flex items-center gap-2">
              <FileDown className="h-4 w-4 shrink-0 text-green-900" />
              <span className="text-sm">{filename}</span>
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={(e) => {
                // do nothing
              }}
            >
              <Download className="h-4 w-4 shrink-0" />
            </Button>
          </div>
          <div className="pb-16" />
        </>
      )}
    </div>
  );
}
