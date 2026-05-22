create type worker_approval_status as enum ('pending', 'approved', 'rejected', 'suspended');
create type work_session_status as enum ('draft', 'recording_start', 'in_progress', 'paused', 'held', 'resumed', 'completed', 'cancelled', 'deleted');
create type verification_post_status as enum ('draft', 'assets_uploading', 'ready_to_publish', 'published', 'rating_pending', 'rated', 'deleted');
create type asset_status as enum ('none', 'recording', 'uploading', 'uploaded', 'failed', 'local_saved', 'retry_pending');
create type wanted_post_status as enum ('open', 'closed', 'hidden', 'deleted');
create type report_status as enum ('received', 'reviewing', 'listed', 'rejected', 'closed');

create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  role_flags text[] not null default '{}',
  nickname text not null unique,
  email text not null unique,
  phone text,
  real_name text,
  phone_verified_at timestamptz,
  created_at timestamptz not null default now(),
  status text not null default 'active'
);

create table public.worker_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  worker_name text not null,
  character_name text not null,
  intro text not null,
  jobs text[] not null default '{}',
  hunting_areas text[] not null default '{}',
  available_time text not null,
  price_text text not null,
  open_kakao_url text,
  discord_contact text,
  approval_status worker_approval_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.worker_profiles(user_id) on delete cascade,
  title text not null,
  description text not null,
  media_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.promo_posts (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.worker_profiles(user_id) on delete cascade,
  title text not null,
  hunting_area text not null,
  content text not null,
  created_at timestamptz not null default now(),
  status text not null default 'published'
);

create table public.wanted_posts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  hunting_area text not null,
  level_condition text not null,
  desired_duration integer not null,
  desired_start_time timestamptz,
  desired_price text,
  auth_method text not null,
  contact_method text not null,
  memo text,
  status wanted_post_status not null default 'open',
  created_at timestamptz not null default now()
);

create table public.wanted_post_comments (
  id uuid primary key default gen_random_uuid(),
  wanted_post_id uuid not null references public.wanted_posts(id) on delete cascade,
  worker_id uuid not null references public.worker_profiles(user_id) on delete cascade,
  content text not null,
  available_time text not null,
  auth_method text not null,
  created_at timestamptz not null default now(),
  status text not null default 'published'
);

create table public.work_sessions (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.worker_profiles(user_id) on delete cascade,
  customer_nickname text not null,
  hunting_area text not null,
  planned_duration integer not null,
  mode text not null,
  status work_session_status not null default 'draft',
  started_at timestamptz,
  completed_at timestamptz,
  paused_seconds integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.verification_posts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.work_sessions(id) on delete cascade,
  worker_id uuid not null references public.worker_profiles(user_id) on delete cascade,
  title text not null,
  summary text not null,
  price_text text not null,
  memo text,
  status verification_post_status not null default 'draft',
  published_at timestamptz,
  customer_link_token text unique
);

create table public.captures (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.work_sessions(id) on delete cascade,
  post_id uuid references public.verification_posts(id) on delete set null,
  type text not null,
  storage_bucket text not null default 'verification-assets',
  storage_key text not null,
  file_url text,
  captured_at timestamptz not null,
  uploaded_at timestamptz,
  sha256_hash text not null,
  is_representative boolean not null default false,
  status asset_status not null default 'local_saved'
);

create table public.clips (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.work_sessions(id) on delete cascade,
  post_id uuid references public.verification_posts(id) on delete set null,
  clip_type text not null,
  engine text not null,
  target_type text not null,
  duration_sec integer not null,
  storage_bucket text not null default 'verification-assets',
  storage_key text not null,
  file_url text,
  file_size integer not null,
  sha256_hash text not null,
  status asset_status not null default 'local_saved'
);

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.verification_posts(id) on delete cascade,
  customer_token text not null,
  score integer not null check (score between 1 and 3),
  reason text,
  public_review text,
  created_at timestamptz not null default now(),
  submit_ip_hash text not null,
  unique (post_id, customer_token)
);

create table public.scammer_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.users(id) on delete cascade,
  target_text text not null,
  reason text not null,
  evidence_urls text[] not null default '{}',
  status report_status not null default 'received',
  created_at timestamptz not null default now()
);

create table public.scammer_entries (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  character_name text,
  reason_type text not null,
  description text not null,
  status report_status not null default 'listed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.update_versions (
  version text primary key,
  minimum_version text not null,
  force_update boolean not null default false,
  download_url text not null,
  release_notes text[] not null default '{}',
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public)
values ('verification-assets', 'verification-assets', false)
on conflict (id) do nothing;
