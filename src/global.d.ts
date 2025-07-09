declare module "*.module.css";

type CustomStyleNode = {
  label: string;
  value: "paragraph" | "heading";
};

type CustomStyle = {
  slug: string;
  title: string;
  css: string;
  nodes: CustomStyleNode[];
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
