import { NextResponse } from 'next/server';

// Architectural Decision: This is a Route Handler (not a page), which means:
// - No React rendering, no RSC Flight payload, no <html> layout wrapper.
// - No hydration scripts injected by Next.js.
// - Returns a plain JSON body with a proper Content-Length header.
// - Responds in < 5ms — ideal for uptime monitors (cron-job.org, UptimeRobot, etc.).
//
// Usage: GET /health
// Response: { "status": "ok", "service": "frontend", "version": "1.0.0", "timestamp": "..." }
//
// Point your heartbeat-service and uptime monitors at this URL, not the root path.

export const runtime = 'edge'; // Run at the edge for fastest cold-start response.
export const dynamic = 'force-static'; // Cache this response — status never changes.

export function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'three-way-match-engine-frontend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
