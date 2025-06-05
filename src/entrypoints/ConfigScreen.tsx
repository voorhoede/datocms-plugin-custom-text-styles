import React, { useState, useEffect } from "react";
import type { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, Form, Button } from "datocms-react-ui";
import { PlusIcon } from "../components/PlusIcon/PlusIcon";
import { DUMMY_CUSTOM_STYLE } from "./variables";
import { StyleCard } from "../components/StyleCard/StyleCard";
import { getUserParameters } from "../utils/userSettings";
import { validateFields } from "../utils/validate";

import * as styling from "./ConfigScreen.module.css";

type Props = {
  ctx: RenderConfigScreenCtx;
};

const ConfigScreen: React.FC<Props> = ({ ctx }) => {
  const [isDisabledSave, setIsDisabledSave] = useState(false);
  const savedParameters = getUserParameters(ctx.plugin.attributes.parameters);
  const [customStyles, setCustomStyle] = useState<CustomStyle[]>(
    savedParameters.customStyles
  );

  /*
   * Load saved custom styles from RenderConfigScreenCtx
   */
  useEffect(() => {
    setCustomStyle(savedParameters.customStyles);
  }, [ctx]);

  /*
   * Handlers for adding, removing and changing custom styles
   */
  const handleStyleAddition = () => {
    setCustomStyle(
      [
        ...customStyles.map((style) => ({ ...style, isOpen: false })),
        {
          ...DUMMY_CUSTOM_STYLE,
          createdAt: new Date().toISOString(),
        },
      ]
    );
  };

  const handleStyleRemoval = async (id: string) => {
    const index = customStyles.findIndex((style) => style.createdAt === id);
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
        prev.filter((_, i) => i !== index)
      );
    }
  };

  /*
   * Only sort if node is changed or if card is closed.
   * This is to prevent reordering in the midst of updating the title and losing focus.
   */
  const handleStyleChange = (
    createdAt: string,
    key: keyof CustomStyle,
    value: CustomStyle[keyof CustomStyle]
  ) => {
    setCustomStyle((prev) =>
      prev.map((item) =>
        item.createdAt === createdAt ? { ...item, [key]: value } : item
      )
    );
  };

  const handleSave = async () => {
    try {
      validateFields(customStyles);
      await ctx.updatePluginParameters({ customStyles });
      ctx.notice("Custom styles saved successfully!");
    } catch (error) {
      setIsDisabledSave(true);
      ctx.alert(`Failed to save custom styles:<br/><br/>${error}`);
      return;
    }
  };
// Disable save button if unable to save

  return (
    <Canvas ctx={ctx}>
      <h2> Custom Styles </h2>
      <p className={styling.description}>
        Set your custom CSS Structured Text styles below.
      </p>
      <Form className={styling.form}>
        {customStyles.map((style) => (
          <StyleCard
            key={style.createdAt}
            style={style}
            handleStyleChange={handleStyleChange}
            handleStyleRemoval={handleStyleRemoval}
            setIsDisabledSave={setIsDisabledSave}
            allStyles={customStyles}
          />
        ))}
        <Button
          type='button'
          buttonType='muted'
          leftIcon={<PlusIcon />}
          onClick={handleStyleAddition}>
          Add Custom Style
        </Button>
        <Button
          type='submit'
          disabled={isDisabledSave}
          buttonType={isDisabledSave ? "muted" : "primary"}
          buttonSize='xl'
          className={styling.saveButton}
          fullWidth
          onClick={handleSave}>
          Save
        </Button>
      </Form>
    </Canvas>
  );
};

export default ConfigScreen;
