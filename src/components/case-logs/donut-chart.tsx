'use client';

import { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function DonutChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS<'doughnut'>>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const root = document.documentElement;
      const donutFill = getComputedStyle(root).getPropertyValue('--chart-donut-fill').trim();
      const donutBg = getComputedStyle(root).getPropertyValue('--chart-donut-bg').trim();

      if (chartRef.current) {
        chartRef.current.data.datasets[0].backgroundColor = [donutFill, donutBg];
        chartRef.current.update();
      }
    }
  }, []);

  const data = {
    labels: ['Logged', 'Remaining'],
    datasets: [
      {
        data: [127, 723],
        backgroundColor: ['var(--chart-donut-fill)', 'var(--chart-donut-bg)'],
        borderWidth: 0,
        cutout: '78%',
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
        enabled: false,
      },
    },
  };

  return (
    <div className="bg-[var(--bg-raised)] border border-[var(--gf-border)] rounded-xl flex flex-col items-center justify-center p-6" style={{ width: '240px', height: '260px' }}>
      <div className="relative w-full h-[160px] flex items-center justify-center">
        <Doughnut ref={chartRef} data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-serif text-[38px] font-medium text-[var(--text-1)] leading-[1]">
            127
          </div>
          <div className="text-[11px] font-light text-[var(--text-3)] mt-1">
            of 850
          </div>
        </div>
      </div>
      <div className="mt-4 text-[10px] font-semibold tracking-[0.07em] uppercase text-[var(--text-3)]">
        Total Major Cases
      </div>
    </div>
  );
}
