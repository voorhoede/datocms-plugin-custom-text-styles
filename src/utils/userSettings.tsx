import parse from "style-to-js";

/*
 * Get typed UserParameters from CTX
 */
export const getUserParameters = (parameters: {
  [k: string]: unknown;
}): UserParameters => {
  return {
    customStyles: Array.isArray(parameters.customStyles)
      ? parameters.customStyles
      : [],
  };
};

export const getUserStyle = (cssString: string): Object => {
  try {
    return parse(cssString);
  } catch (e) {
    return {};
  }
};

/*
 * Sort custom styles by node and then by title
 */
export const sortCustomStyle = (a: CustomStyle, b: CustomStyle) => {
  if (a.node.label === b.node.label) {
    return a.title.localeCompare(b.title);
  }
  return a.node.label.localeCompare(b.node.label);
};
