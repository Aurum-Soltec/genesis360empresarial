begin;

create table public.agent_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  agent_key text not null,
  role text not null,
  allowed_tools text[] not null default '{}',
  budget_cents integer not null check (budget_cents between 0 and 1000000),
  token_limit integer not null check (token_limit between 1 and 1000000),
  timeout_ms integer not null check (timeout_ms between 100 and 900000),
  concurrency_limit integer not null check (concurrency_limit between 1 and 100),
  circuit_breaker_failures integer not null default 3 check (circuit_breaker_failures between 1 and 100),
  provider text not null,
  model text not null,
  status text not null default 'disabled' check (status in ('disabled','evaluation','enabled')),
  created_at timestamptz not null default now(),
  unique(tenant_id, agent_key)
);

create table public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  agent_id uuid not null references public.agent_profiles(id) on delete restrict,
  correlation_id text not null,
  status text not null check (status in ('queued','running','succeeded','failed','denied','timed_out')),
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  cost_cents numeric(12,4) not null default 0 check (cost_cents >= 0),
  error_code text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

create index agent_runs_tenant_created_idx on public.agent_runs(tenant_id, created_at desc);
alter table public.agent_profiles enable row level security;
alter table public.agent_runs enable row level security;
revoke all on public.agent_profiles, public.agent_runs from anon, authenticated;

commit;
