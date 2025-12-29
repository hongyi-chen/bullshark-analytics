'use client';

import { useEffect, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  injurySelectedAthleteIdState,
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
  const [selectedAthleteId, setSelectedAthleteId] = useAtom(injurySelectedAthleteIdState);
  const loading = useAtomValue(dataLoadingState);
  const err = useAtomValue(dataErrorState);
  const [, setLastUpdatedText] = useAtom(lastUpdatedTextState);

  const athletesTrainingData = useAthletesTrainingData();
  const stats = useActivityStats();

  useEffect(() => {
    if (!stats?.lastFetchedAt) {
      setLastUpdatedText("No data yet");
    } else {
      setLastUpdatedText(`Last updated: ${new Date(stats.lastFetchedAt).toLocaleString()}`);
    }
  }, [stats?.lastFetchedAt, setLastUpdatedText]);

  const selectedAthlete = useMemo(() => {
    if (!selectedAthleteId) return null;
    return athletesTrainingData.find(a => a.id === selectedAthleteId) || null;
  }, [athletesTrainingData, selectedAthleteId]);

  const riskyWeeksData = useMemo(() => {
    if (!selectedAthlete?.trainingData.riskyWeeks?.length) return undefined;

    const riskyWeeks = new Map<string, { riskCount: number; risks: string[] }>();
    selectedAthlete.trainingData.riskyWeeks.forEach(rw => {
      riskyWeeks.set(rw.week, {
        riskCount: rw.riskCount,
        risks: rw.risks,
      });
    });

    return riskyWeeks;
  }, [selectedAthlete]);

  return (
    <>
      <DisclaimerCard />

      <Divider size={16} />

      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
            Select Athlete
          </label>
          <AthleteSelector
            athletes={athletesTrainingData}
            selectedAthleteId={selectedAthleteId}
            onSelectAthlete={setSelectedAthleteId}
          />
        </div>
      </Card>

      <Divider size={16} />

      {err.athletesTrainingData != null ? (
        <ErrorCard errorMessage={err.athletesTrainingData} />
      ) : null}

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

          <TrainingWarningsPlaceholder
            athlete={selectedAthlete}
            riskyWeeks={riskyWeeksData}
          />

          <Divider size={16} />

          <MethodologyCard />
        </>
      )}

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
