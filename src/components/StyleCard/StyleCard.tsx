import {
  SelectField,
} from "datocms-react-ui";
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
  handleStyleChange: (
    index: number,
    key: keyof CustomStyle,
    value: CustomStyle[keyof CustomStyle]
  ) => void;
  handleStyleRemoval: (index: number) => void;
  allStyles: CustomStyle[];
};

export const StyleCard = ({
  style,
  handleStyleChange,
  handleStyleRemoval,
  allStyles,
  index,
}: StyleCardProps) => {

  return (
    <Card
      title={<CardTitle {...style} />}
      isOpen={style.isOpen}
      onToggle={() =>
        handleStyleChange(index, "isOpen", !style.isOpen as CustomStyle["isOpen"])
      }
      onDelete={() => handleStyleRemoval(index)}
    >
      <Slug
        index={index}
        value={style.slug}
        handleStyleChange={handleStyleChange}
        allStyles={allStyles}
      />
      <Title
        index={index}
        value={style.title}
        handleStyleChange={handleStyleChange}
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
          handleStyleChange(index, "nodes", newValue as CustomStyle["nodes"])
        }
      />
      <CodeBlock
        handleStyleChange={(index, key, value) => {
          handleStyleChange(index, key, value);
        }}
        style={style}
        index={index}
      />
      <Preview css={style.css} />
    </Card>
  );
};
