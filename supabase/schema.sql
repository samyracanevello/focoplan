-- ============================================================================
-- FocoPlan — Supabase Schema
-- Run this in Supabase SQL Editor (supabase.com → SQL Editor → New query)
-- ============================================================================

-- 1. Subjects
create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null default '#4F46E5',
  icon text not null default '📚',
  weekly_goal_hours int not null default 10,
  created_at timestamptz not null default now()
);

alter table subjects enable row level security;
create policy "Users manage own subjects"
  on subjects for all using (auth.uid() = user_id);

-- 2. Topics (hierarchical, linked to subjects)
create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid not null references subjects(id) on delete cascade,
  parent_id uuid references topics(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

alter table topics enable row level security;
create policy "Users manage own topics"
  on topics for all using (auth.uid() = user_id);

-- 3. Tasks
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  subject_id uuid references subjects(id) on delete set null,
  tag text not null default 'Geral',
  tag_color text not null default 'bg-pastel-lavender text-slate-700',
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  status text not null default 'pending' check (status in ('pending','completed')),
  date date,
  duration_minutes int,
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

alter table tasks enable row level security;
create policy "Users manage own tasks"
  on tasks for all using (auth.uid() = user_id);

-- 4. Pomodoro Sessions
create table if not exists pomodoro_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null,
  duration_minutes int not null,
  type text not null default 'focus' check (type in ('focus','short_break','long_break')),
  completed boolean not null default true,
  created_at timestamptz not null default now()
);

alter table pomodoro_sessions enable row level security;
create policy "Users manage own sessions"
  on pomodoro_sessions for all using (auth.uid() = user_id);

-- 5. Goals
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null default 'study',
  priority text not null default 'medium',
  status text not null default 'not_started',
  target_date date,
  created_at timestamptz not null default now()
);

alter table goals enable row level security;
create policy "Users manage own goals"
  on goals for all using (auth.uid() = user_id);

-- 6. Flashcards
create table if not exists flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid not null references subjects(id) on delete cascade,
  front text not null,
  back text not null,
  interval int not null default 0,
  repetition int not null default 0,
  ease_factor numeric(4,2) not null default 2.50,
  next_review date not null default current_date,
  last_review date,
  created_at timestamptz not null default now()
);

alter table flashcards enable row level security;
create policy "Users manage own flashcards"
  on flashcards for all using (auth.uid() = user_id);

-- 7. Calendar Events
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  date date not null,
  time text,
  color text not null default '#4F46E5',
  description text,
  created_at timestamptz not null default now()
);

alter table events enable row level security;
create policy "Users manage own events"
  on events for all using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists idx_topics_subject on topics(subject_id);
create index if not exists idx_tasks_user on tasks(user_id);
create index if not exists idx_flashcards_subject on flashcards(subject_id);
create index if not exists idx_flashcards_next_review on flashcards(user_id, next_review);
