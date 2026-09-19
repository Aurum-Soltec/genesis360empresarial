-- Local fixture catalog, not customer data or legal authorization.
insert into public.diagnostic_versions(version,status,content_hash,published_at)
values ('3.0','published','7d85eb57b399225400126d8d01341c19f66cfae9b0150e823e1337cbdcfc004d',now())
on conflict (version) do nothing;
-- Consent texts must be reviewed, hashed and activated by a controlled release.
-- There are deliberately no generic placeholder active consent versions here.
