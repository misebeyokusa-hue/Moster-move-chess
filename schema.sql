-- Run in Supabase SQL Editor. All profile/game writes are performed by Edge Functions.
create table if not exists public.player_profiles (
  firebase_uid text primary key,
  username text not null,
  display_name text not null,
  avatar_url text,
  bio text not null default '',
  rating integer not null default 1200,
  games_played integer not null default 0,
  wins integer not null default 0,
  losses integer not null default 0,
  draws integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists player_profiles_username_lower on public.player_profiles(lower(username));
create index if not exists player_profiles_rating on public.player_profiles(rating desc);
create table if not exists public.chess_games (
  id uuid primary key default gen_random_uuid(),
  firebase_uid text not null,
  room_code text,
  result text not null,
  pgn text not null,
  white_ms integer,
  black_ms integer,
  created_at timestamptz not null default now()
);
create index if not exists chess_games_firebase_uid_created_at on public.chess_games(firebase_uid, created_at desc);
alter table public.player_profiles enable row level security;
alter table public.chess_games enable row level security;
-- No browser table policies: authenticated Edge Functions verify Firebase ID tokens and use service role.
