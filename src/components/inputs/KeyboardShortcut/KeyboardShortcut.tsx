import { TextField } from "datocms-react-ui";
import { validateKeyboardShortcutUniqueness } from "../../../utils/validate";
import { useEffect, useMemo } from "react";
import { useErrorSignal } from "../../Card/ErrorContext";

const KEY_NAME = "keyboardShortcut";

type KeyboardShortcutProps<T extends CustomStyle | CustomMark> = {
  index: number;
  value: string;
  onChange: (index: number, key: keyof T, value: T[keyof T]) => void;
  onBlur: () => void;
  allStyles: CustomMark[];
};

export const KeyboardShortcut = <T extends CustomStyle | CustomMark>({
  index,
  value,
  onChange,
  onBlur,
  allStyles,
}: KeyboardShortcutProps<T>) => {
  const validation = useMemo(
    () =>
      validateKeyboardShortcutUniqueness(
        value,
        index,
        allStyles as CustomMark[]
      ),
    [value, index, allStyles]
  );
  const { setError } = useErrorSignal();
  useEffect(() => {
    setError("keyboardShortcut", !!validation.error);
  }, [validation.error, setError]);
  return (
    <TextField
      id={`${KEY_NAME}-${index}`}
      name={KEY_NAME}
      label='Keyboard Shortcut'
      value={value}
      onChange={(newValue) =>
        onChange(index, KEY_NAME as keyof T, newValue as T[keyof T])
      }
      error={validation.error}
      textInputProps={{ onBlur }}
    />
  );
};
