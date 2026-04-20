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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = 'athlete-listbox';

  const selectedAthlete = useMemo(() => {
    return athletes.find(a => a.id === selectedAthleteId);
  }, [athletes, selectedAthleteId]);

  const filteredAthletes = useMemo(() => {
    if (!searchTerm) return athletes;
    return athletes.filter(athlete =>
      athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [athletes, searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredAthletes]);

  const handleInputChange = useCallback((value: string) => {
    setSearchTerm(value);
    setIsOpen(true);
  }, []);

  const handleSelectAthlete = useCallback((athlete: AthleteWithTrainingData) => {
    onSelectAthlete(athlete.id);
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }, [onSelectAthlete]);

  const handleInputFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredAthletes.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredAthletes.length) {
          handleSelectAthlete(filteredAthletes[highlightedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      case 'Home':
        event.preventDefault();
        setHighlightedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setHighlightedIndex(filteredAthletes.length - 1);
        break;
    }
  }, [isOpen, filteredAthletes, highlightedIndex, handleSelectAthlete]);

  const displayValue = selectedAthlete && !isOpen ? selectedAthlete.name : searchTerm;
  const highlightedAthleteId = highlightedIndex >= 0 ? filteredAthletes[highlightedIndex]?.id : undefined;

  return (
    <div className={css.container} ref={containerRef}>
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        id="athlete-selector-input"
        className={css.input}
        placeholder="Type athlete name..."
        value={displayValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={highlightedAthleteId ? `athlete-option-${highlightedAthleteId}` : undefined}
        aria-autocomplete="list"
        aria-label="Search and select an athlete"
        autoComplete="off"
        spellCheck={false}
      />

      {isOpen && (
        <div className={css.dropdown} role="presentation">
          {filteredAthletes.length === 0 ? (
            <div className={css.emptyState} role="status" aria-live="polite">
              No athletes found
            </div>
          ) : (
            <ul
              ref={listboxRef}
              id={listboxId}
              className={css.list}
              role="listbox"
              aria-label="Available athletes"
            >
              {filteredAthletes.map((athlete, index) => {
                const isHighlighted = index === highlightedIndex;
                const isSelected = athlete.id === selectedAthleteId;
                return (
                  <li
                    key={athlete.id}
                    id={`athlete-option-${athlete.id}`}
                    role="option"
                    aria-selected={isSelected}
                    className={`${css.item} ${isSelected ? css.selected : ''} ${isHighlighted ? css.highlighted : ''}`}
                    onClick={() => handleSelectAthlete(athlete)}
                    onMouseEnter={() => setHighlightedIndex(index)}
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
