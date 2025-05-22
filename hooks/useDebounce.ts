import { useState, useEffect } from 'react';

/**
 * A custom hook that creates a debounced version of a value.
 * This is useful for delaying API calls or expensive operations until
 * the user has stopped typing or changing a value.
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 1000ms)
 * @returns The debounced value
 */
function useDebounce<T>(value: T, delay: number = 1000): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if the value changes before the delay has passed
    // or if the component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;