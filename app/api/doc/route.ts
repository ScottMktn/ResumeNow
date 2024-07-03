import buildDoc, { ResumeData } from "@/utils/doc/buildDoc";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data: ResumeData = {
    Experience: [
      {
        Company: "HELICONE (YC W23)",
        Title: "Co-Founder & COO",
        Location: "San Francisco, CA",
        StartDate: "Jan 2023",
        EndDate: "Jun 2024",
        Responsibilities: [
          "Founded an observability, logging, and ETL platform for Large-Language Models used by 5,000+ companies",
          "Developed the core web platform using Next.js, TypeScript, TailwindCSS, Node.js, and PostgreSQL",
          "Grew and managed an engineering team to 8 employees in a year and a half",
          "Crafted and maintained a custom component library, streamlining UI consistency across projects",
          "Responsible for designing and building public pages with an emphasis on Search Engine Optimization (SEO)",
        ],
      },
      {
        Company: "CANDY",
        Title: "Senior Software Engineer",
        Location: "New York, NY",
        StartDate: "May 2022",
        EndDate: "Jan 2023",
        Responsibilities: [
          "Maintained marketplace web application and internal ops portal, improving UX and operational efficiency",
          "Experimented and tested NFT-as-tickets for Major League Baseball to improve fan experiences",
          "Responsible for constructing, planning, and executing tech PDR’s for new features and user flows",
          "Managed a small team of 3 software engineers with a focus on user experience and accessibility",
        ],
      },
      {
        Company: "DRAFTKINGS",
        Title: "Software Engineer",
        Location: "Boston, MA",
        StartDate: "Oct 2021",
        EndDate: "May 2022",
        Responsibilities: [
          "Maintained marketplace web application and supplier ops portal, improving stability and user satisfaction",
          "Generated tech plans for features and workflows, leading to the implementation of 10+ new features",
          "Tested front end components for reliability and accessibility, achieving a 98% component reliability rate",
        ],
      },
      {
        Company: "TESLA",
        Title: "Software Engineer Co-op",
        Location: "Fremont, CA",
        StartDate: "May 2021",
        EndDate: "Oct 2022",
        Responsibilities: [
          "Maintained a global online payment system, reducing manual processing time by 40%",
          "Implemented and tested shared UI components for internal applications, enhancing code reuse and efficiency",
        ],
      },
    ],
    Projects: [
      {
        Title: "RESUMENOW - AI Resume Builder",
        Description:
          "Web application that uses Generative AI to build personalized resumes for specific jobs",
      },
      {
        Title: "GEODIPLOMAT - United Nations Simulator",
        Description:
          "Debate, vote, and participate in a United Nations-style crisis committee",
      },
    ],
    Education: {
      Institution: "NORTHEASTERN UNIVERSITY",
      Degree:
        "Bachelor of Science, Major in Business Administration and Computer Science",
      GPA: "3.6",
      Dates: "Sep 2016 - May 2020",
    },
    Skills: {
      ProgramManagement:
        "Agile, Jira, Linear, Documentation (Notion + Confluence)",
      TechnicalSkills:
        "TypeScript, JavaScript, Node.js, PostgreSQL, TailwindCSS, GraphQL, Next.js, React.js, Amazon Web Services (AWS), Git, Vercel, etc.",
    },
  };

  const buffer = await buildDoc(data);

  // Return the resume as a downloadable file
  return new Response(buffer, {
    headers: {
      "Content-Disposition": "attachment; filename=resume.docx",
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
  });
}
