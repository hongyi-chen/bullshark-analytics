'use client';

import { useEffect, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  injurySelectedAthleteIdState,
  injuryTestModeState,
  dataLoadingState,
  dataErrorState,
  lastUpdatedTextState,
} from '@/lib/state/atoms';
import { useAthletesTrainingData, useActivityStats } from '@/lib/hooks';
import Card from '@/app/ui/cards/Card';
import ErrorCard from '@/app/ui/cards/ErrorCard';
import Divider from '@/app/ui/Divider';
import DisclaimerCard from '@/app/ui/cards/DisclaimerCard';
import AthleteSelector from '@/app/ui/AthleteSelector';
import InjuryVolumeChart from '@/app/ui/cards/InjuryVolumeChart';
import TrainingWarningsPlaceholder from '@/app/ui/TrainingWarningsPlaceholder';
import MethodologyCard from '@/app/ui/cards/MethodologyCard';

export default function InjuryInsightsView() {
  // State
  const [selectedAthleteId, setSelectedAthleteId] = useAtom(injurySelectedAthleteIdState);
  const [testModeEnabled, setTestModeEnabled] = useAtom(injuryTestModeState);
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

  // Find selected athlete
  const selectedAthlete = useMemo(() => {
    if (!selectedAthleteId) return null;
    return athletesTrainingData.find(a => a.id === selectedAthleteId) || null;
  }, [athletesTrainingData, selectedAthleteId]);

  // Process risky weeks from API or test mode
  const riskyWeeksData = useMemo(() => {
    if (!selectedAthlete) return undefined;

    // Use test mode if enabled, otherwise use API data
    if (testModeEnabled) {
      // Generate mock risky weeks for testing
      const weeks = Object.entries(selectedAthlete.trainingData.weeklyKilometers)
        .sort((a, b) => a[0].localeCompare(b[0]));

      const riskyWeeks = new Map<string, { riskCount: number; risks: string[] }>();

      // Mark weeks with >15% increase from previous week as risky
      for (let i = 1; i < weeks.length; i++) {
        const [currentWeek, currentKm] = weeks[i];
        const [, previousKm] = weeks[i - 1];

        if (previousKm > 0) {
          const percentChange = ((currentKm - previousKm) / previousKm) * 100;
          if (percentChange > 15) {
            riskyWeeks.set(currentWeek, {
              riskCount: 1,
              risks: ['HIGH_VOLUME_SPIKE'],
            });
          }
        }
      }

      return riskyWeeks;
    }

    // Use API data
    if (!selectedAthlete.trainingData.riskyWeeks || selectedAthlete.trainingData.riskyWeeks.length === 0) {
      return undefined;
    }

    const riskyWeeks = new Map<string, { riskCount: number; risks: string[] }>();
    selectedAthlete.trainingData.riskyWeeks.forEach(rw => {
      riskyWeeks.set(rw.week, {
        riskCount: rw.riskCount,
        risks: rw.risks,
      });
    });

    return riskyWeeks;
  }, [testModeEnabled, selectedAthlete]);

  return (
    <>
      {/* Disclaimer */}
      <DisclaimerCard />

      <Divider size={16} />

      {/* Athlete Selection */}
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
            Select Athlete
          </label>
          <AthleteSelector
            athletes={athletesTrainingData}
            selectedAthleteId={selectedAthleteId}
            onSelectAthlete={setSelectedAthleteId}
          />

          {/* Test Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--muted)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={testModeEnabled}
                onChange={(e) => setTestModeEnabled(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>Enable test mode (simulate risky weeks)</span>
            </label>
            <div style={{ marginLeft: 'auto' }}>
              <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(234, 179, 8, 0.15)', color: 'rgb(234, 179, 8)', fontWeight: 600 }}>
                TEST
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Divider size={16} />

      {/* Error Handling */}
      {err.athletesTrainingData != null ? (
        <ErrorCard errorMessage={err.athletesTrainingData} />
      ) : null}

      {/* Volume Chart */}
      {selectedAthlete && (
        <>
          <div style={{ opacity: loading.athletesTrainingData ? 0.7 : 1 }}>
            <InjuryVolumeChart
              athlete={selectedAthlete}
              loading={loading.athletesTrainingData}
              riskyWeeks={riskyWeeksData}
            />
          </div>

          <Divider size={16} />

          {/* Training Warnings */}
          <TrainingWarningsPlaceholder
            athlete={selectedAthlete}
            riskyWeeks={riskyWeeksData}
          />

          <Divider size={16} />

          {/* Methodology */}
          <MethodologyCard />
        </>
      )}

      {/* Empty State */}
      {!selectedAthlete && !err.athletesTrainingData && (
        <Card fixedTall>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <p className="muted">Select an athlete to view their training volume and injury insights</p>
          </div>
        </Card>
      )}
    </>
  );
}
