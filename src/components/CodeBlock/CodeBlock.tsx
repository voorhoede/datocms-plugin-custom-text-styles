import { FormLabel } from "datocms-react-ui";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { monokaiSublime } from "react-syntax-highlighter/dist/esm/styles/hljs";

import * as styling from "./CodeBlock.module.css";

type CodeBlockProps = {
  handleStyleChange: (
    index: number,
    key: keyof CustomStyle,
    value: CustomStyle[keyof CustomStyle]
  ) => void;
  style: CustomStyle;
  index: number;
};

export const CodeBlock = ({
  style,
  handleStyleChange,
  index,
}: CodeBlockProps) => {
  return (
    <div className={styling.codeBlock}>
      <FormLabel htmlFor={`css-${style.slug}-${index}`}>
        CSS (to be applied in the Structured Text editor)
      </FormLabel>
      <div className={styling.codeBlock}>
        <SyntaxHighlighter
          language='css'
          style={monokaiSublime}
          className={styling.syntaxHighligther}>
          {style.css}
        </SyntaxHighlighter>
        <textarea
          id={`css-${style.slug}-${index}`}
          name='css'
          rows={6}
          value={style.css}
          onChange={(e) =>
            handleStyleChange(index, "css", e.target.value)
          }
          className={styling.textarea}></textarea>
      </div>
    </div>
  );
};
