
**Critical:** Vercel is **case-sensitive** (Linux). All imports must be lowercase and match filename case exactly.

---

## Known Technical Debt

| Debt | Impact | Fix |
|---|---|---|
| Tailwind CDN | 200 KB parse overhead, prod warning | Migrate to PostCSS build |
| No bundler | No tree-shaking, slow cold load, manual `../` depth errors | Add Vite or esbuild |
| Inline `onclick=` handlers | Forces 56 `window.*` assignments, kills testability | Move to `addEventListener` or event delegation |
| Shared mutable arrays (`participantRoster`, `kemaihProgramsList`) | Any module can mutate, no reactivity | Zustand-like store or Redux |
| No router | No deep linking, no back button | Add `history.pushState` + hash routing |
| No persistence | Refresh loses all changes | Backend + DB, or localStorage for prototype |
| `data/geo.js` orphaned | Inlined into `main.js` during debugging | Extract to proper module |
| `menu-day-tooltip.js` stubbed | 4 stubs remain unused | Delete entirely + remove `window.*` assignments |
| `data/menu-days.js` orphaned | May still exist on disk | Delete |
| Malformed Facebook SVG path | Console error on every load | Fix `<path d="...">` |
| No favicon | 404 on every load | Add `favicon.ico` or `<link rel="icon">` |
| No tests | Any refactor risks silent breakage | Add Vitest + Playwright |
| 15+ charts init on load | Slower first paint | Lazy-init charts when tab becomes visible |
| Chart resize sweep is a hack | Fragile | Use `IntersectionObserver` on canvases |

---

## Recommended Target Architecture

### Path A — Prototype / Demo (keep it simple)

If this is a **demo or pitch deck**, the current architecture is fine. Just fix the debt table above.

### Path B — Production Product (rebuild incrementally)

#### Phase 1 — Stabilization (1–2 weeks)

1. Add **Vite** — bundling, tree-shaking, path aliases (`@/charts`, `@/data`), TypeScript, HMR
2. Remove Tailwind CDN → PostCSS build (kills warning)
3. Convert `data/*.js` → `data/*.json` if truly static
4. Delete all stub code (`menu-day-tooltip.js` no-ops, orphaned references)
5. Fix FB SVG + add favicon
6. Fix remaining warnings

#### Phase 2 — Modularization (2–3 weeks)

1. Replace inline `onclick=` with `data-action` attributes + one delegated listener in `main.js`
2. Delete the 56 `window.*` assignments
3. Introduce a **tiny state store** (`js/store.js`) with subscribe/notify
4. Move mutations out of `data/*.js` — those become immutable after load
5. Add Vitest for `utils/` and a Playwright smoke test (7 clicks)

#### Phase 3 — Backend (4–6 weeks)

1. Add a thin backend: **Next.js API routes** or **Cloudflare Workers**
2. Persist to Postgres (Neon, Supabase) or D1
3. Move `data/*.js` → database tables
4. Real OAuth with proper redirect URIs
5. Replace `alert()` with toast notifications
6. Add proper authentication (session or JWT)

#### Phase 4 — Product Scale

1. Multi-tenant (Kemaih, next partner, etc.)
2. Real RLS on data
3. Audit log write path (currently read-only mock)
4. Token minting ledger integration
5. Scheduled ESG report generation

---

## Conventions & Rules of Thumb

### Path Depth Rule

| File location | To reach project root | To reach `/data/` |
|---|---|---|
| `js/state.js` | `../` | `../data/` |
| `js/modules/*.js` | `../../` | `../../data/` |
| `js/charts/*.js` | `../../` | `../../data/` |
| `js/utils/*.js` | `../../` (if importing data) | — |

**If you ever get a 404, 99% of the time it's one `../` short.**

### Dynamic Imports

Files with `await import(...)` bypass the static-import walker. `menu-rmt.js` uses this for `data/rmt-menus.js` — it's the only file with a runtime-only dependency. **Manually verify** any file using dynamic import.

### Case Sensitivity

Every file, every import, every path must be **lowercase**. Vercel runs Linux. `Roster.js` ≠ `roster.js`.

### Chart Lifecycle

Charts must be re-`resize()`'d when their containing panel becomes visible (`switchMainTab`, collapsible open). The `resizeAllCharts()` helper in `main.js` handles this. If you ever move to a router, replicate this on route change.

### Module Load Order

`main.js` `boot()` order matters:

1. **Document-level listeners** (`initCollapsibleListeners`, `initHeaderListeners`, …) — first
2. **Charts** (`initEsgCharts`, `initLapaqCharts`, `initLapaqGeoCharts(selectGeoState)`, `initPredictiveCharts`) — second
3. **UI renders** (`renderAuditLogs`, `renderProgramsGrid`, …) — third
4. **Async loads** (`initRmtMenus`, `initSocialSDKs`) — fourth
5. **`resizeAllCharts()`** — sweep hidden tabs
6. **Diagnostic** — verify all 56 handlers wired

Skipping or reordering can leave charts blank or handlers undefined.

---

## What To Fix First (if you have 1 hour)

1. **Delete 3 orphaned files** — `data/geo.js` (inlined), `data/menu-days.js` (unused), the stub `menu-day-tooltip.js` (if you don't need `getMenuDayStatus`)
2. **Fix the Facebook SVG** — line 1282 in `dashboard.html`, 1-line change, real user impact
3. **Add `favicon.ico`** — clears the last console 404
4. **Tag the current working state** — `git tag v1.0-working && git push --tags` — so if future changes break something, you can diff against a known-good baseline

---

## Quick Verification (7-Click Smoke Test)

Once deployed, verify the dashboard is functional:

| # | Action | Expected |
|---|---|---|
| 1 | Click each sidebar tab (ESG, LaPaQ, Roster, Audit) | Views switch cleanly |
| 2 | LaPaQ → click **Selangor** button | Pies + bar update, badge changes |
| 3 | Hover any map pin / SVG path | Tooltip appears with state info |
| 4 | Hover **Critical Gaps** KPI card | Table rows dim/highlight |
| 5 | Click **♂ Male** → **♀ Female** | Height chart redraws |
| 6 | Click **Menu & Dietary Analysis** | Modal opens with 20 RMT cards |
| 7 | ESG tab → click **Score: 82 / 100** | Breakdown modal opens |

Console should show:
