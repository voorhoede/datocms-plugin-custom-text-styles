import { TextField } from "datocms-react-ui";
import { validateSlugUniqueness } from "../../../utils/validate";
import { useEffect, useMemo } from "react";
import { useErrorSignal } from "../../Card/ErrorContext";

const KEY_NAME = "slug";

type SlugProps<T extends CustomStyle | CustomMark> = {
  index: number;
  value: string;
  onChange: (index: number, key: keyof T, value: T[keyof T]) => void;
  onBlur: () => void;
  allStyles: T[];
};

export const Slug = <T extends CustomStyle | CustomMark>({
  index,
  value,
  onChange,
  allStyles,
  onBlur,
}: SlugProps<T>) => {
  const validation = useMemo(
    () => validateSlugUniqueness(value, index, allStyles),
    [value, index, allStyles]
  );
  const { setError } = useErrorSignal();
  useEffect(() => {
    setError(KEY_NAME, !!validation.error);
  }, [validation.error]);
  return (
    <TextField
      id={`${KEY_NAME}-${index}`}
      required
      name={KEY_NAME}
      label='Slug (to be used as a CSS class)'
      value={value as string}
      onChange={(newValue) => onChange(index, KEY_NAME, newValue as T[keyof T])}
      textInputProps={{ onBlur }}
      error={validation.error}
    />
  );
};
