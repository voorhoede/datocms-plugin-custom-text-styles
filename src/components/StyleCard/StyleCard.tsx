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
import { useEffect, useMemo } from "react";
import { getUserStyle } from "../../utils/userSettings";
import { StyleTitle } from "../StyleTitle/StyleTitle";
import { validateSlugUniqueness, validateTitleUniqueness } from "../../utils/validate";

import * as styling from "./StyleCard.module.css";

type StyleCardProps = {
  style: CustomStyle;
  index: number;
  handleStyleChange: (
    index: number,
    key: keyof CustomStyle,
    value: CustomStyle[keyof CustomStyle]
  ) => void;
  handleStyleRemoval: (index: number) => void;
  allStyles: CustomStyle[];
  setIsDisabledSave: (isValid: boolean) => void;
};

export const StyleCard = ({
  style,
  handleStyleChange,
  handleStyleRemoval,
  allStyles,
  setIsDisabledSave,
  index,
}: StyleCardProps) => {
  const slugValidation = useMemo(
    () => validateSlugUniqueness(style.slug, index, allStyles),
    [style.slug, index, allStyles]
  );

  const titleValidation = useMemo(
    () => validateTitleUniqueness(style.title, index, allStyles),
    [style.title, index, allStyles]
  );

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

  // update isValidSave when slugValidation or titleValidation changes
  useEffect(() => {
    const isError =
      slugValidation.error || titleValidation.error || !preview.isValid;
    setIsDisabledSave(!!isError);
  }, [slugValidation, titleValidation, preview, setIsDisabledSave]);
  
  return (
    <div
      className={styling.styleCard}
      key={index}
      data-status={preview.isValid ? "valid" : "invalid"}>
      <Button
        type='button'
        leftIcon={<DeleteIcon />}
        buttonType='negative'
        style={{ backgroundColor: "transparent", color: "var(--alert-color)" }}
        className={styling.deleteButton}
        onClick={() => handleStyleRemoval(index)}></Button>
      <Section
        headerClassName={styling.header}
        title={<StyleTitle {...style} />}
        collapsible={{
          isOpen: style.isOpen,
          onToggle: () =>
            handleStyleChange(index, "isOpen", !style.isOpen),
        }}>
        <FieldGroup key={index} className={styling.content}>
          <TextField
            id={`slug-${index}`}
            required
            name='slug'
            label='Slug (to be used as a CSS class)'
            value={style.slug}
            onChange={(newValue) =>
              handleStyleChange(index, "slug", newValue)
            }
            error={slugValidation.error}
          />
          <TextField
            id={`title-${index}`}
            required
            name='title'
            label='Title (shown in the Structured Text editor)'
            value={style.title}
            onChange={(newValue) =>
              handleStyleChange(index, "title", newValue)
            }
            error={titleValidation.error}
          />
          <SelectField
            id={`nodes-${style.slug}-${index}`}
            name='nodes'
            label='Nodes'
            value={style.nodes}
            selectInputProps={{
              isMulti: true,
              options: NODE_OPTIONS,
            }}
            onChange={(newValue) =>
              handleStyleChange(
                index,
                "nodes",
                newValue as typeof NODE_OPTIONS
              )
            }
          />
          <CodeBlock handleStyleChange={handleStyleChange} style={style} index={index} />
          <div style={preview.css}> {preview.text} </div>
        </FieldGroup>
      </Section>
    </div>
  );
};
