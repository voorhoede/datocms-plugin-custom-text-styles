import { useMemo } from "react";
import { getUserStyle } from "../../../utils/userSettings";

type PreviewProps = {
  css: CustomStyle["css"] | CustomMark["css"];
};
export const Preview = ({ css }: PreviewProps) => {
  const preview = useMemo(() => {
    const userStyle = getUserStyle(css);
    return Object.keys(userStyle).length > 0
      ? {
          isValid: true,
          css: userStyle,
          text: "Your text will look like this in the Structured Text editor",
        }
      : {
          isValid: false,
          css: { color: "var(--alert-color)" },
          text: "Please provide valid css",
        };
  }, [css]);

  return <div style={preview.css}> {preview.text} </div>;
};
