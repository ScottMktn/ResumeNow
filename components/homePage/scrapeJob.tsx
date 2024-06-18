// app/scrape-job/page.tsx

"use client";

import { useState } from "react";

const ScrapeJob = () => {
  const [url, setUrl] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(
        `/api/scrape?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();
      setBullets(data.bullets);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  return (
    <div>
      <h1>Scrape Job Listing</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter job URL"
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={fetchJobDetails}>Fetch Job Details</button>
      {bullets.length > 0 && (
        <div>
          <h2>Bullet Points</h2>
          <ul>
            {bullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScrapeJob;
