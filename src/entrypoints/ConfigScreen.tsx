import React, { useState, useEffect } from "react";
import type { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, Form, Button } from "datocms-react-ui";
import { PlusIcon } from "../components/PlusIcon/PlusIcon";
import { DUMMY_CUSTOM_MARK, DUMMY_CUSTOM_STYLE } from "./variables";
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
  const [customMarks, setCustomMark] = useState<CustomMark[]>(
    savedParameters.customMarks
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
    setCustomStyle([
      ...customStyles.map((style) => ({ ...style, isOpen: false })),
      {
        ...DUMMY_CUSTOM_STYLE,
      },
    ]);
  };

  const handleMarkAddition = () => {
    setCustomMark([
      ...customMarks.map((mark) => ({ ...mark, isOpen: false })),
      {
        ...DUMMY_CUSTOM_MARK,
      },
    ]);
  };

  const handleStyleRemoval = async (index: number) => {
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
      setCustomStyle((prev) => prev.filter((_, i) => i !== index));
    }
  };
  const handleMarkRemoval = async (index: number) => {
    const isConfirmed = await ctx.openConfirm({
      title: `Remove ${customMarks[index].title}`,
      content: `All Structured Text fields using this mark will be affected.`,
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
      setCustomMark((prev) => prev.filter((_, i) => i !== index));
    }
  };
  const handleMarkChange = (
    index: number,
    key: keyof CustomMark,
    value: CustomMark[keyof CustomMark]
  ) => {
    setCustomMark((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const handleStyleChange = (
    index: number,
    key: keyof CustomStyle,
    value: CustomStyle[keyof CustomStyle]
  ) => {
    setCustomStyle((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const handleSave = async () => {
    try {
      validateFields(customStyles);
      await ctx.updatePluginParameters({ customStyles, customMarks });
      ctx.notice("Custom styles saved successfully!");
    } catch (error) {
      ctx.alert(`Failed to save custom styles:<br/><br/>${error}`);
      return;
    }
  };
  // Disable save button if unable to save

  return (
    <Canvas ctx={ctx}>
      <Form className={styling.form}>
        <h2> Custom Styles </h2>
        <p> Styles that apply to a node</p>
        {customStyles.map((style, index) => (
          <StyleCard
            key={index}
            index={index}
            style={style}
            handleStyleChange={handleStyleChange}
            handleStyleRemoval={() => handleStyleRemoval(index)}
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
        <br />
        <h2> Custom Marks </h2>
        <p> Styles that apply to inline text</p>
        {customMarks.map((mark, index) => (
          <StyleCard
            key={index}
            index={index}
            style={mark}
            handleStyleChange={handleMarkChange}
            handleStyleRemoval={() => handleMarkRemoval(index)}
            setIsDisabledSave={setIsDisabledSave}
            allStyles={customMarks}
          />
        ))}
        <Button
          type='button'
          buttonType='muted'
          leftIcon={<PlusIcon />}
          onClick={handleMarkAddition}>
          Add Custom Mark
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
