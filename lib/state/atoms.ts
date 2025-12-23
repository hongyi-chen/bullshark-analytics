import { atom } from 'jotai';
import { TimeFilter } from '@/lib/types/dashboard';
import { ServerActivity } from '@/lib/server-api';

export const timeFilterState = atom<TimeFilter>('week');

export const activitiesState = atom<ServerActivity[]>([]);

export const loadingState = atom<boolean>(true);

export const errorState = atom<string | null>(null);
