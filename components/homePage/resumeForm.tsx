"use client";

import { FileUp, LoaderCircle } from "lucide-react";
import { useState } from "react";
import ScrapeJob from "./scrapeJob";
import pdfToText from "react-pdftotext";
import { ResumeData } from "@/utils/doc/buildDoc";

const ResumeForm = () => {
  const [resume, setResume] = useState<File>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [resumeBlob, setResumeBlob] = useState<Blob>();
  const [status, setStatus] = useState<number>();
  const [company, setCompany] = useState<string>();

  const statusMap: { [key: number]: string } = {
    1: "Getting job details",
    2: "Identifying skills and requirements",
    3: "Parsing resume",
    4: "Generating personalized resume",
    5: "Preparing your download",
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resume) {
      setErrorMessage("Please upload your resume");
      return;
    }

    const jobUrl = (
      e.currentTarget.elements.namedItem("job-url") as HTMLInputElement
    ).value;

    if (!jobUrl) {
      setErrorMessage("Please enter the job application URL");
      return;
    }

    try {
      // First, scrape the job details from the provided URL
      setStatus(1);
      const response = await fetch(
        `/api/scrape?url=${encodeURIComponent(jobUrl)}`
      );
      const data = await response.json();
      const bullets = data.bullets;

      // Next, identify the key skills and requirements from the job details
      setStatus(2);
      const keyWordsResponse = await fetch("/api/openai/keywords", {
        method: "POST",
        body: JSON.stringify({ bullets }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const keyWords = (await keyWordsResponse.json()) as {
        keySkills: string[];
        requirements: string[];
      };

      // Next, parse the resume and convert it to text
      setStatus(3);
      const textResume = await pdfToText(resume);

      // Finally, generate a personalized resume based on the job details and the resume text
      setStatus(4);
      const resumeResponse = await fetch("/api/openai/resume", {
        method: "POST",
        body: JSON.stringify({ textResume, keyWords }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resumeJson = (await resumeResponse.json()) as ResumeData;
      setStatus(5);

      // build the resume and return a blob
      const blob = await fetch("/api/doc", {
        method: "POST",
        body: JSON.stringify(resumeJson),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => response.blob());

      setResumeBlob(blob);
      const url = new URL(jobUrl);
      const company = url.hostname.replace("www.", "").split(".")[0];
      setCompany(company);
      setStatus(undefined);

      console.log("Generated personalized resume", resumeJson);
    } catch (error) {
      console.error("Error generating personalized resume:", error);
      setErrorMessage(
        `Error: ${error ?? "Failed to generate resume. Please try again."}`
      );
    }
  };

  return (
    <div className="flex flex-col space-y-4 relative">
      <form className="flex flex-col space-y-8" onSubmit={onSubmit}>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold" htmlFor="resume">
            Upload your resume
          </label>
          <label
            className="p-8 w-full h-36 border border-dashed border-yellow-500 rounded-lg flex items-center justify-center text-yellow-900 hover:bg-yellow-100 hover:cursor-pointer"
            htmlFor="resume"
          >
            <FileUp className="h-4 w-4 shrink-0" />
            <span className="text-sm ml-2">
              {resume ? resume.name : "Select your resume"}
            </span>
          </label>

          <input
            id="resume"
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                if (files[0].type !== "application/pdf") {
                  setErrorMessage("Please upload a PDF file");
                  return;
                }
                setResume(files[0]);
                setErrorMessage(undefined);
              }
            }}
            className="sr-only"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold" htmlFor="job-url">
            Job Application URL
          </label>
          <input
            id="job-url"
            type="url"
            className="border border-dashed border-yellow-500 bg-transparent rounded-lg p-2 text-yellow-900 text-sm"
          />
        </div>
        {errorMessage && (
          <div className="flex justify-center">
            <p className="text-sm text-red-500">{errorMessage}</p>
          </div>
        )}

        <div className="flex w-full justify-center space-x-4">
          <button
            disabled={status !== undefined}
            type="submit"
            className="bg-yellow-900 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 font-semibold flex items-center text-sm"
          >
            {status !== undefined && (
              <LoaderCircle className="h-4 w-4 text-white animate-spin mr-2" />
            )}
            {status !== undefined ? statusMap[status] : "Generate Resume"}
          </button>
        </div>

        {resumeBlob && (
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-green-500">
              Success! Click below to download your personalized resume
            </label>
            <button
              type="button"
              onClick={() => {
                const url = window.URL.createObjectURL(resumeBlob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${resume!.name.replace(
                  ".pdf",
                  ""
                )} - ${company}.docx`;
                a.click();
              }}
              className="p-8 w-full h-36 border border-dashed border-yellow-500 rounded-lg flex items-center justify-center text-yellow-900 hover:bg-yellow-100 hover:cursor-pointer"
            >
              {`${resume!.name.replace(".pdf", "") + ` - ${company}.docx`}`}{" "}
              {`(${(resumeBlob.size / 1024).toFixed(2)} KB)`}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ResumeForm;
