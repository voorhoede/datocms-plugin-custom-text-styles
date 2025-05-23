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
  style: CustomStyle;
  handleStyleChange: (
    id: string,
    key: keyof CustomStyle,
    value: CustomStyle[keyof CustomStyle],
  ) => void;
  handleStyleRemoval: (id: string) => void;
};

export const StyleCard = ({
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
          text: "Your text will look like this in the Structured Text editor",
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
      key={style.id}
      data-status={preview.isValid ? "valid" : "invalid"}>
      <Button
        type='button'
        leftIcon={<DeleteIcon />}
        buttonType='negative'
        style={{ backgroundColor: "transparent", color: "var(--alert-color)" }}
        className={styling.deleteButton}
        onClick={() => handleStyleRemoval(style.id)}></Button>
      <Section
        headerClassName={styling.header}
        title={<StyleTitle {...style} />}
        collapsible={{
          isOpen: style.isOpen,
          onToggle: () => handleStyleChange(style.id, "isOpen", !style.isOpen),
        }}>
        <FieldGroup key={style.id} className={styling.content}>
          <TextField
            id={`slug-${style.id}`}
            name='slug'
            label='Slug (to be used as a CSS class)'
            value={style.slug}
            onChange={(newValue) =>
              handleStyleChange(style.id, "slug", newValue)
            }
          />
          <TextField
            id={`title-${style.id}`}
            name='title'
            label='Title (shown in the Structured Text editor)'
            value={style.title}
            onChange={(newValue) =>
              handleStyleChange(style.id, "title", newValue)
            }
          />
          <SelectField
            id={`node-${style.id}`}
            name='node'
            label='Node'
            value={style.node}
            selectInputProps={{
              options: NODE_OPTIONS,
            }}
            onChange={(newValue) =>
              handleStyleChange(
                style.id,
                "node",
                newValue as (typeof NODE_OPTIONS)[number]
              )
            }
          />
          <CodeBlock handleStyleChange={handleStyleChange} style={style} />
          <span style={preview.css}> {preview.text} </span>
        </FieldGroup>
      </Section>
    </div>
  );
};
