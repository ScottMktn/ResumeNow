"use client";

import { useState } from "react";
import useSWRMutation from "swr/mutation";
import CheckMark from "./checkMark";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

// Define fetcher function for SWR
const fetcher = async (url: string, { arg }: { arg: string }) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      urls: [arg],
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch job data");
  }

  return response.json();
};

export default function JobSearch({ userId }: { userId: string }) {
  const [jobUrl, setJobUrl] = useState("");

  // Use SWRMutation instead of SWR
  const { trigger, data, error, isMutating } = useSWRMutation(
    "/api/scrape",
    fetcher
  );

  const handleSearch = () => {
    if (jobUrl.trim() === "") return;
    trigger(jobUrl);
    console.log("data", data);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Paste the job link here</p>
        {jobUrl !== "" && <CheckMark />}
      </div>
      <Input
        value={jobUrl}
        placeholder="http://example.com"
        onChange={(e) => setJobUrl(e.target.value)}
        className="yellow"
      />

      {error && (
        <p className="text-sm text-red-500">
          Error fetching job data. Please try again.
        </p>
      )}

      {data && (
        <div className="mt-4 p-4 border rounded-md">
          <h3 className="font-medium mb-2">Job Details</h3>
          <pre className="text-xs overflow-auto max-h-60 p-2 bg-gray-100 rounded">
            {JSON.stringify(data.results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
