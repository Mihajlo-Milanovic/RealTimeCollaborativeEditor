# Project Structure (Next.js Focus)

This document explains the `frontend/src` structure for this project, with emphasis on standard Next.js layout and the folders/files that should exist in a healthy Next.js codebase.

## High-Level `src` Layout

- `app/`: Main routing layer (App Router). Every route segment lives here.
- `components/`: Reusable UI components, including TipTap/editor UI building blocks.
- `editor/`: Editor-specific composition and bindings.
- `collaboration/`: Real-time collaboration domain logic (Yjs/provider/awareness).
- `hooks/`: Shared React hooks.
- `lib/`: Utility helpers used across features.
- `styles/`: Global styles, shared variables, and animation definitions.
- `pages/`: Legacy Pages Router area (kept for compatibility/migration).
- `proxy.ts`: Next.js request middleware entry point.

## `app/` (Primary Next.js Routing Folder)

This project is App Router-first. Important items:

- `app/layout.tsx`: Required root layout for all routes.
- `app/page.tsx`: Root route (`/`) page.
- `app/providers.tsx`: Global React providers wrapped into layout/page.
- `app/api/`: Route handlers for backend-like endpoints (`/api/...`).
- Feature route segments:
  - `app/login/page.tsx`
  - `app/register/page.tsx`
  - `app/editor/page.tsx`
  - `app/verify/...`

Nested folders under a segment represent nested route paths. A segment becomes accessible only when it contains a `page.tsx` (or another routable special file).

## Folders/Files That Should Exist in Next.js (Even If Minimal)

For an App Router project, keep these present (or intentionally create placeholders):

- `src/app/` (or root-level `app/`): Core routing folder.
- `src/app/layout.tsx`: Root layout (required).
- `src/app/page.tsx`: Home page (recommended baseline route).
- `public/`: Static assets (`/logo.svg`, images, icons).
- `src/app/api/` (optional but commonly expected): API route handlers location.
- `src/styles/` or `app/globals.css`: Centralized global styling entry.
- `next.config.*`, `tsconfig.json`, and `package.json` at project root: Next.js/project config essentials.

If a folder is not yet used (`api`, feature routes, shared components), keep it with a small placeholder (for example `.gitkeep`) so structure stays explicit for team members.

## Current Project-Specific Feature Grouping

- `collaboration/`: Yjs document/provider/awareness model used by collaborative editing.
- `editor/`: Editor runtime + UI integration layer.
- `components/tiptap-*`: Custom TipTap extensions, nodes, icons, templates, and UI primitives.
- `hooks/`: Behavior hooks for editor, awareness, window/mobile state, and navigation.

This separation keeps Next.js routing (`app`) independent from editor/collaboration domain code, which improves maintainability and testability.

## About `pages/` in This Project

`src/pages/` exists alongside `app/`. Next.js supports both routers, but new work should generally go into `app/` unless there is a specific migration or compatibility reason to keep/add Page Router routes.
