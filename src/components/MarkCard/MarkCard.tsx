import { CodeBlock } from "../inputs/CodeBlock/CodeBlock";
import { CardTitle } from "../Card/CardTitle/CardTitle";
import { Slug } from "../inputs/Slug/Slug";
import { Title } from "../inputs/Title/Title";
import { KeyboardShortcut } from "../inputs/KeyboardShortcut/KeyboardShortcut";
import { Card } from "../Card/Card";
import { Preview } from "../inputs/Preview/Preview";
import { IconSelect } from "../inputs/IconSelect/IconSelect";

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
  };

  const handleBlur = () => {
    save(allMarks, "customMarks");
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
        handleChange(index, "isOpen", !mark.isOpen as CustomMark["isOpen"])
      }
      onDelete={handleRemove}>
      <Slug
        index={index}
        value={mark.slug}
        onChange={handleChange}
        onBlur={handleBlur}
        allStyles={allMarks}
      />
      <Title
        index={index}
        value={mark.title}
        onChange={handleChange}
        onBlur={handleBlur}
        allStyles={allMarks}
      />
      <IconSelect
        index={index}
        selected={mark.icon}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <KeyboardShortcut
        index={index}
        value={mark.keyboardShortcut}
        onChange={handleChange}
        onBlur={handleBlur}
        allStyles={allMarks}
      />
      <CodeBlock
        handleStyleChange={handleChange}
        style={mark}
        index={index}
        onBlur={handleBlur}
      />
      <Preview css={mark.css} />
    </Card>
  );
};
