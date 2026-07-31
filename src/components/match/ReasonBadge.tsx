import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReasonBadgeProps {
  reason: string;
  className?: string;
}

export const ReasonBadge: React.FC<ReasonBadgeProps> = ({ reason, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded border border-rose-900/80 bg-rose-950/60 px-2 py-1 text-xs text-rose-300 font-mono',
        className
      )}
    >
      <AlertCircle className="h-3 w-3 text-rose-400 shrink-0" />
      <span className="truncate">{reason}</span>
    </span>
  );
};

export default ReasonBadge;
