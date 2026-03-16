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
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = 'athlete-selector-listbox';

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

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      const item = items[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleInputChange = useCallback((value: string) => {
    setSearchTerm(value);
    setIsOpen(true);
  }, []);

  const handleSelectAthlete = useCallback((athlete: AthleteWithTrainingData) => {
    onSelectAthlete(athlete.id);
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, [onSelectAthlete]);

  const handleInputFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredAthletes.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredAthletes.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredAthletes.length) {
          handleSelectAthlete(filteredAthletes[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      case 'Home':
        if (isOpen && filteredAthletes.length > 0) {
          e.preventDefault();
          setHighlightedIndex(0);
        }
        break;
      case 'End':
        if (isOpen && filteredAthletes.length > 0) {
          e.preventDefault();
          setHighlightedIndex(filteredAthletes.length - 1);
        }
        break;
    }
  }, [isOpen, filteredAthletes, highlightedIndex, handleSelectAthlete]);

  const displayValue = selectedAthlete && !isOpen ? selectedAthlete.name : searchTerm;
  const activeDescendantId = highlightedIndex >= 0 
    ? `athlete-option-${filteredAthletes[highlightedIndex]?.id}` 
    : undefined;

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
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-activedescendant={activeDescendantId}
        aria-label="Select athlete"
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
              className={css.list} 
              ref={listRef}
              role="listbox"
              id={listId}
              aria-label="Athletes"
            >
              {filteredAthletes.map((athlete, index) => (
                <li
                  key={athlete.id}
                  id={`athlete-option-${athlete.id}`}
                  role="option"
                  aria-selected={athlete.id === selectedAthleteId}
                  className={`${css.item} ${athlete.id === selectedAthleteId ? css.selected : ''} ${index === highlightedIndex ? css.highlighted : ''}`}
                  onClick={() => handleSelectAthlete(athlete)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <div className={css.athleteName}>{athlete.name}</div>
                  <div className={css.athleteMeta}>
                    <span className={css.badge}>{athlete.team}</span>
                    <span className={css.badge}>{athlete.event === 'half' ? 'Half Marathon' : 'Full Marathon'}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
