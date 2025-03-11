export const NODE_OPTIONS = [
  { label: "Paragraph", value: "paragraph" },
  { label: "Heading", value: "heading" },
] as const;

export const DUMMY_CUSTOM_STYLE: CustomStyle = {
  title: "Dummy Style",
  css: "color: darkgrey;\nfont-size: 20px;\nfont-style: italic;",
  node: NODE_OPTIONS[0],
  isOpen: true,
};
