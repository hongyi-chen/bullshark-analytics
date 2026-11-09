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
        setActiveIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [searchTerm]);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setIsOpen(true);
  };

  const handleSelectAthlete = useCallback((athlete: AthleteWithTrainingData) => {
    onSelectAthlete(athlete.id);
    setSearchTerm('');
    setIsOpen(false);
    setActiveIndex(-1);
  }, [onSelectAthlete]);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && event.key !== 'Escape') {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        setIsOpen(true);
        event.preventDefault();
        return;
      }
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex(prev => 
          prev < filteredAthletes.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex(prev => 
          prev > 0 ? prev - 1 : filteredAthletes.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (activeIndex >= 0 && activeIndex < filteredAthletes.length) {
          handleSelectAthlete(filteredAthletes[activeIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      case 'Home':
        if (isOpen && filteredAthletes.length > 0) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      case 'End':
        if (isOpen && filteredAthletes.length > 0) {
          event.preventDefault();
          setActiveIndex(filteredAthletes.length - 1);
        }
        break;
    }
  }, [isOpen, activeIndex, filteredAthletes, handleSelectAthlete]);

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
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={activeDescendant}
        aria-autocomplete="list"
        aria-label="Search athletes"
      />

      {isOpen && (
        <ul
          id={listboxId}
          className={css.dropdown}
          role="listbox"
          aria-label="Athletes"
        >
          {filteredAthletes.length === 0 ? (
            <li className={css.emptyState} role="option" aria-disabled="true">
              No athletes found
            </li>
          ) : (
            filteredAthletes.map((athlete, index) => (
              <li
                key={athlete.id}
                id={`athlete-option-${athlete.id}`}
                className={`${css.item} ${athlete.id === selectedAthleteId ? css.selected : ''} ${index === activeIndex ? css.highlighted : ''}`}
                role="option"
                aria-selected={athlete.id === selectedAthleteId}
                onClick={() => handleSelectAthlete(athlete)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className={css.athleteName}>{athlete.name}</div>
                <div className={css.athleteMeta}>
                  <span className={css.badge}>{athlete.team}</span>
                  <span className={css.badge}>{athlete.event === 'half' ? 'Half Marathon' : 'Full Marathon'}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
