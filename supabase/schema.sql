create extension if not exists pgcrypto;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cv-uploads',
  'cv-uploads',
  false,
  4194304,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  customer_email text not null,
  customer_name text,
  package_slug text not null,
  package_name text not null,
  currency text not null,
  amount integer not null,
  status text not null default 'created',
  stripe_session_id text,
  stripe_payment_intent_id text,
  target_role text,
  target_company text,
  report_status text default 'not_started'
);

create table if not exists intake_submissions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  created_at timestamptz default now(),
  cv_text text,
  cv_file_name text,
  cv_file_type text,
  cv_file_size integer,
  cv_storage_bucket text,
  cv_storage_path text,
  target_role text,
  target_company text,
  job_advert_text text,
  top_achievements text,
  main_cv_concerns text
);

alter table if exists intake_submissions
  add column if not exists cv_file_type text,
  add column if not exists cv_file_size integer,
  add column if not exists cv_storage_bucket text,
  add column if not exists cv_storage_path text;

create table if not exists report_outputs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  created_at timestamptz default now(),
  package_slug text not null,
  target_role text,
  target_company text,
  report_json jsonb not null,
  report_text text,
  cv_draft_text text
);

create index if not exists orders_stripe_session_id_idx on orders (stripe_session_id);
create index if not exists orders_customer_email_idx on orders (customer_email);
create index if not exists intake_submissions_order_id_idx on intake_submissions (order_id);
create unique index if not exists report_outputs_order_id_unique_idx on report_outputs (order_id);
