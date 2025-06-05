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
  allStyles: CustomStyle[];
};

export const StyleCard = ({
  style,
  handleStyleChange,
  handleStyleRemoval,
  allStyles,
}: StyleCardProps) => {
  const slugValidation = useMemo(() => {
    const trimmedSlug = style.slug.trim();
    if (!trimmedSlug) {
      return { error: 'Slug cannot be empty' };
    }

    const duplicateStyle = allStyles.find(
      ({ id, slug }) => id !== style.id && slug.trim() === trimmedSlug
    );
    if (duplicateStyle) {
      return { error: `Slug "${trimmedSlug}" is already used.` };
    }

    return { error: undefined };

  }, [style.slug, style.id, allStyles]);

  const titleValidation = useMemo(() => {
    const trimmedTitle = style.title.trim();
    if (!trimmedTitle) {
      return { error: 'Title cannot be empty' };
    }

    const duplicateStyle = allStyles.find(
      ({ id, title }) => id !== style.id && title.trim() === trimmedTitle
    );
    if (duplicateStyle) {
      return { error: `Title "${trimmedTitle}" is already used.` };
    }

    return { error: undefined };
  }, [style.title, style.id, allStyles]);

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
            required
            name='slug'
            label='Slug (to be used as a CSS class)'
            value={style.slug}
            onChange={(newValue) =>
              handleStyleChange(style.id, "slug", newValue)
            }
            error={slugValidation.error}
          />
          <TextField
            id={`title-${style.id}`}
            required
            name='title'
            label='Title (shown in the Structured Text editor)'
            value={style.title}
            onChange={(newValue) =>
              handleStyleChange(style.id, "title", newValue)
            }
            error={titleValidation.error}
          />
          <SelectField
            id={`nodes-${style.id}`}
            name='nodes'
            label='Nodes'
            value={style.nodes}
            selectInputProps={{
              isMulti: true,
              options: NODE_OPTIONS,
            }}
            onChange={(newValue) =>
              handleStyleChange(
                style.id,
                "nodes",
                newValue as (typeof NODE_OPTIONS)
              )
            }
          />
          <CodeBlock handleStyleChange={handleStyleChange} style={style} />
          <div style={preview.css}> {preview.text} </div>
        </FieldGroup>
      </Section>
    </div>
  );
};
