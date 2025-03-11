declare module "*.module.css";

type CustomStyleNode = {
  label: string;
  value: "paragraph" | "heading";
};

type CustomStyle = {
  title: string;
  css: string;
  node: CustomStyleNode;
  isOpen: boolean;
};

type UserParameters = {
  customStyles: CustomStyle[];
};
