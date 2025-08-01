// src/components/Card/ErrorContext.tsx
import { createContext, useContext } from "react";

export type ErrorContextType = {
  setError: (key: string, hasError: boolean) => void;
  errors: Record<string, boolean>;
};

export const ErrorContext = createContext<ErrorContextType>({
  setError: () => {},
  errors: {},
});

export const useErrorSignal = () => useContext(ErrorContext);
