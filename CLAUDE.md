# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Team 26 Systems Engineering Report website. It renders markdown documentation as a static website using React + Vite. The authoritative content lives in `docs/` as markdown files; the frontend reads copies from `frontend/public/docs/` at runtime and renders them.

## Key Constraints

- **Content source of truth is `docs/`**. Web content must be consistent with `docs/` but does not need to be identical. Some doc sections are still missing — pages gracefully show placeholders when markdown files are not found.
- **`individual-contribution.md` must NOT be added to the website or committed to git.** It exists locally in `docs/` and `frontend/public/docs/` but should stay untracked.
- **The site must be exportable as a static site navigable from `index.html`.** The frontend uses `HashRouter` (not `BrowserRouter`) to support this — all routes work via `index.html#/path`.

## Commands

All commands run from `frontend/`:

```bash
cd frontend
npm install        # install dependencies
npm run dev        # start Vite dev server with HMR
npm run build      # typecheck (tsc -b) then build static site to frontend/dist/
npm run preview    # preview the production build locally
npm run lint       # ESLint
```

There is no test framework configured.

## Azure Demo Deployment

The site is currently hosted at: https://crescoreportdemo.z33.web.core.windows.net/

**After every commit, rebuild and redeploy the site to Azure:**

```bash
cd frontend && npm run build && az storage blob upload-batch \
  --account-name crescoreportdemo \
  --source dist \
  --destination '$web' \
  --overwrite
```

To tear down when the demo is no longer needed:

```bash
az group delete --name cresco-report-demo-rg --yes --no-wait
```

This deletes the resource group, storage account, and all hosted content.

## Design References

The website style is based on these UCL student project sites:

- https://students.cs.ucl.ac.uk/2024/group1/ — Super Happy Space (Docusaurus, top nav)
- https://students.cs.ucl.ac.uk/2024/group4/ — React SPA
- https://students.cs.ucl.ac.uk/2024/group14/ — NaviGo (custom, top nav)
- https://students.cs.ucl.ac.uk/2024/group15 — SightLinks (single-page scroll)
- https://students.cs.ucl.ac.uk/2024/group28 — Webex Log Viewer (Bootstrap, top nav with dropdowns)
- https://students.cs.ucl.ac.uk/2023/group1 — MotionInput (Docusaurus, top nav)
- https://students.cs.ucl.ac.uk/2023/group23 — Quantum for Kids (Bootstrap)

Common patterns adopted: hero section with project name/tagline, feature card grid, team member cards with avatars, partner bar, multi-column dark footer, mobile hamburger nav.

## Architecture

### Content Pipeline

`docs/*.md` -> copied to `frontend/public/docs/*.md` -> fetched at runtime by `MarkdownRenderer` -> rendered with `react-markdown` + `remark-gfm` + `rehype-raw`

Mermaid diagrams in markdown (` ```mermaid ` code blocks) are rendered client-side via the `mermaid` library.

### Frontend Structure

- **Routing**: `HashRouter` in `main.tsx` -> `App.tsx` defines all `<Route>` entries
- **Pages**: Each page in `src/pages/` is a thin wrapper that passes a `fileUrl` (e.g., `/docs/system-design.md`) and `title` to `MarkdownRenderer`
- **Layout**: `Header.tsx` (nav bar with `NavLink`), `Footer.tsx` (static footer), both rendered by `App.tsx` around the routed content
- **`MarkdownRenderer`** (`src/components/MarkdownRenderer.tsx`): The core component — fetches a markdown file URL, renders it with react-markdown, and intercepts ` ```mermaid ` code blocks to render them as diagrams via the `Mermaid` sub-component

### Adding a New Page

1. Create the markdown file in `docs/` and copy it to `frontend/public/docs/`
2. Create a page component in `frontend/src/pages/` (one-liner using `MarkdownRenderer`)
3. Add a `<Route>` in `App.tsx`
4. Add a nav entry in `Header.tsx`'s `navItems` array

### Root `package.json`

The root `package.json` only declares shared React/router type dependencies. The actual buildable project is `frontend/package.json`.
