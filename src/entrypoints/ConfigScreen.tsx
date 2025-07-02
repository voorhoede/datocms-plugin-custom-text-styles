import React, { useState, useEffect, useCallback, useRef } from "react";
import type { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, Form, Button } from "datocms-react-ui";
import { PlusIcon } from "../components/PlusIcon/PlusIcon";
import { DUMMY_CUSTOM_MARK, DUMMY_CUSTOM_STYLE } from "./variables";
import { StyleCard } from "../components/StyleCard/StyleCard";
import { getUserParameters } from "../utils/userSettings";

import * as styling from "./ConfigScreen.module.css";
import { validateFields } from "../utils/validate";

type Props = {
  ctx: RenderConfigScreenCtx;
};

const ConfigScreen: React.FC<Props> = ({ ctx }) => {
  const savedParameters = getUserParameters(ctx.plugin.attributes.parameters);
  const [customStyles, setCustomStyle] = useState<CustomStyle[]>(
    savedParameters.customStyles,
  );
  const [customMarks, setCustomMark] = useState<CustomMark[]>(
    savedParameters.customMarks,
  );
  const hasAlerted = useRef(false);
  // HACK: DatoCMS Textfield does not support onBlur, so we need to debounce the save
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    const nextStyles = [
      ...customStyles.map((style) => ({ ...style, isOpen: false })),
      {
        ...DUMMY_CUSTOM_STYLE,
      },
    ];
    setCustomStyle(nextStyles);
    save(nextStyles, "customStyles");
  };

  const handleMarkAddition = () => {
    const nextMarks = [
      ...customMarks.map((mark) => ({ ...mark, isOpen: false })),
      {
        ...DUMMY_CUSTOM_MARK,
      },
    ];
    setCustomMark(nextMarks);
    save(nextMarks, "customMarks");
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
      const nextStyles = customStyles.filter((_, i) => i !== index);
      setCustomStyle(nextStyles);
      save(nextStyles, "customStyles");
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
      const nextMarks = customMarks.filter((_, i) => i !== index);
      setCustomMark(nextMarks);
      save(nextMarks, "customMarks");
    }
  };
  const handleMarkChange = (
    index: number,
    key: keyof CustomMark,
    value: CustomMark[keyof CustomMark],
  ) => {
    setCustomMark((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  };

  const handleStyleChange = (
    index: number,
    key: keyof CustomStyle,
    value: CustomStyle[keyof CustomStyle],
  ) => {
    const nextStyles = customStyles.map((item, i) =>
      i === index ? { ...item, [key]: value } : item,
    );
    setCustomStyle(nextStyles);
    save(nextStyles, "customStyles");
  };

  const save = (
    list: CustomStyle[] | CustomMark[],
    type: "customStyles" | "customMarks",
  ) => {
    try {
      validateFields(list);

      // HACK: DatoCMS Textfield does not support onBlur, so we need to debounce the save
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        savePluginParameters(list, type);
      }, 500);
    } catch (error) {
      if (!hasAlerted.current) {
        ctx.alert(
          `Custom styles and marks that contain errors will not be saved`,
        );
        hasAlerted.current = true;
      }
    }
  };

  // save use react callback to get correct styles and marks
  const savePluginParameters = async (
    list: CustomStyle[] | CustomMark[],
    type: "customStyles" | "customMarks",
  ) => {
    try {
      await ctx.updatePluginParameters({
        [type]: list,
        ...(type === "customStyles" ? { customMarks } : { customStyles }),
      });
    } catch (error) {
      ctx.alert(`Failed to save custom styles:<br/><br/>${error}`);
    }
  };

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
            allStyles={customMarks}
          />
        ))}
        <Button
          type="button"
          buttonType="muted"
          leftIcon={<PlusIcon />}
          onClick={handleMarkAddition}
        >
          Add Custom Mark
        </Button>
      </Form>
    </Canvas>
  );
};

export default ConfigScreen;
function validateCss(style: CustomStyle) {
  throw new Error("Function not implemented.");
}
