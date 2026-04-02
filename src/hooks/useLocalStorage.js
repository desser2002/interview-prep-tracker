import { useState } from 'react';

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored
        ? JSON.parse(stored)
        : typeof defaultValue === 'function'
          ? defaultValue()
          : defaultValue;
    } catch {
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }
  });

  const setStored = (newValue) => {
    setValue((prev) => {
      const resolved = typeof newValue === 'function' ? newValue(prev) : newValue;
      try {
        if (resolved === null || resolved === undefined) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(resolved));
        }
      } catch {
        // ignore storage errors
      }
      return resolved;
    });
  };

  return [value, setStored];
}
