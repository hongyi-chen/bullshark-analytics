import { useState, useMemo, useRef, useEffect, useCallback, useId } from 'react';
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
  }, [searchTerm]);

  const handleInputChange = useCallback((value: string) => {
    setSearchTerm(value);
    setIsOpen(true);
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      setIsOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev =>
          prev < filteredAthletes.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
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
        if (isOpen) {
          e.preventDefault();
          setActiveIndex(0);
        }
        break;
      case 'End':
        if (isOpen) {
          e.preventDefault();
          setActiveIndex(filteredAthletes.length - 1);
        }
        break;
    }
  }, [isOpen, activeIndex, filteredAthletes, handleSelectAthlete]);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeOption = listRef.current.children[activeIndex] as HTMLElement;
      activeOption?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const displayValue = selectedAthlete && !isOpen ? selectedAthlete.name : searchTerm;
  const activeDescendantId = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

  return (
    <div className={css.container} ref={containerRef}>
      <label htmlFor={inputId} className={css.visuallyHidden}>
        Select athlete
      </label>
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
      />

      {isOpen && (
        <div className={css.dropdown}>
          {filteredAthletes.length === 0 ? (
            <div
              id={listboxId}
              role="listbox"
              aria-label="No athletes found"
              className={css.emptyState}
            >
              No athletes found
            </div>
          ) : (
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
                      <span className={css.badge}>{athlete.event === 'half' ? 'Half Marathon' : 'Full Marathon'}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
      <div aria-live="polite" className={css.visuallyHidden}>
        {isOpen && filteredAthletes.length > 0 && (
          `${filteredAthletes.length} athlete${filteredAthletes.length === 1 ? '' : 's'} available`
        )}
      </div>
    </div>
  );
}
