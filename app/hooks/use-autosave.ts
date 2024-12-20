"use client";

import { useCallback, useEffect, useRef } from "react";

export function useAutosave(
  value: string,
  onSave: (value: string) => void,
  delay: number = 1000
) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const save = useCallback(() => {
    onSave(valueRef.current);
  }, [onSave]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(save, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, save]);
}
