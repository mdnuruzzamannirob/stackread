## Plan: Stackread Frontend Modular Portal

Build a single Next.js App Router portal with role-segmented route groups for public, user, and admin/staff experiences, backed by Redux Toolkit + RTK Query, React Hook Form + Zod, and dedicated reader flows for PDF/EPUB. The plan below maps every required page to backend APIs and phases implementation to deliver stable auth, catalog, reading, subscription/payment, and admin operations in dependency order.

**Steps**

1. Phase 1 — Foundation and app shell: establish Next.js strict TypeScript architecture, global providers, design-system primitives, route-group layouts, route guards skeleton, API client/RTK base query, error/loading boundaries, and Firebase push notification setup. This blocks all subsequent phases.
2. Phase 2 — Authentication and authorization: implement user auth, staff auth + 2FA, social login callbacks, token lifecycle with refresh flow, role-aware navigation, and protected route middleware. Depends on Phase 1.
3. Phase 3 — Public discovery and catalog: build landing, pricing, catalog, search, author/category details, and book details with review listing and preview CTA. Depends on Phases 1–2 for optional authenticated interactions.
4. Phase 4 — Subscriptions and checkout: deliver onboarding plan selection, subscription state pages, coupon validation, and payment orchestration (Stripe Elements + PayPal/SSLCommerz redirect patterns). Depends on Phases 2–3.
5. Phase 5 — Reader experience: implement PDF and EPUB reader surfaces, progress sync, bookmarks, highlights, reading history, currently reading, and completed views. Depends on Phases 2–3 (book metadata) and Phase 4 (access checks).
6. Phase 6 — User dashboard and personal operations: complete dashboard, library aggregation, wishlist, borrows, reservations, notifications, and settings/preferences. Depends on Phases 2–5.
7. Phase 7 — Admin/staff operations: deliver admin dashboard, books/authors/categories CRUD, member/staff management, RBAC, payments/subscriptions oversight, promotions, reports, audit logs, and settings. Depends on Phases 2–6.
8. Phase 8 — Hardening and quality gates: finalize caching/invalidation tuning, optimistic updates, accessibility, i18n readiness, analytics hooks, test coverage, and release readiness. Depends on all previous phases.

**Complete page list**

Public pages:

1. Home — `/` — Marketing landing with featured content, value proposition, and CTA paths to catalog/pricing/login. Auth: public. APIs: `GET /books/featured`, `GET /flash-sales/active`, `GET /plans`.
2. Pricing — `/pricing` — Subscription plan comparison and CTA into onboarding/checkout. Auth: public (aware of logged-in user). APIs: `GET /plans`, `POST /coupons/validate` (optional pre-check).
3. Catalogue — `/catalogue` — Browse books with filters and pagination. Auth: public. APIs: `GET /books`, `GET /categories`, `GET /authors`.
4. Book details — `/catalogue/books/[bookId]` — Metadata, reviews, related actions (wishlist/review/borrow/reserve based on auth). Auth: public/user. APIs: `GET /books/:id`, `GET /books/:bookId/reviews`, `GET /books/:id/preview` (user), `POST /wishlist/:bookId` (user), `POST /borrows` (user), `POST /reservations` (user).
5. Authors list — `/catalogue/authors` — Author index and filters. Auth: public. APIs: `GET /authors`.
6. Author details — `/catalogue/authors/[authorId]` — Author profile with authored books. Auth: public. APIs: `GET /authors/:id`.
7. Categories list — `/catalogue/categories` — Category tree with counts. Auth: public. APIs: `GET /categories`.
8. Category details — `/catalogue/categories/[categoryId]` — Category metadata and filtered catalog. Auth: public. APIs: `GET /categories/:id`, `GET /books?category=...`.
9. Search results — `/search` — Unified search and filters. Auth: public/user. APIs: `GET /search`, `GET /search/suggestions`, `GET /search/popular-terms`, `POST /search/log-click` (user).
10. Login — `/auth/login` — User login form. Auth: public only. APIs: `POST /auth/login`.
11. Register — `/auth/register` — User sign-up form. Auth: public only. APIs: `POST /auth/register`.
12. Verify email — `/auth/verify-email` — Email verification status page. Auth: public. APIs: `POST /auth/verify-email`, `POST /auth/resend-verification`.
13. Forgot password — `/auth/forgot-password` — Request reset link. Auth: public. APIs: `POST /auth/forgot-password`.
14. Reset password — `/auth/reset-password` — Reset with token flow. Auth: public. APIs: `POST /auth/reset-password`.
15. OAuth callback — `/auth/callback` — Handles Google/Facebook redirect and token bootstrap. Auth: public transient. APIs: backend callback redirect integration via `GET /auth/google`, `GET /auth/google/callback`, `GET /auth/facebook`, `GET /auth/facebook/callback`.
16. Staff login — `/admin/login` — Staff credential login entrypoint. Auth: public only. APIs: `POST /staff/login`.
17. Staff 2FA verification/setup — `/admin/2fa` — Verify challenge or configure authenticator app. Auth: staff-in-progress/staff. APIs: `POST /staff/2fa/verify`, `POST /staff/2fa/enable`, `POST /staff/2fa/disable`.
18. Maintenance page — `/maintenance` — Global maintenance notice fallback. Auth: public. APIs: `GET /admin/settings/maintenance`.

User dashboard pages: 19. Dashboard home — `/dashboard` — Resume reading, recommendations, streak, summary cards. Auth: user. APIs: `GET /dashboard`, `GET /dashboard/recommendations`, `GET /dashboard/stats`. 20. My library — `/dashboard/library` — Aggregated user assets (borrows, reservations, wishlist, reading). Auth: user. APIs: `GET /dashboard/library`. 21. Reading history — `/dashboard/reading/history` — Paginated reading timeline. Auth: user. APIs: `GET /reading/history`. 22. Currently reading — `/dashboard/reading/currently-reading` — Resume cards. Auth: user. APIs: `GET /reading/currently-reading`. 23. Completed books — `/dashboard/reading/completed` — Completed reading list. Auth: user. APIs: `GET /reading/completed`. 24. Reader page — `/dashboard/read/[bookId]` — PDF/EPUB reader host with progress/bookmarks/highlights panels. Auth: user (plan-gated). APIs: `POST /reading/:bookId/start`, `POST /reading/:bookId/session`, `PATCH /reading/:bookId/progress`, `GET /books/:id`, `GET /books/:id/preview`, bookmarks and highlights CRUD endpoints. 25. Bookmarks manager — `/dashboard/read/[bookId]/bookmarks` — Standalone bookmark management view. Auth: user. APIs: bookmarks CRUD. 26. Highlights manager — `/dashboard/read/[bookId]/highlights` — Standalone highlight management view. Auth: user. APIs: highlights CRUD. 27. Wishlist — `/dashboard/wishlist` — Saved books and quick actions. Auth: user. APIs: `GET /wishlist`, `DELETE /wishlist/:bookId`, `POST /wishlist/:bookId`. 28. My borrows — `/dashboard/borrows` — Active/past borrows and return actions. Auth: user. APIs: `GET /borrows/my`, `POST /borrows/:id/return`. 29. My reservations — `/dashboard/reservations` — Reservation queue and cancel actions. Auth: user. APIs: `GET /reservations/my`, `DELETE /reservations/:id`. 30. Notifications center — `/dashboard/notifications` — List, mark read, bulk read, unread counter. Auth: user. APIs: `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/mark-read`, `GET /notifications/unread-count`. 31. Subscription overview — `/dashboard/subscription` — Current plan, lifecycle actions, renewal/cancel. Auth: user. APIs: `GET /subscriptions/my`, `PATCH /subscriptions/my/cancel`, `PATCH /subscriptions/my/renew`, `PATCH /subscriptions/my/upgrade`, `PATCH /subscriptions/my/downgrade`. 32. Subscription history — `/dashboard/subscription/history` — Historical plan changes and statuses. Auth: user. APIs: `GET /subscriptions/my/history`. 33. Checkout — `/dashboard/checkout` — Payment method selection and initiation. Auth: user. APIs: `GET /payments/gateways/my`, `POST /coupons/validate`, `POST /payments/initiate`. 34. Payment result — `/dashboard/checkout/result` — Success/failure verification screen post-redirect. Auth: user. APIs: `POST /payments/verify`, `GET /payments/my/:id`. 35. Payment history — `/dashboard/payments` — Transaction timeline and invoice access. Auth: user. APIs: `GET /payments/my`, `GET /payments/my/:id`. 36. Profile settings — `/dashboard/settings/profile` — Name/avatar/language/timezone updates. Auth: user. APIs: `GET /auth/me`, `PATCH /auth/me`. 37. Security settings — `/dashboard/settings/security` — Password and login history. Auth: user. APIs: `PATCH /auth/me/password`, `GET /auth/me/login-history`. 38. Notification preferences — `/dashboard/settings/notifications` — Email/in-app/push toggles. Auth: user. APIs: `PATCH /auth/me/notification-prefs`. 39. Onboarding plan selection — `/dashboard/onboarding/plans` — Post-register plan choice. Auth: user. APIs: `GET /onboarding/plans`, `POST /onboarding/select`. 40. Onboarding completion — `/dashboard/onboarding/complete` — Final handoff into dashboard/checkout. Auth: user. APIs: `POST /onboarding/complete`, `GET /onboarding/status`.

Admin/staff pages: 41. Admin overview — `/admin` — KPI cards and operational summary. Auth: staff/admin. APIs: `GET /admin/reports/admin-overview`. 42. Admin books list — `/admin/books` — Table, filters, feature/availability toggles. Auth: staff/admin with permissions. APIs: `GET /books`, `PATCH /admin/books/:id/featured`, `PATCH /admin/books/:id/available`, `DELETE /admin/books/:id`. 43. Admin create/edit book — `/admin/books/new`, `/admin/books/[bookId]/edit` — Book metadata and file uploads. Auth: staff/admin with `books.manage`. APIs: `POST /admin/books`, `PUT /admin/books/:id`, `POST /admin/books/:id/files`, `DELETE /admin/books/:id/files/:fid`. 44. Admin bulk import books — `/admin/books/import` — CSV upload workflow and result report. Auth: staff/admin. APIs: `POST /admin/books/bulk-import`. 45. Admin authors — `/admin/authors` and `/admin/authors/[authorId]` — Author CRUD. Auth: staff/admin with `authors.manage`. APIs: authors CRUD. 46. Admin categories — `/admin/categories` and `/admin/categories/[categoryId]` — Category tree CRUD. Auth: staff/admin with `categories.manage`. APIs: categories CRUD. 47. Admin members — `/admin/members` — Member index with status filters. Auth: staff/admin with `members.view`. APIs: `GET /admin/members`. 48. Admin member detail — `/admin/members/[userId]` — Profile, activity tabs, moderation actions. Auth: staff/admin. APIs: `GET /admin/members/:userId`, `PATCH /admin/members/:userId/suspend`, `PATCH /admin/members/:userId/unsuspend`, `GET /admin/members/:userId/reading-history`, `GET /admin/members/:userId/payments`. 49. Admin subscriptions — `/admin/subscriptions` and `/admin/subscriptions/[id]` — Subscription oversight and manual adjustments. Auth: staff/admin with `subscriptions.view/manage`. APIs: admin subscriptions list/detail/create/patch. 50. Admin payments — `/admin/payments` and `/admin/payments/[id]` — Payment monitoring and refunds. Auth: staff/admin with `payments.view/manage`. APIs: `GET /payments`, `GET /payments/:id`, `POST /payments/:id/refund`. 51. Admin promotions coupons — `/admin/promotions/coupons` and detail pages. Auth: staff/admin with `promotions.manage`. APIs: coupons CRUD/toggle, validation reference. 52. Admin promotions flash sales — `/admin/promotions/flash-sales` and detail pages. Auth: staff/admin with `promotions.manage`. APIs: flash-sales CRUD/toggle. 53. Admin reviews moderation — `/admin/reviews` — Moderate visibility and filter by status. Auth: staff/admin with `reviews.view/manage`. APIs: `GET /admin/reviews`, `PATCH /admin/reviews/:id/toggle`. 54. Admin reservations — `/admin/reservations` — Queue operations and manual status edits. Auth: staff/admin with `reservations.view/manage`. APIs: `GET /reservations`, `PATCH /reservations/:id`. 55. Admin borrows — `/admin/borrows` — Borrow tracking and adjustments. Auth: staff/admin with `borrows.view/manage`. APIs: `GET /borrows`, `PATCH /borrows/:id`. 56. Admin staff list — `/admin/staff` — Team management table. Auth: staff/admin with `staff.view/manage`. APIs: `GET /admin/staff`, `POST /admin/staff/invite`. 57. Admin staff detail — `/admin/staff/[staffId]` — Role, activity, status actions. Auth: staff/admin. APIs: `GET /admin/staff/:id`, `GET /admin/staff/:id/activity`, `PATCH /admin/staff/:id/role`, `PATCH /admin/staff/:id/suspend`, `PATCH /admin/staff/:id/unsuspend`, `DELETE /admin/staff/:id`, `POST /admin/staff/:id/reinvite`. 58. Admin roles and permissions — `/admin/rbac/roles`, `/admin/rbac/roles/[roleId]` — Role CRUD and permission matrix. Auth: staff/admin with `rbac.view/manage`. APIs: roles + permissions endpoints. 59. Admin audit logs — `/admin/audit` — Activity timeline and export. Auth: staff/admin with `audit.view`. APIs: `GET /admin/audit/logs`, `GET /admin/audit/logs/export`. 60. Admin reports — `/admin/reports` and `/admin/reports/[reportId]` — Report job lifecycle and downloads. Auth: staff/admin with `reports.view/manage`. APIs: reports create/list/detail/download/process. 61. Admin settings — `/admin/settings` — Global platform configuration. Auth: staff/admin with `settings.view/manage`. APIs: `GET /admin/settings`, `PUT /admin/settings`. 62. Admin notifications broadcast — `/admin/notifications` — Bulk email/push composition and dispatch. Auth: staff/admin with `notifications.manage`. APIs: `POST /notifications/bulk-send` (email/push only, no SMS).

**Component architecture**

- Shared components (cross-portal): AppShell, TopNav, SideNav, Breadcrumbs, RoleBadge, DataTable, EmptyState, ErrorState, LoadingState, ConfirmDialog, Pagination, SearchInput, FilterBar, StatCard, FormField wrappers, FileUploader, Toast system.
- Layout components:
  - PublicLayout for marketing/catalog/public auth pages.
  - DashboardLayout for user routes with user sidebar, notification badge, and quick actions.
  - AdminLayout for staff/admin routes with permission-aware menu groups and dense data views.
  - ReaderLayout for immersive reading mode with tool panes and keyboard controls.
- Feature components by module:
  - Auth: LoginForm, RegisterForm, OAuthButtons, PasswordResetForm, EmailVerifyPanel, StaffLoginForm, TwoFactorPanel.
  - Catalog: BookCard, BookGrid, BookDetailHeader, AuthorCard, CategoryTree, ReviewList, ReviewComposer.
  - Subscriptions/Payments: PlanCards, BillingCycleToggle, CouponInput, GatewaySelector, StripeCardForm, RedirectGatewayNotice, PaymentStatusPanel, InvoiceSummary.
  - Reader: PdfViewerShell, EpubViewerShell, ReaderToolbar, ProgressSyncController, BookmarkPanel, HighlightPanel, ReaderSessionHeartbeat.
  - Dashboard/User ops: ResumeCarousel, RecommendationList, LibraryTabs, BorrowCard, ReservationQueueCard, WishlistGrid, NotificationList, PreferencesForm.
  - Admin ops: CRUD tables/forms for books/authors/categories, MemberProfileTabs, StaffRoleEditor, PermissionMatrix, AuditTimeline, ReportJobTable, SettingsEditor, PromotionBuilders.

**RTK Query setup**

- API slice structure:
  - `baseApi` with shared `fetchBaseQuery` wrapper, auth headers, token refresh orchestration, and centralized error mapping.
  - Injected endpoint slices by domain: authApi, staffAuthApi, onboardingApi, plansApi, subscriptionsApi, paymentsApi, promotionsApi, booksApi, authorsApi, categoriesApi, readingApi, wishlistApi, borrowsApi, reservationsApi, reviewsApi, searchApi, dashboardApi, notificationsApi, adminMembersApi, adminStaffApi, adminRbacApi, adminReportsApi, adminAuditApi, adminSettingsApi.
- Endpoint conventions:
  - Queries for list/detail resources with normalized cache keys per route+filters.
  - Mutations for create/update/delete/toggle/verify operations with optimistic patches where safe.
  - Polling endpoints for report status, unread count, and optional reader heartbeat.
- Cache invalidation strategy:
  - Tag types: Auth, UserProfile, Plans, Subscription, Payments, Promotions, Books, Authors, Categories, Reading, Bookmarks, Highlights, Reviews, Wishlist, Borrows, Reservations, Dashboard, Notifications, Members, Staff, Roles, Reports, Audit, Settings.
  - List/detail pairing: mutations invalidate both domain list tag and specific id tags.
  - Composite invalidation: payment/subscription mutations also invalidate Dashboard and UserProfile tags.
  - Reader mutations patch local progress cache immediately and schedule background sync retries.
- Token refresh with RTK Query (critical for 1-day token expiry):
  - **User flow**: On 401 Unauthorized during user request → backend would call refresh endpoint with refresh token (if implemented; currently missing in backend, so frontend must redirect to login).
  - **Staff flow**: On 401 during staff request → backend would call staff refresh endpoint (if implemented; currently missing in backend).
  - Store access token in memory + optional persisted secure storage for token metadata.
  - `baseQueryWithReauth` middleware: On 401, attempt refresh (once implemented in backend); queue concurrent requests; replay after refresh.
  - On refresh failure (or endpoint not yet available): clear auth state, redirect to role-appropriate login, preserve intended destination.
  - **Current state**: Backend refresh endpoints not yet implemented; frontend should handle gracefully and re-prompt login.

**Redux store structure**

- `auth` slice: actorType (`user` or `staff`), access token, current actor profile, role list/permission map, onboarding status, auth hydration status.
- `ui` slice: sidebar collapse state, theme mode, reader panel visibility, global modal stack, table density, persisted filters.
- `reader` slice: activeBookId, activeFileFormat, local cursor/page/cfi, unsynced progress queue, current selection for highlights.
- `notifications` slice: optimistic unread count, local toast queue, last FCM registration timestamp.
- `checkout` slice: selected plan, billing cycle, selected gateway, coupon draft, last payment intent context.
- `catalog` slice (minimal global view state): search query draft, active facet filters reused across pages.
- RTK Query reducers + middleware from `baseApi`.

**Authentication flow**

- User login/register:
  - Register -> verify email -> login -> fetch `GET /auth/me` -> if onboarding incomplete route to onboarding pages.
  - Login resolves actor payload, role guard context, and redirects to previous destination or `/dashboard`.
  - Token stored in memory/localStorage with expiry tracking.
- Staff login + 2FA:
  - Staff credential login -> if 2FA required route to `/admin/2fa` -> verify -> load `GET /staff/me` -> build permission matrix and route to `/admin`.
  - Include invite acceptance surface if needed via tokenized public page using `POST /staff/accept-invite`.
- Social login (Google/Facebook):
  - Trigger OAuth endpoint in popup or redirect.
  - Callback page parses backend return, establishes session, then fetches profile and onboarding status.
- Protected routes by role:
  - Middleware checks auth token presence and actor type.
  - User routes require authenticated user role.
  - Admin routes require staff actor and permission checks per feature route.
  - Unauthorized access routes to role-specific forbidden page with recovery CTA.
- Token refresh (future):
  - When token expires (1-day window in practice), frontend detects 401 from API.
  - If `POST /auth/refresh` implemented: retry with refresh endpoint + retry original request.
  - For now: direct redirect to login on 401.

**Payment flow**

- Plan and checkout orchestration:
  - User selects plan/billing cycle -> optional coupon validation -> gateway selection determined by user country (from `GET /auth/me`) filtered against `GET /payments/gateways/my` backend availability.
- Stripe Elements:
  - Inline card capture page uses Stripe publishable key and confirms payment intent workflow where backend returns Stripe context via `POST /payments/initiate`.
  - Success/failure states route to payment result page and run verification call.
- SSLCommerz/Local gateways redirect:
  - For BD users, show SSLCommerz/bKash/Nagad options when backend indicates enabled in `GET /payments/gateways/my`; initiate then redirect to provider page; after return, call verify endpoint and refresh subscription state.
  - Present local gateways (bKash/Nagad) under "Bangladesh" section; global gateways (Stripe/PayPal) under "International".
- PayPal redirect:
  - Initiate payment, redirect to approval URL, then verify on callback return.
- Country-based gateway display:
  - Determine user country from `GET /auth/me` response.
- Filter candidate gateways based on backend response from `GET /payments/gateways/my`.
- Fallback strategy if country unavailable: show all enabled gateways with region hints.

**Book reading**

- PDF flow with react-pdf:
  - Load secure file source from `GET /books/:id/preview` (signed URL in response), render paginated viewer, persist current page/zoom/preferences.
  - Progress sync throttled to backend `PATCH /reading/:bookId/progress` and on visibility changes/unload.
- EPUB flow with epub.js:
  - Render chapter/cfi navigator, theme/font controls, text selection hooks for highlights.
  - Persist CFI/location and map to progress percentage for backend tracking.
- Progress tracking:
  - Start reading endpoint on reader mount, periodic session heartbeat endpoint while active, progress updates on meaningful deltas.
  - Offline queue for transient network issues with eventual sync.
- Bookmarks + highlights:
  - Create/edit/delete panels, context menu interactions in reader, optimistic local updates with rollback on server failure.

**Complete folder structure**

- `src/app/(public)/` — landing, pricing, catalogue, search, public detail pages.
- `src/app/(auth)/` — login/register/verify/forgot/reset/oauth callback.
- `src/app/(dashboard)/dashboard/...` — user dashboard pages, reading, wishlist, borrows, reservations, payments, settings, onboarding.
- `src/app/(admin)/admin/...` — staff/admin pages for operational modules.
- `src/app/maintenance` and error/not-found boundaries.
- `src/components/common/` — generic UI composition.
- `src/components/layouts/` — PublicLayout, DashboardLayout, AdminLayout, ReaderLayout.
- `src/components/features/{module}/` — module-scoped feature components.
- `src/lib/api/` — base API + endpoint injections + token refresh logic.
- `src/lib/auth/` — token handling, role helpers, guard utilities, Firebase token sync.
- `src/lib/payments/` — gateway orchestration helpers.
- `src/lib/readers/` — PDF/EPUB adapters and progress math.
- `src/lib/forms/` — RHF + Zod resolver helpers and shared schemas.
- `src/lib/utils/` — formatters, date/currency, query builders.
- `src/store/` — configureStore, slices, typed hooks.
- `src/types/` — API DTOs and domain types.
- `src/hooks/` — cross-page hooks (auth, permissions, notifications, reader sync, FCM).
- `src/constants/` — route constants, permissions map, tag types.
- `src/middleware.ts` — route protection and role redirection.
- `public/firebase-messaging-sw.js` — Firebase service worker for push notifications.

**Environment variables needed (frontend)**

- App/runtime:
  - `NEXT_PUBLIC_APP_NAME`
  - `NEXT_PUBLIC_APP_URL`
  - `NEXT_PUBLIC_API_BASE_URL` (e.g., backend `/api/v1` base)
  - `NEXT_PUBLIC_DEFAULT_LOCALE`
  - `NEXT_PUBLIC_DEFAULT_CURRENCY`
  - `NEXT_PUBLIC_API_VERSION=v1`
  - `NEXT_PUBLIC_JWT_ISSUER=lms-backend`
  - `NEXT_PUBLIC_TOKEN_EXPIRES=1d`
- Auth and OAuth:
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
  - `NEXT_PUBLIC_FACEBOOK_APP_ID`
  - `NEXT_PUBLIC_AUTH_CALLBACK_URL`
  - `NEXT_PUBLIC_STAFF_PORTAL_PATH` (if same portal still useful for deep-link generation)
- Payments:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
  - `NEXT_PUBLIC_PAYMENT_RETURN_URL`
- Reader and assets:
  - `NEXT_PUBLIC_PDF_WORKER_SRC`
  - `NEXT_PUBLIC_EPUB_ASSET_CDN` (optional)
- Push Notifications (Firebase):
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`

**Implementation phases (detailed)**

Phase 1 — Core scaffolding and architecture baseline

- Build: app router route groups, provider composition (Redux, RTK Query, theme), error/loading boundaries, permission constants, typed API models skeleton, Firebase initialization.
- Pages/components: root layouts, placeholder route groups for public/dashboard/admin, global shell components.
- API integrations: health and maintenance status probes; base query wiring with auth headers.
- Firebase setup:
  - Install `firebase` package and `firebase-admin` (for server-side SSR if needed).
  - Create `public/firebase-messaging-sw.js` — service worker for push message handling.
  - Initialize Firebase in `src/lib/auth/firebase.ts` with `NEXT_PUBLIC_FIREBASE_*` env vars.
  - On dashboard mount: request Notification permission via `Notification.requestPermission()`.
  - Request FCM token and store locally; no backend endpoint exists yet to sync to `device_tokens` collection (can be deferred).
- Dependencies: none.
- Recommended order: first.

Phase 2 — Authentication and route protection

- Build: user auth forms, staff auth + 2FA flow, OAuth callback processing, auth persistence and hydration, role-aware middleware, token refresh logic prep.
- Pages/components: login/register/forgot/reset/verify/callback/admin-login/admin-2fa + guard wrappers.
- API integrations: auth + staff-auth + onboarding status check + profile endpoints.
- Token refresh: Implement `baseQueryWithReauth` middleware (error boundary for 401); currently wraps calls since backend refresh endpoints missing. When backend implements `POST /auth/refresh` and `POST /staff/refresh`, wire refresh call here.
- Dependencies: Phase 1.
- Recommended order: second; required before any protected pages.

Phase 3 — Public experience and discovery

- Build: landing, pricing, catalogue, search, author/category pages, book detail baseline, public review list.
- Pages/components: marketing sections, filterable data tables/grids, book cards/detail panes.
- API integrations: books, authors, categories, plans, search, flash-sales, reviews (GET).
- Dependencies: Phases 1–2 (for authenticated actions from detail pages).
- Recommended order: third.

Phase 4 — Subscription and checkout

- Build: onboarding plan select, subscription overview/history, checkout, coupon UX, payment result handling.
- Pages/components: plan cards, billing toggles, gateway selector (country-filtered from `GET /payments/gateways/my`), Stripe card element form, redirect status component.
- API integrations: onboarding, subscriptions, payments, coupons, gateways.
- Dependencies: Phases 2–3.
- Recommended order: fourth.

Phase 5 — Reader and annotation system

- Build: unified reader host (PDF/EPUB), progress synchronization, sessions heartbeat, bookmark/highlight CRUD UX, reading timeline pages.
- Pages/components: reader shell/toolbar/panels, reading history/currently reading/completed pages.
- API integrations: reading endpoints, bookmark/highlight endpoints, book detail/preview endpoints.
- Dependencies: Phases 2–4.
- Recommended order: fifth.

Phase 6 — User operations and engagement

- Build: dashboard home/library aggregation, wishlist, borrows, reservations, notification center, profile/security/preferences pages.
- Pages/components: KPI cards, asset lists, reservation queue cards, notification list, email/in-app/push preference toggles (no SMS).
- API integrations: dashboard, wishlist, borrows, reservations, notifications, auth profile/security endpoints.
- Dependencies: Phases 2–5.
- Recommended order: sixth.

Phase 7 — Admin/staff operational modules

- Build: admin overview plus complete management interfaces for books, authors, categories, members, staff, RBAC, subscriptions, payments/refunds, promotions, reviews moderation, reports, audit, settings, broadcast notifications (email/push only, no SMS).
- Pages/components: dense data tables, create/edit forms, role matrix, report job monitor, audit filters/export controls.
- API integrations: all admin/staff endpoints across modules.
- Dependencies: Phases 2–6.
- Recommended order: seventh.

Phase 8 — Optimization, testing, and release readiness

- Build: final cache tuning, optimistic updates hardening, accessibility pass, SEO/public metadata, analytics events, test suites, production env validation.
- Pages/components: cross-cutting enhancements and QA utilities.
- API integrations: end-to-end regression on critical flows.
- Dependencies: all prior phases.
- Recommended order: last.

**Relevant files**

- `stackread-backend/.github/prompts/plan-lmsBackendModularMonolith.prompt.md` — backend planning style baseline and sequencing philosophy.
- `stackread-backend/src/app/routes.ts` — authoritative route mount map for API module ownership.
- `stackread-backend/src/modules/**/**router*.ts` — concrete endpoint definitions and permission guards used for page-to-API mapping.
- `stackread-backend/src/config/env.ts` and `stackread-backend/.env.example` — backend env contracts informing frontend env requirements.
- `stackread-backend/package.json` — backend stack versions and integration constraints.

**Verification**

1. Confirm every listed frontend page maps to at least one existing backend endpoint, with auth level alignment.
2. Validate role guards against backend permission model (`<module>.<action>`).
3. Verify payment gateway UX behavior against real `GET /payments/gateways/my` responses and country filtering logic.
4. Validate reader progress/bookmark/highlight loops against backend response shapes for PDF and EPUB assets.
5. Run phase-gated QA checklist: auth journey, subscription/payment journey, reader journey, admin operational journey.
6. Ensure environment variable matrix is complete for local/staging/production.
7. Confirm Firebase push notification flow is complete (service worker + permission request + token handling).

**Decisions**

- Single portal architecture with route groups is in scope; no separate codebase for staff portal.
- Admin is treated as staff with elevated permissions, consistent with backend role model.
- RTK Query is the canonical server-state layer; local Redux slices remain minimal for client-only UI/session concerns.
- Notification channels: Email, In-App, Push only (SMS removed per current backend configuration decision).
- Token refresh endpoints not yet implemented in backend; frontend implements refresh middleware structure to support when backend adds `POST /auth/refresh` and `POST /staff/refresh`.
- Country-based payment gateway filtering happens on frontend using user country from `GET /auth/me` combined with `GET /payments/gateways/my` backend response.
- Firebase FCM tokens requested on dashboard mount; sync to backend `device_tokens` deferred (backend endpoint missing).

**Scope boundaries**

- Included: planning for pages, components, state architecture, API strategy, auth/payment/reader flows, folder design, phased execution.
- Excluded: implementation code, visual design system customization beyond existing shadcn/Tailwind setup, backend contract changes.

**Known Gaps in Backend (for feature complete, backend should add)**

1. `POST /auth/refresh` — user token refresh endpoint (currently missing; 1-day expiry requires refresh flow).
2. `POST /staff/refresh` — staff token refresh endpoint (currently missing).
3. `POST /notifications/register-device` — FCM device token registration endpoint (frontend has no way to sync tokens).
4. `GET /admin/notification-logs` — notification delivery audit endpoint documented but not implemented.
5. Public config endpoint — frontend needs sanitized config (e.g., OAuth IDs, Firebase config) without hardcoding all env vars.

**Further considerations**

1. OAuth callback contract: Finalize token delivery and redirect semantics early to align callback handler implementation.
2. Payment contract: SSLCommerz appears as provider or bKash/Nagad appear as separate gateways — backend `GET /payments/gateways/my` clarifies which model at runtime.
3. Reader file delivery: Signed URLs confirmed; frontend should handle URL expiry and request refresh if needed.
4. FCM registration: When backend adds `POST /notifications/register-device`, integrate into dashboard mount or auth success flow.
5. Token refresh: Once backend implements refresh endpoints, update RTK Query baseQueryWithReauth middleware to call them on 401.
