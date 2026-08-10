
-- IntegraAlunoFTC / Supabase
-- Execute este arquivo INTEIRO no SQL Editor do Supabase.
-- A chave service_role NUNCA deve ir para o GitHub Pages.

create extension if not exists pgcrypto;

create table if not exists public.turmas (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null,
  nome text not null,
  periodo text,
  created_at timestamptz not null default now()
);

create table if not exists public.perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  turma_id uuid references public.turmas(id) on delete set null,
  papel text not null default 'aluno' check (papel in ('aluno','monitor','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.materias (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid not null references public.turmas(id) on delete cascade,
  nome text not null,
  professor text,
  dia_semana text,
  horario text,
  cor text default 'var(--color-subj-1)',
  resumo text,
  topicos text[] default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.aulas (
  id uuid primary key default gen_random_uuid(),
  materia_id uuid not null references public.materias(id) on delete cascade,
  data date not null,
  titulo text not null,
  status text not null default 'pronta' check (status in ('pendente','processando','pronta')),
  created_at timestamptz not null default now(),
  unique(materia_id,data)
);

create table if not exists public.entregas (
  id uuid primary key default gen_random_uuid(),
  materia_id uuid not null references public.materias(id) on delete cascade,
  tipo text not null default 'atividade',
  titulo text not null,
  data date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.anotacoes (
  id uuid primary key default gen_random_uuid(),
  aula_id uuid not null references public.aulas(id) on delete cascade,
  usuario_id uuid not null references auth.users(id) on delete cascade,
  texto_original text not null,
  texto_organizado_ia text,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.arquivos (
  id uuid primary key default gen_random_uuid(),
  aula_id uuid references public.aulas(id) on delete set null,
  materia_id uuid not null references public.materias(id) on delete cascade,
  enviado_por uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  tipo text not null,
  mime_type text,
  tamanho bigint,
  storage_path text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists idx_materias_turma on public.materias(turma_id);
create index if not exists idx_aulas_materia_data on public.aulas(materia_id,data);
create index if not exists idx_entregas_materia_data on public.entregas(materia_id,data);
create index if not exists idx_anotacoes_aula on public.anotacoes(aula_id);
create index if not exists idx_arquivos_materia on public.arquivos(materia_id);

-- Helpers para RLS.
create or replace function public.is_member_of_turma(target_turma uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfis p
    where p.id = auth.uid() and p.turma_id = target_turma
  );
$$;

create or replace function public.is_admin_or_monitor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfis p
    where p.id = auth.uid() and p.papel in ('admin','monitor')
  );
$$;

-- Cria o perfil automaticamente no cadastro.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  turma_codigo text;
  turma_encontrada uuid;
  nome_usuario text;
begin
  turma_codigo := nullif(trim(coalesce(new.raw_user_meta_data->>'turma_codigo','')), '');
  nome_usuario := coalesce(nullif(trim(new.raw_user_meta_data->>'nome'),''), split_part(coalesce(new.email,''),'@',1));

  if turma_codigo is not null then
    select id into turma_encontrada from public.turmas where upper(codigo) = upper(turma_codigo) limit 1;
  end if;

  insert into public.perfis(id,nome,turma_id)
  values(new.id,nome_usuario,turma_encontrada)
  on conflict (id) do update
  set nome=excluded.nome, turma_id=coalesce(excluded.turma_id, public.perfis.turma_id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.turmas enable row level security;
alter table public.perfis enable row level security;
alter table public.materias enable row level security;
alter table public.aulas enable row level security;
alter table public.entregas enable row level security;
alter table public.anotacoes enable row level security;
alter table public.arquivos enable row level security;

-- Recriação segura das policies (permite executar o SQL mais de uma vez).
do $$
begin
  drop policy if exists "turmas_select_member" on public.turmas;
  drop policy if exists "perfis_select_self" on public.perfis;
  drop policy if exists "perfis_update_self" on public.perfis;
  drop policy if exists "materias_select_member" on public.materias;
  drop policy if exists "materias_write_staff" on public.materias;
  drop policy if exists "aulas_select_member" on public.aulas;
  drop policy if exists "aulas_write_staff" on public.aulas;
  drop policy if exists "entregas_select_member" on public.entregas;
  drop policy if exists "entregas_write_staff" on public.entregas;
  drop policy if exists "anotacoes_select_member" on public.anotacoes;
  drop policy if exists "anotacoes_insert_self" on public.anotacoes;
  drop policy if exists "anotacoes_update_self" on public.anotacoes;
  drop policy if exists "anotacoes_delete_self" on public.anotacoes;
  drop policy if exists "arquivos_select_member" on public.arquivos;
  drop policy if exists "arquivos_insert_self" on public.arquivos;
  drop policy if exists "arquivos_delete_self" on public.arquivos;
end $$;

create policy "turmas_select_member" on public.turmas
for select to authenticated
using (public.is_member_of_turma(id));

create policy "perfis_select_self" on public.perfis
for select to authenticated
using (id = auth.uid());

create policy "perfis_update_self" on public.perfis
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "materias_select_member" on public.materias
for select to authenticated
using (public.is_member_of_turma(turma_id));

create policy "materias_write_staff" on public.materias
for all to authenticated
using (public.is_member_of_turma(turma_id) and public.is_admin_or_monitor())
with check (public.is_member_of_turma(turma_id) and public.is_admin_or_monitor());

create policy "aulas_select_member" on public.aulas
for select to authenticated
using (exists (
  select 1 from public.materias m
  where m.id = aulas.materia_id and public.is_member_of_turma(m.turma_id)
));

create policy "aulas_write_staff" on public.aulas
for all to authenticated
using (exists (
  select 1 from public.materias m
  where m.id = aulas.materia_id and public.is_member_of_turma(m.turma_id) and public.is_admin_or_monitor()
))
with check (exists (
  select 1 from public.materias m
  where m.id = aulas.materia_id and public.is_member_of_turma(m.turma_id) and public.is_admin_or_monitor()
));

create policy "entregas_select_member" on public.entregas
for select to authenticated
using (exists (
  select 1 from public.materias m
  where m.id = entregas.materia_id and public.is_member_of_turma(m.turma_id)
));

create policy "entregas_write_staff" on public.entregas
for all to authenticated
using (exists (
  select 1 from public.materias m
  where m.id = entregas.materia_id and public.is_member_of_turma(m.turma_id) and public.is_admin_or_monitor()
))
with check (exists (
  select 1 from public.materias m
  where m.id = entregas.materia_id and public.is_member_of_turma(m.turma_id) and public.is_admin_or_monitor()
));

create policy "anotacoes_select_member" on public.anotacoes
for select to authenticated
using (exists (
  select 1 from public.aulas a
  join public.materias m on m.id = a.materia_id
  where a.id = anotacoes.aula_id and public.is_member_of_turma(m.turma_id)
));

create policy "anotacoes_insert_self" on public.anotacoes
for insert to authenticated
with check (
  usuario_id = auth.uid()
  and exists (
    select 1 from public.aulas a
    join public.materias m on m.id = a.materia_id
    where a.id = anotacoes.aula_id and public.is_member_of_turma(m.turma_id)
  )
);

create policy "anotacoes_update_self" on public.anotacoes
for update to authenticated
using (usuario_id = auth.uid())
with check (usuario_id = auth.uid());

create policy "anotacoes_delete_self" on public.anotacoes
for delete to authenticated
using (usuario_id = auth.uid());

create policy "arquivos_select_member" on public.arquivos
for select to authenticated
using (exists (
  select 1 from public.materias m
  where m.id = arquivos.materia_id and public.is_member_of_turma(m.turma_id)
));

create policy "arquivos_insert_self" on public.arquivos
for insert to authenticated
with check (
  enviado_por = auth.uid()
  and exists (
    select 1 from public.materias m
    where m.id = arquivos.materia_id and public.is_member_of_turma(m.turma_id)
  )
);

create policy "arquivos_delete_self" on public.arquivos
for delete to authenticated
using (enviado_por = auth.uid());

-- Realtime.
do $$
begin
  alter publication supabase_realtime add table public.materias;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.aulas;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.entregas;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.anotacoes;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.arquivos;
exception when duplicate_object then null;
end $$;

-- Storage privado para materiais.
insert into storage.buckets (id,name,public)
values ('materiais','materiais',false)
on conflict (id) do update set public=false;

drop policy if exists "materiais_storage_select" on storage.objects;
drop policy if exists "materiais_storage_insert" on storage.objects;
drop policy if exists "materiais_storage_delete" on storage.objects;

create policy "materiais_storage_select" on storage.objects
for select to authenticated
using (
  bucket_id = 'materiais'
  and public.is_member_of_turma((split_part(name,'/',1))::uuid)
);

create policy "materiais_storage_insert" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'materiais'
  and public.is_member_of_turma((split_part(name,'/',1))::uuid)
);

create policy "materiais_storage_delete" on storage.objects
for delete to authenticated
using (
  bucket_id = 'materiais'
  and owner_id = auth.uid()
);
