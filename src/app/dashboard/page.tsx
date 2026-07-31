'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Activity, Upload, Database, GitCompare, ArrowRight, FileText, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { getHealth } from '@/services/healthService';

export default function DashboardPage() {
  const {
    data: health,
    isLoading: isHealthLoading,
    isError: isHealthError,
    refetch: refetchHealth,
    isRefetching,
  } = useQuery({
    queryKey: ['backend-health'],
    queryFn: getHealth,
    refetchInterval: 30000,
  });

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-5">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-100">Three-Way Match Engine</h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Automated document ingestion, line-item matching, and 3-way discrepancy resolution.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <Badge variant={isHealthError ? 'error' : 'success'} className="flex items-center gap-1.5 py-1 px-2.5">
                <span className={`h-2 w-2 rounded-full ${isHealthError ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                <span>{isHealthError ? 'Backend Unreachable' : 'Backend Connected'}</span>
              </Badge>
            </div>
          </div>

          {/* Grid Layout: Health Card & Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Backend Health Card */}
            <Card className="md:col-span-1 border-zinc-800 bg-zinc-900/80">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-zinc-400" />
                    <CardTitle className="text-sm font-semibold">Backend Health</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refetchHealth()}
                    disabled={isRefetching}
                    className="h-7 w-7 p-0"
                    title="Refresh health status"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                <CardDescription className="text-xs">Real-time API service status (http://localhost:5001)</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {isHealthLoading ? (
                  <div className="flex items-center gap-2 py-4 text-xs text-zinc-400">
                    <Spinner size="sm" />
                    <span>Checking API connection...</span>
                  </div>
                ) : isHealthError ? (
                  <div className="rounded-md border border-rose-900/60 bg-rose-950/40 p-3 space-y-1">
                    <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                      <XCircle className="h-4 w-4" />
                      <span>Connection Error</span>
                    </div>
                    <p className="text-[11px] text-rose-400/80">
                      Unable to reach backend service at http://localhost:5001. Ensure Express server is running.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2.5 rounded bg-zinc-950 border border-zinc-800">
                      <span className="text-xs text-zinc-400 font-mono">Status</span>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium font-mono">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{health?.status || 'OK'}</span>
                      </div>
                    </div>
                    {health?.timestamp && (
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                        <span>Last Check:</span>
                        <span>{new Date(health.timestamp).toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Application Overview Card */}
            <Card className="md:col-span-2 border-zinc-800 bg-zinc-900/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Engine Workflow Overview</CardTitle>
                <CardDescription className="text-xs">3-Way Match Verification Lifecycle</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded border border-zinc-800 bg-zinc-950 space-y-1">
                    <div className="text-xs font-semibold text-zinc-300">1. Ingest</div>
                    <div className="text-[11px] text-zinc-500">Upload PO, GRN & Invoice PDFs</div>
                  </div>
                  <div className="p-3 rounded border border-zinc-800 bg-zinc-950 space-y-1">
                    <div className="text-xs font-semibold text-zinc-300">2. Parse & Catalog</div>
                    <div className="text-[11px] text-zinc-500">Gemini OCR & SKU validation</div>
                  </div>
                  <div className="p-3 rounded border border-zinc-800 bg-zinc-950 space-y-1">
                    <div className="text-xs font-semibold text-zinc-300">3. Reconcile</div>
                    <div className="text-[11px] text-zinc-500">Automated 3-Way Match</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Navigation Cards */}
          <div>
            <h2 className="text-xs font-mono tracking-wider text-zinc-400 uppercase mb-3">Quick Navigation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/upload" className="group">
                <Card className="h-full border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded bg-zinc-800 text-zinc-100 group-hover:bg-zinc-700">
                      <Upload className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-zinc-100">Upload Documents</h3>
                    <p className="text-xs text-zinc-400 mt-1">Ingest PO, GRN, or Invoice files into parser</p>
                  </div>
                </Card>
              </Link>

              <Link href="/skus" className="group">
                <Card className="h-full border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded bg-zinc-800 text-zinc-100 group-hover:bg-zinc-700">
                      <Database className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-zinc-100">SKU Master</h3>
                    <p className="text-xs text-zinc-400 mt-1">Manage catalog definitions and price lists</p>
                  </div>
                </Card>
              </Link>

              <Link href="/match/PO-SAMPLE" className="group">
                <Card className="h-full border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded bg-zinc-800 text-zinc-100 group-hover:bg-zinc-700">
                      <GitCompare className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-zinc-100">Match Engine</h3>
                    <p className="text-xs text-zinc-400 mt-1">Inspect line-item reconciliation results</p>
                  </div>
                </Card>
              </Link>
            </div>
          </div>

          {/* Recent Uploads Placeholder */}
          <Card className="border-zinc-800 bg-zinc-900/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-zinc-400" />
                  <CardTitle className="text-sm font-semibold">Recent Ingestions</CardTitle>
                </div>
                <Badge variant="outline">Placeholder</Badge>
              </div>
              <CardDescription className="text-xs">
                Recently processed documents will appear here once ingested.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-zinc-800 rounded-md text-center">
                <FileText className="h-8 w-8 text-zinc-600 mb-2" />
                <p className="text-xs text-zinc-400 font-medium">No Recent Documents Ingested</p>
                <p className="text-[11px] text-zinc-600 mt-0.5">Use the Upload section to ingest PO, GRN, or Invoice files.</p>
                <Link href="/upload" className="mt-4">
                  <Button variant="secondary" size="sm">
                    Go to Upload
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
