import { TextField } from "datocms-react-ui";
import { validateTitleUniqueness } from "../../../utils/validate";
import { useEffect, useMemo } from "react";
import { useErrorSignal } from "../../Card/ErrorContext";

const KEY_NAME = "title";

type SlugProps<T extends CustomStyle | CustomMark> = {
  index: number;
  value: string;
  onChange: (index: number, key: keyof T, value: T[keyof T]) => void;
  onBlur: () => void;
  allStyles: T[];
};

export const Title = <T extends CustomStyle | CustomMark>({
  index,
  value,
  onChange,
  onBlur,
  allStyles,
}: SlugProps<T>) => {
  const validation = useMemo(
    () => validateTitleUniqueness(value, index, allStyles),
    [value, index, allStyles],
  );
  const { setError } = useErrorSignal();
  useEffect(() => {
    setError(KEY_NAME, !!validation.error);
  }, [validation.error, setError]);
  return (
    <TextField
      id={`${KEY_NAME}-${index}`}
      required
      name={KEY_NAME}
      label='Title (shown in the Structured Text editor)'
      value={value}
      onChange={(newValue) =>
        onChange(index, KEY_NAME, newValue as T[keyof T])
      }
      textInputProps={{ onBlur }}
      error={validation.error}
    />
  );
};
