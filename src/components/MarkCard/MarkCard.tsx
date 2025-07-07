import { TextField } from "datocms-react-ui";
import { CodeBlock } from "../inputs/CodeBlock/CodeBlock";
import { CardTitle } from "../Card/CardTitle/CardTitle";
import { Slug } from "../inputs/Slug/Slug";
import { Title } from "../inputs/Title/Title";
import { KeyboardShortcut } from "../inputs/KeyboardShortcut/KeyboardShortcut";
import { Card } from "../Card/Card";
import { Preview } from "../inputs/Preview/Preview";
import * as styling from "./MarkCard.module.css";

type MarkCardProps = {
  style: CustomMark;
  index: number;
  handleStyleChange: (
    index: number,
    key: keyof CustomMark,
    value: CustomMark[keyof CustomMark]
  ) => void;
  handleStyleRemoval: (index: number) => void;
  allStyles: CustomMark[];
};

export const MarkCard = ({
  style,
  handleStyleChange,
  handleStyleRemoval,
  allStyles,
  index,
}: MarkCardProps) => {
  return (
    <Card
      title={<CardTitle {...style} />}
      isOpen={style.isOpen}
      onToggle={() =>
        handleStyleChange(
          index,
          "isOpen",
          !style.isOpen as CustomMark["isOpen"]
        )
      }
      onDelete={() => handleStyleRemoval(index)}>
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
      <TextField
        id={`icon-${style.slug}-${index}`}
        name='icon'
        label={
          <span>
            Icon (set an icon name from
            <a
              className={styling.link}
              href='https://fontawesome.com/search?q=house&o=r&ic=free'
              target='_blank'>
              fontawesome free icons
            </a>
            . Valid icons will be displayed in the title of this card. )
          </span>
        }
        placeholder='e.g. "volume-high"'
        value={style.icon}
        onChange={(newValue) => handleStyleChange(index, "icon", newValue)}
      />
      <KeyboardShortcut
        index={index}
        value={style.keyboardShortcut}
        handleStyleChange={handleStyleChange}
        allStyles={allStyles}
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
