import { useEffect, useRef, useState } from "react";

/**
 * A hook that provides a value that automatically reverts to its default state after a specified duration.
 * 
 * @param defaultValue The default value to revert to after timeout
 * @returns A tuple containing:
 *   - The current value
 *   - A setter function that accepts a new value and optional duration (in ms)
 */
export function useTemporal<T>(defaultValue: T): [T, (value: T, duration?: number) => void] {
  const [value, setValue] = useState<T>(defaultValue);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear timeout when component unmounts or when value changes
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Function to set a temporary value that reverts after a duration
  const setTemporalValue = (newValue: T, duration: number = 2000) => {
    // Set the new value
    setValue(newValue);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set timeout to revert to default value
    timeoutRef.current = setTimeout(() => {
      setValue(defaultValue);
      timeoutRef.current = null;
    }, duration);
  };

  return [value, setTemporalValue];
}
