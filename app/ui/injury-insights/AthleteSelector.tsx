import { useState, useMemo, useRef, useEffect, useCallback, KeyboardEvent, useId } from 'react';
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
  const listboxId = useId();
  const inputId = useId();

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
    if (!isOpen && (event.key === 'ArrowDown' || event.key === 'Enter')) {
      setIsOpen(true);
      event.preventDefault();
      return;
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
        if (activeIndex >= 0 && filteredAthletes[activeIndex]) {
          handleSelectAthlete(filteredAthletes[activeIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      case 'Home':
        if (isOpen) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      case 'End':
        if (isOpen) {
          event.preventDefault();
          setActiveIndex(filteredAthletes.length - 1);
        }
        break;
    }
  }, [isOpen, activeIndex, filteredAthletes, handleSelectAthlete]);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeElement = listRef.current.children[activeIndex] as HTMLElement;
      activeElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const displayValue = selectedAthlete && !isOpen ? selectedAthlete.name : searchTerm;
  const activeDescendantId = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

  return (
    <div className={css.container} ref={containerRef}>
      <input
        ref={inputRef}
        id={inputId}
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
        aria-activedescendant={activeDescendantId}
        aria-autocomplete="list"
        autoComplete="off"
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
              id={listboxId}
              className={css.list}
              role="listbox"
              aria-label="Athletes"
            >
              {filteredAthletes.map((athlete, index) => (
                <li
                  key={athlete.id}
                  id={`${listboxId}-option-${index}`}
                  className={`${css.item} ${athlete.id === selectedAthleteId ? css.selected : ''} ${index === activeIndex ? css.active : ''}`}
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
