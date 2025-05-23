import { useMemo } from "react";
import { slugify } from "../../utils/helpers";

type StyleCardProps = CustomStyle;

export const StyleTitle = ({ title, node, styleTag }: StyleCardProps) => {
  const slug = useMemo(() => {
    return slugify(styleTag);
  }, [styleTag]);

  return (
    <span>  
      {node.label} <code>.{slug}</code>
    </span>
  );
};
