# Three-Way Match Engine - Frontend Portal

Modern Next.js 15+ App Router, TypeScript, Tailwind CSS, Axios, and TanStack Query frontend for the Three-Way Match Engine.

---

## Authentication & Login Credentials

This portal connects to the backend API (`http://localhost:5001`). Default environment login credentials:

- **Username**: `admin`
- **Password**: `admin`

---

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified by Next.js) in your browser.

---

## Key Features

- **Authentication**: Credentials authentication against `POST /auth/login` issuing Bearer token stored in `localStorage`.
- **System Dashboard**: Real-time backend status monitoring powered by `GET /health` and TanStack Query.
- **Document Upload**: Ingestion workflow for PO, GRN, and Invoice files with MIME validation and progress tracking.
- **3-Way Match Verification**: Line-item reconciliation breakdown with mismatch row highlighting and embedded PDF viewer.
- **SKU Master Catalog**: Complete CRUD management for Stock Keeping Units.

---

## Production Build & Linting

```bash
# Type check and build production bundle
npm run build

# Run ESLint audit
npm run lint
```
