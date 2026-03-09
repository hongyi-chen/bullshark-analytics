import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
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
  }, [searchTerm]);

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

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setIsOpen(true);
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
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredAthletes.length) {
          handleSelectAthlete(filteredAthletes[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }, [isOpen, filteredAthletes, highlightedIndex, handleSelectAthlete]);

  const displayValue = selectedAthlete && !isOpen ? selectedAthlete.name : searchTerm;

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
        aria-controls={listId}
        aria-activedescendant={highlightedIndex >= 0 ? `athlete-option-${highlightedIndex}` : undefined}
        aria-label="Select athlete"
        aria-autocomplete="list"
      />

      {isOpen && (
        <div className={css.dropdown} role="listbox" id={listId}>
          {filteredAthletes.length === 0 ? (
            <div className={css.emptyState} role="status">No athletes found</div>
          ) : (
            <ul className={css.list} role="presentation">
              {filteredAthletes.map((athlete, index) => (
                <li
                  key={athlete.id}
                  id={`athlete-option-${index}`}
                  className={`${css.item} ${athlete.id === selectedAthleteId ? css.selected : ''} ${index === highlightedIndex ? css.highlighted : ''}`}
                  onClick={() => handleSelectAthlete(athlete)}
                  role="option"
                  aria-selected={athlete.id === selectedAthleteId}
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
