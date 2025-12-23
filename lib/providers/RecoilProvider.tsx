'use client';

import { Provider } from 'jotai';

export default function RecoilProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}
