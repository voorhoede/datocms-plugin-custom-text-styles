import React, { useState, useEffect } from "react";
import type { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import {
  Canvas,
  Form,
  FieldGroup,
  TextField,
  Button,
  TextareaField,
  SelectField,
  Section,
  FormLabel
} from "datocms-react-ui";
import { PlusIcon } from "../components/PlusIcon/PlusIcon";
import { DUMMY_CUSTOM_STYLE, NODE_OPTIONS } from "./variables";

import * as styling from "./ConfigScreen.module.css";
import { DeleteIcon } from "../components/DeleteIcon/DeleteIcon";

type Props = {
  ctx: RenderConfigScreenCtx;
};

export type CustomStyle = {
  title: string;
  css: string;
  node: (typeof NODE_OPTIONS)[number];
  isOpen: boolean;
};

const ConfigScreen: React.FC<Props> = ({ ctx }) => {
  const savedParams = ctx.plugin.attributes.parameters || {};
  const [customStyles, setCustomStyle] = useState<CustomStyle[]>(
    (savedParams.customStyles as CustomStyle[]) || [DUMMY_CUSTOM_STYLE]
  );

  useEffect(() => {
    setCustomStyle(
      (savedParams.customStyles as CustomStyle[]) || [DUMMY_CUSTOM_STYLE]
    );
  }, [ctx]);

  const handleGroupAddition = () => {
    setCustomStyle([...customStyles, DUMMY_CUSTOM_STYLE]);
    ctx.notice("Added new field group");
  };

  const handleGroupRemoval = (index: number) => {
    setCustomStyle((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGroupChange = (
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
      await ctx.updatePluginParameters({ customStyles });
      ctx.notice("Settings saved successfully!");
    } catch (error) {
      ctx.alert(`Failed to save settings \n ${error}`);
      return;
    }
  };

  return (
    <Canvas ctx={ctx}>
      <Form className='form'>
        {customStyles.map((style, index) => (
          <div className={styling.card} key={index}>
            <Button
              type='button'
              className={styling.deleteButton}
              buttonType='negative'
              onClick={() => handleGroupRemoval(index)}>
              <DeleteIcon />
            </Button>
            <Section
              key={index}
              headerClassName={styling.cardHeader}
              titleClassName={styling.cardTitle}
              title={style.title}
              collapsible={{
                isOpen: style.isOpen,
                onToggle: () =>
                  handleGroupChange(index, "isOpen", !style.isOpen),
              }}>
              <FieldGroup key={index} className={styling.cardContent}>
                <TextField
                  id={`title-${index}`}
                  name='title'
                  label='Title'
                  value={style.title || ""}
                  onChange={(newValue) =>
                    handleGroupChange(index, "title", newValue)
                  }
                />
                <SelectField
                  id={`node-${index}`}
                  name='node'
                  label='Node'
                  hint='Select one of the options'
                  value={style.node}
                  selectInputProps={{
                    options: NODE_OPTIONS,
                  }}
                  onChange={(newValue) =>
                    handleGroupChange(
                      index,
                      "node",
                      newValue as (typeof NODE_OPTIONS)[number]
                    )
                  }
                />
                <TextareaField
                  id={`css-${index}`}
                  name='css'
                  label='CSS'
                  textareaInputProps={{
                    rows: 10,
                    className: styling.textareaCode,
                  }}
                  value={style.css || ""}
                  onChange={(newValue) =>
                    handleGroupChange(index, "css", newValue)
                  }
                />
              </FieldGroup>
            </Section>
          </div>
        ))}
        <Button
          type='button'
          buttonType='muted'
          className={styling.buttonContent}
          onClick={handleGroupAddition}>
          <PlusIcon /> Add Custom Style
        </Button>
        <Button
          type='submit'
          buttonType='primary'
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
