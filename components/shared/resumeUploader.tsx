"use client";

import { FileUp, Download, Check } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "../ui/button";
import defaultFetcher from "@/utils/defaultFetcher";
import CheckMark from "./checkMark";
import DefaultLoading from "./defaultLoading";

export default function ResumeUploader({ userId }: { userId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  const { data, error, isLoading, mutate } = useSWR(
    `/api/get-resume?userId=${userId}`,
    defaultFetcher
  );

  const existingResume = data?.resume || null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      setErrorMessage("Please upload a PDF or DOCX file");
      return;
    }

    setIsUploading(true);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);

    try {
      // Create form data to send the file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      // Send to API route for S3 upload
      const response = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to upload resume");
      }

      setSuccessMessage("Resume uploaded successfully!");
      // Revalidate the data after successful upload
      mutate();
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to upload resume"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Upload your resume</p>
        {existingResume && <CheckMark />}
      </div>

      {isLoading ? (
        <div className="p-8 w-full h-36 border bg-yellow-100 hover:bg-yellow-200 transition-colors border-yellow-500 rounded-lg flex items-center justify-center">
          <DefaultLoading />
        </div>
      ) : (
        <label
          className={`relative p-8 w-full h-36 border bg-yellow-100 hover:bg-yellow-200 transition-colors border-yellow-500 rounded-lg flex items-center justify-center text-yellow-900 hover:cursor-pointer ${
            isUploading ? "opacity-50 pointer-events-none" : ""
          }`}
          htmlFor="resume"
        >
          <FileUp className="h-4 w-4 shrink-0" />
          <span className="text-sm ml-2">
            {isUploading
              ? "Uploading..."
              : existingResume
              ? existingResume.name
              : "Select your resume"}
          </span>
          {/* if the resume is uploaded, show a download icon on the top right */}
          {existingResume && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open(existingResume.url, "_blank");
              }}
            >
              <Download className="h-4 w-4 shrink-0" />
            </Button>
          )}
        </label>
      )}

      <input
        id="resume"
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileUpload}
        className="sr-only"
      />

      {errorMessage && (
        <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
      )}

      {successMessage && (
        <p className="text-sm text-green-500 mt-2">{successMessage}</p>
      )}
    </div>
  );
}
