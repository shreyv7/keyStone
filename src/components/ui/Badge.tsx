import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'critical' | 'warning' | 'high' | 'info' | 'medium' | 'low' | 'neutral' | 'healthy' | 'success';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'sm',
  icon,
  children,
  className = '',
  ...props
}) => {
  const variantClass = {
    critical: 'ks-badge-critical',
    warning: 'ks-badge-warning',
    high: 'ks-badge-warning',
    info: 'ks-badge-info',
    medium: 'ks-badge-info',
    low: 'ks-badge-neutral',
    neutral: 'ks-badge-neutral',
    healthy: 'ks-badge-healthy',
    success: 'ks-badge-healthy',
  }[variant];

  const sizeClass = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]';

  return (
    <span className={`ks-badge ${sizeClass} ${variantClass} ${className}`} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
