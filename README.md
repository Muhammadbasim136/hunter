# Hunter Lite — Frontend

Lead-generation and outreach dashboard. Talks to a backend expected at
`http://localhost:5000` (REST + Socket.IO).

## Stack

React 19 + Vite, react-router-dom, axios, socket.io-client, qrcode.react,
react-hook-form, react-hot-toast, Tailwind CSS (custom theme).

## Setup

```bash
npm install
npm run dev
```

Dev server runs on **http://localhost:3000** (pinned in `vite.config.js` —
required since the backend is fixed at port 5000). Make sure the backend is
running before you log in; the app calls it directly, there's no proxy.

```bash
npm run build      # production build to dist/
npm run preview    # serve the production build locally
npm run lint        # oxlint
```

## Structure

```
src/
  lib/            axios instance (JWT interceptor) + socket.io singleton
  context/        AuthContext (session/token), AppStateContext (WhatsApp/email
                  status, queue state, leads feed, all socket wiring)
  components/
    layout/       Sidebar, StatusStrip, AppLayout, ProtectedRoute, AuthLayout
    ui/           Buttons live in index.css (.btn-primary etc), plus
                  EmptyState, SegmentedControl, Badge, Spinner, Icons
    settings/     WhatsAppCard (QR login flow), EmailCard (app password)
    search/       SearchForm, ProgressIndicator (run:progress)
    leads/        LeadsTable, LeadRow, LanguageSelector, QueueControls,
                  IncomingPauseBanner
  pages/          Login, Signup, ForgotPassword, ResetPassword, Dashboard,
                  NewSearch, Settings
```

## Notes on a couple of judgment calls

The API contract doesn't include GET endpoints to check *current* WhatsApp
connection state or *current* connected email on page load/refresh (only
POST actions + socket events). Two consequences:

- **WhatsApp / email "connected" status** is hydrated from a local hint
  (`localStorage`) after a successful connect, then kept accurate for the
  rest of the session via real socket events (`whatsapp:ready`, etc). If the
  backend gains a status-check endpoint, swap the hint in
  `AppStateContext.jsx` for a real fetch on mount.
- **Auto-send queue state** (`idle`/`running`/`paused`) starts as `idle` on
  every load and is then driven by the Start/Pause/Resume responses and the
  `whatsapp:incoming_pause` / `whatsapp:resumed` events.

**Language codes** sent to `POST /leads/:id/message` are
`roman_urdu` / `english` / `mix` (see `LanguageSelector.jsx`) — adjust if the
backend expects different values.

**Manual send channel**: when a lead's `channel` is `both`, the row shows a
small selector so you can choose WhatsApp or email per send; otherwise it
sends on the lead's single channel.
