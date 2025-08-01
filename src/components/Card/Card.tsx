import { Button, FieldGroup, Section } from "datocms-react-ui";
import { DeleteIcon } from "../icons/DeleteIcon/DeleteIcon";
import { ReactNode, useMemo, useState, useCallback } from "react";
import { ErrorContext } from "./ErrorContext";

import * as styling from "./Card.module.css";

interface CardProps {
  title: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
  children: ReactNode;
}

export const Card = ({
  title,
  isOpen,
  onToggle,
  onDelete,
  children,
}: CardProps) => {
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const setError = useCallback((key: string, hasError: boolean) => {
    setErrors((prev) => {
      if (prev[key] === hasError) return prev;
      return { ...prev, [key]: hasError };
    });
  }, []);

  const hasAnyError = Object.values(errors).some(Boolean);

  return (
    <ErrorContext.Provider value={{ setError, errors }}>
      <div
        className={styling.card}
        data-status={hasAnyError ? "invalid" : "valid"}
      >
        <Button
          type="button"
          leftIcon={<DeleteIcon />}
          buttonType="negative"
          style={{ backgroundColor: "transparent", color: "var(--alert-color)" }}
          className={styling.deleteButton}
          onClick={onDelete}
        ></Button>
        <Section
          headerClassName={styling.header}
          title={title}
          collapsible={{
            isOpen,
            onToggle,
          }}
        >
          <FieldGroup className={styling.content}>{children}</FieldGroup>
        </Section>
      </div>
    </ErrorContext.Provider>
  );
};
