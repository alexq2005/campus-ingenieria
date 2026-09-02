import { useCallback, useEffect, useState } from 'react';

/**
 * Persiste un estado en localStorage.
 * Generic: `const [tema, setTema] = useLocalStorage<'light'|'dark'>('tema', 'light');`
 */
export function useLocalStorage<T>(key: string, initial: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignorar errores de cuota o modo privado
    }
  }, [key, value]);

  const setPersistent = useCallback((next: T | ((prev: T) => T)) => {
    setValue(next);
  }, []);

  return [value, setPersistent];
}
