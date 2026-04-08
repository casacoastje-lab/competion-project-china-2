-- =====================================================
-- CHINAVERSE DATABASE MIGRATION
-- Full Database Setup for ChinaVerse Project
-- =====================================================

-- =====================================================
-- SECTION 1: USERS & AUTH
-- =====================================================

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  role text default 'reader' check (role in ('reader', 'blogger', 'admin')),
  language_preference text default 'en' check (language_preference in ('en', 'zh')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User progress table (stores user learning/reading progress)
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  content_type text not null check (content_type in ('blog', 'lesson', 'landmark', 'quiz')),
  content_id uuid not null,
  progress_percent integer default 0 check (progress_percent between 0 and 100),
  completed boolean default false,
  score integer,
  last_accessed_at timestamptz default now(),
  unique(user_id, content_type, content_id)
);

-- Badges / achievements
create table if not exists public.badges (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  icon_url text,
  criteria jsonb,
  created_at timestamptz default now()
);

-- User badges (earned achievements)
create table if not exists public.user_badges (
  user_id uuid references public.profiles(id) on delete cascade,
  badge_id uuid references public.badges(id) on delete cascade,
  earned_at timestamptz default now(),
  primary key (user_id, badge_id)
);

-- =====================================================
-- SECTION 2: BLOG SYSTEM
-- =====================================================

-- Categories for blog posts
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name_en text not null,
  name_zh text not null,
  slug text unique not null,
  description_en text,
  description_zh text,
  cover_image_url text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Blog posts
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete set null,
  category_id uuid references public.categories(id),
  title_en text not null,
  title_zh text,
  slug text unique not null,
  content_en text not null,
  content_zh text,
  cover_image_url text,
  excerpt_en text,
  excerpt_zh text,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  is_featured boolean default false,
  view_count integer default 0,
  read_time_minutes integer,
  tags text[],
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Comments
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null,
  is_approved boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Likes (for posts)
create table if not exists public.likes (
  user_id uuid references public.profiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);

-- Bookmarks (save posts)
create table if not exists public.bookmarks (
  user_id uuid references public.profiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);

-- =====================================================
-- SECTION 3: CULTURAL CONTENT
-- =====================================================

-- Landmarks / tourist attractions
create table if not exists public.landmarks (
  id uuid default gen_random_uuid() primary key,
  name_en text not null,
  name_zh text not null,
  short_description_en text,
  short_description_zh text,
  long_description_en text,
  long_description_zh text,
  province text,
  city text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  cover_image_url text,
  images text[],
  category text,
  amap_place_id text,
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- Mini lessons
create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  title_en text not null,
  title_zh text not null,
  category_id uuid references public.categories(id),
  difficulty text default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  duration_minutes integer,
  cover_image_url text,
  is_published boolean default false,
  sort_order integer default 0,
  content jsonb,
  created_at timestamptz default now()
);

-- =====================================================
-- SECTION 4: TRIGGERS
-- =====================================================

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 4)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Profiles updated_at trigger
drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Posts updated_at trigger
drop trigger if exists update_posts_updated_at on public.posts;
create trigger update_posts_updated_at
  before update on public.posts
  for each row execute procedure public.handle_updated_at();

-- Comments updated_at trigger
drop trigger if exists update_comments_updated_at on public.comments;
create trigger update_comments_updated_at
  before update on public.comments
  for each row execute procedure public.handle_updated_at();

-- =====================================================
-- SECTION 5: ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.bookmarks enable row level security;
alter table public.landmarks enable row level security;
alter table public.lessons enable row level security;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- =====================================================
-- USER PROGRESS POLICIES
-- =====================================================

drop policy if exists "Users can view own progress" on public.user_progress;
create policy "Users can view own progress"
  on public.user_progress for select using (auth.uid() = user_id);

drop policy if exists "Users can manage own progress" on public.user_progress;
create policy "Users can manage own progress"
  on public.user_progress for all using (auth.uid() = user_id);

-- =====================================================
-- BADGES POLICIES
-- =====================================================

drop policy if exists "Badges are viewable by everyone" on public.badges;
create policy "Badges are viewable by everyone"
  on public.badges for select using (true);

drop policy if exists "Users can view own badges" on public.user_badges;
create policy "Users can view own badges"
  on public.user_badges for select using (auth.uid() = user_id);

-- =====================================================
-- CATEGORIES POLICIES
-- =====================================================

drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone"
  on public.categories for select using (true);

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
  on public.categories for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- =====================================================
-- POSTS POLICIES
-- =====================================================

drop policy if exists "Published posts are viewable by everyone" on public.posts;
create policy "Published posts are viewable by everyone"
  on public.posts for select using (status = 'published');

drop policy if exists "Bloggers can view own drafts" on public.posts;
create policy "Bloggers can view own drafts"
  on public.posts for select using (auth.uid() = author_id);

drop policy if exists "Bloggers can create posts" on public.posts;
create policy "Bloggers can create posts"
  on public.posts for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('blogger', 'admin')
    )
  );

drop policy if exists "Authors and admins can update posts" on public.posts;
create policy "Authors and admins can update posts"
  on public.posts for update using (
    auth.uid() = author_id or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Authors and admins can delete posts" on public.posts;
create policy "Authors and admins can delete posts"
  on public.posts for delete using (
    auth.uid() = author_id or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =====================================================
-- COMMENTS POLICIES
-- =====================================================

drop policy if exists "Approved comments viewable by everyone" on public.comments;
create policy "Approved comments viewable by everyone"
  on public.comments for select using (is_approved = true);

drop policy if exists "Authenticated users can comment" on public.comments;
create policy "Authenticated users can comment"
  on public.comments for insert with check (auth.uid() is not null);

drop policy if exists "Users can update own comments" on public.comments;
create policy "Users can update own comments"
  on public.comments for update using (auth.uid() = author_id);

drop policy if exists "Users can delete own comments" on public.comments;
create policy "Users can delete own comments"
  on public.comments for delete using (auth.uid() = author_id);

drop policy if exists "Admins can manage all comments" on public.comments;
create policy "Admins can manage all comments"
  on public.comments for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =====================================================
-- LIKES POLICIES
-- =====================================================

drop policy if exists "Authenticated users can like" on public.likes;
create policy "Authenticated users can like"
  on public.likes for insert with check (auth.uid() = user_id);

drop policy if exists "Users can view likes" on public.likes;
create policy "Users can view likes"
  on public.likes for select using (true);

drop policy if exists "Users can remove own likes" on public.likes;
create policy "Users can remove own likes"
  on public.likes for delete using (auth.uid() = user_id);

-- =====================================================
-- BOOKMARKS POLICIES
-- =====================================================

drop policy if exists "Users can manage own bookmarks" on public.bookmarks;
create policy "Users can manage own bookmarks"
  on public.bookmarks for all using (auth.uid() = user_id);

drop policy if exists "Users can view own bookmarks" on public.bookmarks;
create policy "Users can view own bookmarks"
  on public.bookmarks for select using (auth.uid() = user_id);

-- =====================================================
-- LANDMARKS POLICIES
-- =====================================================

drop policy if exists "Landmarks are viewable by everyone" on public.landmarks;
create policy "Landmarks are viewable by everyone"
  on public.landmarks for select using (true);

drop policy if exists "Admins can manage landmarks" on public.landmarks;
create policy "Admins can manage landmarks"
  on public.landmarks for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =====================================================
-- LESSONS POLICIES
-- =====================================================

drop policy if exists "Published lessons are viewable by everyone" on public.lessons;
create policy "Published lessons are viewable by everyone"
  on public.lessons for select using (is_published = true);

drop policy if exists "Admins can manage lessons" on public.lessons;
create policy "Admins can manage lessons"
  on public.lessons for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =====================================================
-- SECTION 6: SEED DATA
-- =====================================================

-- Insert default categories
insert into public.categories (name_en, name_zh, slug, description_en, description_zh, sort_order) values
  ('History & Landmarks', '历史与地标', 'history-landmarks', 'Explore China''s rich historical heritage and iconic landmarks', '探索中国丰富的历史遗产和标志性建筑', 1),
  ('Language & Calligraphy', '语言与书法', 'language-calligraphy', 'Learn Mandarin Chinese and the art of calligraphy', '学习普通话和书法艺术', 2),
  ('Food & Traditions', '美食与传统', 'food-traditions', 'Discover Chinese cuisine and traditional customs', '发现中国美食和传统习俗', 3),
  ('Art & Music', '艺术与音乐', 'art-music', 'Appreciate Chinese art forms and traditional music', '欣赏中国艺术形式和传统音乐', 4),
  ('Travel Guide', '旅行指南', 'travel-guide', 'Practical tips for exploring China', '探索中国的实用技巧', 5),
  ('Festivals', '节日庆典', 'festivals', 'Learn about Chinese festivals and celebrations', '了解中国节日和庆典', 6)
on conflict (slug) do nothing;

-- Insert default badges
insert into public.badges (name, description, criteria) values
  ('First Steps', 'Completed your first lesson', '{"type": "lessons_completed", "count": 1}'),
  ('Explorer', 'Read 5 articles', '{"type": "blogs_read", "count": 5}'),
  ('Culture Enthusiast', 'Read 10 articles', '{"type": "blogs_read", "count": 10}'),
  ('Quiz Master', 'Completed 5 quizzes', '{"type": "quizzes_completed", "count": 5}'),
  ('Globe Trotter', 'Explored 10 landmarks', '{"type": "landmarks_explored", "count": 10}'),
  ('Dedicated Learner', 'Completed 5 lessons', '{"type": "lessons_completed", "count": 5}')
on conflict do nothing;

-- Insert sample landmarks
insert into public.landmarks (name_en, name_zh, short_description_en, short_description_zh, long_description_en, long_description_zh, province, city, latitude, longitude, category, is_featured) values
  ('The Great Wall of China', '长城', 'The world''s longest fortification, stretching over 21,000 km.', '横贯中国北方的世界最长防御工事。', 'The Great Wall winding across mountains and deserts for over 2,000 years. It stands as a testament to human determination and engineering brilliance.', '横跨山脉与沙漠的长城，拥有两千多年的悠久历史。它是人类决心和工程技术的见证。', 'Beijing', 'Beijing', 40.3588, 116.0145, 'History', true),
  ('The Forbidden City', '故宫', 'The world''s largest palace complex and imperial home for 500 years.', '世界上最大的宫殿建筑群，五百年皇家住所。', 'The heart of Beijing, home to 24 emperors of the Ming and Qing dynasties. A masterpiece of Chinese architecture.', '北京之魂，明清两代24位皇帝的居住地。中国建筑的杰作。', 'Beijing', 'Beijing', 39.9163, 116.3972, 'History', true),
  ('West Lake', '西湖', 'A poetic landscape that has inspired Chinese art for a thousand years.', '启发了千年中国艺术的如画风景。', 'The most romanticized landscape in Chinese culture, appearing in countless poems, paintings, and legends.', '中国文化中最富诗意的景观，出现在无数诗词画作和传说中。', 'Zhejiang', 'Hangzhou', 30.2590, 120.1490, 'Nature', false),
  ('Terracotta Army', '兵马俑', '8,000 lifelike clay warriors guarding an ancient emperor.', '守护古代皇帝的八千尊写实陶俑。', 'The silent guardians of China''s first emperor, a wonder of archaeology and ancient craftsmanship.', '中国首位皇帝的静默卫士，世界考古奇迹。', 'Shaanxi', 'Xi''an', 34.3846, 109.2783, 'History', true),
  ('Zhangjiajie Pillars', '张家界', 'Otherworldly sandstone pillars that inspired Avatar.', '启发了《阿凡达》世界的梦幻砂岩柱峰。', 'Over 3,000 stone pillars rising from the mist of Hunan Province, creating a landscape unlike anywhere else on Earth.', '湖南省三千多座从云雾中拔地而起的石峰，创造出地球上独一无二的景观。', 'Hunan', 'Zhangjiajie', 29.3250, 110.4340, 'Nature', false),
  ('The Bund', '外滩', 'Where colonial charm meets futuristic skyscrapers on the Huangpu River.', '黄浦江畔，殖民魅力与未来感摩天大楼的交汇点。', 'Shanghai''s historic waterfront, featuring 52 buildings of various architectural styles from Gothic to Art Deco.', '上海的历史地标，汇集了52栋风格各异的历史建筑，从哥特式到装饰艺术风格。', 'Shanghai', 'Shanghai', 31.2416, 121.4930, 'Cityscape', false),
  ('Li River', '漓江', 'Majestic karst peaks and traditional life reflected in glass-clear water.', '清澈见底的水面映照着雄伟的喀斯特峰岭和传统生活。', 'The 83km stretch between Guilin and Yangshuo, widely considered China''s most beautiful river.', '桂林至阳朔83公里的水路，被公认为中国最美的河流。', 'Guangxi', 'Guilin', 25.0740, 110.4500, 'Nature', false),
  ('Jiuzhaigou Valley', '九寨沟', 'Multi-level waterfalls, colorful lakes, and snow-capped peaks.', '叠翠冰川，五彩湖泊，以及终年积雪的山峰。', 'A nature reserve and national park in Sichuan, famous for its blue and green lakes that seem almost unreal.', '四川省的自然保护区，以蓝绿交织的梦幻湖泊而闻名。', 'Sichuan', 'Jiuzhaigou', 33.2000, 103.9000, 'Nature', false),
  ('Potala Palace', '布达拉宫', 'The roof of the world''s most iconic fortress and spiritual center.', '世界屋脊上最具标志性的堡垒与精神中心。', 'Located in Lhasa, it was the winter palace of the Dalai Lamas since the 7th century.', '位于拉萨，自公元7世纪以来，这里便是历代达赖喇嘛的冬宫。', 'Tibet', 'Lhasa', 29.6578, 91.1172, 'Spiritual', false),
  ('The Summer Palace', '颐和园', 'A masterpiece of Chinese landscape garden design on Kunming Lake.', '昆明湖畔中国园林景观设计的杰作。', 'The best-preserved imperial garden in the world, once a retreat for empresses and emperors.', '世界上保存最完整的皇家园林，曾是后妃们的避暑胜地。', 'Beijing', 'Beijing', 40.0000, 116.2700, 'Imperial Garden', false)
on conflict do nothing;

-- Insert sample lessons
insert into public.lessons (title_en, title_zh, category_id, difficulty, duration_minutes, is_published, sort_order, content) 
select 
  '5,000 Years of Civilization',
  '五千年文明概论',
  c.id,
  'beginner',
  15,
  true,
  1,
  '{"takeaways": {"en": ["Chinese civilization began along the Yellow River over 5,000 years ago.", "Imperial dynasties like the Han and Tang unified the continent.", "The Great Wall and Silk Road integrated China with the world."], "zh": ["中华文明起源于5000多年前的黄河流域。", "汉、唐等强大王朝实现了一统天下。", "长城与丝绸之路将中国与世界紧密相连。"]}, "quiz": {"question_en": "Which dynasty is known as China''s ''Golden Age'' of culture and trade?", "question_zh": "哪个朝代被公认为中国文化与贸易的「黄金时代」？", "options_en": ["Han", "Ming", "Tang"], "options_zh": ["汉朝", "明朝", "唐朝"], "answer_en": "Tang", "answer_zh": "唐朝", "explanation_en": "The Tang Dynasty was a global peak of art and open trade.", "explanation_zh": "唐朝是艺术与对外贸易发展的巅峰时期。"}}'::jsonb
from public.categories c where c.slug = 'history-landmarks'
on conflict do nothing;

insert into public.lessons (title_en, title_zh, category_id, difficulty, duration_minutes, is_published, sort_order, content)
select 
  'The Magic of Tones',
  '声调的魔力',
  c.id,
  'beginner',
  10,
  true,
  2,
  '{"takeaways": {"en": ["Mandarin has 4 main tones plus a neutral tone.", "The same sound with a different tone has a different meaning.", "Tones are musical and essential for being understood."], "zh": ["普通话有四个主声调和一个轻声。", "相同的读音，声调不同，意义各异。", "声调具有音乐感，是沟通的基础。"]}, "quiz": {"question_en": "How many main tones are there in Mandarin?", "question_zh": "普通话有多少个主要声调？", "options_en": ["3", "4", "5"], "options_zh": ["3个", "4个", "5个"], "answer_en": "4", "answer_zh": "4个", "explanation_en": "There are 4 distinct pitch contours.", "explanation_zh": "普通话包含四个不同的音调轮廓。"}}'::jsonb
from public.categories c where c.slug = 'language-calligraphy'
on conflict do nothing;

insert into public.lessons (title_en, title_zh, category_id, difficulty, duration_minutes, is_published, sort_order, content)
select 
  'The Eight Great Cuisines',
  '八大菜系博览',
  c.id,
  'intermediate',
  20,
  true,
  3,
  '{"takeaways": {"en": ["Chinese food is regional, not just one ''style''.", "Sichuan is known for spice, Cantonese for freshness.", "Each cuisine reflects local ingredients and climate."], "zh": ["中国饮食具有鲜明的地域性。", "川菜以麻辣著称，粤菜讲究食材本味。", "每种菜系都反映了当地的物产与气候。"]}, "quiz": {"question_en": "Which cuisine is famous for the ''Mala'' (numbing & spicy) flavor?", "question_zh": "哪个菜系以「麻辣」风味闻名？", "options_en": ["Cantonese", "Sichuan", "Shandong"], "options_zh": ["粤菜", "川菜", "鲁菜"], "answer_en": "Sichuan", "answer_zh": "川菜", "explanation_en": "Sichuan peppercorns provide the unique numbing sensation.", "explanation_zh": "花椒为川菜提供了独特的麻感。"}}'::jsonb
from public.categories c where c.slug = 'food-traditions'
on conflict do nothing;

-- Insert sample blog posts
insert into public.posts (title_en, title_zh, slug, content_en, content_zh, excerpt_en, excerpt_zh, status, is_featured, read_time_minutes, tags, published_at)
values
  ('The Great Wall: More Than Just a Wall', '长城：不仅仅是一堵墙', 'the-great-wall-more-than-a-wall',
   'When people imagine China, the Great Wall is often the first image that comes to mind. Stretching over 21,000 kilometers across northern China, it is one of the most recognizable structures in human history. But the wall is far more than a tourist attraction — it is a living testament to thousands of years of Chinese history, politics, and human determination.

## The Origins: Not One Wall, But Many

Contrary to popular belief, the Great Wall was not built all at once by a single emperor. Its construction spanned over two millennia, beginning as early as the 7th century BC when various Chinese states built walls to protect their borders.

It was the first emperor to unify China in 221 BC who ordered the connection of these existing walls into a single defensive line. Hundreds of thousands of workers — soldiers, peasants, and prisoners — labored under brutal conditions.

## The Ming Dynasty: The Wall We See Today

Most of what survives today was built during the Ming Dynasty (1368–1644 AD). After the Mongols had ruled China, the Ming emperors were determined to prevent another northern invasion.

## More Than Military: A Cultural Symbol

Beyond its military function, the Great Wall became a profound cultural symbol. It represented the boundary between the civilized world of China and the outside.',
   '长城是中国乃至全人类历史上最宏伟的建筑奇迹之一。它不仅仅是一道防御工事，更是中华民族坚韧不拔精神的象征。

### 起源与发展

长城的修筑历史可追溯到西周时期。秦始皇统一六国后，连接并修缮了战国长城。我们今天看到的长城主要是明朝时期的杰作。

### 文化遗产

长城沿线的烽火台、关隘和防御体系展示了古代卓越的军事智慧和工程技术。

### 今日长城

如今，长城已成为世界著名的旅游胜地。无论是八达岭的雄伟，还是慕田峪的秀美，亦或是箭扣的险峻，都吸引着无数游客前来领略这一世界奇观。',
   'Most people know the Great Wall as a marvel of engineering. But behind the stone and mortar lies a story of sacrifice, strategy, and a civilization determined to survive.',
   '大多数人了解长城是因为它是工程奇迹。但在砖石之后，隐藏着一段关于牺牲、战略和一个决心生存的文明的故事。',
   'published', true, 7, array['History', 'Landmarks', 'China'],
   now())
on conflict (slug) do nothing;

insert into public.posts (title_en, title_zh, slug, content_en, content_zh, excerpt_en, excerpt_zh, status, is_featured, read_time_minutes, tags, published_at)
values
  ('The Living Art: Understanding Chinese Calligraphy', '活着的艺术：理解中国书法', 'art-of-chinese-calligraphy',
   'Walk into any Chinese home, restaurant, or government building and you will almost certainly find calligraphy on the wall. A vertical scroll, black ink on white paper or red silk, characters flowing with confident brushstrokes.

## What Is Calligraphy?

Chinese calligraphy (书法, shūfǎ) is the artistic practice of writing Chinese characters using a brush and ink. Unlike Western calligraphy which focuses primarily on decorative lettering, Chinese calligraphy is considered fine art.

## The Five Script Styles

1. **Seal Script (篆书)** — The oldest. Rigid and formal.
2. **Clerical Script (隶书)** — More angular and horizontal.
3. **Regular Script (楷书)** — The standard script used in printing today.
4. **Running Script (行书)** — Semi-cursive. The most common in everyday handwriting.
5. **Cursive Script (草书)** — Highly abbreviated and flowing.

## The Four Treasures of the Study

- **Brush (笔)** — Made from animal hair.
- **Ink (墨)** — Traditionally an ink stick.
- **Paper (纸)** — Xuan paper from Anhui province.
- **Ink Stone (砚)** — Used to grind ink.',
   '书法是中国传统艺术的瑰宝，被誉为"无声的音乐"和"纸上的舞蹈"。

### 历史传承

从古老的甲骨文、金文，到后来的篆、隶、楷、行、草，书法经历了数千年的演变。

### 艺术表现

书法家通过用笔的速度、力度以及墨色的浓淡，抒发情感和意境。它追求一种气韵生动、和谐统一的美感。',
   'In China, the way you write is as important as what you write. Calligraphy is not just penmanship — it is considered the highest form of visual art.',
   '在中国，书写的方式与书写的内容同等重要。书法不只是一种写字技艺——它被认为是视觉艺术的最高形式。',
   'published', false, 6, array['Language', 'Art', 'Culture'],
   now())
on conflict (slug) do nothing;

insert into public.posts (title_en, title_zh, slug, content_en, content_zh, excerpt_en, excerpt_zh, status, is_featured, read_time_minutes, tags, published_at)
values
  ('Chinese New Year: The World''s Biggest Celebration Explained', '中国新年：全球最大庆典解析', 'guide-to-chinese-new-year',
   'Every year, usually between late January and mid-February, China transforms. Spring Festival, or Chinese New Year, is the most important holiday in the Chinese calendar.

## Key Traditions

🧧 **Red Envelopes (红包)** — Elders give money to children for good luck.
🥟 **Dumplings (饺子)** — Shaped like gold ingots, symbolizing wealth.
🎆 **Fireworks** — To drive away evil spirits.
🏮 **Red Lanterns** — Symbolizing happiness and prosperity.

## The Largest Migration

During Chinese New Year, over 3 billion trips are made as people return to their hometowns — the largest annual human migration on Earth.',
   '春节是中国人最重要的传统节日，象征着团圆和新的开始。

### 节日习俗

贴春联、吃团圆饭、守岁、发红包、舞龙舞狮等，每一项习俗都蕴含着对未来生活的美好期盼。',
   'More than 1.4 billion people celebrate it. It lasts 15 days. It involves fireworks, dumplings, red envelopes, and the largest annual human migration on Earth.',
   '超过14亿人庆祝它。它持续15天。包括烟花、饺子、红包，以及地球上规模最大的年度人口迁移。',
   'published', true, 8, array['Festivals', 'Traditions', 'Culture'],
   now())
on conflict (slug) do nothing;

insert into public.posts (title_en, title_zh, slug, content_en, content_zh, excerpt_en, excerpt_zh, status, is_featured, read_time_minutes, tags, published_at)
values
  ('Fire and Flavor: A Deep Dive into Sichuan Cuisine', '火与风味：深入探索四川美食', 'sichuan-cuisine-fire-and-flavor',
   'Sichuan cuisine (川菜) is one of the Eight Great Cuisines of China. It originates from Sichuan Province in the southwest.

## The Science of Mala (麻辣)

**Sichuan Peppercorns (花椒):** Creates a tingling, numbing sensation.
**Red Chillies (辣椒):** Adds depth and heat.

## Famous Dishes

1. **Mapo Tofu** — Silken tofu in spicy sauce with numbing peppercorns
2. **Kung Pao Chicken** — Stir-fried chicken with peanuts and chilies
3. **Hot Pot** — A communal broth with various ingredients
4. **Dan Dan Noodles** — Noodles with spicy Sichuan sauce

## The Seven Flavors

Sichuan cuisine is known for its "seven flavors": spicy, numbing, sweet, sour, salty, bitter, and aromatic.',
   '川菜以其麻辣鲜香而闻名于世。灵魂在于"麻"与"辣"的完美结合。

### 经典菜品

麻婆豆腐、宫保鸡丁、火锅、担担面等都是川菜的代表作品。

### 七滋八味

川菜以"七滋八味"著称：麻、辣、甜、酸、咸、苦、香。',
   'Sichuan cuisine is not just spicy — it is an experience that numbs your lips, ignites your senses, and leaves you craving more.',
   '四川菜不只是辣——它是一种让您嘴唇发麻、感官燃烧、让您欲罢不能的体验。',
   'published', false, 7, array['Food', 'Sichuan', 'Cuisine'],
   now())
on conflict (slug) do nothing;

insert into public.posts (title_en, title_zh, slug, content_en, content_zh, excerpt_en, excerpt_zh, status, is_featured, read_time_minutes, tags, published_at)
values
  ('Inside the Forbidden City: A Complete Visitor''s Guide', '紫禁城内部：完整参观指南', 'inside-the-forbidden-city',
   'The Forbidden City was the imperial palace of China from 1420 to 1912 — home to 24 emperors.

## Layout

The palace complex covers 72 hectares and contains 980 buildings with 8,886 rooms. It is divided into two main areas:

**The Outer Court** — Where the Emperor conducted state affairs
**The Inner Court** — The Emperor''s private quarters and those of the imperial family

## Key Highlights

1. **Hall of Supreme Harmony** — The largest building and the heart of the palace
2. **Imperial Garden** — A beautiful traditional Chinese garden
3. **The Palace Museum** — Houses priceless artifacts from imperial collections',
   '故宫，又称紫禁城，是明清两代的皇宫，也是世界上现存规模最大、保存最完整的木质结构古建筑群。

### 建筑布局

紫禁城占地72公顷，拥有980座建筑、8886间房间，分为外朝和内廷两大部分。

### 参观亮点

太和殿、御花园、故宫博物院等都是不可错过的精彩之处。',
   'For 500 years, no ordinary person could enter. Today, millions visit each year. But do they really see it?',
   '500年来，普通人无法进入。如今每年有数百万人参观。',
   'published', true, 6, array['History', 'Landmarks', 'Beijing'],
   now())
on conflict (slug) do nothing;

-- =====================================================
-- SECTION 7: STORAGE BUCKETS
-- =====================================================

-- Note: Run these in Supabase Dashboard > Storage > New Bucket
-- Or use the SQL below (may require Supabase CLI)

-- insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
--   ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']),
--   ('post-images', 'post-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
--   ('lesson-media', 'lesson-media', true, null, null);

-- =====================================================
-- SECTION 8: INDEXES FOR PERFORMANCE
-- =====================================================

create index if not exists idx_posts_author_id on public.posts(author_id);
create index if not exists idx_posts_status on public.posts(status);
create index if not exists idx_posts_slug on public.posts(slug);
create index if not exists idx_posts_category_id on public.posts(category_id);
create index if not exists idx_comments_post_id on public.comments(post_id);
create index if not exists idx_comments_author_id on public.comments(author_id);
create index if not exists idx_likes_post_id on public.likes(post_id);
create index if not exists idx_bookmarks_user_id on public.bookmarks(user_id);
create index if not exists idx_user_progress_user_id on public.user_progress(user_id);
create index if not exists idx_landmarks_category on public.landmarks(category);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Grant public access to functions
grant execute on function public.handle_new_user() to anon, authenticated;
grant execute on function public.handle_updated_at() to anon, authenticated;

-- Grant table permissions
grant select on public.profiles to anon, authenticated;
grant update on public.profiles to authenticated;
grant insert on public.profiles to authenticated;

grant select, insert, update, delete on public.user_progress to authenticated;

grant select on public.badges to anon, authenticated;
grant select, insert on public.user_badges to authenticated;

grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;

grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;

grant select on public.comments to anon;
grant insert, update, delete on public.comments to authenticated;

grant select, insert, delete on public.likes to authenticated;

grant all on public.bookmarks to authenticated;

grant select on public.landmarks to anon, authenticated;
grant insert, update, delete on public.landmarks to authenticated;

grant select on public.lessons to anon, authenticated;
grant insert, update, delete on public.lessons to authenticated;
