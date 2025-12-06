-- ==========================================
-- GAMIFICATION SCHEMA FOR MEMORY REWRITER AI
-- ==========================================

create table if not exists public.user_stats (
  user_id uuid not null primary key references auth.users (id) on delete cascade,
  xp integer default 0,
  level integer default 1,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_activity_date date,
  badges text[] default '{}'::text[], -- Array of badge IDs strings
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.user_stats enable row level security;

-- Policies
create policy "Users can view their own stats" 
  on public.user_stats for select 
  to authenticated 
  using (auth.uid() = user_id);

create policy "Users can update their own stats" 
  on public.user_stats for update 
  to authenticated 
  using (auth.uid() = user_id);

create policy "Users can insert their own stats" 
  on public.user_stats for insert 
  to authenticated 
  with check (auth.uid() = user_id);

-- Function to handle new user creation (optional trigger)
create or replace function public.handle_new_user_stats() 
returns trigger as $$
begin
  insert into public.user_stats (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;
