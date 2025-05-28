import { useMemo } from "react";
import { slugify } from "../../utils/helpers";

type StyleCardProps = CustomStyle;

export const StyleTitle = ({ title, nodes, slug }: StyleCardProps) => {
  const slugifiedSlug = useMemo(() => {
    return slugify(slug);
  }, [slug]);

  return (
    <span>
      <code>.{slugifiedSlug}</code> on {nodes.map(({ label }) => label).join(", ")}
    </span>
  );
};
