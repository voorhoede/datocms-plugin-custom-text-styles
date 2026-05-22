import React, { useState, useEffect, useCallback, useRef } from "react";
import type { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, Form, Button, Section } from "datocms-react-ui";
import { PlusIcon } from "../components/icons/PlusIcon/PlusIcon";
import { DUMMY_CUSTOM_MARKS, DUMMY_CUSTOM_STYLES } from "./variables";
import { StyleCard } from "../components/StyleCard/StyleCard";
import { MarkCard } from "../components/MarkCard/MarkCard";
import { getUserParameters } from "../utils/userSettings";
import { validateFields } from "../utils/validate";
import * as styling from "./ConfigScreen.module.css";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

    const dummyStyle = DUMMY_CUSTOM_STYLES[customStyles.length < DUMMY_CUSTOM_STYLES.length ? customStyles.length : DUMMY_CUSTOM_STYLES.length - 1];
    const nextStyles = [
      ...customStyles.map((style) => ({ ...style, isOpen: false })),
      {
        ...dummyStyle,
      },
    ];
    setCustomStyle(nextStyles);
    save(nextStyles, "customStyles");
  };

  const handleMarkAddition = () => {
    const dummyMark = DUMMY_CUSTOM_MARKS[customMarks.length < DUMMY_CUSTOM_MARKS.length ? customMarks.length : DUMMY_CUSTOM_MARKS.length - 1];
    const nextMarks = [
      ...customMarks.map((mark) => ({ ...mark, isOpen: false })),
      {
        ...dummyMark,
      },
    ];
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
      <Section title="Please Note" highlighted>
        <strong>
          <FontAwesomeIcon icon={faExclamationTriangle} color="var(--alert-color)" /> All of the below custom styles and marks will be available to all Structured Text Fields on default.
        </strong>
        <p>
          If you do not want this, you can configure which specific styles and marks are available for content editors on a per-block basis. See the <a href="https://github.com/voorhoede/datocms-plugin-custom-text-styles/blob/main/README.md#field-add-on-settings" target="_blank" rel="noopener noreferrer">README</a> for more information.
        </p>
      </Section>
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
