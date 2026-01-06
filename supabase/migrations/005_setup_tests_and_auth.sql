-- Create tests table
create table tests (
  id uuid default gen_random_uuid() primary key,
  module text not null,
  title text not null,
  date timestamp with time zone not null,
  room text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table tests enable row level security;

-- Policies
create policy "Public tests are viewable by everyone"
  on tests for select
  using ( true );

create policy "Admins can insert tests"
  on tests for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can delete tests"
  on tests for delete
  using ( auth.role() = 'authenticated' );
