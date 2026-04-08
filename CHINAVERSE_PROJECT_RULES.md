# 🏯 CHINAVERSE — Full Project Rules & Memory File
> AI Coding Assistant Context File — Read this before generating any code.
> Last Updated: April 2026

---

## 1. PROJECT OVERVIEW

**Project Name:** ChinaVerse (中华宇宙)
**Purpose:** A bilingual (Chinese + English) web and mobile platform that teaches and promotes Chinese culture through tourism guides, blog posts, interactive lessons, and AI-assisted exploration.
**Competition:** 2026 Sichuan Provincial Undergraduate Computer Design Contest (19th Huadi Cup) — Category: Software Application & Development
**Target Audience:** International tourists visiting China, students learning about Chinese culture, and Chinese users wanting to share their cultural knowledge.

---

## 2. CRITICAL CHINA COMPATIBILITY RULES 🇨🇳

> ⚠️ THE APP MUST WORK PERFECTLY INSIDE MAINLAND CHINA WITHOUT A VPN.

### STRICTLY FORBIDDEN (Blocked in China):
- ❌ Google Fonts (fonts.googleapis.com)
- ❌ Google Maps / Google Maps API
- ❌ Google Analytics / Google Tag Manager
- ❌ Firebase (owned by Google)
- ❌ YouTube embeds or YouTube API
- ❌ Twitter / X widgets or embeds
- ❌ Facebook / Meta SDK
- ❌ Instagram embeds
- ❌ Any CDN hosted on Google infrastructure
- ❌ reCAPTCHA (Google)
- ❌ Disqus comments
- ❌ Gravatar avatars

### APPROVED CHINA-SAFE ALTERNATIVES:
| Blocked Service | Use Instead |
|---|---|
| Google Fonts | Self-host fonts via Fontsource npm package OR use system fonts |
| Google Maps | **Amap (高德地图) Loca API** — https://loca.amap.com |
| Google Analytics | **Umami** (self-hosted, privacy-first) or **Plausible** |
| YouTube | **Bilibili embed API** for video content |
| Google reCAPTCHA | **hCaptcha** (accessible in China) |
| Google OAuth | Supabase email/password auth + WeChat OAuth (optional) |
| Google CDN | Use **jsDelivr** (https://www.jsdelivr.com) or **unpkg** |
| Firebase Storage | **Supabase Storage** |

### Font Strategy:
```css
/* Use self-hosted or system font stacks only */
font-family: 'Noto Serif SC', 'SimSun', 'STSong', serif; /* Chinese serif */
font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif; /* Chinese sans */
/* Install via: npm install @fontsource/noto-sans-sc @fontsource/noto-serif-sc */
```

---

## 3. TECHNOLOGY STACK

### Frontend (Web)
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3
- **UI Components:** shadcn/ui (self-contained, no external CDN needed)
- **Icons:** Lucide React (bundled, no CDN)
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod validation
- **Rich Text Editor:** TipTap (for blog post writing — no Google deps)
- **Image Upload Preview:** react-dropzone

### Mobile App
- **Framework:** React Native with **Expo** (managed workflow)
- **Navigation:** Expo Router (file-based routing)
- **Shared logic:** Extract business logic into a shared `/packages/core` folder (monorepo)
- **Platform targets:** iOS + Android
- **Push Notifications:** Expo Notifications (China-safe: uses APNs for iOS, direct for Android)
- **Maps on mobile:** react-native-amap3d (Amap SDK for React Native)

### Backend & Database
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (email/password — NO Google OAuth)
- **File Storage:** Supabase Storage (for profile pictures, blog images)
- **Realtime:** Supabase Realtime (for live comment updates)
- **Edge Functions:** Supabase Edge Functions (Deno) for custom server logic

### Hosting
- **Web:** Vercel (connected to GitHub repo)
- **Environment Variables:** Stored in Vercel Dashboard (never commit .env to git)
- **CDN:** Vercel Edge Network (generally accessible in China)

### Repository Structure
```
chinaverse/
├── apps/
│   ├── web/                  # Next.js web app
│   └── mobile/               # Expo React Native app
├── packages/
│   └── core/                 # Shared types, utils, Supabase client
├── supabase/
│   ├── migrations/           # SQL migration files
│   └── seed.sql              # Initial seed data
├── .env.example
├── CHINAVERSE_PROJECT_RULES.md
└── README.md
```

---

## 4. SUPABASE DATABASE SCHEMA

### Users & Auth
> Supabase Auth handles authentication. We extend the default `auth.users` table with a custom `profiles` table.

```sql
-- profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  display_name text,
  avatar_url text,                    -- stored in Supabase Storage
  bio text,
  role text default 'reader'          -- 'reader' | 'blogger' | 'admin'
    check (role in ('reader', 'blogger', 'admin')),
  language_preference text default 'en' check (language_preference in ('en', 'zh')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- progress table (stores user learning/reading progress)
create table public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  content_type text not null           -- 'blog' | 'lesson' | 'landmark' | 'quiz'
    check (content_type in ('blog', 'lesson', 'landmark', 'quiz')),
  content_id uuid not null,
  progress_percent integer default 0 check (progress_percent between 0 and 100),
  completed boolean default false,
  score integer,                        -- for quizzes (0–100)
  last_accessed_at timestamptz default now(),
  unique(user_id, content_type, content_id)
);

-- badges / achievements
create table public.badges (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  icon_url text,
  criteria jsonb                        -- e.g. {"type": "blogs_read", "count": 10}
);

create table public.user_badges (
  user_id uuid references public.profiles(id) on delete cascade,
  badge_id uuid references public.badges(id) on delete cascade,
  earned_at timestamptz default now(),
  primary key (user_id, badge_id)
);
```

### Blog System
```sql
-- categories for blog posts
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name_en text not null,
  name_zh text not null,
  slug text unique not null,
  description_en text,
  description_zh text,
  cover_image_url text,
  sort_order integer default 0
);

-- Insert default categories
insert into public.categories (name_en, name_zh, slug) values
  ('History & Landmarks', '历史与地标', 'history-landmarks'),
  ('Language & Calligraphy', '语言与书法', 'language-calligraphy'),
  ('Food & Traditions', '美食与传统', 'food-traditions'),
  ('Art & Music', '艺术与音乐', 'art-music'),
  ('Travel Guide', '旅行指南', 'travel-guide'),
  ('Festivals', '节日庆典', 'festivals');

-- blog posts
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete set null,
  category_id uuid references public.categories(id),
  title_en text not null,
  title_zh text,
  slug text unique not null,
  content_en text not null,             -- TipTap JSON or HTML
  content_zh text,
  cover_image_url text,
  excerpt_en text,
  excerpt_zh text,
  status text default 'draft'
    check (status in ('draft', 'published', 'archived')),
  is_featured boolean default false,
  view_count integer default 0,
  read_time_minutes integer,
  tags text[],
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- comments
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  parent_id uuid references public.comments(id) on delete cascade, -- for nested replies
  content text not null,
  is_approved boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- likes (for posts)
create table public.likes (
  user_id uuid references public.profiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);

-- bookmarks (save posts)
create table public.bookmarks (
  user_id uuid references public.profiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);
```

### Cultural Content
```sql
-- landmarks / tourist attractions
create table public.landmarks (
  id uuid default gen_random_uuid() primary key,
  name_en text not null,
  name_zh text not null,
  description_en text,
  description_zh text,
  province text,
  city text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  cover_image_url text,
  images text[],
  category text,                        -- 'temple' | 'palace' | 'nature' | 'museum' | 'street'
  amap_place_id text,                   -- Amap POI ID
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- mini lessons
create table public.lessons (
  id uuid default gen_random_uuid() primary key,
  title_en text not null,
  title_zh text,
  category_id uuid references public.categories(id),
  content jsonb not null,              -- structured lesson JSON (sections, quizzes, media)
  difficulty text default 'beginner'
    check (difficulty in ('beginner', 'intermediate', 'advanced')),
  duration_minutes integer,
  cover_image_url text,
  is_published boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);
```

---

## 5. USER ROLES & PERMISSIONS

### Role Definitions

| Role | Can Do |
|---|---|
| **reader** | Read posts, write comments, like, bookmark, track progress, update own profile |
| **blogger** | Everything reader can do + create/edit/delete OWN blog posts, upload images |
| **admin** | Everything + manage all users, approve/reject posts, manage categories, assign blogger role, delete any content |

### Supabase Row Level Security (RLS) Rules

```sql
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.bookmarks enable row level security;

-- PROFILES: Users can read all profiles, only update their own
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- POSTS: Published posts visible to all; bloggers manage own posts; admins manage all
create policy "Published posts are viewable by everyone"
  on public.posts for select using (status = 'published');

create policy "Bloggers can view own drafts"
  on public.posts for select using (auth.uid() = author_id);

create policy "Bloggers can create posts"
  on public.posts for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('blogger', 'admin')
    )
  );

create policy "Bloggers can update own posts"
  on public.posts for update using (
    auth.uid() = author_id or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- COMMENTS: Approved comments visible to all; authenticated users can comment
create policy "Approved comments viewable by everyone"
  on public.comments for select using (is_approved = true);

create policy "Authenticated users can comment"
  on public.comments for insert with check (auth.uid() is not null);

create policy "Users can update/delete own comments"
  on public.comments for update using (auth.uid() = author_id);
```

---

## 6. AUTHENTICATION FLOWS

### Sign Up (Reader)
1. User fills form: email, password, username, display name
2. Call `supabase.auth.signUp({ email, password })`
3. Supabase sends verification email
4. On email confirm → trigger auto-creates `profiles` row with `role = 'reader'`
5. Redirect to `/onboarding` → pick language preference, upload avatar

### Sign Up (Blogger)
- Bloggers are NOT self-registered
- Admin promotes a reader to blogger via Admin Dashboard:
  ```sql
  update public.profiles set role = 'blogger' where id = '<user_id>';
  ```

### Sign In
1. `supabase.auth.signInWithPassword({ email, password })`
2. Store session (Supabase handles this automatically via cookies in Next.js)
3. Check `profile.role` to redirect:
   - `reader` → `/dashboard`
   - `blogger` → `/blogger/dashboard`
   - `admin` → `/admin/dashboard`

### Password Reset
- `supabase.auth.resetPasswordForEmail(email)`
- User gets email with reset link → redirects to `/auth/reset-password`

### Auto-create Profile Trigger
```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 4),
    split_part(new.email, '@', 1)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 7. FILE STORAGE (Supabase Storage)

### Buckets
```
avatars/          → public bucket — profile pictures
  {user_id}/profile.jpg

post-images/      → public bucket — blog post images
  {post_id}/{filename}

lesson-media/     → public bucket — lesson audio/video/images
  {lesson_id}/{filename}
```

### Upload Rules
- Avatar max size: **2MB**, formats: jpg, png, webp
- Post images max size: **5MB**, formats: jpg, png, webp, gif
- Compress images client-side using `browser-image-compression` npm package before upload
- Always store only the Supabase storage **path** in the database, not the full URL
- Generate public URL via: `supabase.storage.from('avatars').getPublicUrl(path)`

---

## 8. PAGES & ROUTING STRUCTURE

### Web (Next.js App Router)
```
app/
├── (public)/
│   ├── page.tsx                    # Home — featured posts, map preview
│   ├── explore/page.tsx            # Browse all categories + landmarks map
│   ├── blog/
│   │   ├── page.tsx                # Blog listing with filters
│   │   └── [slug]/page.tsx         # Individual blog post
│   ├── landmarks/
│   │   ├── page.tsx                # Interactive Amap with all landmarks
│   │   └── [id]/page.tsx           # Individual landmark page
│   ├── lessons/
│   │   ├── page.tsx                # Lesson catalog
│   │   └── [id]/page.tsx           # Lesson player
│   └── profile/[username]/page.tsx # Public user profile
│
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   └── reset-password/page.tsx
│
├── (reader)/                        # Protected: role = reader+
│   ├── dashboard/page.tsx           # Progress overview, bookmarks, activity
│   ├── settings/page.tsx            # Profile edit, avatar upload, password
│   └── bookmarks/page.tsx
│
├── (blogger)/                       # Protected: role = blogger+
│   ├── blogger/
│   │   ├── dashboard/page.tsx       # My posts stats
│   │   ├── posts/page.tsx           # My posts list
│   │   ├── posts/new/page.tsx       # Create post (TipTap editor)
│   │   └── posts/[id]/edit/page.tsx # Edit post
│
└── (admin)/                         # Protected: role = admin only
    ├── admin/
    │   ├── dashboard/page.tsx        # Site analytics, quick stats
    │   ├── users/page.tsx            # User management, role assignment
    │   ├── posts/page.tsx            # All posts moderation
    │   ├── comments/page.tsx         # Comment moderation
    │   ├── categories/page.tsx       # Manage categories
    │   └── landmarks/page.tsx        # Manage landmarks
```

### Mobile (Expo Router)
```
app/
├── (tabs)/
│   ├── index.tsx          # Home feed
│   ├── explore.tsx        # Map view (Amap)
│   ├── learn.tsx          # Lessons
│   └── profile.tsx        # User profile & progress
├── blog/[slug].tsx
├── lesson/[id].tsx
├── landmark/[id].tsx
└── auth/
    ├── login.tsx
    └── register.tsx
```

---

## 9. KEY UI COMPONENTS TO BUILD

### Shared Components
- `<PostCard />` — title, cover image, category, author avatar, read time, like count
- `<UserAvatar />` — with fallback initials, always from Supabase Storage
- `<CategoryBadge />` — colored pill with Chinese + English label
- `<ProgressBar />` — shows lesson/reading progress
- `<CommentThread />` — nested comments with reply support
- `<LikeButton />` — optimistic UI update
- `<BookmarkButton />` — saves post to user's collection
- `<RichTextEditor />` — TipTap editor for bloggers (toolbar: bold, italic, headings, image upload, link)
- `<BilingualToggle />` — switch between EN / ZH content

### Maps Component
```tsx
// Use Amap JS API — China safe
// Load script dynamically (no npm package needed, add to next.config.js allowed domains)
// Script: https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY

// In next.config.js:
const nextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: [{ key: 'Content-Security-Policy', value: "..." }] }]
  }
}
```

---

## 10. DESIGN SYSTEM

### Color Palette (Chinese Cultural Theme)
```css
:root {
  /* Primary — Imperial Red */
  --color-primary: #C0392B;
  --color-primary-light: #E74C3C;
  --color-primary-dark: #922B21;

  /* Secondary — Jade Green */
  --color-secondary: #1A7A4A;
  --color-secondary-light: #27AE60;

  /* Accent — Imperial Gold */
  --color-accent: #D4A017;
  --color-accent-light: #F1C40F;

  /* Neutral */
  --color-ink: #1C1C1E;
  --color-paper: #FAF8F5;          /* warm off-white like rice paper */
  --color-muted: #8C7B6E;

  /* Dark mode */
  --color-dark-bg: #111010;
  --color-dark-surface: #1E1C1C;
}
```

### Typography
```css
/* Install: npm install @fontsource/noto-sans-sc @fontsource/noto-serif-sc */
--font-display: 'Noto Serif SC', 'STSong', serif;       /* Headings — elegant, cultural */
--font-body: 'Noto Sans SC', 'PingFang SC', sans-serif; /* Body — clean, readable */
--font-mono: 'JetBrains Mono', 'Consolas', monospace;   /* Code */
```

### Design Principles
- Inspired by traditional Chinese ink painting (水墨画) — elegant, minimal, purposeful
- Use brush-stroke style decorative elements (SVG)
- Generous whitespace — "rice paper" feel
- Red and gold accents sparingly — don't make it feel like a restaurant menu
- Support both LTR (English) and vertical/RTL reading modes for Chinese content
- Every page should feel like an elegant cultural magazine, not a generic blog

---

## 11. INTERNATIONALIZATION (i18n)

### Strategy
- Use **next-intl** for Next.js
- Default language: English (`en`)
- Secondary language: Simplified Chinese (`zh`)
- Language preference stored in `profiles.language_preference`
- URLs: `/en/blog/...` and `/zh/blog/...`

### Bilingual Content
- Blog posts have `title_en`, `title_zh`, `content_en`, `content_zh` fields
- If `content_zh` is null → only show English with a note "Chinese translation coming soon"
- UI strings stored in `/messages/en.json` and `/messages/zh.json`

---

## 12. PERFORMANCE & SEO

### Next.js Optimizations
- Use `next/image` for ALL images (automatic WebP conversion, lazy loading)
- Blog post pages: use `generateStaticParams` for SSG where possible
- Use Supabase server-side client in Server Components (not client-side)
- Implement ISR (Incremental Static Regeneration) for blog posts: `revalidate: 3600`

### SEO
- Each post page: dynamic `<title>`, `<meta description>`, Open Graph tags
- Generate `/sitemap.xml` dynamically from published posts
- Structured data (JSON-LD) for articles and landmarks
- Chinese-language pages: set `lang="zh-Hans"` on `<html>` tag

---

## 13. ENVIRONMENT VARIABLES

```env
# .env.local (NEVER commit this file)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here   # server-side only

# Amap (高德地图) — China-safe maps
NEXT_PUBLIC_AMAP_KEY=your_amap_web_key_here
NEXT_PUBLIC_AMAP_SECRET=your_amap_secret_here

# App
NEXT_PUBLIC_APP_URL=https://chinaverse.vercel.app
NEXT_PUBLIC_APP_NAME=ChinaVerse

# Optional: hCaptcha (China-safe CAPTCHA)
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_hcaptcha_key
HCAPTCHA_SECRET_KEY=your_hcaptcha_secret
```

---

## 14. SECURITY RULES

- **Never** expose `SUPABASE_SERVICE_ROLE_KEY` to the client (no `NEXT_PUBLIC_` prefix)
- All user input must be sanitized — use Zod schemas for validation
- TipTap editor output (HTML) must be sanitized with `DOMPurify` before storing/rendering
- Rate limit comment creation using Supabase Edge Functions
- All admin routes must verify `role = 'admin'` server-side (middleware check)
- Profile pictures: validate MIME type server-side, not just file extension

### Next.js Middleware (Route Protection)
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // Protected routes
  const readerRoutes = ['/dashboard', '/settings', '/bookmarks']
  const bloggerRoutes = ['/blogger']
  const adminRoutes = ['/admin']

  const path = req.nextUrl.pathname

  if (!session) {
    if ([...readerRoutes, ...bloggerRoutes, ...adminRoutes].some(r => path.startsWith(r))) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return res
}
```

---

## 15. MOBILE-SPECIFIC NOTES (Expo)

- Share Supabase client from `/packages/core/supabase.ts` between web and mobile
- Use `expo-image-picker` for avatar upload on mobile
- Use `expo-secure-store` to persist Supabase session tokens securely
- Amap React Native SDK: `react-native-amap3d` — follow their setup for iOS/Android keys
- Test on both iOS Simulator and Android Emulator during development
- For China app stores: you may need to register with Apple App Store Connect and Huawei AppGallery for Chinese users
- Consider adding **Huawei HMS Push** as alternative to APNs for Android in China (standard FCM/GCM is Google and blocked)

---

## 16. DEVELOPMENT WORKFLOW

### Git Branching
```
main          → production (auto-deploys to Vercel)
develop       → staging
feature/*     → individual features
fix/*         → bug fixes
```

### Commit Convention
```
feat: add landmark detail page
fix: correct RLS policy for comments
chore: update dependencies
docs: add API documentation
```

### Supabase Migrations
- Never manually edit the database in production
- Always create migration files: `supabase migration new <name>`
- Apply locally: `supabase db reset`
- Apply to production: `supabase db push`

---

## 17. COMPETITION COMPLIANCE NOTES

- ⚠️ All submitted files must be **ANONYMOUS** — remove all names, university logos, student IDs
- Works must be created between **July 1, 2025 – June 30, 2026**
- Submission deadline: **May 6, 2026**
- The app must demonstrate real functionality — have working demo data (seed the database)
- Prepare a demo video (hosted on Bilibili, NOT YouTube)
- Prepare a PPT presentation — also anonymous
- All maps used must display a map review number (Amap provides this automatically)

---

## 18. QUICK REFERENCE COMMANDS

```bash
# Install dependencies
npm install

# Run web dev server
cd apps/web && npm run dev

# Run mobile app
cd apps/mobile && npx expo start

# Supabase local development
supabase start
supabase db reset          # Apply all migrations + seed

# Generate TypeScript types from Supabase schema
supabase gen types typescript --local > packages/core/types/database.ts

# Deploy web to Vercel
vercel --prod
```

---

*End of ChinaVerse Project Rules File*
*This file should be kept up to date as the project evolves.*
*Always refer to this file before generating new code to ensure consistency.*
