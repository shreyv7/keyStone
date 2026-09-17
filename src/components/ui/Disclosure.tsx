import React from 'react';
import { ChevronDown } from 'lucide-react';

interface DisclosureProps {
  title: React.ReactNode;
  summary?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const Disclosure: React.FC<DisclosureProps> = ({
  title,
  summary,
  children,
  defaultOpen = false,
  className = '',
}) => (
  <details
    open={defaultOpen}
    className={`group rounded-xl border border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-900/40 ${className}`}
  >
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
      <span className="min-w-0">
        <span className="block">{title}</span>
        {summary && (
          <span className="mt-0.5 block text-xs font-normal text-slate-500 dark:text-slate-400">
            {summary}
          </span>
        )}
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
    </summary>
    <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-800">{children}</div>
  </details>
);
