import parse from "style-to-js";

// TODO: add function to select with structured text fields you can apply which custom styles to
/*
 * Handler for saving all custom styles.
 * Saved custom styles can be used in all structured text fields.
 */
const validateCss = (style: CustomStyle) => {
  try {
    parse(style.css);
  } catch (error) {
    throw new Error(`Invalid CSS in "${style.title}": ${error}`);
  }
};

const slugs = new Set<string>();
const validateSlug = (style: CustomStyle) => {
  // Check for empty slug
  const trimmedSlug = style.slug.trim();
  if (!trimmedSlug) {
    throw new Error(`Slug cannot be empty for style "${style.title}"`);
  }

  // Check for duplicate slug
  if (slugs.has(trimmedSlug)) {
    throw new Error(
      `Duplicate slug "${trimmedSlug}" found. Each style must have a unique slug.`
    );
  }

  slugs.add(trimmedSlug);
};

const titles = new Set<string>();
const validateTitle = (style: CustomStyle) => {
  // Check for empty title
  const trimmedTitle = style.title.trim();
  if (!trimmedTitle) {
    throw new Error(`Title cannot be empty for one of the custom styles`);
  }
  // check for duplicate title
  if (titles.has(trimmedTitle)) {
    throw new Error(
      `Duplicate title "${trimmedTitle}" found. Each style must have a unique title.`
    );
  }
  titles.add(trimmedTitle);
};

export const validateFields = (customStyles: CustomStyle[]) => {
  slugs.clear();
  titles.clear();

  for (const style of customStyles) {
    validateCss(style);
    validateSlug(style);
    validateTitle(style);
  }
};
