import css from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  id?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search...",
  ariaLabel = "Search",
  id,
}: SearchBarProps) {
  return (
    <input
      type="search"
      id={id}
      className={css.searchInput}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
    />
  );
}
