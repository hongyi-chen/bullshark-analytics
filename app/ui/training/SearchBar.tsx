import css from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  ariaLabel?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  id,
  ariaLabel,
}: SearchBarProps) {
  return (
    <input
      type="search"
      id={id}
      className={css.searchInput}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel || placeholder.replace('...', '')}
      autoComplete="off"
      spellCheck={false}
    />
  );
}
