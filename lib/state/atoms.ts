import { atom } from 'jotai';
import { TimeFilter, TeamStatsData } from '@/lib/types/dashboard';
import { ServerActivity } from '@/lib/server-api';
import { Athlete } from '@/app/ui/types';

export const timeFilterState = atom<TimeFilter>('week');

export const activitiesState = atom<ServerActivity[]>([]);

export const loadingState = atom<boolean>(true);

export const errorState = atom<string | null>(null);

export const teamStatsState = atom<TeamStatsData | null>(null);

export const teamLoadingState = atom<boolean>(true);

export const teamErrorState = atom<string | null>(null);

export type TeamChartMode = 'weekly' | 'running';

export const teamChartModeState = atom<TeamChartMode>('running');

export type TeamViewMode = 'comparison' | 'bulls-breakdown' | 'sharks-breakdown';

export const teamViewModeState = atom<TeamViewMode>('comparison');

export const athletesState = atom<Athlete[]>([]);
