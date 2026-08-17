# HRMS Client

The Angular frontend for [HRMS API](https://github.com/Fazlerabbi-Fahad/hrms-api) — a human resource management dashboard for employees, payroll, salary, departments, roles and reporting.

**Backend:** [hrms-api](https://github.com/Fazlerabbi-Fahad/hrms-api) — ASP.NET Core Clean Architecture API. This app will not run without it.

<!-- SCREENSHOT: replace with a GIF of the employee list → detail → edit flow -->
<!-- ![HRMS dashboard](docs/demo.gif) -->

---

## What it does

An internal-operations dashboard, not a marketing site. The screens are data-dense on purpose: paginated tables, multi-step forms, role-gated actions, and a sidebar whose contents depend on what the signed-in user is allowed to see.

- **Auth** — login and registration, JWT stored and rehydrated on reload, automatic expiry handling
- **Dashboard** — landing view after sign-in
- **Employees** — paginated and searchable list, detail view, create/edit forms
- **Payroll** — records, forms, and a payroll report view
- **Salary** — salary records with detail and edit
- **Departments / Designations / Employment statuses** — reference data management
- **Roles** — role list and assignment
- **Reports** — reporting views
- **Theme** — light/dark switching

---

## Architecture

Feature-first, lazily loaded, standalone components. Nothing is registered in a global `NgModule`.

```
src/app/
├── core/                      Singletons — loaded once, used everywhere
│   ├── auth/                  AuthService (signal-based session state)
│   ├── guards/                authGuard — route protection
│   ├── interceptors/          authInterceptor — attaches the Bearer token
│   ├── models/                Shared API + auth + employee types
│   └── services/              ThemeService
│
├── features/                  One folder per domain area, each self-contained
│   ├── auth/                  pages/login, pages/register
│   ├── dashboard/
│   ├── employees/             pages/ · services/ · models/ · employees.routes.ts
│   ├── payroll/
│   ├── salary/
│   ├── department/
│   ├── designation/
│   ├── employment-status/
│   ├── role/
│   └── reports/
│
├── layouts/
│   ├── auth-layout/           Bare shell for login/register
│   └── main-layout/           Sidebar + topbar shell for the authenticated app
│
└── shared/                    Reusable across features
    ├── components/            Paginator, NotFound
    ├── model/
    └── services/
```

**Why this shape.** Each feature owns its own pages, its own service, its own models, and its own route file. Adding a domain area means adding a folder and one `loadChildren` line — you never touch another feature to ship one. `core/` is the only place allowed to hold app-wide singletons, and `shared/` is the only place allowed to hold cross-feature UI.

### Routing

Every feature is code-split at the route level:

```ts
{
  path: 'employees',
  loadChildren: () =>
    import('./features/employees/employees.routes')
      .then(m => m.EMPLOYEE_ROUTES)
}
```

Authenticated routes sit under `MainLayoutComponent` behind `authGuard`; login and register sit under `AuthLayoutComponent`. Router config uses `withComponentInputBinding()`, so route params arrive as component inputs instead of manual `ActivatedRoute` subscriptions.

### Auth flow

`AuthService` holds the session in an Angular **signal**:

```ts
currentUser = signal<AuthUser | null>(null);
```

- On login, the user + token are written to the signal and to `localStorage`
- On app start, the constructor rehydrates from `localStorage` and discards the session if the token has already expired
- `authInterceptor` clones every outgoing request and attaches `Authorization: Bearer <token>`
- `authGuard` blocks protected routes when there's no valid session
- `hasRole()` exposes role checks for conditional UI

Signals rather than `BehaviorSubject` — session state is synchronously readable, and templates react without an `async` pipe.

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Angular 21, standalone components |
| Language | TypeScript 5.9 |
| State | Angular signals |
| Async | RxJS 7.8 |
| Styling | Tailwind CSS 3.4 + `@tailwindcss/forms` + `@tailwindcss/typography` |
| Icons | FontAwesome |
| JWT | `jwt-decode` |
| Testing | Vitest |
| Formatting | Prettier + `prettier-plugin-tailwindcss` |

---

## Getting started

### Prerequisites

- Node.js 20+ and npm
- The [HRMS API](https://github.com/Fazlerabbi-Fahad/hrms-api) running locally

### 1. Clone and install

```bash
git clone https://github.com/Fazlerabbi-Fahad/hrms-client.git
cd hrms-client
npm install
```

### 2. Point it at your API

`src/environments/environments.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5093/api/v1'
};
```

Change the port if your API is listening elsewhere. The backend's CORS policy allows `http://localhost:4200`, so run the dev server on the default port.

### 3. Run

```bash
npm start
```

Open `http://localhost:4200`. The app redirects to `/login` until you have a session.

### Other commands

```bash
npm run build     # production build → dist/
npm run watch     # rebuild on change (development config)
npm test          # Vitest
```

---

## Production build

Set the real API URL in `src/environments/environments.prod.ts`:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://your-api-host/api/v1'
};
```

Then:

```bash
npm run build
```

Output lands in `dist/`. Any static host works — Firebase Hosting, Netlify, Vercel, nginx.

---

## Conventions

- **Standalone components everywhere.** No `NgModule` declarations.
- **Feature services own their HTTP calls.** `EmployeeService` knows about `/Employee`; components don't build URLs.
- **All responses share one envelope.** The API returns `{ isSuccess, statusCode, data, message, errors }`, typed in `core/models/api.model.ts`, so unwrapping is uniform.
- **Tailwind utilities in templates**, with Prettier's Tailwind plugin keeping class order consistent.
- **SCSS** as the component style language, configured through Angular schematics.

---

## Roadmap

- [ ] Global HTTP error interceptor with toast notifications
- [ ] Refresh-token handling on 401
- [ ] Deployed demo instance

---

## License

MIT
