import { useId } from 'react';
import css from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  'aria-label'?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  id,
  'aria-label': ariaLabel,
}: SearchBarProps) {
  const generatedId = useId();
  const inputId = id || `search-${generatedId}`;

  return (
    <input
      id={inputId}
      type="text"
      className={css.searchInput}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel || placeholder}
    />
  );
}
