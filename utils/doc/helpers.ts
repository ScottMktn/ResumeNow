import { Tab, TextRun } from "docx";

export type ThemedTextType = {
  title: string;
  bold?: boolean;
  variant?: "heading" | "subheading" | "body";
  font?: "Spectral" | "Times New Roman";
  tab?: boolean;
};

export const ThemedText = (props: ThemedTextType) => {
  const {
    title,
    bold = false,
    variant = "heading",
    font = "Spectral",
    tab = false,
  } = props;

  const sizeMap = {
    heading: 32,
    subheading: 22,
    body: 22,
  };

  return new TextRun({
    children: tab ? [new Tab(), title] : [title],
    bold,
    size: sizeMap[variant],
    color: "000000",
    font: {
      name: "Times New Roman",
      hint: "default",
    },
  });
};
