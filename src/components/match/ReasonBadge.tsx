import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReasonBadgeProps {
  reason: string;
  className?: string;
}

export const ReasonBadge: React.FC<ReasonBadgeProps> = ({ reason, className }) => {
  const isPass =
    reason.includes('passed') ||
    reason.includes('accepted') ||
    reason.includes('invoiced accepted') ||
    reason.includes('No over-billing');

  const isWarning =
    reason.includes('PARTIALLY') ||
    reason.includes('Partial') ||
    reason.includes('partial') ||
    reason.includes('TOLERANCE') ||
    reason.includes('DUPLICATE');

  if (isPass) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-sans font-medium border border-emerald-800/80 bg-emerald-950/60 text-emerald-300',
          className
        )}
      >
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
        <span>{reason}</span>
      </span>
    );
  }

  if (isWarning) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-sans font-medium border border-amber-800/80 bg-amber-950/60 text-amber-300',
          className
        )}
      >
        <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
        <span>{reason}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-sans font-medium border border-rose-900/80 bg-rose-950/60 text-rose-300',
        className
      )}
    >
      <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
      <span>{reason}</span>
    </span>
  );
};

export default ReasonBadge;
