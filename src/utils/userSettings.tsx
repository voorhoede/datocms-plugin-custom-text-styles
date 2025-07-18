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
    customMarks: Array.isArray(parameters.customMarks)
      ? parameters.customMarks
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
