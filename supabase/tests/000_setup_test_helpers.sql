-- Test-only helpers with no network or dbdev dependency.
-- Runs only in local/staging test databases. Never run against production.
create schema if not exists tests;

create or replace function tests.create_supabase_user(
  p_identifier text,
  p_email text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := gen_random_uuid();
begin
  insert into auth.users(
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) values (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    p_email,
    '',
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('test_identifier', p_identifier),
    now(),
    now()
  );
end
$$;

create or replace function tests.get_supabase_uid(p_identifier text)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select id
  from auth.users
  where raw_user_meta_data->>'test_identifier' = p_identifier
  order by created_at desc
  limit 1
$$;

create or replace function tests.authenticate_as(p_identifier text)
returns void
language plpgsql
as $$
declare
  v_user_id uuid := tests.get_supabase_uid(p_identifier);
begin
  if v_user_id is null then
    raise exception 'TEST_USER_NOT_FOUND';
  end if;
  perform set_config('request.jwt.claim.sub', v_user_id::text, true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);
  perform set_config(
    'request.jwt.claims',
    jsonb_build_object('sub', v_user_id, 'role', 'authenticated')::text,
    true
  );
  execute 'set local role authenticated';
end
$$;

create or replace function tests.authenticate_as_service_role()
returns void
language plpgsql
as $$
begin
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '', true);
  perform set_config('request.jwt.claim.role', 'service_role', true);
  perform set_config(
    'request.jwt.claims',
    jsonb_build_object('role', 'service_role')::text,
    true
  );
  execute 'set local role service_role';
end
$$;

create or replace function tests.rls_enabled(p_schema text)
returns text
language sql
as $$
  select ok(
    not exists (
      select 1
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = p_schema
        and c.relkind in ('r', 'p')
        and not c.relrowsecurity
    ),
    format('all tables in schema %s have RLS enabled', p_schema)
  )
$$;

revoke all on schema tests from public, anon, authenticated;
revoke all on all functions in schema tests from public, anon, authenticated;
grant usage on schema tests to anon, authenticated, service_role;
grant execute on all functions in schema tests to anon, authenticated, service_role;

select plan(1);
select pass('local Supabase test helpers installed without dbdev');
select * from finish();
