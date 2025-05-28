declare module "*.module.css";

type CustomStyleNode = {
  label: string;
  value: "paragraph" | "heading";
};

type CustomStyle = {
  id: string;
  title: string;
  css: string;
  nodes: CustomStyleNode[];
  isOpen: boolean;
  slug: string;
};

type UserParameters = {
  customStyles: CustomStyle[];
};
