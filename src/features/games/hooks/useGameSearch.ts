import { useState, useEffect, useRef } from 'react';

export function useGameSearch(
  onSearch: (value: string) => void,
  delay = 400
) {
  const [value, setValue] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(value);
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, delay, onSearch]);

  return { value, setValue };
}
