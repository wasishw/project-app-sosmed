# Sociality — Social Media App

A social media app (timeline, posts, likes, comments, follow, saved posts, profiles, user search) built with **Next.js App Router** from the _Figma-Sosmed_ design, using the real REST API:

- API base URL: `https://be-social-media-api-production.up.railway.app`
- Swagger: `https://be-social-media-api-production.up.railway.app/api-swagger/`

## Tech stack

| Need                         | Tool                                       |
| ---------------------------- | ------------------------------------------ |
| Framework                    | Next.js 16 (App Router, Cache Components)  |
| Language                     | TypeScript (strict)                        |
| Server state / data fetching | TanStack Query v5                          |
| HTTP client                  | Axios                                      |
| Client / UI state            | Zustand                                    |
| Forms                        | React Hook Form                            |
| Schema validation            | Zod                                        |
| UI components                | shadcn/ui (Radix)                          |
| Styling                      | Tailwind CSS v4 (Figma tokens in `@theme`) |

## Getting started

```bash
cp .env.example .env    # NEXT_PUBLIC_API_BASE_URL=...
npm install
npm run dev             # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Features (user flow from Figma)

- **Auth**: register (name, username, email, number phone, password + confirm) and login, with field errors from Zod and from the API. Session token kept in a cookie; logout from the avatar menu.
- **Timeline**: signed in → `GET /api/feed` (own posts + people you follow); guests (or a new user with an empty feed) → `GET /api/posts`. Infinite scroll, "Show More" caption.
- **Post actions**: like / unlike (optimistic), list of users who liked (with Follow / Following), save / unsave, share (copy link).
- **Post detail & comments**: opens as a dialog over the current page (intercepting route) or as a full page on refresh. Add comment with emoji picker, delete own comments (or any comment on your own post), delete your own post.
- **Add post**: image upload (click or drag & drop, PNG/JPG/WEBP ≤ 5MB) with preview, Change / Delete Image, caption.
- **My profile**: stats, Gallery (`/api/me/posts`) and Saved (`/api/me/saved`) tabs, followers / following lists, Edit Profile (name, username, number phone, bio, avatar upload).
- **Friends profile**: Follow / Following, Gallery and Liked tabs.
- **Search users**: dropdown in the desktop header, full-screen page on mobile.
- Route protection on the server (`src/proxy.ts`), loading skeletons, empty and error states, success/error toasts (Figma "Alert").

## Folder structure

```
src/
├── app/                       # routes only (thin pages)
│   ├── (auth)/                # login, register (gradient background layout)
│   ├── (main)/                # navbar + bottom menu layout
│   │   ├── @modal/(.)posts/[id]   # intercepted post detail → dialog
│   │   ├── posts/[id]         # full post page
│   │   ├── add-post/ profile/ profile/edit/ users/[username]/ search/
│   │   └── page.tsx           # timeline
│   ├── layout.tsx providers.tsx session-guard.tsx not-found.tsx globals.css
├── assets/
│   ├── icons/                 # *.svg exported from the Figma file (currentColor)
│   └── images/                # *.png (auth background, default avatar)
├── components/
│   ├── ui/                    # shadcn/ui primitives styled with Figma variants
│   └── shared/                # navbar, bottom nav, icon, avatar, form fields…
├── features/                  # auth, posts, comments, profile, search, users
├── hooks/                     # useInfiniteScroll, useDebouncedValue
├── lib/
│   ├── api/                   # axios instance + one module per resource
│   ├── query/                 # query keys, query options, hooks, cache helpers
│   └── validations/           # zod schemas
├── store/                     # Zustand: auth token + UI state
├── types/                     # API response types
└── proxy.ts                   # route protection
```

## State management

- **Server state** (everything that comes from the API: feed, posts, comments, likes, profiles, followers, saved posts) lives only in **TanStack Query**: hierarchical query keys (`lib/query/keys.ts`), `queryOptions` / `infiniteQueryOptions` factories, custom hooks per feature, `invalidateQueries` after mutations, and optimistic updates with rollback for like, save and follow.
- **Client / UI state** lives in **Zustand**: the session token (`store/auth-store.ts`, persisted in a cookie so `proxy.ts` can read it) and what is open on screen (`store/ui-store.ts`: likes/followers dialog, mobile menu). No API data is copied into Zustand.
- **URL state**: active profile tab (`?tab=`), search keyword (`?q=`), and the post dialog (`/posts/[id]`).
- **Form state**: React Hook Form + Zod resolvers; API validation errors (`data: [{ path, msg }]`) are mapped back onto the matching inputs.

## API endpoints used

| Area     | Endpoints                                                                                                                                                                         |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth     | `POST /auth/register`, `POST /auth/login`                                                                                                                                         |
| Me       | `GET /me`, `PATCH /me` (multipart), `GET /me/posts`, `GET /me/saved`, `GET /me/followers`, `GET /me/following`                                                                    |
| Posts    | `GET /feed`, `GET /posts`, `POST /posts` (multipart), `GET /posts/{id}`, `DELETE /posts/{id}`                                                                                     |
| Likes    | `POST /posts/{id}/like`, `DELETE /posts/{id}/like`, `GET /posts/{id}/likes`, `GET /users/{username}/likes`                                                                        |
| Comments | `GET /posts/{id}/comments`, `POST /posts/{id}/comments`, `DELETE /comments/{id}`                                                                                                  |
| Saves    | `POST /posts/{id}/save`, `DELETE /posts/{id}/save`                                                                                                                                |
| Users    | `GET /users/search`, `GET /users/{username}`, `GET /users/{username}/posts`, `GET /users/{username}/followers`, `GET /users/{username}/following`, `POST/DELETE /follow/{username}` |
