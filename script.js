/* ==========================================================================
   StudyHub — script único (sem build, sem módulos, sem dependências além
   do cliente do Supabase carregado via CDN no index.html)
   ========================================================================== */

/* ---------------------------------------------------------------------
   1. CONFIGURAÇÃO DO SUPABASE
   As chaves abaixo são públicas por natureza (a "anon/publishable key" é
   feita para ser exposta no navegador) — quem protege seus dados de
   verdade é o Row Level Security (RLS), configurado no painel do
   Supabase. NUNCA coloque a "service_role key" aqui.
   --------------------------------------------------------------------- */
const SUPABASE_URL = "https://zknqnzikwzgckluyarxm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_5Y9y3MaWtMHd7TgUsdL9zg_qEYUk3PU";

const supabaseClient =
  SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

/* ---------------------------------------------------------------------
   2. USUÁRIO
   --------------------------------------------------------------------- */
const usuario = { nome: "Marina" };

/* ---------------------------------------------------------------------
   3. ESTADO POR SEMESTRE (dados de exemplo + persistência local)
   Cada semestre é um "bloco" isolado: tem suas próprias matérias, aulas,
   arquivos e anotações — como se fosse uma base de dados separada. Tudo
   fica salvo no localStorage, então criar um semestre novo ou adicionar
   uma matéria sobrevive a um F5. Quando o Supabase for conectado de
   verdade, cada semestre vira uma linha da tabela "turmas"/"semestres" e
   os filtros passam a ser "where semestre_id = ...".
   --------------------------------------------------------------------- */
const STORAGE_KEY = "studyhub_state_v1";

function semestrePadrao() {
  return {
    id: "sem-2026-1",
    nome: "2026.1",
    materias: [
      {
        id: "algoritmos",
        nome: "Algoritmos e Estrutura de Dados",
        professor: "Prof. Ricardo Aveline",
        diaSemana: "Segunda-feira",
        horario: "08:00 – 10:00",
        cor: "var(--color-subj-1)",
        resumo: "Fundamentos de estruturas de dados (listas, pilhas, filas, árvores) e análise de complexidade de algoritmos.",
        topicos: ["Complexidade Big O", "Árvores binárias", "Ordenação (quicksort, mergesort)"],
        entregas: [
          { tipo: "atividade", titulo: "Lista de exercícios AVL", data: "2026-08-09" },
          { tipo: "prova", titulo: "P2 — Árvores e Grafos", data: "2026-08-14" },
        ],
      },
      {
        id: "banco-de-dados",
        nome: "Banco de Dados",
        professor: "Profa. Helena Duque",
        diaSemana: "Terça-feira",
        horario: "10:00 – 12:00",
        cor: "var(--color-subj-2)",
        resumo: "Modelagem relacional, normalização, SQL avançado e introdução a bancos NoSQL.",
        topicos: ["Modelo Entidade-Relacionamento", "Normalização (1FN–3FN)", "JOINs e subqueries"],
        entregas: [
          { tipo: "trabalho", titulo: "Modelagem do projeto final", data: "2026-08-11" },
          { tipo: "prova", titulo: "P2 — Consultas avançadas", data: "2026-08-20" },
        ],
      },
      {
        id: "engenharia-software",
        nome: "Engenharia de Software",
        professor: "Prof. Diego Kastelic",
        diaSemana: "Quarta-feira",
        horario: "14:00 – 16:00",
        cor: "var(--color-subj-3)",
        resumo: "Ciclo de vida de software, metodologias ágeis e princípios de arquitetura.",
        topicos: ["Scrum e Kanban", "Princípios SOLID", "Testes automatizados"],
        entregas: [{ tipo: "atividade", titulo: "Sprint review em grupo", data: "2026-08-10" }],
      },
      {
        id: "redes",
        nome: "Redes de Computadores",
        professor: "Prof. Tiago Salum",
        diaSemana: "Quinta-feira",
        horario: "08:00 – 10:00",
        cor: "var(--color-subj-4)",
        resumo: "Modelo OSI/TCP-IP, protocolos de rede e fundamentos de infraestrutura.",
        topicos: ["Camadas OSI", "TCP vs UDP", "Roteamento e sub-redes"],
        entregas: [
          { tipo: "prova", titulo: "P2 — Camada de Transporte", data: "2026-08-17" },
          { tipo: "trabalho", titulo: "Relatório de sub-redes", data: "2026-08-21" },
        ],
      },
    ],
    aulasPorMateria: {
      algoritmos: [
        { id: "a1", data: "2026-07-27", titulo: "Introdução a árvores binárias", status: "pronta" },
        { id: "a2", data: "2026-08-03", titulo: "Balanceamento (AVL)", status: "pronta" },
        { id: "a3", data: "2026-08-10", titulo: "Grafos — introdução", status: "pendente" },
      ],
      "banco-de-dados": [
        { id: "b1", data: "2026-07-28", titulo: "Normalização 1FN a 3FN", status: "pronta" },
        { id: "b2", data: "2026-08-04", titulo: "JOINs complexos", status: "pronta" },
      ],
      "engenharia-software": [{ id: "e1", data: "2026-07-29", titulo: "Cerimônias do Scrum", status: "pronta" }],
      redes: [
        { id: "r1", data: "2026-07-30", titulo: "Modelo OSI", status: "pronta" },
        { id: "r2", data: "2026-08-06", titulo: "TCP vs UDP", status: "processando" },
      ],
    },
    arquivosPorMateria: {
      algoritmos: [
        { id: "f1", nome: "aula07-arvores.pptx", tipo: "pptx", enviadoPor: "Marina", data: "2026-07-27" },
        { id: "f2", nome: "lista-exercicios-avl.docx", tipo: "docx", enviadoPor: "João", data: "2026-08-03" },
        { id: "f3", nome: "resumo-complexidade.txt", tipo: "txt", enviadoPor: "Marina", data: "2026-07-20" },
      ],
      "banco-de-dados": [
        { id: "f4", nome: "modelo-er-projeto.xlsx", tipo: "xlsx", enviadoPor: "Carla", data: "2026-08-01" },
        { id: "f5", nome: "slides-normalizacao.pptx", tipo: "pptx", enviadoPor: "Pedro", data: "2026-07-28" },
      ],
      "engenharia-software": [{ id: "f6", nome: "guia-scrum.docx", tipo: "docx", enviadoPor: "Marina", data: "2026-07-29" }],
      redes: [{ id: "f7", nome: "camadas-osi.pptx", tipo: "pptx", enviadoPor: "João", data: "2026-07-30" }],
    },
    anotacoesPorMateria: {
      algoritmos: [
        {
          id: "n1",
          usuario: "João",
          data: "2026-08-03",
          textoOrganizado:
            "Árvore AVL é uma árvore binária de busca autobalanceada. Fator de balanceamento de cada nó deve estar entre -1 e 1. Rotações simples e duplas são usadas para rebalancear após inserção/remoção.",
        },
      ],
    },
  };
}

function estadoPadrao() {
  return { semestres: [semestrePadrao()], semestreAtualId: "sem-2026-1" };
}

function carregarEstado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.semestres) && parsed.semestres.length) return parsed;
    }
  } catch (e) {
    console.warn("Não foi possível ler o estado salvo, usando dados padrão.", e);
  }
  return estadoPadrao();
}

let appState = carregarEstado();

function salvarEstado() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.warn("Não foi possível salvar o estado localmente.", e);
  }
}

function getSemestreAtual() {
  return appState.semestres.find((s) => s.id === appState.semestreAtualId) || appState.semestres[0];
}

function materiasAtuais() {
  return getSemestreAtual().materias;
}
function aulasDe(materiaId) {
  return getSemestreAtual().aulasPorMateria[materiaId] || [];
}
function arquivosDe(materiaId) {
  return getSemestreAtual().arquivosPorMateria[materiaId] || [];
}
function anotacoesDe(materiaId) {
  const sem = getSemestreAtual();
  if (!sem.anotacoesPorMateria[materiaId]) sem.anotacoesPorMateria[materiaId] = [];
  return sem.anotacoesPorMateria[materiaId];
}

function registrarAnotacao(materiaId, texto) {
  const lista = anotacoesDe(materiaId);
  lista.unshift({
    id: "local-" + Date.now(),
    usuario: "Você",
    data: new Date().toISOString().slice(0, 10),
    textoOrganizado: texto,
  });
  salvarEstado();
}

function slugify(texto) {
  return texto
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function idUnicoDeMateria(base) {
  const existentes = materiasAtuais().map((m) => m.id);
  let id = base || "materia";
  let i = 2;
  while (existentes.includes(id)) id = `${base}-${i++}`;
  return id;
}

function adicionarMateria(dados) {
  const sem = getSemestreAtual();
  const id = idUnicoDeMateria(slugify(dados.nome) || "materia");
  sem.materias.push({ ...dados, id, entregas: dados.entregas || [] });
  sem.aulasPorMateria[id] = [];
  sem.arquivosPorMateria[id] = [];
  sem.anotacoesPorMateria[id] = [];
  salvarEstado();
  return id;
}

function criarNovoSemestre(nome) {
  const id = "sem-" + Date.now();
  appState.semestres.push({ id, nome, materias: [], aulasPorMateria: {}, arquivosPorMateria: {}, anotacoesPorMateria: {} });
  appState.semestreAtualId = id;
  salvarEstado();
  return id;
}

function trocarSemestre(id) {
  appState.semestreAtualId = id;
  salvarEstado();
}

// Retorna a próxima entrega (data mais próxima, priorizando futuras) de uma matéria.
function getProximaEntrega(materia) {
  if (!materia.entregas || !materia.entregas.length) return null;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const ordenadas = [...materia.entregas].sort((a, b) => a.data.localeCompare(b.data));
  const futuras = ordenadas.filter((e) => new Date(e.data + "T00:00:00") >= hoje);
  return futuras[0] || ordenadas[ordenadas.length - 1];
}

const tiposDeArquivoLabel = { pptx: "Slides", docx: "Documentos", xlsx: "Planilhas", txt: "Textos", pdf: "PDFs" };

/* ---------------------------------------------------------------------
   4. ÍCONES (SVG inline, sem dependência externa)
   --------------------------------------------------------------------- */
const ICON_PATHS = {
  alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6"/><path d="M9 16h6"/>',
  arrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  arrowLeft: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  paperclip: '<path d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  sparkles: '<path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="M5.6 5.6l2.8 2.8"/><path d="M15.6 15.6l2.8 2.8"/><path d="M18.4 5.6l-2.8 2.8"/><path d="M8.4 15.6l-2.8 2.8"/>',
  loader: '<line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.9" y1="4.9" x2="7.8" y2="7.8"/><line x1="16.2" y1="16.2" x2="19.1" y2="19.1"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.9" y1="19.1" x2="7.8" y2="16.2"/><line x1="16.2" y1="7.8" x2="19.1" y2="4.9"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/>',
  presentation: '<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M12 17v4"/><path d="M8 21h8"/>',
  sheet: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
  cap: '<path d="M22 10L12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  panelClose: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><path d="M14 9l-2 3 2 3"/>',
  panelOpen: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><path d="M13 9l2 3-2 3"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
};

function icon(name, size = 16, extraClass = "") {
  const p = ICON_PATHS[name] || "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${extraClass}">${p}</svg>`;
}

/* ---------------------------------------------------------------------
   5. HELPERS DE DATA
   --------------------------------------------------------------------- */
function formatarDataCurta(iso) {
  const [, mes, dia] = iso.split("-");
  return `${dia}/${mes}`;
}
function formatarDataLonga(iso) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

/* ---------------------------------------------------------------------
   6. ROUTER (baseado em hash, ex: #/materia/algoritmos)
   --------------------------------------------------------------------- */
const routes = [];
let renderRotaAtual = () => {};

function addRoute(pattern, render) {
  const paramNames = [];
  const regex = new RegExp(
    "^" +
      pattern
        .split("/")
        .map((seg) => {
          if (seg.startsWith(":")) {
            paramNames.push(seg.slice(1));
            return "([^/]+)";
          }
          return seg;
        })
        .join("/") +
      "$"
  );
  routes.push({ regex, paramNames, render });
}

function currentPath() {
  const hash = window.location.hash.slice(1) || "/";
  const [path] = hash.split("?");
  return path || "/";
}

function navigate(path) {
  window.location.hash = path;
}

function getQueryParam(name) {
  const hash = window.location.hash.slice(1);
  const [, query] = hash.split("?");
  const params = new URLSearchParams(query || "");
  return params.get(name);
}

function startRouter(container) {
  function render() {
    const path = currentPath();
    for (const route of routes) {
      const match = path.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, i) => (params[name] = match[i + 1]));
        container.innerHTML = "";
        window.scrollTo(0, 0);
        route.render(container, params);
        return;
      }
    }
    container.innerHTML = `<div class="page"><p class="empty-note">Página não encontrada.</p></div>`;
  }
  renderRotaAtual = render;
  window.addEventListener("hashchange", render);
  render();
}

// Chamado depois de trocar/criar semestre ou adicionar matéria: re-renderiza
// a rota atual sem navegar para outra página.
function rerenderApp() {
  renderSidebar(document.getElementById("sidebar"));
  renderRotaAtual();
}

/* ---------------------------------------------------------------------
   7. SIDEBAR (navegação + seletor de semestre)
   --------------------------------------------------------------------- */
const navLinks = [
  { to: "/", label: "Início", iconName: "grid" },
  { to: "/materias", label: "Matérias", iconName: "book" },
  { to: "/simulados", label: "Simular provas", iconName: "cap" },
  { to: "/minha-area", label: "Minha área", iconName: "user" },
];

let sidebarOpen = true;

function renderSidebar(el) {
  const path = currentPath();
  el.className = "sidebar" + (sidebarOpen ? "" : " collapsed");
  const semestreAtual = getSemestreAtual();

  el.innerHTML = `
    <div class="sidebar-header">
      <div class="avatar">${usuario.nome.charAt(0)}</div>
      ${
        sidebarOpen
          ? `<div>
              <p class="sidebar-user-label">Bem-vindo(a),</p>
              <p class="sidebar-user-name">${usuario.nome}</p>
            </div>`
          : ""
      }
    </div>

    ${
      sidebarOpen
        ? `<div class="sidebar-semester">
            <label class="sidebar-semester-label">${icon("layers", 13)} Semestre</label>
            <div class="sidebar-semester-row">
              <select id="semester-select" class="semester-select">
                ${appState.semestres
                  .map((s) => `<option value="${s.id}" ${s.id === semestreAtual.id ? "selected" : ""}>${s.nome}</option>`)
                  .join("")}
              </select>
              <button id="btn-novo-semestre" class="semester-add-btn" title="Criar novo semestre">${icon("plus", 15)}</button>
            </div>
          </div>`
        : `<button id="btn-novo-semestre-collapsed" class="semester-add-btn-collapsed" title="Criar novo semestre">${icon("plus", 16)}</button>`
    }

    <nav class="sidebar-nav">
      ${navLinks
        .map(({ to, label, iconName }) => {
          const isActive = to === "/" ? path === "/" : path.startsWith(to);
          return `<a href="#${to}" class="nav-link${isActive ? " active" : ""}">
            ${icon(iconName, 18)}
            ${sidebarOpen ? `<span>${label}</span>` : ""}
          </a>`;
        })
        .join("")}
    </nav>
    <button class="sidebar-toggle" id="sidebar-toggle-btn">
      ${icon(sidebarOpen ? "panelClose" : "panelOpen", 18)}
      ${sidebarOpen ? "<span>Recolher</span>" : ""}
    </button>
  `;

  el.querySelector("#sidebar-toggle-btn").addEventListener("click", () => {
    sidebarOpen = !sidebarOpen;
    renderSidebar(el);
  });

  const select = el.querySelector("#semester-select");
  if (select) {
    select.addEventListener("change", (e) => {
      trocarSemestre(e.target.value);
      navigate("/");
      rerenderApp();
    });
  }

  const btnNovo = el.querySelector("#btn-novo-semestre") || el.querySelector("#btn-novo-semestre-collapsed");
  if (btnNovo) {
    btnNovo.addEventListener("click", () => {
      const nome = window.prompt("Nome do novo semestre (ex: 2026.2):");
      if (!nome || !nome.trim()) return;
      criarNovoSemestre(nome.trim());
      navigate("/materias");
      rerenderApp();
    });
  }
}

/* ---------------------------------------------------------------------
   8. COMPONENTE: card de matéria
   --------------------------------------------------------------------- */
function subjectCardHtml(materia) {
  const entrega = getProximaEntrega(materia);
  const eProva = entrega?.tipo === "prova";
  return `
    <button class="subject-card corner-fold" style="--fold-color:${materia.cor}" data-navigate="/materia/${materia.id}">
      <div class="meta-row">
        <span class="dot" style="background:${materia.cor}"></span>
        <span class="mono-label">${materia.diaSemana} · ${materia.horario}</span>
      </div>
      <div>
        <h3>${materia.nome}</h3>
        <p class="professor">${materia.professor}</p>
      </div>
      <p class="resumo">${materia.resumo || "Sem resumo ainda."}</p>
      ${
        entrega
          ? `<div class="badge ${eProva ? "badge-prova" : "badge-entrega"}">
              ${icon(eProva ? "alert" : "clipboard", 14)}
              <span>${eProva ? "Prova" : "Entrega"} · ${entrega.titulo} em ${formatarDataCurta(entrega.data)}</span>
            </div>`
          : ""
      }
    </button>
  `;
}

/* ---------------------------------------------------------------------
   9. LINHA DO TEMPO DE ENTREGAS (tabela na Home)
   --------------------------------------------------------------------- */
const TIMELINE_DIAS = 16; // janela de dias exibida, a partir de hoje

function toIsoLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function gerarJanelaDeDias(qtd) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dias = [];
  for (let i = 0; i < qtd; i++) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() + i);
    dias.push(d);
  }
  return dias;
}

const DIAS_ABREV = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function timelineTableHtml() {
  const materias = materiasAtuais();
  if (!materias.length) {
    return `
      <section>
        <div class="section-header"><h2 class="h2">Linha do tempo de entregas</h2></div>
        <p class="empty-note">Adicione matérias a este semestre para ver as entregas na linha do tempo.</p>
      </section>
    `;
  }

  const dias = gerarJanelaDeDias(TIMELINE_DIAS);
  const isoHoje = toIsoLocal(new Date());

  const headerCells = dias
    .map((d) => {
      const iso = toIsoLocal(d);
      const isHoje = iso === isoHoje;
      return `<th class="timeline-day${isHoje ? " today" : ""}">
        <span class="dow">${DIAS_ABREV[d.getDay()]}</span>
        <span class="dnum">${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}</span>
      </th>`;
    })
    .join("");

  const bodyRows = materias
    .map((m) => {
      const cells = dias
        .map((d) => {
          const iso = toIsoLocal(d);
          const isHoje = iso === isoHoje;
          const entregasNoDia = (m.entregas || []).filter((e) => e.data === iso);
          return `<td class="timeline-cell${isHoje ? " is-today" : ""}">
            ${entregasNoDia
              .map((e) => {
                const eProva = e.tipo === "prova";
                return `<span class="timeline-marker ${eProva ? "prova" : "entrega"}" title="${e.titulo} — ${formatarDataLonga(e.data)}">
                  ${icon(eProva ? "alert" : "clipboard", 10)}
                </span>`;
              })
              .join("")}
          </td>`;
        })
        .join("");

      return `<tr>
        <td class="timeline-row-name"><span class="dot" style="background:${m.cor}"></span>${m.nome}</td>
        ${cells}
      </tr>`;
    })
    .join("");

  const isoLimite = toIsoLocal(dias[dias.length - 1]);
  const proximasNaJanela = materias
    .flatMap((m) => (m.entregas || []).filter((e) => e.data >= isoHoje && e.data <= isoLimite).map((e) => ({ ...e, materia: m.nome, cor: m.cor })))
    .sort((a, b) => a.data.localeCompare(b.data));

  return `
    <section>
      <div class="section-header">
        <h2 class="h2">Linha do tempo de entregas</h2>
        <span class="mono-label">próximos ${TIMELINE_DIAS} dias</span>
      </div>
      <div class="timeline-wrap">
        <table class="timeline-table">
          <thead><tr><th class="timeline-row-name"></th>${headerCells}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
      ${
        proximasNaJanela.length
          ? `<ul class="timeline-legend">
              ${proximasNaJanela
                .map(
                  (e) => `<li>
                    <span class="timeline-marker ${e.tipo === "prova" ? "prova" : "entrega"} static">${icon(e.tipo === "prova" ? "alert" : "clipboard", 10)}</span>
                    <strong>${formatarDataLonga(e.data)}</strong> — ${e.materia}: ${e.titulo}
                  </li>`
                )
                .join("")}
            </ul>`
          : `<p class="empty-note" style="margin-top:12px">Nenhuma entrega nos próximos ${TIMELINE_DIAS} dias.</p>`
      }
    </section>
  `;
}

/* ---------------------------------------------------------------------
   10. PÁGINA: Home
   --------------------------------------------------------------------- */
function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

function renderHome(container) {
  const semestreAtual = getSemestreAtual();
  const materias = materiasAtuais();
  const hoje = diasSemana[new Date().getDay()];
  const aulaDeHoje = materias.find((m) => m.diaSemana === hoje);
  const dataFormatada = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });

  container.innerHTML = `
    <div class="page">
      <section>
        <p class="date-label">${dataFormatada} · <span class="mono-label">semestre ${semestreAtual.nome}</span></p>
        <h1 class="h1">${saudacao()}, ${usuario.nome}.</h1>
        ${
          aulaDeHoje
            ? `<div class="today-banner corner-fold" style="--fold-color:${aulaDeHoje.cor}">
                <div>
                  <p class="label">Aula de hoje</p>
                  <p class="title">${aulaDeHoje.nome}</p>
                  <p class="sub">${aulaDeHoje.professor} · ${aulaDeHoje.horario}</p>
                </div>
                <button class="btn btn-accent" data-navigate="/materia/${aulaDeHoje.id}">
                  Ir para a matéria ${icon("arrowRight", 16)}
                </button>
              </div>`
            : `<div class="today-empty">Sem aula prevista para hoje. Aproveite para revisar uma matéria ou gerar um simulado.</div>`
        }
      </section>
      <section>
        <div class="section-header">
          <h2 class="h2">Suas matérias</h2>
          <a href="#/materias" class="btn-link">ver grade completa</a>
        </div>
        ${
          materias.length
            ? `<div class="subject-grid">${materias.map(subjectCardHtml).join("")}</div>`
            : `<p class="empty-note">Nenhuma matéria neste semestre ainda. <a href="#/materias" class="btn-link">Adicionar a primeira</a>.</p>`
        }
      </section>

      ${timelineTableHtml()}
    </div>
  `;
}

/* ---------------------------------------------------------------------
   11. PÁGINA: Matérias (grade completa + adicionar matéria)
   --------------------------------------------------------------------- */
let formNovaMateriaAberto = false;

function renderMaterias(container) {
  const semestreAtual = getSemestreAtual();
  const materias = materiasAtuais();

  container.innerHTML = `
    <div class="page">
      <div class="section-header" style="align-items:flex-start">
        <div>
          <h1 class="h1" style="font-size:30px">Grade de matérias</h1>
          <p class="empty-note" style="margin-top:4px">Semestre ${semestreAtual.nome} · clique em uma linha para abrir a matéria.</p>
        </div>
        <button class="btn btn-primary" id="btn-nova-materia">${icon("plus", 16)} Nova matéria</button>
      </div>

      <div id="form-nova-materia"></div>

      ${
        materias.length
          ? `<div class="table-wrap">
              <table>
                <thead><tr><th>Matéria</th><th>Professor</th><th>Horário</th><th>Próxima entrega</th></tr></thead>
                <tbody>
                  ${materias
                    .map((m) => {
                      const entrega = getProximaEntrega(m);
                      const eProva = entrega?.tipo === "prova";
                      return `
                        <tr data-navigate="/materia/${m.id}">
                          <td><div class="meta-row"><span class="dot" style="background:${m.cor}"></span><span class="nome">${m.nome}</span></div></td>
                          <td class="empty-note">${m.professor}</td>
                          <td class="mono-label">${m.diaSemana} · ${m.horario}</td>
                          <td>
                            ${
                              entrega
                                ? `<span class="badge ${eProva ? "badge-prova" : "badge-entrega"}">${icon(eProva ? "alert" : "clipboard", 12)} ${entrega.titulo} · ${formatarDataLonga(entrega.data)}</span>`
                                : `<span class="empty-note">—</span>`
                            }
                          </td>
                        </tr>`;
                    })
                    .join("")}
                </tbody>
              </table>
            </div>`
          : `<p class="empty-note">Nenhuma matéria neste semestre ainda. Clique em "Nova matéria" para começar.</p>`
      }
    </div>
  `;

  container.querySelector("#btn-nova-materia").addEventListener("click", () => {
    formNovaMateriaAberto = !formNovaMateriaAberto;
    renderFormNovaMateria(container.querySelector("#form-nova-materia"), container);
  });

  renderFormNovaMateria(container.querySelector("#form-nova-materia"), container);
}

const CORES_MATERIA = ["var(--color-subj-1)", "var(--color-subj-2)", "var(--color-subj-3)", "var(--color-subj-4)", "var(--color-subj-5)", "var(--color-subj-6)"];

function renderFormNovaMateria(el, container) {
  if (!formNovaMateriaAberto) {
    el.innerHTML = "";
    return;
  }

  el.innerHTML = `
    <div class="form-card" style="margin-bottom:8px">
      <div class="two-col">
        <div>
          <label class="field-label">Nome da matéria</label>
          <input type="text" class="field new-materia-field" id="nm-nome" placeholder="Ex: Cálculo II" />
        </div>
        <div>
          <label class="field-label">Professor(a)</label>
          <input type="text" class="field new-materia-field" id="nm-professor" placeholder="Ex: Prof. Marcos Lima" />
        </div>
        <div>
          <label class="field-label">Dia da semana</label>
          <select class="field new-materia-field" id="nm-dia">
            ${diasSemana
              .slice(1)
              .concat(diasSemana[0])
              .map((d) => `<option value="${d}">${d}</option>`)
              .join("")}
          </select>
        </div>
        <div>
          <label class="field-label">Horário</label>
          <input type="text" class="field new-materia-field" id="nm-horario" placeholder="Ex: 19:00 – 21:00" />
        </div>
      </div>
      <div>
        <label class="field-label">Resumo (opcional)</label>
        <textarea class="field" id="nm-resumo" rows="2" placeholder="Do que se trata a matéria..."></textarea>
      </div>
      <div>
        <label class="field-label">Tópicos (separados por vírgula, opcional)</label>
        <input type="text" class="field new-materia-field" id="nm-topicos" placeholder="Ex: Limites, Derivadas, Integrais" />
      </div>
      <div>
        <label class="field-label">Cor</label>
        <div class="color-swatches" id="nm-cores">
          ${CORES_MATERIA.map((c, i) => `<button type="button" class="color-swatch${i === 0 ? " active" : ""}" data-cor="${c}" style="background:${c}"></button>`).join("")}
        </div>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-accent" id="btn-salvar-materia">${icon("plus", 16)} Adicionar matéria</button>
        <button class="btn-ghost" id="btn-cancelar-materia">Cancelar</button>
      </div>
    </div>
  `;

  let corSelecionada = CORES_MATERIA[0];
  el.querySelectorAll(".color-swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      el.querySelectorAll(".color-swatch").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      corSelecionada = btn.dataset.cor;
    });
  });

  el.querySelector("#btn-cancelar-materia").addEventListener("click", () => {
    formNovaMateriaAberto = false;
    renderFormNovaMateria(el, container);
  });

  el.querySelector("#btn-salvar-materia").addEventListener("click", () => {
    const nome = el.querySelector("#nm-nome").value.trim();
    const professor = el.querySelector("#nm-professor").value.trim();
    const diaSemana = el.querySelector("#nm-dia").value;
    const horario = el.querySelector("#nm-horario").value.trim();
    const resumo = el.querySelector("#nm-resumo").value.trim();
    const topicos = el
      .querySelector("#nm-topicos")
      .value.split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (!nome) {
      el.querySelector("#nm-nome").focus();
      return;
    }

    adicionarMateria({ nome, professor: professor || "A definir", diaSemana, horario: horario || "A definir", resumo, topicos, cor: corSelecionada });
    formNovaMateriaAberto = false;
    renderMaterias(container);
  });
}

/* ---------------------------------------------------------------------
   12. PÁGINA: Matéria (anotações, upload, portfólio)
   --------------------------------------------------------------------- */
const ICONE_POR_TIPO = { pptx: "presentation", docx: "file", xlsx: "sheet", txt: "file", pdf: "file" };
const estadoMateria = {};

function getEstadoMateria(materiaId) {
  const chave = `${appState.semestreAtualId}:${materiaId}`;
  if (!estadoMateria[chave]) {
    estadoMateria[chave] = {
      aulaSelecionada: (aulasDe(materiaId) || [])[0]?.id ?? null,
      abaAtiva: "visao-geral",
    };
  }
  return estadoMateria[chave];
}

function renderMateria(container, params) {
  const materia = materiasAtuais().find((m) => m.id === params.id);

  if (!materia) {
    container.innerHTML = `
      <div class="page page-narrow" style="text-align:center;padding-top:64px">
        <p class="empty-note">Matéria não encontrada neste semestre.</p>
        <a href="#/" class="btn-link">Voltar para o início</a>
      </div>`;
    return;
  }

  const s = getEstadoMateria(materia.id);
  const aulas = aulasDe(materia.id);
  const arquivos = arquivosDe(materia.id);
  const arquivosPorTipo = {};
  arquivos.forEach((a) => {
    arquivosPorTipo[a.tipo] = arquivosPorTipo[a.tipo] || [];
    arquivosPorTipo[a.tipo].push(a);
  });

  container.innerHTML = `
    <div class="page">
      <button class="back-link" id="btn-voltar">${icon("arrowLeft", 15)} Voltar</button>
      <header class="materia-header corner-fold" style="--fold-color:${materia.cor}">
        <span class="mono-label">${materia.diaSemana} · ${materia.horario}</span>
        <h1>${materia.nome}</h1>
        <p class="professor">${materia.professor}</p>
        <p class="resumo">${materia.resumo || "Sem resumo ainda."}</p>
        <div class="chip-row">${(materia.topicos || []).map((t) => `<span class="chip">${t}</span>`).join("")}</div>
        ${(() => {
          const entrega = getProximaEntrega(materia);
          if (!entrega) return "";
          const eProva = entrega.tipo === "prova";
          return `<div class="entrega-flag ${eProva ? "badge-prova" : "badge-entrega"}">
                ${icon(eProva ? "alert" : "clipboard", 16)}
                Próxima ${eProva ? "prova" : "entrega"}: ${entrega.titulo} — ${formatarDataLonga(entrega.data)}
              </div>`;
        })()}
      </header>

      <section class="aula-selector-row">
        <div class="aula-pills">
          ${
            aulas.length
              ? aulas.map((a) => `<button class="aula-pill${a.id === s.aulaSelecionada ? " active" : ""}" data-aula="${a.id}">${formatarDataCurta(a.data)}${a.status === "processando" ? " · processando" : ""}</button>`).join("")
              : `<span class="empty-note">Nenhuma aula registrada ainda.</span>`
          }
        </div>
        <button class="btn btn-primary" id="btn-gerar-simulado">${icon("sparkles", 16)} Gerar simulado desta matéria</button>
      </section>

      <div class="tabs">
        <button class="tab${s.abaAtiva === "visao-geral" ? " active" : ""}" data-tab="visao-geral">Anotações &amp; upload</button>
        <button class="tab${s.abaAtiva === "portfolio" ? " active" : ""}" data-tab="portfolio">Portfólio de arquivos</button>
      </div>

      <div id="tab-content"></div>
    </div>
  `;

  container.querySelector("#btn-voltar").addEventListener("click", () => window.history.back());
  container.querySelector("#btn-gerar-simulado").addEventListener("click", () => navigate(`/simulados?materia=${materia.id}`));
  container.querySelectorAll(".aula-pill").forEach((btn) =>
    btn.addEventListener("click", () => {
      s.aulaSelecionada = btn.dataset.aula;
      renderMateria(container, params);
    })
  );
  container.querySelectorAll(".tab").forEach((btn) =>
    btn.addEventListener("click", () => {
      s.abaAtiva = btn.dataset.tab;
      renderMateria(container, params);
    })
  );

  const tabContent = container.querySelector("#tab-content");
  if (s.abaAtiva === "visao-geral") {
    renderAbaAnotacoes(tabContent, materia.id, arquivos);
  } else {
    renderAbaPortfolio(tabContent, arquivosPorTipo);
  }
}

function renderAbaAnotacoes(el, materiaId, arquivos) {
  el.innerHTML = `
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:12px">
        <h2 class="h3">${icon("pen", 18)} Anotações da turma</h2>
        <textarea class="field" id="rascunho" rows="4" placeholder="Escreva aqui o que anotou na aula. A IA vai organizar e integrar à base da matéria..."></textarea>
        <button class="btn btn-accent" id="btn-registrar" style="width:fit-content" disabled>${icon("sparkles", 16)} Registrar anotação</button>
        <div id="lista-anotacoes" style="display:flex;flex-direction:column;gap:12px;margin-top:8px"></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <h2 class="h3">${icon("paperclip", 18)} Anexar material da aula</h2>
        <label class="dropzone">
          ${icon("paperclip", 22)}
          <span class="hint">Arraste um arquivo ou clique para enviar</span>
          <span class="types">PPTX · DOCX · XLSX · TXT · PDF</span>
          <input type="file" style="display:none" accept=".pptx,.docx,.xlsx,.txt,.pdf" />
        </label>
        <h3 class="h3" style="font-size:14px;color:var(--color-ink-soft)">Enviados recentemente</h3>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${arquivos
            .slice(0, 4)
            .map(
              (arq) => `
            <div class="file-row">
              ${icon(ICONE_POR_TIPO[arq.tipo] || "file", 16)}
              <div style="min-width:0;flex:1">
                <p class="nome">${arq.nome}</p>
                <p class="info">${arq.enviadoPor} · ${formatarDataLonga(arq.data)}</p>
              </div>
            </div>`
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  const textarea = el.querySelector("#rascunho");
  const btnRegistrar = el.querySelector("#btn-registrar");
  const listaAnotacoes = el.querySelector("#lista-anotacoes");

  function desenharAnotacoes() {
    const anotacoes = anotacoesDe(materiaId);
    listaAnotacoes.innerHTML = anotacoes.length
      ? anotacoes
          .map(
            (n) => `
        <div class="note-card">
          <div class="top"><span class="autor">${n.usuario}</span><span class="data">${formatarDataLonga(n.data)}</span></div>
          <p>${n.textoOrganizado}</p>
        </div>`
          )
          .join("")
      : `<p class="empty-note">Nenhuma anotação ainda. Seja o primeiro.</p>`;
  }
  desenharAnotacoes();

  textarea.addEventListener("input", () => {
    btnRegistrar.disabled = !textarea.value.trim();
  });

  btnRegistrar.addEventListener("click", () => {
    const texto = textarea.value.trim();
    if (!texto) return;
    btnRegistrar.disabled = true;
    btnRegistrar.innerHTML = `${icon("loader", 16, "spin")} Organizando com IA...`;

    // Placeholder local do fluxo "anotação → IA organiza → salva". No
    // backend real isso vira uma chamada à Edge Function do Supabase.
    setTimeout(() => {
      registrarAnotacao(materiaId, texto);
      textarea.value = "";
      btnRegistrar.disabled = true;
      btnRegistrar.innerHTML = `${icon("sparkles", 16)} Registrar anotação`;
      desenharAnotacoes();
    }, 900);
  });
}

function renderAbaPortfolio(el, arquivosPorTipo) {
  const blocos = Object.keys(tiposDeArquivoLabel)
    .map((tipo) => {
      const lista = arquivosPorTipo[tipo] || [];
      if (!lista.length) return "";
      return `
        <div>
          <h3 class="h3" style="margin-bottom:12px">${icon(ICONE_POR_TIPO[tipo] || "file", 16)} ${tiposDeArquivoLabel[tipo]} <span class="mono-label" style="font-weight:400">(${lista.length})</span></h3>
          <div class="file-grid">
            ${lista
              .map(
                (arq) => `
              <div class="file-row">
                ${icon(ICONE_POR_TIPO[tipo] || "file", 16)}
                <div style="min-width:0"><p class="nome">${arq.nome}</p><p class="info">${formatarDataLonga(arq.data)}</p></div>
              </div>`
              )
              .join("")}
          </div>
        </div>`;
    })
    .join("");

  el.innerHTML = `<div style="display:flex;flex-direction:column;gap:24px">${blocos || `<p class="empty-note">Nenhum arquivo enviado ainda.</p>`}</div>`;
}

/* ---------------------------------------------------------------------
   13. PÁGINA: Simulados (prova completa, correção e PDF)
   --------------------------------------------------------------------- */

// Estado da prova em andamento. fase: "escolha" | "prova" | "resultado"
let provaState = { fase: "escolha", materiaId: null, questoes: null, respostas: {}, resultado: null };

function embaralhar(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function amostrar(array, n) {
  return embaralhar(array).slice(0, n);
}

const PROVA_FILLERS = [
  "Conteúdo ainda não abordado nesta matéria",
  "Tema de outro semestre",
  "Não faz parte da ementa atual",
  "Assunto ainda não cadastrado",
];

// Gera uma prova nova e aleatória: 5 múltipla escolha, 3 V/F, 2 discursivas.
// Usa os tópicos da própria matéria (resposta certa) e tópicos/nomes de
// outras matérias do mesmo semestre como alternativas erradas — assim a
// correção automática funciona mesmo sem um motor de IA real por trás.
function gerarProva(materia) {
  const semestre = getSemestreAtual();
  const topicos = materia.topicos && materia.topicos.length ? materia.topicos : ["conteúdo geral da matéria"];
  const outrasMaterias = semestre.materias.filter((m) => m.id !== materia.id);
  const topicosExternos = outrasMaterias.flatMap((m) => (m.topicos || []).map((t) => t));
  const nomesOutrasMaterias = outrasMaterias.map((m) => m.nome);

  function distratoresTopico(excluir, qtd) {
    const pool = topicosExternos.filter((t) => t !== excluir);
    const escolhidos = amostrar(pool, qtd);
    while (escolhidos.length < qtd) escolhidos.push(PROVA_FILLERS[escolhidos.length % PROVA_FILLERS.length]);
    return escolhidos;
  }
  function distratoresMateria(qtd) {
    const escolhidos = amostrar(nomesOutrasMaterias, qtd);
    while (escolhidos.length < qtd) escolhidos.push(PROVA_FILLERS[escolhidos.length % PROVA_FILLERS.length]);
    return escolhidos;
  }

  // --- múltipla escolha ---
  let poolMC = [];
  topicos.forEach((topico) => {
    poolMC.push({
      enunciado: `Qual das alternativas abaixo é um tópico abordado na matéria "${materia.nome}"?`,
      opcoes: embaralhar([{ texto: topico, correta: true }, ...distratoresTopico(topico, 3).map((t) => ({ texto: t, correta: false }))]),
    });
    if (outrasMaterias.length) {
      poolMC.push({
        enunciado: `O tópico "${topico}" pertence a qual matéria?`,
        opcoes: embaralhar([{ texto: materia.nome, correta: true }, ...distratoresMateria(3).map((t) => ({ texto: t, correta: false }))]),
      });
    }
  });
  while (poolMC.length < 5) {
    const topico = topicos[poolMC.length % topicos.length];
    poolMC.push({
      enunciado: `Assinale a alternativa correta sobre o conteúdo de "${materia.nome}" relacionado a "${topico}".`,
      opcoes: embaralhar([{ texto: topico, correta: true }, ...distratoresTopico(topico, 3).map((t) => ({ texto: t, correta: false }))]),
    });
  }
  const questoesMC = amostrar(poolMC, 5).map((q, i) => ({ ...q, id: `mc-${i}`, tipo: "mc" }));

  // --- verdadeiro ou falso ---
  let poolVF = topicos.map((topico) => ({ enunciado: `"${topico}" é um tópico abordado na matéria "${materia.nome}".`, correta: true }));
  topicosExternos.forEach((t) => poolVF.push({ enunciado: `"${t}" é um tópico abordado na matéria "${materia.nome}".`, correta: false }));
  if (!poolVF.some((q) => !q.correta)) {
    PROVA_FILLERS.forEach((f) => poolVF.push({ enunciado: `"${f}" é um tópico abordado na matéria "${materia.nome}".`, correta: false }));
  }
  while (poolVF.length < 3) poolVF.push(poolVF[poolVF.length % poolVF.length]);
  let questoesVF = amostrar(poolVF, 3);
  if (questoesVF.every((q) => q.correta) || questoesVF.every((q) => !q.correta)) {
    const oposto = poolVF.find((q) => q.correta !== questoesVF[0].correta);
    if (oposto) questoesVF[questoesVF.length - 1] = oposto;
  }
  questoesVF = questoesVF.map((q, i) => ({ ...q, id: `vf-${i}`, tipo: "vf" }));

  // --- discursivas ---
  let topicosDiscursiva = amostrar(topicos, Math.min(2, topicos.length));
  while (topicosDiscursiva.length < 2) topicosDiscursiva.push(topicos[topicosDiscursiva.length % topicos.length]);
  const questoesDiscursiva = topicosDiscursiva.slice(0, 2).map((topico, i) => ({
    id: `ds-${i}`,
    tipo: "discursiva",
    enunciado: `Explique com suas palavras o conceito de "${topico}" e cite um exemplo prático visto em aula.`,
    pontosChave: ["Definição correta do conceito", "Exemplo prático coerente", "Relação com o conteúdo visto em aula"],
  }));

  return { mc: questoesMC, vf: questoesVF, discursiva: questoesDiscursiva };
}

function todasQuestoes(questoes) {
  return [...questoes.mc, ...questoes.vf, ...questoes.discursiva];
}

function iniciarProva(materiaId) {
  const materia = materiasAtuais().find((m) => m.id === materiaId);
  if (!materia) return;
  provaState = { fase: "prova", materiaId, questoes: gerarProva(materia), respostas: {}, resultado: null };
}

function renderSimulados(container) {
  const materias = materiasAtuais();

  if (!materias.length) {
    container.innerHTML = `
      <div class="page page-narrow">
        <h1 class="h1" style="font-size:30px">Simular provas</h1>
        <p class="empty-note" style="margin-top:12px">Nenhuma matéria neste semestre ainda. <a href="#/materias" class="btn-link">Adicione uma matéria</a> para gerar simulados.</p>
      </div>`;
    return;
  }

  // Se veio de "Gerar simulado desta matéria" (botão na tela da Matéria),
  // já inicia a prova direto, sem passar pela tela de escolha.
  const materiaQuery = getQueryParam("materia");
  if (provaState.fase === "escolha" && materiaQuery && materias.some((m) => m.id === materiaQuery)) {
    iniciarProva(materiaQuery);
  }

  if (provaState.fase === "prova") renderTelaProva(container, materias);
  else if (provaState.fase === "resultado") renderTelaResultado(container, materias);
  else renderTelaEscolha(container, materias);
}

function renderTelaEscolha(container, materias) {
  container.innerHTML = `
    <div class="page page-narrow">
      <div>
        <h1 class="h1" style="font-size:30px">Simular provas</h1>
        <p class="empty-note" style="margin-top:4px">A prova tem 10 questões (5 múltipla escolha, 3 V/F, 2 discursivas), geradas aleatoriamente a cada tentativa.</p>
      </div>
      <div class="form-card">
        <div>
          <label class="field-label">Matéria</label>
          <select class="field" id="select-materia">
            ${materias.map((m) => `<option value="${m.id}">${m.nome}</option>`).join("")}
          </select>
        </div>
        <button class="btn btn-accent" id="btn-gerar" style="width:fit-content">${icon("sparkles", 16)} Gerar simulado</button>
      </div>
    </div>
  `;

  container.querySelector("#btn-gerar").addEventListener("click", () => {
    const materiaId = container.querySelector("#select-materia").value;
    iniciarProva(materiaId);
    renderSimulados(container);
  });
}

function renderTelaProva(container, materias) {
  const materia = materias.find((m) => m.id === provaState.materiaId);
  const { mc, vf, discursiva } = provaState.questoes;
  const total = mc.length + vf.length + discursiva.length;
  const respondidas = Object.keys(provaState.respostas).length;

  function questaoMcHtml(q, numero) {
    const selecionada = provaState.respostas[q.id];
    return `
      <div class="quiz-question">
        <p class="q-num">Questão ${numero} · múltipla escolha</p>
        <p class="q-enunciado">${q.enunciado}</p>
        <div class="quiz-options">
          ${q.opcoes
            .map(
              (op, idx) => `<button class="quiz-option${selecionada === idx ? " selected" : ""}" data-qid="${q.id}" data-idx="${idx}">${op.texto}</button>`
            )
            .join("")}
        </div>
      </div>`;
  }

  function questaoVfHtml(q, numero) {
    const selecionada = provaState.respostas[q.id];
    return `
      <div class="quiz-question">
        <p class="q-num">Questão ${numero} · verdadeiro ou falso</p>
        <p class="q-enunciado">${q.enunciado}</p>
        <div class="vf-buttons">
          <button class="vf-btn${selecionada === true ? " selected" : ""}" data-qid="${q.id}" data-val="true">Verdadeiro</button>
          <button class="vf-btn${selecionada === false ? " selected" : ""}" data-qid="${q.id}" data-val="false">Falso</button>
        </div>
      </div>`;
  }

  function questaoDiscursivaHtml(q, numero) {
    const valor = provaState.respostas[q.id] || "";
    return `
      <div class="quiz-question">
        <p class="q-num">Questão ${numero} · discursiva</p>
        <p class="q-enunciado">${q.enunciado}</p>
        <textarea class="quiz-textarea" data-qid="${q.id}" placeholder="Escreva sua resposta aqui...">${valor}</textarea>
      </div>`;
  }

  container.innerHTML = `
    <div class="page page-narrow">
      <button class="back-link" id="btn-trocar-materia">${icon("arrowLeft", 15)} Trocar de matéria</button>
      <div>
        <h1 class="h1" style="font-size:26px">Simulado — ${materia.nome}</h1>
        <p class="empty-note" style="margin-top:4px">Responda as 10 questões e clique em Finalizar para ver o resultado.</p>
      </div>

      <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${(respondidas / total) * 100}%"></div></div>
      <p class="mono-label" style="margin-top:-16px">${respondidas}/${total} respondidas</p>

      <h2 class="quiz-section-title">Múltipla escolha</h2>
      ${mc.map((q, i) => questaoMcHtml(q, i + 1)).join("")}

      <h2 class="quiz-section-title">Verdadeiro ou falso</h2>
      ${vf.map((q, i) => questaoVfHtml(q, mc.length + i + 1)).join("")}

      <h2 class="quiz-section-title">Discursivas</h2>
      ${discursiva.map((q, i) => questaoDiscursivaHtml(q, mc.length + vf.length + i + 1)).join("")}

      <button class="btn btn-accent" id="btn-finalizar" style="width:fit-content;margin-top:8px">${icon("sparkles", 16)} Finalizar simulado</button>
    </div>
  `;

  container.querySelector("#btn-trocar-materia").addEventListener("click", () => {
    provaState = { fase: "escolha", materiaId: null, questoes: null, respostas: {}, resultado: null };
    renderSimulados(container);
  });

  container.querySelectorAll(".quiz-option").forEach((btn) =>
    btn.addEventListener("click", () => {
      provaState.respostas[btn.dataset.qid] = Number(btn.dataset.idx);
      renderSimulados(container);
    })
  );
  container.querySelectorAll(".vf-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      provaState.respostas[btn.dataset.qid] = btn.dataset.val === "true";
      renderSimulados(container);
    })
  );
  container.querySelectorAll(".quiz-textarea").forEach((ta) => {
    ta.addEventListener("input", () => {
      provaState.respostas[ta.dataset.qid] = ta.value;
    });
  });

  container.querySelector("#btn-finalizar").addEventListener("click", () => {
    const todas = todasQuestoes(provaState.questoes);
    provaState.resultado = todas.map((q) => {
      if (q.tipo === "mc") {
        const idx = provaState.respostas[q.id];
        const correta = idx !== undefined && q.opcoes[idx] && q.opcoes[idx].correta;
        return { ...q, respostaUsuario: idx, correta };
      }
      if (q.tipo === "vf") {
        const val = provaState.respostas[q.id];
        const correta = val !== undefined && val === q.correta;
        return { ...q, respostaUsuario: val, correta };
      }
      return { ...q, respostaUsuario: provaState.respostas[q.id] || "", correta: null };
    });
    provaState.fase = "resultado";
    renderSimulados(container);
  });
}

function renderTelaResultado(container, materias) {
  const materia = materias.find((m) => m.id === provaState.materiaId);
  const resultado = provaState.resultado;
  const acertos = resultado.filter((q) => q.correta === true).length;
  const total = resultado.length;
  const pendentes = resultado.filter((q) => q.tipo === "discursiva" && q.correta === null).length;

  function statusBadge(q) {
    if (q.correta === true) return `<span class="q-status-badge correta">${icon("sparkles", 12)} Correto</span>`;
    if (q.correta === false) return `<span class="q-status-badge incorreta">${icon("alert", 12)} Incorreto</span>`;
    return `<span class="q-status-badge pendente">Autoavaliação pendente</span>`;
  }

  function mcHtml(q, numero) {
    return `
      <div class="quiz-question">
        <p class="q-num">Questão ${numero} · múltipla escolha ${statusBadge(q)}</p>
        <p class="q-enunciado">${q.enunciado}</p>
        <div class="quiz-options">
          ${q.opcoes
            .map((op, idx) => {
              let cls = "";
              if (op.correta) cls = " correta-reveal";
              else if (idx === q.respostaUsuario) cls = " incorreta-reveal";
              return `<div class="quiz-option${cls}">${op.texto}${idx === q.respostaUsuario ? " · sua resposta" : ""}</div>`;
            })
            .join("")}
        </div>
      </div>`;
  }

  function vfHtml(q, numero) {
    const respondeuVerdadeiro = q.respostaUsuario === true;
    const respondeuFalso = q.respostaUsuario === false;
    const classeVerdadeiro = (q.correta ? " correta-reveal" : "") + (respondeuVerdadeiro && !q.correta ? " incorreta-reveal" : "");
    const classeFalso = (!q.correta ? " correta-reveal" : "") + (respondeuFalso && q.correta ? " incorreta-reveal" : "");
    return `
      <div class="quiz-question">
        <p class="q-num">Questão ${numero} · verdadeiro ou falso ${statusBadge(q)}</p>
        <p class="q-enunciado">${q.enunciado}</p>
        <div class="vf-buttons">
          <div class="vf-btn${classeVerdadeiro}">Verdadeiro${respondeuVerdadeiro ? " · sua resposta" : ""}</div>
          <div class="vf-btn${classeFalso}">Falso${respondeuFalso ? " · sua resposta" : ""}</div>
        </div>
      </div>`;
  }

  function discursivaHtml(q, numero) {
    return `
      <div class="quiz-question">
        <p class="q-num">Questão ${numero} · discursiva ${statusBadge(q)}</p>
        <p class="q-enunciado">${q.enunciado}</p>
        <div class="note-card" style="margin-bottom:10px"><p style="white-space:pre-wrap">${q.respostaUsuario || "(em branco)"}</p></div>
        <p class="field-label">Pontos que uma boa resposta deve cobrir</p>
        <ul class="pontos-chave">
          ${q.pontosChave.map((p) => `<li>${icon("clipboard", 13)} ${p}</li>`).join("")}
        </ul>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="pill-btn${q.correta === true ? " active" : ""}" data-autoavaliar="${q.id}" data-val="true">Marquei certo</button>
          <button class="pill-btn${q.correta === false ? " active" : ""}" data-autoavaliar="${q.id}" data-val="false">Marquei errado</button>
        </div>
      </div>`;
  }

  const mcQuestoes = resultado.filter((q) => q.tipo === "mc");
  const vfQuestoes = resultado.filter((q) => q.tipo === "vf");
  const dsQuestoes = resultado.filter((q) => q.tipo === "discursiva");

  container.innerHTML = `
    <div class="page page-narrow">
      <div>
        <h1 class="h1" style="font-size:26px">Resultado — ${materia.nome}</h1>
      </div>

      <div class="score-card">
        <div class="score-num">${acertos}/${total}</div>
        <p class="score-label">questões corretas${pendentes ? ` · ${pendentes} discursiva(s) aguardando sua autoavaliação abaixo` : ""}</p>
      </div>

      <div class="result-actions">
        <button class="btn btn-primary" id="btn-baixar-pdf">${icon("file", 16)} Baixar PDF da prova corrigida</button>
        <button class="btn btn-accent" id="btn-tentar-outra">${icon("sparkles", 16)} Tentar novamente (prova nova)</button>
        <button class="btn-ghost" id="btn-trocar-materia-resultado">Trocar de matéria</button>
      </div>

      <h2 class="quiz-section-title">Múltipla escolha</h2>
      ${mcQuestoes.map((q, i) => mcHtml(q, i + 1)).join("")}

      <h2 class="quiz-section-title">Verdadeiro ou falso</h2>
      ${vfQuestoes.map((q, i) => vfHtml(q, mcQuestoes.length + i + 1)).join("")}

      <h2 class="quiz-section-title">Discursivas</h2>
      ${dsQuestoes.map((q, i) => discursivaHtml(q, mcQuestoes.length + vfQuestoes.length + i + 1)).join("")}
    </div>
  `;

  container.querySelectorAll("[data-autoavaliar]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const q = provaState.resultado.find((x) => x.id === btn.dataset.autoavaliar);
      q.correta = btn.dataset.val === "true";
      renderSimulados(container);
    })
  );

  container.querySelector("#btn-tentar-outra").addEventListener("click", () => {
    iniciarProva(provaState.materiaId);
    renderSimulados(container);
  });

  container.querySelector("#btn-trocar-materia-resultado").addEventListener("click", () => {
    provaState = { fase: "escolha", materiaId: null, questoes: null, respostas: {}, resultado: null };
    renderSimulados(container);
  });

  container.querySelector("#btn-baixar-pdf").addEventListener("click", () => {
    gerarPdfResultado(materia, resultado, acertos, total);
  });
}

// Gera o PDF da prova corrigida usando jsPDF (carregado via CDN no index.html).
function gerarPdfResultado(materia, resultado, acertos, total) {
  if (!window.jspdf) {
    alert("Não foi possível carregar o gerador de PDF. Verifique sua conexão e tente novamente.");
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const margemX = 14;
  const larguraUtil = 182;
  let y = 20;

  function garantirEspaco(altura) {
    if (y + altura > 280) {
      doc.addPage();
      y = 20;
    }
  }
  function escreverParagrafo(texto, opts = {}) {
    const fontSize = opts.fontSize || 11;
    doc.setFontSize(fontSize);
    doc.setFont(undefined, opts.bold ? "bold" : "normal");
    const linhas = doc.splitTextToSize(texto, larguraUtil);
    garantirEspaco(linhas.length * (fontSize * 0.5) + 4);
    doc.text(linhas, margemX, y);
    y += linhas.length * (fontSize * 0.5) + 4;
  }

  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.text(`Simulado — ${materia.nome}`, margemX, y);
  y += 8;
  doc.setFontSize(11);
  doc.setFont(undefined, "normal");
  doc.text(`Resultado: ${acertos}/${total} questões corretas · gerado pelo StudyHub`, margemX, y);
  y += 10;

  const numerar = (arr, offset) => arr.map((q, i) => ({ q, numero: offset + i + 1 }));
  const mc = resultado.filter((q) => q.tipo === "mc");
  const vf = resultado.filter((q) => q.tipo === "vf");
  const ds = resultado.filter((q) => q.tipo === "discursiva");

  [...numerar(mc, 0), ...numerar(vf, mc.length), ...numerar(ds, mc.length + vf.length)].forEach(({ q, numero }) => {
    garantirEspaco(14);
    const statusTexto = q.correta === true ? "[correto]" : q.correta === false ? "[incorreto]" : "[autoavaliação pendente]";
    escreverParagrafo(`${numero}. ${q.enunciado}  ${statusTexto}`, { bold: true });

    if (q.tipo === "mc") {
      q.opcoes.forEach((op, idx) => {
        const marcador = op.correta ? "(correta)" : idx === q.respostaUsuario ? "(sua resposta)" : "";
        escreverParagrafo(`   - ${op.texto} ${marcador}`.trim());
      });
    } else if (q.tipo === "vf") {
      const respostaTexto = q.respostaUsuario === true ? "Verdadeiro" : q.respostaUsuario === false ? "Falso" : "(não respondida)";
      escreverParagrafo(`   Sua resposta: ${respostaTexto}`);
    } else {
      escreverParagrafo(`   Sua resposta: ${q.respostaUsuario || "(em branco)"}`);
      escreverParagrafo(`   Pontos esperados: ${q.pontosChave.join("; ")}`);
    }
    y += 2;
  });

  doc.save(`simulado-${slugify(materia.nome)}-corrigido.pdf`);
}

/* ---------------------------------------------------------------------
   14. PÁGINA: Minha Área
   --------------------------------------------------------------------- */
function renderMinhaArea(container) {
  const semestreAtual = getSemestreAtual();
  const materias = materiasAtuais();
  const minhasAnotacoes = materias.flatMap((m) =>
    anotacoesDe(m.id)
      .filter((n) => n.usuario === "Você" || n.usuario === usuario.nome)
      .map((n) => ({ ...n, materiaNome: m.nome }))
  );

  container.innerHTML = `
    <div class="page page-narrow">
      <div class="profile-row">
        <div class="avatar-lg">${usuario.nome.charAt(0)}</div>
        <div><h1 class="h1" style="font-size:24px">${usuario.nome}</h1><p class="empty-note">${materias.length} matérias no semestre ${semestreAtual.nome}</p></div>
      </div>

      <section>
        <h2 class="h2" style="margin-bottom:12px">Semestres</h2>
        <div class="semester-list">
          ${appState.semestres
            .map(
              (s) => `<button class="semester-list-item${s.id === semestreAtual.id ? " active" : ""}" data-semestre="${s.id}">
                <span>${s.nome}</span>
                <span class="mono-label">${s.materias.length} matéria(s)</span>
              </button>`
            )
            .join("")}
        </div>
      </section>

      <section>
        <h2 class="h2" style="margin-bottom:12px">Minhas anotações (semestre atual)</h2>
        ${
          minhasAnotacoes.length
            ? `<div style="display:flex;flex-direction:column;gap:12px">
                ${minhasAnotacoes
                  .map((n) => `<div class="note-card"><span class="autor">${n.materiaNome}</span><p style="margin-top:4px">${n.textoOrganizado}</p></div>`)
                  .join("")}
              </div>`
            : `<p class="empty-note">Você ainda não registrou anotações. Abra uma matéria e comece a contribuir.</p>`
        }
      </section>

      <section>
        <h2 class="h2" style="margin-bottom:12px">Configurações</h2>
        <p class="empty-note">Conecte sua conta ao Supabase para sincronizar suas anotações entre dispositivos. (em breve)</p>
      </section>
    </div>
  `;

  container.querySelectorAll(".semester-list-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      trocarSemestre(btn.dataset.semestre);
      rerenderApp();
    });
  });
}

/* ---------------------------------------------------------------------
   15. INICIALIZAÇÃO
   --------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const sidebarEl = document.getElementById("sidebar");
  const mainEl = document.getElementById("main");

  addRoute("/", renderHome);
  addRoute("/materias", renderMaterias);
  addRoute("/materia/:id", renderMateria);
  addRoute("/simulados", renderSimulados);
  addRoute("/minha-area", renderMinhaArea);

  // Delegação de cliques: qualquer elemento com [data-navigate="/rota"]
  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-navigate]");
    if (target) navigate(target.dataset.navigate);
  });

  function renderShell() {
    renderSidebar(sidebarEl);
  }

  window.addEventListener("hashchange", renderShell);
  renderShell();
  startRouter(mainEl);
});
