import { type BlockNodeTypeWithCustomStyle } from "datocms-structured-text-utils";

export const NODE_OPTIONS: { label: string; value: BlockNodeTypeWithCustomStyle }[] = [
  { label: "Paragraph", value: "paragraph" },
  { label: "Heading", value: "heading" },
];

export const DUMMY_CUSTOM_STYLES: CustomStyle[] = [{
  title: "Centered",
  css: `text-align: center;`,
  nodes: NODE_OPTIONS,
  isOpen: true,
  slug: "centered",
},
{
  title: "Right",
  css: `text-align: right;`,
  nodes: NODE_OPTIONS,
  isOpen: true,
  slug: "right",
},
{
  title: "Pink",
  css: `color: pink;`,
  nodes: NODE_OPTIONS,
  isOpen: true,
  slug: "pink",
},
];

export const DUMMY_CUSTOM_MARKS: CustomMark[] = [{
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
},
{
  title: "Tiny",
  css: `font-size: 10px;`,
  isOpen: true,
  slug: "tiny",
  icon: {
    label: "Volume Low",
    value: "volume-low",
  },
  keyboardShortcut: "ctrl+shift+t",
},
{
  title: "Fancy",
  css: `text-decoration: underline;
text-decoration-style: wavy;`,
  isOpen: true,
  slug: "fancy",
  icon: {
    label: "Sparkles",
    value: "sparkles",
  },
  keyboardShortcut: "ctrl+shift+f",
},
];
