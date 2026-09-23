import React from 'react';

export interface BadgeProps {
  variant?: 'emerald' | 'blue' | 'amber' | 'rose' | 'slate' | 'purple';
  children: React.ReactNode;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'slate',
  children,
  size = 'sm',
  icon,
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/80',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  }[variant];

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${variantStyles} ${sizeStyles}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
