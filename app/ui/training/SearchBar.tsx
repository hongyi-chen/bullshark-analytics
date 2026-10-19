import css from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  "aria-label"?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  id = "search-input",
  "aria-label": ariaLabel = "Search",
}: SearchBarProps) {
  return (
    <div className={css.searchWrapper}>
      <label htmlFor={id} className="sr-only">
        {ariaLabel}
      </label>
      <input
        id={id}
        type="search"
        className={css.searchInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    </div>
  );
}
