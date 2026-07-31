'use client';

import React from 'react';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export default function SKUsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SKU Master Catalog</CardTitle>
              <CardDescription>
                Manage Stock Keeping Units, unit prices, and catalog mappings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 border border-dashed border-zinc-800 rounded-md text-xs font-mono text-zinc-500">
                SKU Master Module Architecture Initialized
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
