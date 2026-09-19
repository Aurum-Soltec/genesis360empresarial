begin;

-- 0007 used event + aggregate_id + timestamp as the outbox idempotency key.
-- Multiple state transitions in one PostgreSQL transaction share `now()`,
-- so later transitions could collide. Include the resulting status as part
-- of the event identity while preserving deterministic idempotency.
create or replace function private.emit_domain_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_json jsonb;
  old_json jsonb;
  v_tenant uuid;
  v_company uuid;
  v_id uuid;
  v_status text;
  v_old_status text;
  v_stamp text;
  v_event text := tg_argv[0];
  v_idempotency_key text;
begin
  row_json := to_jsonb(new);
  old_json := case when tg_op = 'UPDATE' then to_jsonb(old) else '{}'::jsonb end;

  v_tenant := (row_json ->> 'tenant_id')::uuid;
  v_company := nullif(row_json ->> 'company_id','')::uuid;
  v_id := (row_json ->> 'id')::uuid;
  v_status := coalesce(
    row_json ->> 'status',
    row_json ->> 'qualification_status',
    row_json ->> 'outcome_status'
  );
  v_old_status := coalesce(
    old_json ->> 'status',
    old_json ->> 'qualification_status',
    old_json ->> 'outcome_status'
  );
  v_stamp := case
    when tg_op = 'UPDATE' then statement_timestamp()::text
    else coalesce(
      row_json ->> 'recorded_at',
      row_json ->> 'created_at',
      statement_timestamp()::text
    )
  end;

  if tg_op = 'UPDATE' and v_old_status is not distinct from v_status then
    return new;
  end if;

  v_idempotency_key :=
    v_event || ':' ||
    v_id::text || ':' ||
    coalesce(v_status, 'NO_STATUS') || ':' ||
    v_stamp;

  insert into public.event_outbox(
    tenant_id,
    company_id,
    event_type,
    aggregate_type,
    aggregate_id,
    idempotency_key,
    payload
  )
  values (
    v_tenant,
    v_company,
    v_event,
    tg_table_name,
    v_id,
    v_idempotency_key,
    jsonb_strip_nulls(
      jsonb_build_object(
        'status', v_status,
        'previousStatus', v_old_status
      )
    )
  )
  on conflict (tenant_id, idempotency_key) do nothing;

  return new;
end
$$;

revoke all on function private.emit_domain_event()
from public, anon, authenticated;

commit;
