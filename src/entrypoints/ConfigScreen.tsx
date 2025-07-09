import React, { useState, useEffect, useCallback, useRef } from "react";
import type { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, Form, Button } from "datocms-react-ui";
import { PlusIcon } from "../components/icons/PlusIcon/PlusIcon";
import { DUMMY_CUSTOM_MARK, DUMMY_CUSTOM_STYLE } from "./variables";
import { StyleCard } from "../components/StyleCard/StyleCard";
import { MarkCard } from "../components/MarkCard/MarkCard";
import { getUserParameters } from "../utils/userSettings";

import * as styling from "./ConfigScreen.module.css";
import { validateFields } from "../utils/validate";

type Props = {
  ctx: RenderConfigScreenCtx;
};

const ConfigScreen: React.FC<Props> = ({ ctx }) => {
  const savedParameters = getUserParameters(ctx.plugin.attributes.parameters);
  const [customStyles, setCustomStyle] = useState<CustomStyle[]>(
    savedParameters.customStyles
  );
  const [customMarks, setCustomMark] = useState<CustomMark[]>(
    savedParameters.customMarks
  );
  const hasAlerted = useRef(false);
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
    ctx.alert(JSON.stringify(nextMarks));
    setCustomMark(nextMarks);
    save(nextMarks, "customMarks");
  };

  const confirmDeletion = async (title: string): Promise<boolean> => {
    return (await ctx.openConfirm({
      title: `Remove ${title}`,
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
    })) as boolean;
  };

  const save = (
    list: CustomStyle[] | CustomMark[],
    type: "customStyles" | "customMarks"
  ) => {
    try {
      validateFields(list);
      savePluginParameters(list, type);
    } catch (error) {
      if (!hasAlerted.current) {
        ctx.alert(
          `Custom styles and marks that contain errors will not be saved`
        );
        hasAlerted.current = true;
      }
    }
  };

  const savePluginParameters = async (
    list: CustomStyle[] | CustomMark[],
    type: "customStyles" | "customMarks"
  ) => {
    try {
      const oppositeType = type === "customStyles" ? "customMarks" : "customStyles";
      await ctx.updatePluginParameters({
        [type]: list,
        [oppositeType]: savedParameters[oppositeType],
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
            allStyles={customStyles}
            setCustomStyle={setCustomStyle}
            save={save}
            confirmDeletion={confirmDeletion}
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
          <MarkCard
            key={index}
            index={index}
            mark={mark}
            setCustomMark={setCustomMark}
            save={save}
            allMarks={customMarks}
            confirmDeletion={confirmDeletion}
          />
        ))}
        {customMarks.length}
        <Button
          type='button'
          buttonType='muted'
          leftIcon={<PlusIcon />}
          onClick={handleMarkAddition}>
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
