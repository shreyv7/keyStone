import React from 'react';

export interface MetricStripItem {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  tone?: 'critical' | 'warning' | 'info' | 'healthy' | 'neutral';
}

interface MetricStripProps {
  items: MetricStripItem[];
}

const valueTone = {
  critical: 'text-red-600 dark:text-red-400',
  warning: 'text-amber-700 dark:text-amber-300',
  info: 'text-blue-600 dark:text-blue-300',
  healthy: 'text-emerald-600 dark:text-emerald-300',
  neutral: 'text-slate-900 dark:text-slate-100',
};

export const MetricStrip: React.FC<MetricStripProps> = ({ items }) => (
  <div className="grid grid-cols-1 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-slate-50/70 px-4 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/40 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
    {items.map((item) => (
      <div key={item.label} className="flex min-w-0 items-baseline justify-between gap-3 py-3 sm:block sm:px-4 sm:first:pl-0 sm:last:pr-0">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</div>
        <div className={`mt-1 text-xl font-bold tracking-tight ${valueTone[item.tone || 'neutral']}`}>
          {item.value}
        </div>
        {item.detail && (
          <div className="mt-0.5 hidden text-[11px] text-slate-500 sm:block">{item.detail}</div>
        )}
      </div>
    ))}
  </div>
);
