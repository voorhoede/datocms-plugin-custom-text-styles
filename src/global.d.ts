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

type UserParameters = {
  customStyles: CustomStyle[];
};
