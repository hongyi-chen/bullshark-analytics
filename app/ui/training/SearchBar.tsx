import { useId } from 'react';
import css from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search...",
  label = "Search",
  id: providedId,
}: SearchBarProps) {
  const generatedId = useId();
  const inputId = providedId || `search-${generatedId}`;

  return (
    <div className={css.searchContainer}>
      <label htmlFor={inputId} className="sr-only">
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
        role="searchbox"
      />
    </div>
  );
}
