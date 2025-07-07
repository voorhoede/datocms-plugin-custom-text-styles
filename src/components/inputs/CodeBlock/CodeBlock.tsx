import { FormLabel } from "datocms-react-ui";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { monokaiSublime } from "react-syntax-highlighter/dist/esm/styles/hljs";

import * as styling from "./CodeBlock.module.css";
import { useErrorSignal } from "../../Card/ErrorContext";
import { useEffect, useMemo } from "react";
import { validateCss } from "../../../utils/validate";

type CodeBlockProps<T extends CustomStyle | CustomMark> = {
  style: T;
  handleStyleChange: (index: number, key: keyof T, value: T[keyof T]) => void;
  index: number;
};

export const CodeBlock = <T extends CustomStyle | CustomMark>({
  style,
  handleStyleChange,
  index,
}: CodeBlockProps<T>) => {
  const validation = useMemo(() => validateCss(style.css), [style.css]);

  const { setError } = useErrorSignal();
  useEffect(() => {
    setError("css", !!validation.error);
  }, [validation.error, setError]);
  return (
    <div className={styling.codeBlock}>
      <FormLabel htmlFor={`css-${style.slug}-${index}`}>
        CSS (to be applied in the Structured Text editor)
      </FormLabel>
      <div className={styling.codeBlock}>
        <SyntaxHighlighter
          language="css"
          style={monokaiSublime}
          className={styling.syntaxHighligther}
        >
          {style.css}
        </SyntaxHighlighter>
        <textarea
          id={`css-${style.slug}-${index}`}
          name="css"
          rows={6}
          value={style.css}
          onChange={(e) =>
            handleStyleChange(index, "css", e.target.value as T[keyof T])
          }
          className={styling.textarea}
        ></textarea>
      </div>
    </div>
  );
};
