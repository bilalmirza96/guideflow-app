'use client';

import { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function TrendChart() {
  const chartRef = useRef<ChartJS<'bar'>>(null);

  useEffect(() => {
    if (chartRef.current) {
      const root = document.documentElement;
      const barColor = getComputedStyle(root).getPropertyValue('--chart-bar').trim();
      chartRef.current.data.datasets[0].backgroundColor = barColor;
      chartRef.current.update();
    }
  }, []);

  const data = {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Cases',
        data: [6, 8, 10, 9, 12, 11, 14, 10, 8, 12, 13, 14],
        backgroundColor: 'var(--chart-bar)',
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 8,
        titleFont: { size: 12, weight: 'bold' as const },
        bodyFont: { size: 11 },
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 10 },
          color: 'var(--text-3)',
        },
      },
      y: {
        beginAtZero: true,
        max: 16,
        grid: {
          color: 'var(--gf-border)',
        },
        ticks: {
          font: { size: 10 },
          color: 'var(--text-3)',
          stepSize: 4,
        },
      },
    },
  };

  return (
    <div className="bg-[var(--bg-raised)] border border-[var(--gf-border)] rounded-xl p-5 flex flex-col h-[260px]">
      <div className="mb-4">
        <h3 className="text-[14px] font-semibold text-[var(--text-1)]">
          Monthly Case Volume
        </h3>
        <p className="text-[12px] text-[var(--text-3)] mt-1">
          Last 12 months
        </p>
      </div>
      <div className="flex-1">
        <Bar ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}
