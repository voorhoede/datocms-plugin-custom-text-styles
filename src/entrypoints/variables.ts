import { v4 as uuidv4 } from "uuid";
export const NODE_OPTIONS: CustomStyleNode[] = [
  { label: "Paragraph", value: "paragraph" },
  { label: "Heading", value: "heading" },
];

export const DUMMY_CUSTOM_STYLE = () => {
  return {
    id: uuidv4(),
    title: "Custom Style",
    css: "color: darkgrey;\nfont-size: 20px;\nfont-style: italic;",
    node: NODE_OPTIONS[0],
    isOpen: true,
  };
};
