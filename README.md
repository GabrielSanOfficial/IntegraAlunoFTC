# StudyHub + Supabase

## Implantação
1. No Supabase, abra SQL Editor, cole `supabase/schema.sql` e execute.
2. No Table Editor, crie uma linha em `turmas`, por exemplo código `FTC-2026-1`.
3. Confira `config.js` com a URL e a chave publishable/anon do projeto.
4. Para importar usuários, copie `.env.example` para `.env`, preencha a service role apenas localmente, coloque `backlogusers.xlsx` na raiz e execute `npm install` e `npm run import-users`.
5. Nunca envie `.env`, a service role ou a planilha com senhas ao GitHub.
6. Envie os demais arquivos ao repositório e habilite GitHub Pages em Settings > Pages.
7. Entre com um usuário importado. No Table Editor, altere `perfis.papel` para `monitor` em quem poderá criar matérias, aulas e prazos.

## Teste mínimo
- Login.
- Monitor cria matéria.
- Aluno abre a matéria, salva anotação e envia arquivo.
- Segundo aluno da mesma turma visualiza o conteúdo.
- Usuário de outra turma não deve visualizar esses dados.

## Observação
O gerador atual usa os tópicos da matéria. Resumos por IA e perguntas baseadas no conteúdo exigem uma Edge Function e um provedor de IA, etapa posterior.
