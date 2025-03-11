import { FormLabel } from "datocms-react-ui";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { monokaiSublime } from "react-syntax-highlighter/dist/esm/styles/hljs";

import * as styling from "./CodeBlock.module.css";

type CodeBlockProps = {
  index: number;
  handleStyleChange: (
    index: number,
    key: keyof CustomStyle,
    value: CustomStyle[keyof CustomStyle],
  ) => void;
  style: CustomStyle;
};

export const CodeBlock = ({
  style,
  index,
  handleStyleChange,
}: CodeBlockProps) => {
  return (
    <div className={styling.codeBlock}>
      <FormLabel htmlFor="css">CSS</FormLabel>
      <div className={styling.codeBlock}>
        <SyntaxHighlighter
          language="css"
          style={monokaiSublime}
          className={styling.syntaxHighligther}
        >
          {style.css}
        </SyntaxHighlighter>
        <textarea
          id={`css-${index}`}
          name="css"
          rows={6}
          value={style.css}
          onChange={(e) => handleStyleChange(index, "css", e.target.value)}
          className={styling.textarea}
        ></textarea>
      </div>
    </div>
  );
};
