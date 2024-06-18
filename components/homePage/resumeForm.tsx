"use client";

import { FileUp, LoaderCircle } from "lucide-react";
import { useState } from "react";
import ScrapeJob from "./scrapeJob";
import pdfToText from "react-pdftotext";

export interface ResumeType {
  Experience: {
    Company: "Company Name";
    Title: "Job Title";
    StartDate: "Start Date";
    EndDate: "End Date";
    Responsibilities: ["Responsibility1", "Responsibility2"];
    Technologies: ["Technology1", "Technology2"];
  }[];
}

const ResumeForm = () => {
  const [resume, setResume] = useState<File>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [personalizedResume, setPersonalizedResume] = useState<ResumeType>();
  const [status, setStatus] = useState<string>();

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
      setStatus("Getting job details");
      const response = await fetch(
        `/api/scrape?url=${encodeURIComponent(jobUrl)}`
      );
      const data = await response.json();
      const bullets = data.bullets;

      // Next, identify the key skills and requirements from the job details
      setStatus("Identifying skills and requirements");
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
      setStatus("Parsing resume");
      const textResume = await pdfToText(resume);

      // Finally, generate a personalized resume based on the job details and the resume text
      setStatus("Generating personalized resume");
      const resumeResponse = await fetch("/api/openai/resume", {
        method: "POST",
        body: JSON.stringify({ textResume, keyWords }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resumeJson = (await resumeResponse.json()) as ResumeType;
      setStatus("Done");
      setPersonalizedResume(resumeJson);

      // after 2 seconds, reset the status
      setTimeout(() => {
        setStatus(undefined);
      }, 2000);

      console.log("Generated personalized resume", resumeJson);
    } catch (error) {
      console.error("Error generating personalized resume:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 relative">
      <div className="flex justify-between w-full">
        <h2 className="text-lg font-bold">Try for Free</h2>
        {status !== undefined && (
          <div id="status" className="flex items-center space-x-2">
            <LoaderCircle className="h-4 w-4 text-green-600 animate-spin" />
            <span className="text-sm text-green-600">{status}</span>
          </div>
        )}
      </div>

      <form
        className="flex flex-col space-y-8 bg-white p-8 rounded-lg border border-violet-300"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold" htmlFor="resume">
            Upload your resume
          </label>
          <label
            className="p-8 w-full h-36 border border-dashed border-violet-300 rounded-lg flex items-center justify-center text-violet-900 hover:bg-violet-200 hover:cursor-pointer"
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
            className="border border-dashed border-violet-300 rounded-lg p-2"
          />
        </div>
        <div className="flex space-x-2 items-center w-full justify-end">
          {errorMessage && (
            <div className="flex justify-end">
              <p className="text-sm text-red-500">{errorMessage}</p>
            </div>
          )}

          <div className="flex w-full justify-end">
            <button
              type="submit"
              className="bg-violet-900 text-white px-4 py-2 rounded-lg hover:bg-violet-700 font-bold flex items-center"
            >
              {status !== undefined && (
                <LoaderCircle className="h-4 w-4 text-white animate-spin mr-2" />
              )}
              Generate Resume
            </button>
          </div>
        </div>
      </form>
      {personalizedResume && (
        <div className="flex flex-col space-y-4 pt-16">
          <h2 className="text-lg font-bold">Personalized Resume</h2>
          <div className="flex flex-col space-y-4 bg-white p-8 rounded-lg border border-violet-300">
            {personalizedResume.Experience.map((experience, index) => (
              <div key={index} className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <h3 className="text-md font-semibold">
                    {experience.Company} - {experience.Title}
                  </h3>
                  <p className="text-sm">
                    {experience.StartDate} - {experience.EndDate}
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <h4 className="text-sm font-semibold">Responsibilities</h4>
                  <ul className="list-disc list-inside">
                    {experience.Responsibilities.map(
                      (responsibility, index) => (
                        <li key={index} className="text-sm">
                          {responsibility}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="flex flex-col space-y-2">
                  <h4 className="text-sm font-semibold">Technologies</h4>
                  <ul className="list-disc list-inside">
                    {experience.Technologies.map((technology, index) => (
                      <li key={index} className="text-sm">
                        {technology}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeForm;
