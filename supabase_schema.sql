-- Create the memories table
create table public.memories (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null default auth.uid (),
  original_text text not null,
  rewritten_text text not null,
  mood text null,
  unlock_date timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  constraint memories_pkey primary key (id),
  constraint memories_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
);

-- Enable Row Level Security (RLS)
alter table public.memories enable row level security;

-- Create Policy: Users can insert their own memories
create policy "Users can insert their own memories"
on public.memories
for insert
to authenticated
with check (auth.uid() = user_id);

-- Create Policy: Users can view their own memories
create policy "Users can view their own memories"
on public.memories
for select
to authenticated
using (auth.uid() = user_id);
