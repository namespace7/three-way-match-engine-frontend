import React from 'react';
import { Card } from '@/components/ui/Card';
import { StructuredEntity } from '@/types/match';

export interface DocumentHeaderItem {
  label: string;
  value?: string | number | StructuredEntity | null;
}

export interface DocumentHeaderProps {
  title?: string;
  items: DocumentHeaderItem[];
}

const renderHeaderValue = (value: DocumentHeaderItem['value']): React.ReactNode => {
  if (value === undefined || value === null || value === '') {
    return '—';
  }

  if (typeof value === 'object') {
    const entity = value as StructuredEntity;
    const name =
      typeof entity.name === 'string'
        ? entity.name
        : typeof entity.companyName === 'string'
        ? entity.companyName
        : typeof entity.title === 'string'
        ? entity.title
        : undefined;
    const address = typeof entity.address === 'string' ? entity.address : undefined;
    const taxId =
      typeof entity.taxId === 'string'
        ? entity.taxId
        : typeof entity.vatId === 'string'
        ? entity.vatId
        : undefined;

    if (name || address || taxId) {
      return (
        <div className="space-y-0.5 font-sans">
          {name && <div className="text-xs font-semibold text-zinc-100">{name}</div>}
          {address && <div className="text-[11px] font-normal text-zinc-400 leading-tight">{address}</div>}
          {taxId && <div className="text-[10px] font-mono font-normal text-zinc-500">Tax ID: {taxId}</div>}
        </div>
      );
    }

    // Fallback if object has other properties
    const entries = Object.entries(entity).filter(
      ([, v]) => v !== undefined && v !== null && v !== ''
    );
    if (entries.length > 0) {
      return (
        <div className="space-y-0.5 font-sans">
          {entries.map(([k, v]) => (
            <div key={k} className="text-[11px] text-zinc-300">
              <span className="text-zinc-500 font-mono text-[10px] uppercase">{k}: </span>
              <span>{String(v)}</span>
            </div>
          ))}
        </div>
      );
    }

    return '—';
  }

  return String(value);
};

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({ title, items }) => {
  return (
    <Card className="border-zinc-800 bg-zinc-900/60 p-4">
      {title && <h3 className="text-xs font-mono tracking-wider text-zinc-400 uppercase mb-3">{title}</h3>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-0.5">
            <div className="text-[11px] font-medium text-zinc-400">{item.label}</div>
            <div className="text-xs font-semibold text-zinc-100 font-mono">
              {renderHeaderValue(item.value)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DocumentHeader;
