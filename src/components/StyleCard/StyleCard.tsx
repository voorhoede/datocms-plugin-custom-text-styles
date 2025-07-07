import { SelectField } from "datocms-react-ui";
import { NODE_OPTIONS } from "../../entrypoints/variables";
import { CodeBlock } from "../inputs/CodeBlock/CodeBlock";
import { useMemo } from "react";
import { getUserStyle } from "../../utils/userSettings";
import { CardTitle } from "../Card/CardTitle/CardTitle";
import { Slug } from "../inputs/Slug/Slug";
import { Title } from "../inputs/Title/Title";

import { Card } from "../Card/Card";
import { Preview } from "../inputs/Preview/Preview";

type StyleCardProps = {
  style: CustomStyle;
  index: number;
  setCustomStyle: (styles: CustomStyle[]) => void;
  save: (
    styles: CustomStyle[] | CustomMark[],
    type: "customStyles" | "customMarks"
  ) => void;
  allStyles: CustomStyle[];
  confirmDeletion: (title: string) => Promise<boolean>;
};

export const StyleCard = ({
  style,
  setCustomStyle,
  allStyles,
  index,
  save,
  confirmDeletion,
}: StyleCardProps) => {

  const handleChange = (
    index: number,
    key: keyof CustomStyle,
    value: CustomStyle[keyof CustomStyle]
  ) => {
    const nextStyles = allStyles.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    setCustomStyle(nextStyles);
    save(nextStyles, "customStyles");
  };

  const handleRemove = async () => {
    const isConfirmed = await confirmDeletion(style.title);
    if (isConfirmed) {
      const nextStyles = allStyles.filter((_, i) => i !== index);
      setCustomStyle(nextStyles);
      save(nextStyles, "customStyles");
    }
  };

  return (
    <Card
      title={<CardTitle {...style} />}
      isOpen={style.isOpen}
      onToggle={() =>
        handleChange(index, "isOpen", !style.isOpen as CustomStyle["isOpen"])
      }
      onDelete={handleRemove}>
      <Slug
        index={index}
        value={style.slug}
        handleStyleChange={handleChange}
        allStyles={allStyles}
      />
      <Title
        index={index}
        value={style.title}
        handleStyleChange={handleChange}
        allStyles={allStyles}
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
          handleChange(index, "nodes", newValue as CustomStyle["nodes"])
        }
      />
      <CodeBlock
        handleStyleChange={(index, key, value) => {
          handleChange(index, key, value);
        }}
        style={style}
        index={index}
      />
      <Preview css={style.css} />
    </Card>
  );
};
