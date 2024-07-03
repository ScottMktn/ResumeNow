import {
  Document,
  Packer,
  Paragraph,
  AlignmentType,
  TabStopType,
  Tab,
} from "docx";
import { promises as fs } from "fs";
import { ThemedText } from "./helpers";

interface Experience {
  Company: string;
  Title: string;
  Location: string;
  StartDate: string;
  EndDate: string;
  Responsibilities: string[];
}

interface Project {
  Title: string;
  Description: string;
}

interface Education {
  Institution: string;
  Degree: string;
  GPA: string;
  Dates: string;
}

interface Skills {
  ProgramManagement: string;
  TechnicalSkills: string;
}

export interface ResumeData {
  Experience: Experience[];
  Projects: Project[];
  Education: Education;
  Skills: Skills;
}

const buildDoc = async (data: ResumeData): Promise<Buffer> => {
  // Add section title
  const addSectionTitle = (title: string) => {
    return new Paragraph({
      thematicBreak: true,
      children: [
        ThemedText({
          title,
          bold: true,
          variant: "subheading",
        }),
      ],
      spacing: {
        after: 72,
        before: 108,
      },
    });
  };

  // Add experiences
  const addExperience = (experience: Experience) => {
    return [
      new Paragraph({
        spacing: {
          before: 108,
          after: 36,
        },
        children: [
          ThemedText({
            title: experience.Company,
            bold: true,
            variant: "subheading",
          }),
          ThemedText({
            title: `${experience.Location}`,
            bold: true,
            variant: "subheading",
            tab: true,
          }),
        ],
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: 12240,
          },
        ],
      }),
      new Paragraph({
        children: [
          ThemedText({
            title: experience.Title,
            bold: true,
            variant: "subheading",
          }),
          ThemedText({
            title: `${experience.StartDate} - ${experience.EndDate}`,
            bold: true,
            variant: "subheading",
            tab: true,
          }),
        ],
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: 12240,
          },
        ],
        spacing: {
          after: 72,
        },
      }),
      ...experience.Responsibilities.map((responsibility) => {
        return new Paragraph({
          children: [
            ThemedText({
              title: responsibility,
              variant: "body",
            }),
          ],
          indent: {
            left: 256,
            hanging: 256,
            start: 256,
          },
          bullet: {
            level: 0,
          },
          spacing: {
            after: 72,
          },
        });
      }),
    ];
  };

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 1 inch
              right: 720, // 1 inch
              bottom: 720, // 1 inch
              left: 720, // 1 inch
            },
            size: {
              width: 12240, // 8.5 inches
              height: 15840, // 11 inches
            },
          },
        },
        children: [
          new Paragraph({
            children: [
              ThemedText({
                title: "Scott Nguyen",
                bold: true,
                variant: "heading",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 72,
            },
          }),
          new Paragraph({
            children: [
              ThemedText({
                title: "Senior Software Engineer",
                bold: true,
                variant: "heading",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 72,
            },
          }),
          new Paragraph({
            children: [
              ThemedText({
                title:
                  "San Francisco, CA 94102 • scottmktn@gmail.com • +1 (617) 417-4011",
                variant: "subheading",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 216,
            },
          }),

          addSectionTitle("PROFESSIONAL EXPERIENCE"),
          ...data.Experience.flatMap(addExperience),
          addSectionTitle("PROJECTS"),
          ...data.Projects.map((project) => [
            new Paragraph({
              children: [
                ThemedText({
                  title: project.Title,
                  bold: true,
                  variant: "subheading",
                }),
              ],
              spacing: {
                after: 36,
              },
            }),

            new Paragraph({
              children: [
                ThemedText({
                  title: project.Description,
                  variant: "body",
                }),
              ],
              indent: {
                left: 256,
                hanging: 256,
                start: 256,
              },
              bullet: {
                level: 0,
              },
              spacing: {
                after: 72,
              },
            }),
          ]).flat(),
          addSectionTitle("EDUCATION"),
          new Paragraph({
            children: [
              ThemedText({
                title: data.Education.Institution,
                bold: true,
                variant: "subheading",
              }),
              ThemedText({
                title: data.Education.Dates,
                bold: true,
                variant: "subheading",
                tab: true,
              }),
            ],
            tabStops: [
              {
                type: TabStopType.RIGHT,
                position: 12240,
              },
            ],
            spacing: {
              after: 72,
            },
          }),
          new Paragraph({
            children: [
              ThemedText({
                title: data.Education.Degree,
                variant: "subheading",
              }),
              ThemedText({
                title: `GPA: ${data.Education.GPA}`,
                bold: true,
                variant: "subheading",
                tab: true,
              }),
            ],
            tabStops: [
              {
                type: TabStopType.RIGHT,
                position: 12240,
              },
            ],
            spacing: {
              after: 72,
            },
          }),

          addSectionTitle("SKILLS"),
          new Paragraph({
            children: [
              ThemedText({
                title: `Program Management: ${data.Skills.ProgramManagement}`,
                variant: "subheading",
              }),
            ],
          }),
          new Paragraph({
            children: [
              ThemedText({
                title: `Technical Skills: ${data.Skills.TechnicalSkills}`,
                variant: "subheading",
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
};

export default buildDoc;
