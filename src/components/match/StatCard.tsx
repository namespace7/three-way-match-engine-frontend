import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  icon,
  variant = 'default',
  className,
}) => {
  const variantBorder = {
    default: 'border-zinc-800 bg-zinc-900/70',
    success: 'border-emerald-900/60 bg-emerald-950/20',
    danger: 'border-rose-900/60 bg-rose-950/20',
    warning: 'border-amber-900/60 bg-amber-950/20',
  };

  const valueColor = {
    default: 'text-zinc-100',
    success: 'text-emerald-300',
    danger: 'text-rose-300',
    warning: 'text-amber-300',
  };

  return (
    <Card className={cn('p-4 transition-colors', variantBorder[variant], className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">{label}</span>
        {icon && <div className="text-zinc-400">{icon}</div>}
      </div>
      <div className="mt-2">
        <div className={cn('text-lg font-bold font-mono tracking-tight', valueColor[variant])}>
          {value}
        </div>
        {subValue && <div className="text-[11px] text-zinc-500 font-mono mt-0.5">{subValue}</div>}
      </div>
    </Card>
  );
};

export default StatCard;
