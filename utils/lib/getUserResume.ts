import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getUserResume(userId: string) {
  try {
    // Configure S3 client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });

    // List objects in the user's resume folder
    const listCommand = new ListObjectsV2Command({
      Bucket: "resume-now",
      Prefix: `${userId}/resume/`,
      MaxKeys: 10,
    });

    const listResponse = await s3Client.send(listCommand);

    // Check if any resume exists
    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      return { resume: null };
    }

    // Get the most recent resume by sorting based on LastModified timestamp
    const sortedFiles = listResponse.Contents.filter((file) =>
      // filter out the non .pdf files
      file.Key?.endsWith(".pdf")
    ).sort((a, b) => {
      return (
        (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0)
      );
    });

    // The first item after sorting is the most recent one
    const latestResume = sortedFiles[0];

    // Extract the file name from the key
    const key = latestResume.Key || "";
    const fileName = key.split("/").pop() || "resume";

    // Generate a pre-signed URL for downloading the file
    const getCommand = new GetObjectCommand({
      Bucket: "resume-now",
      Key: key,
    });

    const presignedUrl = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 900,
    });

    return {
      resume: {
        name: fileName,
        url: presignedUrl,
        lastModified: latestResume.LastModified,
      },
    };
  } catch (error) {
    console.error("Error retrieving resume:", error);
    throw new Error("Failed to retrieve resume");
  }
}
