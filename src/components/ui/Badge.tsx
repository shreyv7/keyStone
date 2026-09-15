import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'critical' | 'high' | 'medium' | 'low' | 'neutral' | 'success';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  icon,
  children,
  className = '',
  ...props
}) => {
  const variantClass = {
    critical: 'ks-badge-critical',
    high: 'ks-badge-high',
    medium: 'ks-badge-medium',
    low: 'ks-badge-low',
    neutral: 'ks-badge-neutral',
    success: 'ks-badge-success',
  }[variant];

  return (
    <span className={`ks-badge ${variantClass} ${className}`} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
