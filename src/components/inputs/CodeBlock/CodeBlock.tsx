import { FormLabel } from "datocms-react-ui";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";

import * as styling from "./CodeBlock.module.css";
import { useErrorSignal } from "../../Card/ErrorContext";
import { useEffect, useMemo } from "react";
import { validateCss } from "../../../utils/validate";

type CodeBlockProps<T extends CustomStyle | CustomMark> = {
  style: T;
  handleStyleChange: (index: number, key: keyof T, value: T[keyof T]) => void;
  index: number;
  onBlur: () => void;
};

SyntaxHighlighter.registerLanguage("css", css);

const canvasSyntaxTheme = {
  hljs: {
    display: "block",
    overflowX: "auto",
    padding: "var(--padding)",
    background: "var(--color--code--surface)",
    color: "var(--color--code--ink)",
    fontFamily: "var(--monospaced-font-family)",
  },
  "hljs-selector-tag": {
    color: "var(--color--primary-soft--ink)",
  },
  "hljs-selector-class": {
    color: "var(--color--ink-link)",
  },
  "hljs-selector-id": {
    color: "var(--color--ink-primary)",
  },
  "hljs-selector-attr": {
    color: "var(--color--ink-warning)",
  },
  "hljs-selector-pseudo": {
    color: "var(--color--ink-warning)",
  },
  "hljs-attribute": {
    color: "var(--color--ink-primary)",
  },
  "hljs-built_in": {
    color: "var(--color--ink-link)",
  },
  "hljs-keyword": {
    color: "var(--color--ink-primary)",
  },
  "hljs-variable": {
    color: "var(--color--ink-danger)",
  },
  "hljs-string": {
    color: "var(--color--ink-success)",
  },
  "hljs-number": {
    color: "var(--color--ink-warning)",
  },
  "hljs-literal": {
    color: "var(--color--ink-warning)",
  },
  "hljs-meta": {
    color: "var(--color--ink-subtle)",
  },
  "hljs-comment": {
    color: "var(--color--ink-subtle)",
    fontStyle: "italic",
  },
} as const;

export const CodeBlock = <T extends CustomStyle | CustomMark>({
  style,
  handleStyleChange,
  onBlur,
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
          style={canvasSyntaxTheme}
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
          onBlur={onBlur}
          className={styling.textarea}
        ></textarea>
      </div>
    </div>
  );
};
