import css from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: SearchBarProps) {
  return (
    <input
      type="search"
      id={id}
      className={css.searchInput}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel ?? (ariaLabelledby ? undefined : placeholder)}
      aria-labelledby={ariaLabelledby}
    />
  );
}
