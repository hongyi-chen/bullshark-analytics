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
  
  const comboboxId = useId();
  const listboxId = `${comboboxId}-listbox`;
  const labelId = `${comboboxId}-label`;

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

  // Scroll active option into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeElement = listRef.current.children[activeIndex] as HTMLElement;
      activeElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

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
  }, [onSelectAthlete]);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    const maxIndex = filteredAthletes.length - 1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setActiveIndex(prev => Math.min(prev + 1, maxIndex));
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(maxIndex);
        break;
      case 'Enter':
        event.preventDefault();
        if (isOpen && activeIndex >= 0 && filteredAthletes[activeIndex]) {
          handleSelectAthlete(filteredAthletes[activeIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  }, [isOpen, activeIndex, filteredAthletes, handleSelectAthlete]);

  const displayValue = selectedAthlete && !isOpen ? selectedAthlete.name : searchTerm;
  const activeDescendantId = activeIndex >= 0 ? `${comboboxId}-option-${activeIndex}` : undefined;

  return (
    <div className={css.container} ref={containerRef}>
      <span id={labelId} className="sr-only">
        Search and select an athlete
      </span>
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
        aria-labelledby={labelId}
        aria-activedescendant={activeDescendantId}
        aria-autocomplete="list"
        autoComplete="off"
      />

      {isOpen && (
        <div className={css.dropdown}>
          {filteredAthletes.length === 0 ? (
            <div className={css.emptyState} role="status">
              No athletes found
            </div>
          ) : (
            <ul
              ref={listRef}
              className={css.list}
              role="listbox"
              id={listboxId}
              aria-label="Athletes"
            >
              {filteredAthletes.map((athlete, index) => {
                const isActive = index === activeIndex;
                const isSelected = athlete.id === selectedAthleteId;
                return (
                  <li
                    key={athlete.id}
                    id={`${comboboxId}-option-${index}`}
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
    </div>
  );
}
