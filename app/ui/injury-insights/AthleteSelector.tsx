import { useState, useMemo, useRef, useEffect, useCallback, useId, KeyboardEvent } from 'react';
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
  
  const inputId = useId();
  const listboxId = useId();

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
  }, [filteredAthletes]);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeElement = listRef.current.children[activeIndex] as HTMLElement;
      activeElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const handleInputChange = useCallback((value: string) => {
    setSearchTerm(value);
    setIsOpen(true);
    setActiveIndex(-1);
  }, []);

  const handleSelectAthlete = useCallback((athlete: AthleteWithTrainingData) => {
    onSelectAthlete(athlete.id);
    setSearchTerm('');
    setIsOpen(false);
    setActiveIndex(-1);
  }, [onSelectAthlete]);

  const handleInputFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    const athleteCount = filteredAthletes.length;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setActiveIndex(prev => (prev < athleteCount - 1 ? prev + 1 : prev));
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;

      case 'Enter':
        event.preventDefault();
        if (activeIndex >= 0 && activeIndex < athleteCount) {
          handleSelectAthlete(filteredAthletes[activeIndex]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;

      case 'Home':
        if (isOpen && athleteCount > 0) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;

      case 'End':
        if (isOpen && athleteCount > 0) {
          event.preventDefault();
          setActiveIndex(athleteCount - 1);
        }
        break;
    }
  }, [filteredAthletes, isOpen, activeIndex, handleSelectAthlete]);

  const displayValue = selectedAthlete && !isOpen ? selectedAthlete.name : searchTerm;
  const activeDescendantId = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

  return (
    <div className={css.container} ref={containerRef}>
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={activeDescendantId}
        aria-autocomplete="list"
        aria-label="Search and select athlete"
        className={css.input}
        placeholder="Type athlete name..."
        value={displayValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
      />

      {isOpen && (
        <div className={css.dropdown}>
          {filteredAthletes.length === 0 ? (
            <div className={css.emptyState} role="status" aria-live="polite">
              No athletes found
            </div>
          ) : (
            <>
              <div className={css.srOnly} role="status" aria-live="polite">
                {filteredAthletes.length} {filteredAthletes.length === 1 ? 'athlete' : 'athletes'} available
              </div>
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                aria-label="Athletes"
                className={css.list}
              >
                {filteredAthletes.map((athlete, index) => {
                  const isSelected = athlete.id === selectedAthleteId;
                  const isActive = index === activeIndex;
                  
                  return (
                    <li
                      key={athlete.id}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      className={`${css.item} ${isSelected ? css.selected : ''} ${isActive ? css.active : ''}`}
                      onClick={() => handleSelectAthlete(athlete)}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <div className={css.athleteName}>{athlete.name}</div>
                      <div className={css.athleteMeta}>
                        <span className={css.badge}>{athlete.team}</span>
                        <span className={css.badge}>
                          {athlete.event === 'half' ? 'Half Marathon' : 'Full Marathon'}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
