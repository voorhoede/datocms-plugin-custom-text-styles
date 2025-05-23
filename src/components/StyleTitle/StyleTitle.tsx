import { useMemo } from "react";
import { slugify } from "../../utils/helpers";

type StyleCardProps = CustomStyle;

export const StyleTitle = ({ title, node, slug }: StyleCardProps) => {
  const slugifiedSlug = useMemo(() => {
    return slugify(slug);
  }, [slug]);

  return (
    <span>  
      {node.label} <code>.{slugifiedSlug}</code>
    </span>
  );
};
