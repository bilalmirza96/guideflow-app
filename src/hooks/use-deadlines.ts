'use client';

import { useMemo } from 'react';
import { CONFERENCES, Conference } from '@/data/conferences';

export interface DeadlineRow {
  id: string;
  name: string;
  abbreviation: string;
  deadline: Date;
  daysUntil: number;
  hasAwards: boolean;
  url: string;
  urgency: 'red' | 'orange' | 'green';
}

function getNextDeadline(month: number): Date {
  const today = new Date();
  const currentYear = today.getFullYear();

  const deadline = new Date(currentYear, month - 1, 15);

  if (deadline <= today) {
    deadline.setFullYear(currentYear + 1);
  }

  return deadline;
}

function daysUntil(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getConferencesForFellowship(
  fellowship: string,
  conferences: Conference[]
): Conference[] {
  return conferences.filter(
    (conf) => conf.fellowships.includes('all') || conf.fellowships.includes(fellowship)
  );
}

export function useDeadlines(fellowship: string): DeadlineRow[] {
  return useMemo(() => {
    const filtered = getConferencesForFellowship(fellowship, CONFERENCES);

    const rows = filtered.map((conf) => {
      const deadline = getNextDeadline(conf.typical_deadline_month);
      const days = daysUntil(deadline);

      let urgency: 'red' | 'orange' | 'green';
      if (days < 30) {
        urgency = 'red';
      } else if (days < 90) {
        urgency = 'orange';
      } else {
        urgency = 'green';
      }

      return {
        id: conf.id,
        name: conf.name,
        abbreviation: conf.abbreviation,
        deadline,
        daysUntil: days,
        hasAwards: conf.resident_awards,
        url: conf.abstracts_url,
        urgency,
      };
    });

    return rows.sort((a, b) => a.daysUntil - b.daysUntil).slice(0, 6);
  }, [fellowship]);
}
