declare module "*.module.css";

type Node = "paragraph" | "heading";

type CustomStyleNode = {
  label: string;
  value: BlockNodeTypeWithCustomStyle;
};

type CustomStyle = {
  slug: string;
  title: string;
  css: string;
  nodes: BlockNodeTypeWithCustomStyle[];
  isOpen: boolean;
};

type CustomMark = {
  slug: string;
  title: string;
  css: string;
  icon: {
    label: string;
    value: string;
  };
  keyboardShortcut: string;
  isOpen: boolean;
};

type UserParameters = {
  customStyles: CustomStyle[];
  customMarks: CustomMark[];
};
