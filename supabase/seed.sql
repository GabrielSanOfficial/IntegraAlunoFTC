
-- Dados iniciais de teste.
-- Execute DEPOIS do schema.sql.
-- Pode executar mais de uma vez.

insert into public.turmas (id,codigo,nome,periodo)
values ('00000000-0000-0000-0000-000000000001','FTC-2026-1','FTC — Turma 2026/1','2026/1')
on conflict (id) do update set codigo=excluded.codigo,nome=excluded.nome,periodo=excluded.periodo;

insert into public.materias (id,turma_id,nome,professor,dia_semana,horario,cor,resumo,topicos)
values
('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Algoritmos e Estrutura de Dados','Prof. Ricardo Aveline','Segunda-feira','08:00 – 10:00','var(--color-subj-1)','Fundamentos de estruturas de dados e análise de complexidade.','{"Complexidade Big O","Árvores binárias","Ordenação (quicksort, mergesort)"}'),
('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','Banco de Dados','Profa. Helena Duque','Terça-feira','10:00 – 12:00','var(--color-subj-2)','Modelagem relacional, normalização e SQL avançado.','{"Modelo Entidade-Relacionamento","Normalização (1FN–3FN)","JOINs e subqueries"}'),
('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','Engenharia de Software','Prof. Diego Kastelic','Quarta-feira','14:00 – 16:00','var(--color-subj-3)','Ciclo de vida de software, metodologias ágeis e arquitetura.','{"Scrum e Kanban","Princípios SOLID","Testes automatizados"}'),
('10000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000001','Redes de Computadores','Prof. Tiago Salum','Quinta-feira','08:00 – 10:00','var(--color-subj-4)','Modelo OSI/TCP-IP, protocolos e fundamentos de infraestrutura.','{"Camadas OSI","TCP vs UDP","Roteamento e sub-redes"}')
on conflict (id) do update set nome=excluded.nome,professor=excluded.professor,dia_semana=excluded.dia_semana,horario=excluded.horario,cor=excluded.cor,resumo=excluded.resumo,topicos=excluded.topicos;

insert into public.aulas (id,materia_id,data,titulo,status)
values
('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','2026-07-27','Introdução a árvores binárias','pronta'),
('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','2026-08-03','Balanceamento (AVL)','pronta'),
('20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','2026-08-10','Grafos — introdução','pendente'),
('20000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000002','2026-07-28','Normalização 1FN a 3FN','pronta'),
('20000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000002','2026-08-04','JOINs complexos','pronta'),
('20000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000003','2026-07-29','Cerimônias do Scrum','pronta'),
('20000000-0000-0000-0000-000000000007','10000000-0000-0000-0000-000000000004','2026-07-30','Modelo OSI','pronta'),
('20000000-0000-0000-0000-000000000008','10000000-0000-0000-0000-000000000004','2026-08-06','TCP vs UDP','processando')
on conflict (id) do update set titulo=excluded.titulo,status=excluded.status;

insert into public.entregas (id,materia_id,tipo,titulo,data)
values
('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','atividade','Lista de exercícios AVL','2026-08-09'),
('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','prova','P2 — Árvores e Grafos','2026-08-14'),
('30000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000002','trabalho','Modelagem do projeto final','2026-08-11'),
('30000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000002','prova','P2 — Consultas avançadas','2026-08-20'),
('30000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000003','atividade','Sprint review em grupo','2026-08-10'),
('30000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000004','prova','P2 — Camada de Transporte','2026-08-17'),
('30000000-0000-0000-0000-000000000007','10000000-0000-0000-0000-000000000004','trabalho','Relatório de sub-redes','2026-08-21')
on conflict (id) do nothing;
