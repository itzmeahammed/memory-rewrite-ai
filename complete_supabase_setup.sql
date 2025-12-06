-- ==========================================
-- COMPLETE SUPABASE SCHEMA FOR MEMORY REWRITER AI
-- ==========================================

-- 1. Create the 'memories' table
-- This table stores all the user's rewritten memories.
create table if not exists public.memories (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null default auth.uid (), -- Links to the authenticated user
  original_text text not null,               -- The user's original input
  rewritten_text text not null,              -- The AI's output
  mood text null,                            -- The selected mood (e.g., 'Stoic', 'Funny')
  unlock_date timestamp with time zone null, -- For the Time Capsule feature
  created_at timestamp with time zone not null default now(),
  
  -- Primary Key
  constraint memories_pkey primary key (id),
  
  -- Foreign Key: Ensure user_id exists in auth.users
  constraint memories_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
);

-- 2. Enable Row Level Security (RLS)
-- This is crucial for security. It ensures users can only access their own data.
alter table public.memories enable row level security;

-- 3. Create Policies

-- Policy: Allow users to INSERT their own memories
create policy "Users can insert their own memories"
on public.memories
for insert
to authenticated
with check (auth.uid() = user_id);

-- Policy: Allow users to VIEW (Select) their own memories
create policy "Users can view their own memories"
on public.memories
for select
to authenticated
using (auth.uid() = user_id);

-- Policy: Allow users to DELETE their own memories (Optional, but good to have)
create policy "Users can delete their own memories"
on public.memories
for delete
to authenticated
using (auth.uid() = user_id);

-- ==========================================
-- END OF SCRIPT
-- ==========================================
