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
  return (
    <input
      type="search"
      className={css.searchInput}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={label}
    />
  );
}
