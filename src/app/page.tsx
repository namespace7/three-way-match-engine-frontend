// Architectural Decision: This page is intentionally minimal.
// Auth-based routing (/ → /dashboard or /login) is handled by
// src/middleware.ts at the edge layer before any React rendering occurs.
// This eliminates the 'use client' RSC payload that was causing uptime
// monitors (cron-job.org) to report "Output Too Large".
export default function RootPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
      <div
        className="inline-block animate-spin rounded-full border-solid border-zinc-400 border-t-transparent w-8 h-8 border-3"
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

