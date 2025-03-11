import { useMemo } from "react";

type StyleCardProps = CustomStyle;

export const StyleTitle = ({ title, node }: StyleCardProps) => {
  const slug = useMemo(() => {
    return title.toLowerCase().replace(/ /g, "-");
  }, [title]);

  return (
    <span>
      {node.label} <code>.{slug}</code>
    </span>
  );
};
