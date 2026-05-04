import { useId } from 'react';
import css from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search...",
  label = "Search",
}: SearchBarProps) {
  const id = useId();

  return (
    <div className={css.searchContainer}>
      <label htmlFor={id} className={css.visuallyHidden}>
        {label}
      </label>
      <input
        id={id}
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
