-- ═══════════════════════════════════════════════════════════
--  Yurdunu Bil — Supabase Veritabanı Şeması
--  Bu dosyayı Supabase projenizde SQL Editor'de çalıştırın.
-- ═══════════════════════════════════════════════════════════

-- 1) PROFİLLER ────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_upsert_own" on public.profiles;
create policy "profiles_upsert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Yeni kullanıcı kayıt olduğunda otomatik profil satırı oluştur
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2) İL İLERLEMESİ (keşfedilen iller) ──────────────────────────
create table if not exists public.province_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  province_name text not null,
  visited boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (user_id, province_name)
);

alter table public.province_progress enable row level security;

drop policy if exists "province_progress_all_own" on public.province_progress;
create policy "province_progress_all_own" on public.province_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- 3) TEST SONUÇLARI ─────────────────────────────────────────────
create table if not exists public.quiz_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id text,
  correct int not null default 0,
  total int not null default 0,
  score int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.quiz_results enable row level security;

drop policy if exists "quiz_results_all_own" on public.quiz_results;
create policy "quiz_results_all_own" on public.quiz_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists quiz_results_user_idx on public.quiz_results(user_id, created_at desc);


-- 4) FAVORİLER ────────────────────────────────────────────────
create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,
  item_type text not null default 'province' check (item_type in ('province','topic')),
  created_at timestamptz not null default now(),
  primary key (user_id, item_id, item_type)
);

alter table public.favorites enable row level security;

drop policy if exists "favorites_all_own" on public.favorites;
create policy "favorites_all_own" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- ═══════════════════════════════════════════════════════════
--  NOTLAR
--  - Yukarıdaki tüm politikalar "kullanıcı yalnızca kendi verisini
--    görebilir/değiştirebilir" (RLS) kuralını uygular.
--  - Google ile giriş için: Supabase Dashboard > Authentication >
--    Providers > Google bölümünü ayrı olarak yapılandırmanız gerekir.
--  - E-posta doğrulamasını Authentication > Settings altından
--    açıp/kapatabilirsiniz. Kapalıysa kayıt sonrası oturum direkt açılır.
-- ═══════════════════════════════════════════════════════════
