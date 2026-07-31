import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MatchStatus } from '@/types/match';

export interface StatusBadgeProps {
  status: MatchStatus;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  size = 'md',
}) => {
  const normalizedStatus = (status || 'PENDING').toUpperCase();

  const isMatched = normalizedStatus === 'MATCHED';
  const isDiscrepancy =
    normalizedStatus === 'DISCREPANCY' ||
    normalizedStatus === 'MISMATCH' ||
    normalizedStatus === 'FLAGGED';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  if (isMatched) {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-md border border-emerald-800 bg-emerald-950/80 text-emerald-300 font-mono tracking-wide',
          sizeClasses[size],
          className
        )}
      >
        <CheckCircle2 className={cn('text-emerald-400', iconSizes[size])} />
        <span>MATCHED</span>
      </span>
    );
  }

  if (isDiscrepancy) {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-md border border-rose-800 bg-rose-950/80 text-rose-300 font-mono tracking-wide',
          sizeClasses[size],
          className
        )}
      >
        <XCircle className={cn('text-rose-400', iconSizes[size])} />
        <span>{normalizedStatus}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-amber-800 bg-amber-950/80 text-amber-300 font-mono tracking-wide',
        sizeClasses[size],
        className
      )}
    >
      <Clock className={cn('text-amber-400', iconSizes[size])} />
      <span>{normalizedStatus}</span>
    </span>
  );
};

export default StatusBadge;
