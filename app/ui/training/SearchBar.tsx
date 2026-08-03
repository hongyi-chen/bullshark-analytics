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
  return (
    <input
      type="text"
      className={css.searchInput}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      id={id}
      aria-label={ariaLabel}
    />
  );
}
