import { useMemo } from "react";
import { slugify } from "../../utils/helpers";
import styling from "./StyleTitle.module.css";

type StyleCardProps = CustomStyle | CustomMark;

export const StyleTitle = (style: StyleCardProps) => {
  const slugifiedSlug = useMemo(() => {
    return slugify(style.slug);
  }, [style.slug]);

  return (
    <span>
      <code className={styling.slug}>.{slugifiedSlug}</code> 
      <span className={styling.subtitle}>
        { 'nodes' in style && `on ${style.nodes.map(({ label }) => label).join(", ")}`}
        { 'icon' in style && `${style.icon}`}
        { 'keyboardShortcut' in style && `with ${style.keyboardShortcut}`}
      </span>
    </span>
  );
};
