import { getDashboardStats } from '@/services';
// hooks/useDashboard.ts
import { useMemo } from 'react';

export const useDashboard = () => {
  return useMemo(() => getDashboardStats(), []);
};
