# Supabase Database Setup

Run these SQL commands in your Supabase SQL Editor (Dashboard > SQL Editor)

## Step 1: Enable Extensions

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";
```

## Step 2: Create Tables

```sql
-- Profiles table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Interview sessions table
create table interview_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  category text not null,
  question text not null,
  recording_url text,
  transcript text,
  ai_analysis text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Interview reports table
create table interview_reports (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references interview_sessions on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  overall_score integer check (overall_score >= 0 and overall_score <= 100),
  speech_score integer check (speech_score >= 0 and speech_score <= 100),
  content_score integer check (content_score >= 0 and content_score <= 100),
  confidence_score integer check (confidence_score >= 0 and confidence_score <= 100),
  feedback text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## Step 3: Enable Row Level Security

```sql
-- Enable RLS on all tables
alter table profiles enable row level security;
alter table interview_sessions enable row level security;
alter table interview_reports enable row level security;
```

## Step 4: Create Security Policies

```sql
-- Profiles policies
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Interview sessions policies
create policy "Users can view own sessions"
  on interview_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on interview_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on interview_sessions for update
  using (auth.uid() = user_id);

-- Interview reports policies
create policy "Users can view own reports"
  on interview_reports for select
  using (auth.uid() = user_id);

create policy "Users can insert own reports"
  on interview_reports for insert
  with check (auth.uid() = user_id);
```

## Step 5: Create Triggers

```sql
-- Function to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call function on user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for profiles updated_at
create trigger on_profiles_updated
  before update on profiles
  for each row execute procedure public.handle_updated_at();
```

## Step 6: Create Indexes for Performance

```sql
-- Indexes for faster queries
create index interview_sessions_user_id_idx on interview_sessions(user_id);
create index interview_sessions_created_at_idx on interview_sessions(created_at desc);
create index interview_reports_user_id_idx on interview_reports(user_id);
create index interview_reports_session_id_idx on interview_reports(session_id);
create index interview_reports_created_at_idx on interview_reports(created_at desc);
```

## Step 7: Optional - Insert Sample Data

```sql
-- This will only work after you've created a user through the app
-- Replace 'your-user-id' with actual user ID from auth.users table

-- Sample interview session
insert into interview_sessions (user_id, category, question, transcript)
values (
  'your-user-id',
  'Behavioral Interviews',
  'Tell me about a time when you had to work under pressure.',
  'Sample transcript of the interview response...'
);

-- Sample report (use actual session_id from previous insert)
insert into interview_reports (session_id, user_id, overall_score, speech_score, content_score, confidence_score, feedback)
values (
  'session-id-here',
  'your-user-id',
  85,
  88,
  82,
  86,
  'Great job! Your response was well-structured. Consider speaking a bit slower for better clarity.'
);
```

## Verify Setup

Run this query to check if everything is set up correctly:

```sql
-- Check tables exist
select table_name 
from information_schema.tables 
where table_schema = 'public' 
order by table_name;

-- Check policies exist
select schemaname, tablename, policyname 
from pg_policies 
where schemaname = 'public';
```

## Storage Setup (Optional - for video recordings)

If you want to store video recordings in Supabase:

1. Go to Storage in Supabase Dashboard
2. Create a new bucket called `interview-recordings`
3. Set it to Public or Private (recommended: Private)
4. Add policy:

```sql
-- Policy for interview recordings bucket
create policy "Users can upload own recordings"
on storage.objects for insert
with check (
  bucket_id = 'interview-recordings' and
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can view own recordings"
on storage.objects for select
using (
  bucket_id = 'interview-recordings' and
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Done! 🎉

Your Supabase database is now ready for the Interview Master app.
