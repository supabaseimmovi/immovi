-- Remove exposição pública direta; leads devem entrar pela API Next validada.
drop policy if exists "insert_publico" on public.leads_immovi;
drop policy if exists "select_bloqueado" on public.leads_immovi;

revoke select, insert, update, delete on public.leads_immovi from anon, authenticated;
revoke select, insert, update, delete on public.leads_immovi_historico from anon, authenticated;
revoke select, insert, update, delete on public.crm_users from anon, authenticated;

grant select, insert, update, delete on public.leads_immovi to service_role;
grant select, insert, update, delete on public.leads_immovi_historico to service_role;
grant select, insert, update, delete on public.crm_users to service_role;

-- Constraints de integridade
alter table public.leads_immovi
  alter column status set not null,
  alter column origem set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_immovi_status_check'
      and conrelid = 'public.leads_immovi'::regclass
  ) then
    alter table public.leads_immovi
      add constraint leads_immovi_status_check
      check (status in (
        'Novo',
        'Em atendimento',
        'Consultoria agendada',
        'Proposta enviada',
        'Aguardando retorno',
        'Convertido',
        'Perdido'
      ));
  end if;
end $$;

alter table public.crm_users
  alter column role set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'crm_users_role_check'
      and conrelid = 'public.crm_users'::regclass
  ) then
    alter table public.crm_users
      add constraint crm_users_role_check
      check (role in ('admin', 'atendente', 'viewer'));
  end if;
end $$;

-- Tabela de sessões para revogação de JWT
create table if not exists public.crm_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.crm_users(id) on delete cascade,
  jti text unique not null,
  revoked_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

alter table public.crm_sessions enable row level security;
revoke select, insert, update, delete on public.crm_sessions from anon, authenticated;
grant select, insert, update, delete on public.crm_sessions to service_role;

-- Evita grants automaticos em objetos futuros criados por postgres no schema public.
alter default privileges for role postgres in schema public
  revoke select, insert, update, delete on tables from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke execute on functions from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke usage, select on sequences from anon, authenticated;
