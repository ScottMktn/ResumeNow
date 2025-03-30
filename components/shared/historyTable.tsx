"use client";

import { Button } from "@/components/ui/button";
import {
  Download,
  SquareArrowOutUpRight,
  SquareArrowUpRight,
} from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function HistoryTable({ historyItems }: { historyItems: any }) {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const handleDownload = async (generationId: string, filename: string) => {
    setIsDownloading(generationId);

    try {
      const response = await fetch(
        `/api/download-generated-resume?generationId=${generationId}&filename=${filename}`
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
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-yellow-200">
          <TableHead>Job</TableHead>
          <TableHead>Created</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {historyItems.map((item: any) => (
          <TableRow
            key={item.id}
            className="border-b border-yellow-100 hover:bg-yellow-50"
          >
            <TableCell>
              <Link
                href={item.job?.jobUrl || ""}
                className="underline text-sm flex items-center"
                target="_blank"
              >
                {item.job?.companyName || "Unknown Company"} -{" "}
                {item.job?.jobTitle || "Unknown Position"}
                <SquareArrowOutUpRight className="h-3 w-3 ml-1 inline" />
              </Link>
            </TableCell>

            <TableCell className="text-sm text-gray-500">
              {item.createdAt
                ? formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                  })
                : "Unknown"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleDownload(item.generationId, item.filename)
                  }
                  disabled={isDownloading === item.generationId}
                >
                  <Download className="h-4 w-4 mr-1" />
                  {isDownloading === item.generationId ? "..." : "Download"}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
