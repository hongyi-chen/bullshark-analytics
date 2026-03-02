import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { AthleteWithTrainingData } from '@/app/ui/types';
import css from './AthleteSelector.module.scss';

interface AthleteSelectorProps {
  athletes: AthleteWithTrainingData[];
  selectedAthleteId: string | null;
  onSelectAthlete: (athleteId: string | null) => void;
  id?: string;
}

export default function AthleteSelector({
  athletes,
  selectedAthleteId,
  onSelectAthlete,
  id = 'athlete-selector',
}: AthleteSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = `${id}-listbox`;

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

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => 
          prev < filteredAthletes.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => 
          prev > 0 ? prev - 1 : filteredAthletes.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filteredAthletes.length) {
          handleSelectAthlete(filteredAthletes[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  }, [isOpen, activeIndex, filteredAthletes, handleSelectAthlete]);

  const displayValue = selectedAthlete && !isOpen ? selectedAthlete.name : searchTerm;
  const activeDescendant = activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined;

  return (
    <div className={css.container} ref={containerRef}>
      <input
        ref={inputRef}
        id={id}
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
        aria-autocomplete="list"
        aria-activedescendant={activeDescendant}
      />

      {isOpen && (
        <div className={css.dropdown}>
          {filteredAthletes.length === 0 ? (
            <div className={css.emptyState} role="status">No athletes found</div>
          ) : (
            <ul 
              id={listboxId}
              className={css.list} 
              role="listbox"
              aria-label="Athletes"
            >
              {filteredAthletes.map((athlete, index) => (
                <li
                  key={athlete.id}
                  id={`${id}-option-${index}`}
                  className={`${css.item} ${athlete.id === selectedAthleteId ? css.selected : ''} ${index === activeIndex ? css.active : ''}`}
                  onClick={() => handleSelectAthlete(athlete)}
                  role="option"
                  aria-selected={athlete.id === selectedAthleteId}
                  tabIndex={-1}
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
