import { ChangeEvent, useCallback } from 'react';
import css from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search...",
  ariaLabel = "Search"
}: SearchBarProps) {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <input
      type="search"
      className={css.searchInput}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      aria-label={ariaLabel}
      role="searchbox"
    />
  );
}
