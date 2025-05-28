import React, { useState, useEffect } from "react";
import type { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, Form, Button } from "datocms-react-ui";
import { PlusIcon } from "../components/PlusIcon/PlusIcon";
import { DUMMY_CUSTOM_STYLE } from "./variables";
import { StyleCard } from "../components/StyleCard/StyleCard";
import { getUserParameters, sortCustomStyle } from "../utils/userSettings";
import parse from "style-to-js";
import { v4 as uuidv4 } from "uuid";


import * as styling from "./ConfigScreen.module.css";

type Props = {
  ctx: RenderConfigScreenCtx;
};

const ConfigScreen: React.FC<Props> = ({ ctx }) => {
  const savedParameters = getUserParameters(ctx.plugin.attributes.parameters);
  const [customStyles, setCustomStyle] = useState<CustomStyle[]>(
    savedParameters.customStyles,
  );

  /*
   * Load saved custom styles from RenderConfigScreenCtx
   */
  useEffect(() => {
    setCustomStyle(savedParameters.customStyles.sort(sortCustomStyle));
  }, [ctx]);

  /*
   * Handlers for adding, removing and changing custom styles
   */
  const handleStyleAddition = () => {
    setCustomStyle(
      [
        ...customStyles.map(style => ({ ...style, isOpen: false })),
        {
          ...DUMMY_CUSTOM_STYLE,
          id: uuidv4(),
        }
      ].sort(sortCustomStyle),
    );
  };

  const handleStyleRemoval = async (id: string) => {
    const index = customStyles.findIndex((style) => style.id === id);
    const isConfirmed = await ctx.openConfirm({
      title: `Remove ${customStyles[index].title}`,
      content: `All Structured Text fields using this style will be affected.`,
      cancel: {
        label: "Cancel",
        value: false,
      },
      choices: [
        {
          label: "Delete",
          value: true,
          intent: "negative",
        },
      ],
    });
    if (isConfirmed) {
      setCustomStyle((prev) =>
        prev.filter((_, i) => i !== index).sort(sortCustomStyle),
      );
    }
  };

  /*
   * Only sort if node is changed or if card is closed.
   * This is to prevent reordering in the midst of updating the title and losing focus.
   */
  const handleStyleChange = (
    id: string,
    key: keyof CustomStyle,
    value: CustomStyle[keyof CustomStyle],
  ) => {
    const index = customStyles.findIndex((style) => style.id === id);
    const isSort = key === "nodes" || (key === "isOpen" && value === false);
    setCustomStyle((prev) => {
      const updated = prev.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      );
      return isSort ? updated.sort(sortCustomStyle) : updated;
    });
  };

  // TODO: add function to select with structured text fields you can apply which custom styles to
  /*
   * Handler for saving all custom styles.
   * Saved custom styles can be used in all structured text fields.
   */
  const validateCss = () => {
    for (const style of customStyles) {
      try {
        parse(style.css);
      } catch (error) {
        throw new Error(`Invalid CSS in "${style.title}": ${error}`);
      }
    }
  };

  const validateFields = () => {
    const slugs = new Set<string>();

    for (const style of customStyles) {
      // Check for empty title
      const trimmedTitle = style.title.trim();
      if (!trimmedTitle) {
        throw new Error(`Title cannot be empty for one of the custom styles`);
      }

      // Check for empty slug
      const trimmedSlug = style.slug.trim();
      if (!trimmedSlug) {
        throw new Error(`Slug cannot be empty for style "${style.title}"`);
      }

      // Check for duplicate slug
      if (slugs.has(trimmedSlug)) {
        throw new Error(`Duplicate slug "${trimmedSlug}" found. Each style must have a unique slug.`);
      }
      slugs.add(trimmedSlug);
    }
  };

  const handleSave = async () => {
    try {
      validateFields();
      validateCss();
      await ctx.updatePluginParameters({ customStyles });
      ctx.notice("Custom styles saved successfully!");
    } catch (error) {
      ctx.alert(`Failed to save custom styles:<br/><br/>${error}`);
      return;
    }
  };

  return (
    <Canvas ctx={ctx}>
      <h2> Custom Styles </h2>
      <p className={styling.description}>
        Set your custom CSS Structured Text styles below.
      </p>
      <Form className={styling.form}>
        {customStyles.map((style) => (
          <StyleCard
            key={style.id}
            style={style}
            handleStyleChange={handleStyleChange}
            handleStyleRemoval={handleStyleRemoval}
            allStyles={customStyles}
          />
        ))}
        <Button
          type="button"
          buttonType="muted"
          leftIcon={<PlusIcon />}
          onClick={handleStyleAddition}
        >
          Add Custom Style
        </Button>
        <Button
          type="submit"
          buttonType="primary"
          buttonSize="xl"
          className={styling.saveButton}
          fullWidth
          onClick={handleSave}
        >
          Save
        </Button>
      </Form>
    </Canvas>
  );
};

export default ConfigScreen;
