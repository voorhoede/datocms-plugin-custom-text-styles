import {
  SelectField,
} from "datocms-react-ui";
import {
  fas,
  IconName,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as styles from "./IconSelect.module.css";
import { icon } from "@fortawesome/fontawesome-svg-core";

const KEY_NAME = "icon";

const removePrefix = (input: string): string => {
  return input.replace("fa", "");
};

// Ensure a kebab case format since DatoCMS Structured Text Component expects this 'volume-high'.
const getIconValue = (input: string): string => {
  return removePrefix(input).replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

const getIconLabel = (value: string): string => {
  return removePrefix(value).replace(/([A-Z])/g, " $1").trim();
};

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

const IconValue = ({ data }: { data: { value: string; label: string } }) => {
  const { label, value } = data;
  return (
    <div className={styles.iconValue}>
      <FontAwesomeIcon
        icon={['fas', value as IconName]}
        style={{ marginRight: 8 }}
      />
      <span>{label}</span>
    </div>
  );
};

export const IconSelect = ({
  index,
  selected,
  onChange,
  onBlur,
}: IconSelectProps) => {

  const IconOption = (props: {
    data: { value: string; label: string };
    innerRef: React.RefObject<HTMLDivElement>;
    innerProps: any;
    isFocused: boolean;
    isSelected: boolean;
  }) => {
    const { value, label } = props.data as { value: string; label: string, icon: string };
    return (
      <div
        ref={props.innerRef}
        {...props.innerProps}
        className={styles.iconOption}
        data-focused={props.isFocused ? "true" : "false"}
        data-selected={props.isSelected ? "true" : "false"}>
        <FontAwesomeIcon
          icon={['fas', value as IconName]}
          style={{ marginRight: 8 }}
        />
        <span>{label}</span>
      </div>
    );
  };

  const options = Object.keys(fas)
    .filter((key) => key !== "prefix") // Remove metadata
    .map((iconKey) => {
      const value = getIconValue(iconKey);
      const label = getIconLabel(iconKey);
      return {
        label,
        value,
      };
    });
  return (
    <SelectField
      id={`${KEY_NAME}-${index}`}
      name={KEY_NAME}
      label='Icon'
      placeholder='e.g. "volume-high"'
      value={selected}
      onChange={(newValue) => {
        onChange(index, KEY_NAME, newValue as CustomMark[keyof CustomMark]);
      }}
      selectInputProps={{
        isMulti: false,
        options,
        onBlur,
        components: {
          Option: IconOption as any,
          SingleValue: IconValue,
        },
      }}
    />
  );
};
