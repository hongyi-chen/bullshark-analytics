import { useState, useMemo, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { AthleteWithTrainingData } from '@/app/ui/types';
import css from './AthleteSelector.module.scss';

interface AthleteSelectorProps {
  athletes: AthleteWithTrainingData[];
  selectedAthleteId: string | null;
  onSelectAthlete: (athleteId: string | null) => void;
}

export default function AthleteSelector({
  athletes,
  selectedAthleteId,
  onSelectAthlete,
}: AthleteSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = 'athlete-selector-listbox';

  // Get selected athlete name
  const selectedAthlete = useMemo(() => {
    return athletes.find(a => a.id === selectedAthleteId);
  }, [athletes, selectedAthleteId]);

  // Filter athletes based on search term
  const filteredAthletes = useMemo(() => {
    if (!searchTerm) return athletes;
    return athletes.filter(athlete =>
      athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [athletes, searchTerm]);

  // Reset active index when filtered list changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [filteredAthletes.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  const handleSelectAthlete = useCallback((athlete: AthleteWithTrainingData) => {
    onSelectAthlete(athlete.id);
    setSearchTerm('');
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }, [onSelectAthlete]);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      setIsOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filteredAthletes.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filteredAthletes.length) {
          handleSelectAthlete(filteredAthletes[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      case 'Home':
        if (isOpen && filteredAthletes.length > 0) {
          e.preventDefault();
          setActiveIndex(0);
        }
        break;
      case 'End':
        if (isOpen && filteredAthletes.length > 0) {
          e.preventDefault();
          setActiveIndex(filteredAthletes.length - 1);
        }
        break;
    }
  }, [isOpen, activeIndex, filteredAthletes, handleSelectAthlete]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeElement = listRef.current.children[activeIndex] as HTMLElement;
      activeElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const displayValue = selectedAthlete && !isOpen ? selectedAthlete.name : searchTerm;
  const activeDescendant = activeIndex >= 0 ? `athlete-option-${filteredAthletes[activeIndex]?.id}` : undefined;

  return (
    <div className={css.container} ref={containerRef}>
      <input
        ref={inputRef}
        type="text"
        className={css.input}
        placeholder="Type athlete name..."
        value={displayValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-label="Select athlete"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-activedescendant={activeDescendant}
        aria-autocomplete="list"
      />

      {isOpen && (
        <div className={css.dropdown}>
          {filteredAthletes.length === 0 ? (
            <div className={css.emptyState} role="status" aria-live="polite">
              No athletes found
            </div>
          ) : (
            <ul
              ref={listRef}
              id={listId}
              className={css.list}
              role="listbox"
              aria-label="Athletes"
            >
              {filteredAthletes.map((athlete, index) => {
                const isActive = index === activeIndex;
                const isSelected = athlete.id === selectedAthleteId;
                return (
                  <li
                    key={athlete.id}
                    id={`athlete-option-${athlete.id}`}
                    className={`${css.item} ${isSelected ? css.selected : ''} ${isActive ? css.active : ''}`}
                    onClick={() => handleSelectAthlete(athlete)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className={css.athleteName}>{athlete.name}</div>
                    <div className={css.athleteMeta}>
                      <span className={css.badge}>{athlete.team}</span>
                      <span className={css.badge}>{athlete.event === 'half' ? 'Half Marathon' : 'Full Marathon'}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
