import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Create a document client for easier handling of JavaScript objects
const docClient = DynamoDBDocumentClient.from(client);

// Table names
const RESUMES_TABLE = process.env.AWS_DYNAMODB_RESUMES_TABLE || "";
const JOBS_TABLE = process.env.AWS_DYNAMODB_JOBS_TABLE || "";
const GENERATED_RESUMES_TABLE =
  process.env.AWS_DYNAMODB_GENERATED_RESUMES_TABLE || "";

// Resume functions
export async function saveUserResume(
  userId: string,
  resumeData: {
    fileName: string;
    s3Key: string;
    s3Url: string;
    processedData?: any;
  }
) {
  const timestamp = new Date().toISOString();
  const resumeId = uuidv4();

  const item = {
    userId,
    id: `resume#${resumeId}`,
    fileName: resumeData.fileName,
    s3Key: resumeData.s3Key,
    s3Url: resumeData.s3Url,
    processedData: resumeData.processedData || null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await docClient.send(
    new PutCommand({
      TableName: RESUMES_TABLE,
      Item: item,
    })
  );

  return { ...item, resumeId };
}

export async function getUserResumes(userId: string) {
  const result = await docClient.send(
    new ScanCommand({
      TableName: RESUMES_TABLE,
      FilterExpression: "userId = :userId AND begins_with(id, :prefix)",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":prefix": "resume#",
      },
    })
  );

  // Sort the results manually since we're using Scan instead of Query
  const sortedItems = (result.Items || []).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return sortedItems;
}

export type Job = {
  generationId: string;
  id: string;
  userId: string;
  jobUrl: string;
  companyName: string;
  jobTitle: string;
  summary: string;
  keySkills: string[];
  keyRequirements: string[];
  createdAt: string;
  jobId?: string;
};

export interface Resume {
  name: string;
  jobRole: string;
  address: string;
  emailAddress: string;
  phoneNumber: string;
  professionalExperience: ProfessionalExperience[];
  education: Education;
  extraCurriculars: ExtraCurricular[];
  technicalSkills: string[];
  toolsAndTechnologies: string[];
}

export interface ProfessionalExperience {
  companyName: string;
  jobTitle: string;
  jobBullets: string[];
  jobLocation: string;
  jobDateRange: string;
}

export interface Education {
  collegeName: string;
  degree: string;
  dateRange: string;
  gpa: number;
}

export interface ExtraCurricular {
  activityName: string;
  dateRange: string;
  description: string;
}

export async function getLatestUserResume(userId: string) {
  const resumes = await getUserResumes(userId);
  const latestResume = resumes.length > 0 ? resumes[0] : null;
  return latestResume;
}

// Job functions
// change the primary key to be the generationId
export async function saveJobData(
  generationId: string,
  jobData: {
    userId: string;
    jobUrl: string;
    companyName: string;
    jobTitle: string;
    summary: string;
    keySkills: string[];
    keyRequirements: string[];
  }
) {
  const timestamp = new Date().toISOString();
  const jobId = uuidv4();

  const item = {
    generationId,
    id: `job#${jobId}`,
    userId: jobData.userId,
    jobUrl: jobData.jobUrl,
    companyName: jobData.companyName || "Unknown Company",
    jobTitle: jobData.jobTitle || "Unknown Position",
    summary: jobData.summary || "",
    keySkills: jobData.keySkills || [],
    keyRequirements: jobData.keyRequirements || [],
    createdAt: timestamp,
  };

  await docClient.send(
    new PutCommand({
      TableName: JOBS_TABLE,
      Item: item,
    })
  );

  return { ...item, jobId };
}
export async function getUserJobs(userId: string) {
  const result = await docClient.send(
    new QueryCommand({
      TableName: JOBS_TABLE,
      KeyConditionExpression: "userId = :userId AND begins_with(id, :prefix)",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":prefix": "job#",
      },
      ScanIndexForward: false, // Sort in descending order (newest first)
    })
  );

  return result.Items || [];
}

export async function getJobByGenerationId(
  userId: string,
  generationId: string
) {
  const result = await docClient.send(
    new ScanCommand({
      TableName: JOBS_TABLE,
      FilterExpression: "generationId = :generationId AND userId = :userId",
      ExpressionAttributeValues: {
        ":generationId": generationId,
        ":userId": userId,
      },
    })
  );

  return result.Items && result.Items.length > 0 ? result.Items[0] : null;
}

// Generated Resume functions
export async function saveGeneratedResume(
  generationId: string,
  userId: string,
  resumeData: Resume,
  s3Key: string,
  filename: string
) {
  const timestamp = new Date().toISOString();
  const generatedId = uuidv4();

  const item = {
    generationId,
    userId,
    id: `generated#${generatedId}`,
    resumeData,
    s3Key,
    filename,
    createdAt: timestamp,
  };

  await docClient.send(
    new PutCommand({
      TableName: GENERATED_RESUMES_TABLE,
      Item: item,
    })
  );

  return { ...item, generatedId };
}

export async function getUserGeneratedResumes(userId: string) {
  const result = await docClient.send(
    new ScanCommand({
      TableName: GENERATED_RESUMES_TABLE,
      FilterExpression: "userId = :userId AND begins_with(id, :prefix)",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":prefix": "generated#",
      },
    })
  );

  // Sort the results manually since we're using Scan instead of Query
  const sortedItems = (result.Items || []).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return sortedItems;
}

export async function getGeneratedResume(userId: string, generatedId: string) {
  const result = await docClient.send(
    new GetCommand({
      TableName: GENERATED_RESUMES_TABLE,
      Key: {
        userId,
        id: `generated#${generatedId}`,
      },
    })
  );

  return result.Item;
}
