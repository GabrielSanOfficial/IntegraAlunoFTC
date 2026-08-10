# IntegraAlunoFTC — versão Supabase

Esta versão substitui o `script.js` anterior que ainda funcionava com arrays locais.

## Estrutura

- `index.html` — página principal + CDN do Supabase
- `script.js` — autenticação, leitura/escrita no Supabase, Storage e Realtime
- `style.css` — seu visual original, com estilos adicionais de login/sistema
- `supabase/schema.sql` — banco, RLS, trigger de perfil, Realtime e Storage
- `supabase/seed.sql` — turma e dados iniciais de teste

## Ordem de instalação

### 1. Supabase
No projeto correto do Supabase:
1. SQL Editor
2. Execute `supabase/schema.sql` inteiro.
3. Depois execute `supabase/seed.sql` inteiro.
4. Em Authentication > Providers > Email, mantenha Email habilitado.
5. Para o primeiro teste, você pode desativar temporariamente a confirmação de e-mail em Authentication > Providers > Email.

### 2. GitHub Pages
Substitua no repositório:
- `index.html`
- `script.js`
- `style.css`

Mantenha exatamente os nomes dos arquivos.

### 3. Teste
Abra o site e clique em `Criar conta`.

Use:
- Código da turma: `FTC-2026-1`
- seu e-mail
- uma senha com pelo menos 6 caracteres

Depois do login, as matérias devem vir do banco, não de arrays locais.

## Importante
A chave que aparece em `script.js` é a chave pública/publishable. Ela pode ficar no frontend. Nunca coloque `service_role` no GitHub.

## O que já está conectado
- Supabase Auth
- Perfil do usuário
- Turma
- Matérias
- Aulas
- Entregas
- Anotações
- Upload para Supabase Storage
- Metadados de arquivos no PostgreSQL
- Realtime para alterações
- RLS por turma

A IA/RAG ainda não foi ligada. O botão de anotação salva o texto diretamente; a etapa seguinte pode usar Supabase Edge Functions para chamar a IA sem expor uma chave de API.
