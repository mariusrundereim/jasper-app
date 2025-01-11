"use client";

import { useCallback, useEffect, useRef } from "react";

interface AutosaveOptions {
  value: string;
  onSave: (value: string) => void;
  delay?: number;
}

export class AutosaveManager {
  private timeoutRef: NodeJS.Timeout | undefined;
  private currentValue: string;

  constructor(value: string) {
    this.currentValue = value;
  }

  public getValue(): string {
    return this.currentValue;
  }

  public setValue(value: string): void {
    this.currentValue = value;
  }

  public clearTimeout(): void {
    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
    }
  }

  public setTimeout(callback: () => void, delay: number): void {
    this.timeoutRef = setTimeout(callback, delay);
  }
}

export function useAutosave({
  value,
  onSave,
  delay = 1000,
}: AutosaveOptions): void {
  // Initialize refs with proper typing
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const autosaveManager = useRef<AutosaveManager>(new AutosaveManager(value));

  // Update the manager's value when the input value changes
  useEffect(() => {
    autosaveManager.current.setValue(value);
  }, [value]);

  // Save callback
  const save = useCallback(() => {
    onSave(autosaveManager.current.getValue());
  }, [onSave]);

  // Autosave effect
  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(save, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, save]);
}
