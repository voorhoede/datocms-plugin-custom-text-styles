export const NODE_OPTIONS: CustomStyleNode[] = [
  { label: "Paragraph", value: "paragraph" },
  { label: "Heading", value: "heading" },
];

export const DUMMY_CUSTOM_STYLE = () => {
  return {
    id: 'stand-out',
    title: "Stand Out",
    css: `text-align: center;
font-size: 24px;
font-weight: bold;`,
    node: NODE_OPTIONS[0],
    isOpen: true,
    slug: "stand-out",
  };
};
