# Architecture

This project is a Next.js 16 App Router application. Architecture decisions should
favor the framework conventions documented in `node_modules/next/dist/docs/` over
older Next.js memory.

## Principles

1. Use `app/` as the routing surface. A route is public only when a segment contains
   `page.tsx` or `route.ts`.
2. Prefer Server Components. Add `"use client"` only for state, effects, browser
   APIs, event handlers, or client-only hooks.
3. Keep route-local implementation colocated with the route when it serves only that
   route. Use private folders such as `_components`, `_lib`, or `_hooks` for files
   that must not become routes.
4. Put shared UI or domain utilities outside a route segment only when at least two
   routes need them.
5. Use `route.ts` for App Router API endpoints. Keep request parsing, validation,
   and response shaping explicit.
6. Use `public/` only for static assets that must be served directly.
7. Avoid adding dependencies unless the feature spec explains why the platform or
   existing dependencies are not enough.

## Current shape

- `app/layout.tsx` defines the root document and shared font setup.
- `app/page.tsx` exposes `/`.
- `app/globals.css` contains global styles and Tailwind entrypoints.
- `public/` contains static SVG assets.

## What not to do

- Do not add a `pages/` router unless a spec explicitly calls for Pages Router.
- Do not introduce a data layer, service layer, ORM, or state library without a
  feature requirement and design note.
- Do not use client components as the default for pages and layouts.
- Do not rely on remote docs when the relevant local Next.js docs are available in
  `node_modules/next/dist/docs/`.
