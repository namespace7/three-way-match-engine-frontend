import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-zinc-800 text-zinc-200 border-zinc-700',
    success: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-800',
    error: 'bg-rose-950/80 text-rose-300 border-rose-800',
    outline: 'bg-transparent text-zinc-400 border-zinc-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-mono font-medium rounded border',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
