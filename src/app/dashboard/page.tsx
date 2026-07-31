'use client';

import React from 'react';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Overview of Purchase Orders, Goods Received Notes, Invoices, and Reconciliation Status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 border border-dashed border-zinc-800 rounded-md text-xs font-mono text-zinc-500">
                Dashboard Module Architecture Initialized
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
