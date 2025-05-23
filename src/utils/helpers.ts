export const slugify = (str: string) =>
  str
    .normalize("NFD")
    .toLowerCase()
    .replace(/[^a-z0-9\- ]/g, "")
    .replace(/\s+/g, "-");
