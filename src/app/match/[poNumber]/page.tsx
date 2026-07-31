'use client';

import React, { use } from 'react';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export interface MatchPageProps {
  params: Promise<{
    poNumber: string;
  }>;
}

export default function MatchPage({ params }: MatchPageProps) {
  const resolvedParams = use(params);
  const poNumber = resolvedParams.poNumber;

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Three-Way Match Verification</CardTitle>
              <CardDescription>
                Reconciliation breakdown and discrepancy analysis for PO: <span className="font-mono text-zinc-200">{poNumber}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 border border-dashed border-zinc-800 rounded-md text-xs font-mono text-zinc-500">
                3-Way Match Verification Module Architecture Initialized for {poNumber}
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
