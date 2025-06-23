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
import {
  validateSlugUniqueness,
  validateTitleUniqueness,
} from "../../utils/validate";

import * as styling from "./StyleCard.module.css";

type StyleCardProps<T extends CustomStyle | CustomMark> = {
  style: T;
  index: number;
  handleStyleChange: (index: number, key: keyof T, value: T[keyof T]) => void;
  handleStyleRemoval: (index: number) => void;
  allStyles: T[];
  setIsDisabledSave: (isValid: boolean) => void;
};

export const StyleCard = <T extends CustomStyle | CustomMark>({
  style,
  handleStyleChange,
  handleStyleRemoval,
  allStyles,
  setIsDisabledSave,
  index,
}: StyleCardProps<T>) => {
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
            handleStyleChange(index, "isOpen", !style.isOpen as T[keyof T]),
        }}>
        <FieldGroup key={index} className={styling.content}>
          <TextField
            id={`slug-${index}`}
            required
            name='slug'
            label='Slug (to be used as a CSS class)'
            value={style.slug}
            onChange={(newValue) =>
              handleStyleChange(index, "slug", newValue as T[keyof T])
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
              handleStyleChange(index, "title", newValue as T[keyof T])
            }
            error={titleValidation.error}
          />
          {"nodes" in style && (
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
                  "nodes" as keyof T,
                  newValue as T[keyof T]
                )
              }
            />
          )}
          {"icon" in style && (
            <TextField
              id={`icon-${style.slug}-${index}`}
              name='icon'
              label={
                <span>
                  Icon (set an icon name from
                  <a className={styling.link} href='https://fontawesome.com/search?q=house&o=r&ic=free' target='_blank'>
                    fontawesome free icons
                  </a>. Valid icons will be displayed in the title of this card.
                  )
                </span>
              }
              placeholder='e.g. "volume-high"'
              value={style.icon}
              onChange={(newValue) =>
                handleStyleChange(
                  index,
                  "icon" as keyof T,
                  newValue as T[keyof T]
                )
              }
            />
          )}
          {"keyboardShortcut" in style && (
            <TextField
              id={`keyboardShortcut-${style.slug}-${index}`}
              name='keyboardShortcut'
              label='Keyboard Shortcut'
              value={style.keyboardShortcut}
              onChange={(newValue) =>
                handleStyleChange(
                  index,
                  "keyboardShortcut" as keyof T,
                  newValue as T[keyof T]
                )
              }
            />
          )}
          <CodeBlock
            handleStyleChange={handleStyleChange}
            style={style}
            index={index}
          />
          <div style={preview.css}> {preview.text} </div>
        </FieldGroup>
      </Section>
    </div>
  );
};
