import {
  Button,
  FieldGroup,
  Section,
  SelectField,
  TextField,
} from "datocms-react-ui";
import { DeleteIcon } from "../DeleteIcon/DeleteIcon";
import { NODE_OPTIONS } from "../../entrypoints/variables";
import { CodeBlock } from "../CodeBlock/CodeBlock";
import { useMemo } from "react";
import { getUserStyle } from "../../utils/userSettings";
import { StyleTitle } from "../StyleTitle/StyleTitle";

import * as styling from "./StyleCard.module.css";

type StyleCardProps = {
  index: number;
  style: CustomStyle;
  handleStyleChange: (
    index: number,
    key: keyof CustomStyle,
    value: CustomStyle[keyof CustomStyle],
  ) => void;
  handleStyleRemoval: (index: number) => void;
};

export const StyleCard = ({
  index,
  style,
  handleStyleChange,
  handleStyleRemoval,
}: StyleCardProps) => {
  const preview = useMemo(() => {
    const userStyle = getUserStyle(style.css);
    return Object.keys(userStyle).length > 0
      ? {
          isValid: true,
          css: userStyle,
          text: "Your text will look like this",
        }
      : {
          isValid: false,
          css: { color: "var(--alert-color)" },
          text: "Please provide valid css",
        };
  }, [style]);

  return (
    <div
      className={styling.styleCard}
      key={index}
      data-status={preview.isValid ? "valid" : "invalid"}
    >
      <Button
        type="button"
        leftIcon={<DeleteIcon />}
        buttonType="negative"
        style={{ backgroundColor: "transparent", color: "var(--alert-color)" }}
        className={styling.deleteButton}
        onClick={() => handleStyleRemoval(index)}
      ></Button>
      <Section
        key={index}
        headerClassName={styling.header}
        title={<StyleTitle {...style} />}
        collapsible={{
          isOpen: style.isOpen,
          onToggle: () => handleStyleChange(index, "isOpen", !style.isOpen),
        }}
      >
        <FieldGroup key={index} className={styling.content}>
          <TextField
            id={`title-${index}`}
            name="title"
            label="Title"
            value={style.title}
            onChange={(newValue) => handleStyleChange(index, "title", newValue)}
          />
          <SelectField
            id={`node-${index}`}
            name="node"
            label="Node"
            value={style.node}
            selectInputProps={{
              options: NODE_OPTIONS,
            }}
            onChange={(newValue) =>
              handleStyleChange(
                index,
                "node",
                newValue as (typeof NODE_OPTIONS)[number],
              )
            }
          />
          <CodeBlock
            index={index}
            handleStyleChange={handleStyleChange}
            style={style}
          />
          <span style={preview.css}> {preview.text} </span>
        </FieldGroup>
      </Section>
    </div>
  );
};
