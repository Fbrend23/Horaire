-- Create modules table
create table modules (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  room text,
  day integer not null, -- 0-6
  start_hour integer not null,
  start_minute integer not null,
  end_hour integer not null,
  end_minute integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create vacations table
create table vacations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  start_date date not null,
  end_date date, -- null can mean "forever" or just open ended, but usually not for vacations
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table modules enable row level security;
alter table vacations enable row level security;

-- Policies for Modules
create policy "Public modules are viewable by everyone"
  on modules for select using ( true );

create policy "Admins can insert modules"
  on modules for insert with check ( auth.role() = 'authenticated' );

create policy "Admins can update modules"
  on modules for update using ( auth.role() = 'authenticated' );

create policy "Admins can delete modules"
  on modules for delete using ( auth.role() = 'authenticated' );

-- Policies for Vacations
create policy "Public vacations are viewable by everyone"
  on vacations for select using ( true );

create policy "Admins can insert vacations"
  on vacations for insert with check ( auth.role() = 'authenticated' );

create policy "Admins can update vacations"
  on vacations for update using ( auth.role() = 'authenticated' );

create policy "Admins can delete vacations"
  on vacations for delete using ( auth.role() = 'authenticated' );
