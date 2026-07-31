import React from 'react';
import { Card } from '@/components/ui/Card';

export interface DocumentHeaderItem {
  label: string;
  value?: string | number | null;
}

export interface DocumentHeaderProps {
  title?: string;
  items: DocumentHeaderItem[];
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({ title, items }) => {
  return (
    <Card className="border-zinc-800 bg-zinc-900/60 p-4">
      {title && <h3 className="text-xs font-mono tracking-wider text-zinc-400 uppercase mb-3">{title}</h3>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-0.5">
            <div className="text-[11px] font-medium text-zinc-400">{item.label}</div>
            <div className="text-xs font-semibold text-zinc-100 font-mono truncate">
              {item.value !== undefined && item.value !== null && item.value !== '' ? item.value : '—'}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DocumentHeader;
