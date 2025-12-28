'use client';

import { useEffect, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  trainingSearchState,
  trainingEventFilterState,
  trainingTeamFilterState,
  dataLoadingState,
  dataErrorState,
  lastUpdatedTextState,
} from '@/lib/state/atoms';
import { useAthletesTrainingData } from '@/lib/hooks';
import { useActivityStats } from '@/lib/hooks';
import SearchBar from '@/app/ui/SearchBar';
import TrainingChartCard from '@/app/ui/cards/TrainingChartCard';
import Divider from '@/app/ui/Divider';
import ErrorCard from '@/app/ui/cards/ErrorCard';
import Card from '@/app/ui/cards/Card';
import css from '@/app/ui/Filters.module.scss';

export default function TrainingView() {
  // State
  const [searchQuery, setSearchQuery] = useAtom(trainingSearchState);
  const [eventFilter, setEventFilter] = useAtom(trainingEventFilterState);
  const [teamFilter, setTeamFilter] = useAtom(trainingTeamFilterState);
  const loading = useAtomValue(dataLoadingState);
  const err = useAtomValue(dataErrorState);
  const [, setLastUpdatedText] = useAtom(lastUpdatedTextState);

  // Data hooks
  const athletesTrainingData = useAthletesTrainingData();
  const stats = useActivityStats();

  // Update last updated text
  useEffect(() => {
    if (!stats?.lastFetchedAt) {
      setLastUpdatedText("No data yet");
    } else {
      setLastUpdatedText(`Last updated: ${new Date(stats.lastFetchedAt).toLocaleString()}`);
    }
  }, [stats?.lastFetchedAt, setLastUpdatedText]);

  // Filtered athletes with combined search + tag filters
  const filteredAthletes = useMemo(() => {
    return athletesTrainingData.filter(athlete => {
      // Search filter
      const matchesSearch = athlete.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Event filter
      const matchesEvent = eventFilter === 'all' || athlete.event === eventFilter;

      // Team filter
      const matchesTeam = teamFilter === 'all' || athlete.team === teamFilter;

      return matchesSearch && matchesEvent && matchesTeam;
    });
  }, [athletesTrainingData, searchQuery, eventFilter, teamFilter]);

  return (
    <>
      {/* Search and Filters - Separate Row */}
      <div className={css.card}>
        <div className={css.group}>
          <span className={css.label}>Search Athletes</span>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Type athlete name..."
          />
        </div>

        <div className={css.divider} />

        <div className={css.group}>
          <span className={css.label}>Event</span>
          <div className={css.pillRow}>
            <button
              className={css.pill}
              aria-pressed={eventFilter === 'all'}
              onClick={() => setEventFilter('all')}
              type="button"
            >
              All Events
            </button>
            <button
              className={css.pill}
              aria-pressed={eventFilter === 'half'}
              onClick={() => setEventFilter('half')}
              type="button"
            >
              Half Marathon
            </button>
            <button
              className={css.pill}
              aria-pressed={eventFilter === 'full'}
              onClick={() => setEventFilter('full')}
              type="button"
            >
              Full Marathon
            </button>
          </div>
        </div>

        <div className={css.divider} />

        <div className={css.group}>
          <span className={css.label}>Team</span>
          <div className={css.pillRow}>
            <button
              className={css.pill}
              aria-pressed={teamFilter === 'all'}
              onClick={() => setTeamFilter('all')}
              type="button"
            >
              All Teams
            </button>
            <button
              className={css.pill}
              aria-pressed={teamFilter === 'bulls'}
              onClick={() => setTeamFilter('bulls')}
              type="button"
            >
              Bulls
            </button>
            <button
              className={css.pill}
              aria-pressed={teamFilter === 'sharks'}
              onClick={() => setTeamFilter('sharks')}
              type="button"
            >
              Sharks
            </button>
          </div>
        </div>
      </div>

      <Divider size={16} />

      {err.athletesTrainingData != null ? (
        <ErrorCard errorMessage={err.athletesTrainingData} />
      ) : filteredAthletes.length === 0 ? (
        <Card fixedTall>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <p className="muted">No athletes match your filters</p>
          </div>
        </Card>
      ) : null}

      <div style={{ opacity: loading.athletesTrainingData ? 0.7 : 1 }}>
        <TrainingChartCard
          athletes={filteredAthletes}
          loading={loading.athletesTrainingData}
        />
      </div>
    </>
  );
}
