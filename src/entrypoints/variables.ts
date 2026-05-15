import { type BlockNodeTypeWithCustomStyle } from "datocms-structured-text-utils";

export const NODE_OPTIONS: { label: string; value: BlockNodeTypeWithCustomStyle }[] = [
  { label: "Paragraph", value: "paragraph" },
  { label: "Heading", value: "heading" },
];

export const DUMMY_CUSTOM_STYLE: CustomStyle = {
  title: "Centered",
  css: `text-align: center;`,
  nodes: NODE_OPTIONS,
  isOpen: true,
  slug: "centered",
};

export const DUMMY_CUSTOM_MARK: CustomMark = {
  title: "Shout",
  css: `text-transform: uppercase;
font-size: 20px;
font-weight: bold;`,
  isOpen: true,
  slug: "shout",
  icon: {
    label: "Volume High",
    value: "volume-high",
  },
  keyboardShortcut: "ctrl+shift+p",
};
