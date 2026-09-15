import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  const variantClass = {
    primary: 'ks-btn-primary',
    secondary: 'ks-btn-secondary',
    danger: 'ks-btn-danger',
    ghost: 'ks-btn-ghost',
  }[variant];

  const sizeClass = {
    sm: 'ks-btn-sm',
    md: 'ks-btn-md',
    lg: 'ks-btn-lg',
  }[size];

  return (
    <button
      className={`ks-btn ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
