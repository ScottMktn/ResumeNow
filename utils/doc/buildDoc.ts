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

interface Extracurricular {
  Title: string;
  Description: string[];
}

interface Education {
  Institution: string;
  Degree: string;
  GPA: string;
  Dates: string;
}

interface Skills {
  TechnicalSkills: string;
  Interests: string;
}

interface PersonalInfo {
  Name: string;
  Title: string;
  Location: string;
  Email: string;
  Phone: string;
}

export interface ResumeData {
  PersonalInfo: PersonalInfo;
  Experience: Experience[];
  Extracurricular: Extracurricular[];
  Education: Education;
  Skills: Skills;
}

export interface FlattenedResumeData {
  PersonalInfo: {
    Name: string;
    Title: string;
    Location: string;
    Email: string;
    Phone: string;
  };
  Experience: {
    Company: string;
    Title: string;
    Location: string;
    StartDate: string;
    EndDate: string;
    Responsibilities: string[];
  }[];
  Extracurricular: {
    Title: string;
    Description: string[];
  }[];
  Education: {
    Institution: string;
    Degree: string;
    GPA: string;
    Dates: string;
  };
  Skills: {
    TechnicalSkills: string;
    Interests: string;
  };
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
        before: 144,
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
      ...experience.Responsibilities?.map((responsibility) => {
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
                title: data.PersonalInfo.Name,
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
                title: data.PersonalInfo.Title,
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
                title: `${data.PersonalInfo.Location} • ${data.PersonalInfo.Email} • ${data.PersonalInfo.Phone}`,
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
          addSectionTitle("EXTRACURRICULARS"),
          ...data.Extracurricular?.map((extracurricular) => [
            new Paragraph({
              children: [
                ThemedText({
                  title: extracurricular.Title,
                  bold: true,
                  variant: "subheading",
                }),
              ],
              spacing: {
                after: 36,
              },
            }),
            ...extracurricular.Description?.map((description) => {
              return new Paragraph({
                children: [
                  ThemedText({
                    title: description,
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
                title: `Technical Skills: ${data.Skills.TechnicalSkills}`,
                variant: "subheading",
              }),
            ],
          }),
          new Paragraph({
            children: [
              ThemedText({
                title: `Interests: ${data.Skills.Interests}`,
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
