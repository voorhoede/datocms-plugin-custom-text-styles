import { useMemo } from "react";
import { slugify } from "../../../utils/helpers";
import styling from "./CardTitle.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
type StyleCardProps = CustomStyle | CustomMark;

export const CardTitle = (style: StyleCardProps) => {
  const slugifiedSlug = useMemo(() => {
    return slugify(style.slug);
  }, [style.slug]);

  return (
    <span>
      <code className={styling.slug}>.{slugifiedSlug}</code>
      <span className={styling.subtitle}>
        {"nodes" in style &&
          `on ${style.nodes.map(({ label }) => label).join(", ")}`}
      </span>
      {"icon" in style && (
        <FontAwesomeIcon icon={fas[style.icon.value as IconName]} />
      )}
    </span>
  );
};
