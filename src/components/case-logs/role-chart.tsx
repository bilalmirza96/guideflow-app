'use client';

import { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function RoleChart() {
  const chartRef = useRef<ChartJS<'doughnut'>>(null);

  useEffect(() => {
    if (chartRef.current) {
      const root = document.documentElement;
      const colorSJ = getComputedStyle(root).getPropertyValue('--chart-role-sj').trim();
      const colorFA = getComputedStyle(root).getPropertyValue('--chart-role-fa').trim();
      const colorTA = getComputedStyle(root).getPropertyValue('--chart-role-ta').trim();
      const colorSC = getComputedStyle(root).getPropertyValue('--chart-role-sc').trim();

      chartRef.current.data.datasets[0].backgroundColor = [colorSJ, colorFA, colorTA, colorSC];
      chartRef.current.update();
    }
  }, []);

  const data = {
    labels: ['SJ', 'FA', 'TA', 'SC'],
    datasets: [
      {
        data: [98, 25, 4, 0],
        backgroundColor: [
          'var(--chart-role-sj)',
          'var(--chart-role-fa)',
          'var(--chart-role-ta)',
          'var(--chart-role-sc)',
        ],
        borderWidth: 0,
        cutout: '65%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="bg-[var(--bg-raised)] border border-[var(--gf-border)] rounded-xl p-5 h-[260px] flex flex-col" style={{ width: '220px' }}>
      <h3 className="text-[14px] font-semibold text-[var(--text-1)] mb-4">
        Role Breakdown
      </h3>
      <div className="flex-1 flex items-center justify-center">
        <Doughnut ref={chartRef} data={data} options={options} />
      </div>
      <div className="mt-4 space-y-2 text-[12px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--chart-role-sj)' }} />
          <span className="text-[var(--text-2)] flex-1">Surgeon Junior</span>
          <span className="text-[var(--text-3)] font-medium">98</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--chart-role-fa)' }} />
          <span className="text-[var(--text-2)] flex-1">First Assistant</span>
          <span className="text-[var(--text-3)] font-medium">25</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--chart-role-ta)' }} />
          <span className="text-[var(--text-2)] flex-1">Teaching Asst</span>
          <span className="text-[var(--text-3)] font-medium">4</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--chart-role-sc)' }} />
          <span className="text-[var(--text-2)] flex-1">Surgeon Chief</span>
          <span className="text-[var(--text-3)] font-medium">0</span>
        </div>
      </div>
    </div>
  );
}
