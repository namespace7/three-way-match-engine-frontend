# Three-Way Match Engine - Enterprise AP Frontend Portal

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.0-blue?style=for-the-badge&logo=typescript)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-v5-ff4154?style=for-the-badge&logo=reactquery)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3.4-06b6d4?style=for-the-badge&logo=tailwindcss)

Modern Next.js 16 App Router, TypeScript, Tailwind CSS, Axios, and TanStack Query frontend portal for the Three-Way Match Engine.

---

## 1. Authentication & Credentials

This portal connects to the backend API (`http://localhost:5001`). Default environment login credentials:

- **Username**: `admin`
- **Password**: `admin`

---

## 2. Key Features

- **JWT / Bearer Token Authentication**: Credentials authentication against `POST /auth/login` issuing Bearer tokens attached automatically via Axios interceptors.
- **Authenticated PDF Preview & Streaming**: Fetches protected document binaries via Axios `api.get(url, { responseType: 'blob' })` with `Authorization: Bearer <token>`, generating secure Blob Object URLs (`blob:http://...`).
- **3-Way Match Verification View**: Tabbed document view (PO, Fulfillment/Invoices, Delivery/GRNs, Summary) with mismatch row highlighting and embedded PDF viewer.
- **TanStack Query (React Query v5)**: Automated server state caching, background re-validation, loading/error states, and cache invalidation upon document upload (`queryClient.invalidateQueries`).
- **SKU Master Catalogue**: Complete CRUD management for Stock Keeping Units.
- **Enterprise Dark Mode UI**: Responsive layout inspired by SAP Ariba with high contrast and zero text clipping.

---

## 3. Notes for Reviewer

> [!NOTE]  
> The backend operates in **Mock Mode** (`USE_GEMINI=false`) by default, returning deterministic sample fixture data derived from the assignment PDFs (`CI4PO05788`). This allows offline evaluation without paid AI API keys or credit requirements.

---

## 4. Running Frontend

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Type check & production build
npm run build

# 4. ESLint audit
npm run lint
```

---

## 5. UI Screenshots & Flow Walkthrough

### Login
![Login](doc/screenshots/login.png)

### Dashboard
![Dashboard](doc/screenshots/dashboard.png)

### Upload Documents
![Upload Modal](doc/screenshots/upload_modal.png)

### Upload Progress
![Upload Progress](doc/screenshots/upload_progress.png)

### SKU Master
![SKU Master](doc/screenshots/sku_master.png)

### Create SKU
![Create SKU](doc/screenshots/create_sku.png)

### Purchase Order
![Purchase Order](doc/screenshots/purchase_order.png)

### Goods Received Note
![Goods Received Note](doc/screenshots/goods_received_note.png)

### Supplier Invoice
![Supplier Invoice](doc/screenshots/supplier_invoice.png)

### Match Summary
![Match Summary](doc/screenshots/match_summary.png)

### Partial Match Audit
![Partial Match Audit](doc/screenshots/partial_match_audit.png)

### PDF Viewer Controls
![PDF Viewer Controls](doc/screenshots/pdf_viewer_controls.png)

### PDF Viewer Fullscreen
![PDF Viewer Fullscreen](doc/screenshots/pdf_viewer_fullscreen.png)

### Master Resolution
![Master Resolution](doc/screenshots/master_resolution.png)

### Final AP Decision Card
![Final AP Decision Card](doc/screenshots/final_ap_decision.png)

### Warehouse Audit Cards
![Warehouse Audit Cards](doc/screenshots/warehouse_audit_cards.png)

### Responsive Layout
![Responsive Layout](doc/screenshots/responsive_layout.png)
