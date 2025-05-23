declare module "*.module.css";

type CustomStyleNode = {
  label: string;
  value: "paragraph" | "heading";
};

type CustomStyle = {
  id: string;
  title: string;
  css: string;
  node: CustomStyleNode;
  isOpen: boolean;
  styleTag: string;
};

type UserParameters = {
  customStyles: CustomStyle[];
};
