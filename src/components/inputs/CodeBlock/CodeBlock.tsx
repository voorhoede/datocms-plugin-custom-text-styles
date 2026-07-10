import type { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import { FormLabel, useCtx } from "datocms-react-ui";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";

import * as styling from "./CodeBlock.module.css";
import { useErrorSignal } from "../../Card/ErrorContext";
import { useEffect, useMemo, type CSSProperties } from "react";
import { validateCss } from "../../../utils/validate";

type CodeBlockProps<T extends CustomStyle | CustomMark> = {
  style: T;
  handleStyleChange: (index: number, key: keyof T, value: T[keyof T]) => void;
  index: number;
  onBlur: () => void;
};

SyntaxHighlighter.registerLanguage("css", css);

const getToken = (
  tokens: RenderConfigScreenCtx["cssDesignTokens"],
  name: string,
) => tokens[name] || `var(${name})`;

const createCanvasSyntaxTheme = (
  tokens: RenderConfigScreenCtx["cssDesignTokens"],
): Record<string, CSSProperties> => ({
  hljs: {
    display: "block",
    overflowX: "auto",
    padding: "var(--padding)",
    background: getToken(tokens, "--color--surface-muted"),
    color: getToken(tokens, "--color--ink"),
    fontFamily: "var(--monospaced-font-family)",
  },
  "hljs-selector-tag": {
    color: getToken(tokens, "--color--ink-link"),
  },
  "hljs-selector-class": {
    color: getToken(tokens, "--color--ink-link"),
  },
  "hljs-selector-id": {
    color: getToken(tokens, "--color--ink-primary"),
  },
  "hljs-selector-attr": {
    color: getToken(tokens, "--color--ink-warning"),
  },
  "hljs-selector-pseudo": {
    color: getToken(tokens, "--color--ink-warning"),
  },
  "hljs-attribute": {
    color: getToken(tokens, "--color--ink-primary"),
  },
  "hljs-built_in": {
    color: getToken(tokens, "--color--ink-link"),
  },
  "hljs-keyword": {
    color: getToken(tokens, "--color--ink-primary"),
  },
  "hljs-variable": {
    color: getToken(tokens, "--color--ink-danger"),
  },
  "hljs-string": {
    color: getToken(tokens, "--color--ink-success"),
  },
  "hljs-number": {
    color: getToken(tokens, "--color--ink-warning"),
  },
  "hljs-literal": {
    color: getToken(tokens, "--color--ink-warning"),
  },
  "hljs-meta": {
    color: getToken(tokens, "--color--ink-subtle"),
  },
  "hljs-comment": {
    color: getToken(tokens, "--color--ink-subtle"),
    fontStyle: "italic",
  },
});

export const CodeBlock = <T extends CustomStyle | CustomMark>({
  style,
  handleStyleChange,
  onBlur,
  index,
}: CodeBlockProps<T>) => {
  const ctx = useCtx<RenderConfigScreenCtx>();
  const syntaxTheme = useMemo(
    () => createCanvasSyntaxTheme(ctx.cssDesignTokens),
    [ctx.colorScheme, ctx.cssDesignTokens],
  );
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
          style={syntaxTheme}
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
