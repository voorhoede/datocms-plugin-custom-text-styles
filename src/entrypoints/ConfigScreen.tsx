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
} from "datocms-react-ui";

type Props = {
  ctx: RenderConfigScreenCtx;
};

export type CustomStyle = {
  title: string;
  css: string;
  node: (typeof NODE_OPTIONS)[number];
};

const NODE_OPTIONS = [
  { label: "Paragraph", value: "paragraph" },
  { label: "Heading", value: "heading" },
] as const;

const ConfigScreen: React.FC<Props> = ({ ctx }) => {
  // Load saved parameters or set defaults
  const savedParams = ctx.plugin.attributes.parameters || {};
  const [customStyles, setCustomStyle] = useState<CustomStyle[]>(
    (savedParams.customStyles as CustomStyle[]) || [
      {
        title: "dummyTitle",
        css: "",
      },
    ]
  );

  useEffect(() => {
    setCustomStyle(
      (savedParams.customStyles as CustomStyle[]) || [
        {
          title: "dummyTitle",
          css: "",
          node: "paragraph",
        },
      ]
    );
  }, [ctx]);

  const handleGroupAddition = () => {
    setCustomStyle([
      ...customStyles,
      { title: "dummyTitle", css: "", node: NODE_OPTIONS[0] },
    ]);
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
    await ctx.updatePluginParameters({ customStyles });
    ctx.notice("Settings saved successfully!");
  };

  return (
    <Canvas ctx={ctx}>
      <Form className='form'>
        <div>
          {customStyles.map((styling, index) => (
            <Section key={index} title={`Custom Style ${index + 1}`}>
              <div className='custom-style'>
                <FieldGroup key={index}>
                  <Button
                    type='button'
                    buttonType='negative'
                    onClick={() => handleGroupRemoval(index)}>
                    {/* Remove Custom Style "{styling.title}" */}X
                  </Button>
                  <TextField
                    id={`title-${index}`}
                    name='title'
                    label='Title'
                    value={styling.title || ""}
                    onChange={(newValue) =>
                      handleGroupChange(index, "title", newValue)
                    }
                  />
                  <SelectField
                    id={`node-${index}`}
                    name='node'
                    label='Node'
                    hint='Select one of the options'
                    value={styling.node}
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
                    id={`css-class-${index}`}
                    name='css-class'
                    label='CSS Class'
                    textareaInputProps={{
                      rows: 10,
                    }}
                    value={styling.css || ""}
                    onChange={(newValue) =>
                      handleGroupChange(index, "css", newValue)
                    }
                  />
                </FieldGroup>
              </div>
            </Section>
          ))}
          <Button
            type='button'
            buttonType='muted'
            onClick={handleGroupAddition}>
            + Add Custom Style
          </Button>
        </div>
        <Button
          type='submit'
          buttonType='primary'
          buttonSize='xl'
          fullWidth
          onClick={handleSave}>
          Save
        </Button>
      </Form>
    </Canvas>
  );
};

export default ConfigScreen;
