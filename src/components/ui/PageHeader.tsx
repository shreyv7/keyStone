import React from 'react';

interface PageHeaderProps {
  title: string;
  description: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode;
  eyebrow?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  primaryAction,
  secondaryActions,
  eyebrow,
}) => (
  <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      {eyebrow && (
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          {eyebrow}
        </div>
      )}
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h1>
      <div className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {description}
      </div>
    </div>

    {(primaryAction || secondaryActions) && (
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {secondaryActions}
        {primaryAction}
      </div>
    )}
  </header>
);
