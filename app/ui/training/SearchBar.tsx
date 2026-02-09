import { useId } from 'react';
import css from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Accessible label for the search input (required for screen readers) */
  label?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search...",
  label = "Search"
}: SearchBarProps) {
  const inputId = useId();
  
  return (
    <div className={css.searchContainer}>
      <label htmlFor={inputId} className={css.visuallyHidden}>
        {label}
      </label>
      <input
        id={inputId}
        type="search"
        className={css.searchInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
      />
    </div>
  );
}
