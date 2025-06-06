import { useMemo } from "react";
import { slugify } from "../../utils/helpers";
import styling from "./StyleTitle.module.css";

type StyleCardProps = CustomStyle;

export const StyleTitle = ({ title, nodes, slug }: StyleCardProps) => {
  const slugifiedSlug = useMemo(() => {
    return slugify(slug);
  }, [slug]);

  return (
    <span>
      <code className={styling.slug}>.{slugifiedSlug}</code> <span className={styling.subtitle}>on {nodes.map(({ label }) => label).join(", ")}</span>
    </span>
  );
};
