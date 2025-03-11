declare module "*.module.css";

type CustomStyle = {
  title: string;
  css: string;
  node: (typeof NODE_OPTIONS)[number];
  isOpen: boolean;
};

type UserParameters = {
  customStyles: CustomStyle[];
};
