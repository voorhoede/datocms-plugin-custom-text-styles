import { SelectField } from "datocms-react-ui";
import { fas } from "@fortawesome/free-solid-svg-icons";

{
  /* TODO: turn into selector based on FA icons  react-ui component*/
}
{
  /* preferably emoji grid,  */
}
const KEY_NAME = "icon";

type IconSelectProps = {
  index: number;
  selected: CustomMark["icon"];
  onChange: (
    index: number,
    key: keyof CustomMark,
    value: CustomMark[keyof CustomMark]
  ) => void;
  onBlur: () => void;
};

export const IconSelect = ({
  index,
  selected,
  onChange,
  onBlur,
}: IconSelectProps) => {
  // TODO: add icon to options
  // get them from fa icon library
  //   get types in IconName
const options = Object.keys(fas)
  .filter((key) => key !== "prefix") // Remove metadata
  .map((iconKey) => {
    const label = iconKey.replace("fa", "").replace(/([A-Z])/g, " $1").trim();
    return {
      label,
      value: iconKey,
    };
  });
  return (
    <SelectField
      id={`${KEY_NAME}-${index}`}
      name={KEY_NAME}
      label={
        <span>
          Icon (set an icon name from
          <a
            href='https://fontawesome.com/search?q=house&o=r&ic=free'
            target='_blank'>
            fontawesome free icons
          </a>
          . Valid icons will be displayed in the title of this card. )
        </span>
      }
      placeholder='e.g. "volume-high"'
      value={selected}
      onChange={(newValue) => {
        onChange(
          index,
          KEY_NAME,
          newValue as CustomMark[keyof CustomMark]
        );
      }}
      selectInputProps={{
        isMulti: false,
        options,
        onBlur,
      }}
    />
  );
};
