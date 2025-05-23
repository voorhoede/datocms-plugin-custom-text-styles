import { useMemo } from "react";

type StyleCardProps = CustomStyle;

export const StyleTitle = ({ title, node, styleTag }: StyleCardProps) => {
  const slug = useMemo(() => {
    return styleTag.toLowerCase().replace(/ /g, "-");
  }, [styleTag]);

  return (
    <span>  
      {node.label} <code>.{slug}</code>
    </span>
  );
};
