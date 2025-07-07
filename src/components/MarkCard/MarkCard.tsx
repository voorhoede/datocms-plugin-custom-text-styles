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
  mark: CustomMark;
  index: number;
  setCustomMark: (marks: CustomMark[]) => void;
  save: (
    marks: CustomMark[] | CustomStyle[],
    type: "customMarks" | "customStyles"
  ) => void;
  allMarks: CustomMark[];
  confirmDeletion: (title: string) => Promise<boolean>;
};

export const MarkCard = ({
  mark,
  setCustomMark,
  allMarks,
  save,
  confirmDeletion,
  index,
}: MarkCardProps) => {
    const handleChange = (
      index: number,
      key: keyof CustomMark,
      value: CustomMark[keyof CustomMark]
    ) => {
      const nextMarks = allMarks.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      );
      setCustomMark(nextMarks);
      save(nextMarks, "customMarks");
    };

    const handleRemove = async () => {
      const isConfirmed = await confirmDeletion(mark.title);
      if (isConfirmed) {
        const nextMarks = allMarks.filter((_, i) => i !== index);
        setCustomMark(nextMarks);
        save(nextMarks, "customMarks");
      }
    };
  return (
    <Card
      title={<CardTitle {...mark} />}
      isOpen={mark.isOpen}
      onToggle={() =>
        handleChange(
          index,
          "isOpen",
          !mark.isOpen as CustomMark["isOpen"]
        )
      }
      onDelete={handleRemove}>
      <Slug
        index={index}
        value={mark.slug}
        handleStyleChange={handleChange}
        allStyles={allMarks}
      />
      <Title
        index={index}
        value={mark.title}
        handleStyleChange={handleChange}
        allStyles={allMarks}
      />
      <TextField
        id={`icon-${mark.slug}-${index}`}
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
        value={mark.icon}
        onChange={(newValue) => handleChange(index, "icon", newValue)}
      />
      <KeyboardShortcut
        index={index}
        value={mark.keyboardShortcut}
        handleStyleChange={handleChange}
        allStyles={allMarks}
      />
      <CodeBlock
        handleStyleChange={handleChange}
        style={mark}
        index={index}
      />
      <Preview css={mark.css} />
    </Card>
  );
};
