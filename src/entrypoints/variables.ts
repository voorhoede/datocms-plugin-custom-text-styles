import { CustomStyle } from "./ConfigScreen";

export const NODE_OPTIONS = [
  { label: "Paragraph", value: "paragraph" },
  { label: "Heading", value: "heading" },
] as const;

export const DUMMY_CUSTOM_STYLE: CustomStyle = {
  title: "dummyTitle",
  css: "color: red;\nfont-size: 20px;",
  node: NODE_OPTIONS[0],
  isOpen: false,
};
