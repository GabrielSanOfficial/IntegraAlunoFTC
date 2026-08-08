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
   2. DADOS DE EXEMPLO
   Usados enquanto as páginas ainda não leem do Supabase. A forma dos
   objetos aqui já reflete o schema em supabase/schema.sql — trocar por
   dados reais depois é só trocar a fonte, não a estrutura.
   --------------------------------------------------------------------- */
const usuario = { nome: "Marina" };

const materias = [
  {
    id: "algoritmos",
    nome: "Algoritmos e Estrutura de Dados",
    professor: "Prof. Ricardo Aveline",
    diaSemana: "Segunda-feira",
    horario: "08:00 – 10:00",
    cor: "var(--color-subj-1)",
    resumo: "Fundamentos de estruturas de dados (listas, pilhas, filas, árvores) e análise de complexidade de algoritmos.",
    topicos: ["Complexidade Big O", "Árvores binárias", "Ordenação (quicksort, mergesort)"],
    proximaEntrega: { tipo: "prova", titulo: "P2 — Árvores e Grafos", data: "2026-08-14" },
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
    proximaEntrega: { tipo: "trabalho", titulo: "Modelagem do projeto final", data: "2026-08-11" },
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
    proximaEntrega: { tipo: "atividade", titulo: "Sprint review em grupo", data: "2026-08-10" },
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
    proximaEntrega: { tipo: "prova", titulo: "P2 — Camada de Transporte", data: "2026-08-17" },
  },
];

const aulasPorMateria = {
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
};

const arquivosPorMateria = {
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
};

const anotacoesPorMateria = {
  algoritmos: [
    {
      id: "n1",
      usuario: "João",
      data: "2026-08-03",
      textoOrganizado:
        "Árvore AVL é uma árvore binária de busca autobalanceada. Fator de balanceamento de cada nó deve estar entre -1 e 1. Rotações simples e duplas são usadas para rebalancear após inserção/remoção.",
    },
  ],
};

const tiposDeArquivoLabel = { pptx: "Slides", docx: "Documentos", xlsx: "Planilhas", txt: "Textos", pdf: "PDFs" };

/* ---------------------------------------------------------------------
   3. ÍCONES (SVG inline, sem dependência externa)
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
};

function icon(name, size = 16, extraClass = "") {
  const p = ICON_PATHS[name] || "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${extraClass}">${p}</svg>`;
}

/* ---------------------------------------------------------------------
   4. HELPERS DE DATA
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
   5. ROUTER (baseado em hash, ex: #/materia/algoritmos)
   --------------------------------------------------------------------- */
const routes = [];

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
  window.addEventListener("hashchange", render);
  render();
}

/* ---------------------------------------------------------------------
   6. SIDEBAR
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
}

/* ---------------------------------------------------------------------
   7. COMPONENTE: card de matéria
   --------------------------------------------------------------------- */
function subjectCardHtml(materia) {
  const entrega = materia.proximaEntrega;
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
      <p class="resumo">${materia.resumo}</p>
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
   8. PÁGINA: Home
   --------------------------------------------------------------------- */
function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

function renderHome(container) {
  const hoje = diasSemana[new Date().getDay()];
  const aulaDeHoje = materias.find((m) => m.diaSemana === hoje);
  const dataFormatada = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });

  container.innerHTML = `
    <div class="page">
      <section>
        <p class="date-label">${dataFormatada}</p>
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
        <div class="subject-grid">${materias.map(subjectCardHtml).join("")}</div>
      </section>
    </div>
  `;
}

/* ---------------------------------------------------------------------
   9. PÁGINA: Matérias (grade completa)
   --------------------------------------------------------------------- */
function renderMaterias(container) {
  container.innerHTML = `
    <div class="page">
      <div>
        <h1 class="h1" style="font-size:30px">Grade de matérias</h1>
        <p class="empty-note" style="margin-top:4px">Clique em uma linha para abrir a matéria, ver aulas, arquivos e anotações.</p>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Matéria</th><th>Professor</th><th>Horário</th><th>Próxima entrega</th></tr>
          </thead>
          <tbody>
            ${materias
              .map((m) => {
                const eProva = m.proximaEntrega?.tipo === "prova";
                return `
                  <tr data-navigate="/materia/${m.id}">
                    <td><div class="meta-row"><span class="dot" style="background:${m.cor}"></span><span class="nome">${m.nome}</span></div></td>
                    <td class="empty-note">${m.professor}</td>
                    <td class="mono-label">${m.diaSemana} · ${m.horario}</td>
                    <td>
                      ${
                        m.proximaEntrega
                          ? `<span class="badge ${eProva ? "badge-prova" : "badge-entrega"}">${icon(eProva ? "alert" : "clipboard", 12)} ${m.proximaEntrega.titulo} · ${formatarDataLonga(m.proximaEntrega.data)}</span>`
                          : `<span class="empty-note">—</span>`
                      }
                    </td>
                  </tr>`;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ---------------------------------------------------------------------
   10. PÁGINA: Matéria (anotações, upload, portfólio)
   --------------------------------------------------------------------- */
const ICONE_POR_TIPO = { pptx: "presentation", docx: "file", xlsx: "sheet", txt: "file", pdf: "file" };
const estadoMateria = {};

function getEstadoMateria(materiaId) {
  if (!estadoMateria[materiaId]) {
    estadoMateria[materiaId] = {
      aulaSelecionada: (aulasPorMateria[materiaId] || [])[0]?.id ?? null,
      abaAtiva: "visao-geral",
      anotacoes: [...(anotacoesPorMateria[materiaId] || [])],
    };
  }
  return estadoMateria[materiaId];
}

function renderMateria(container, params) {
  const materia = materias.find((m) => m.id === params.id);

  if (!materia) {
    container.innerHTML = `
      <div class="page page-narrow" style="text-align:center;padding-top:64px">
        <p class="empty-note">Matéria não encontrada.</p>
        <a href="#/" class="btn-link">Voltar para o início</a>
      </div>`;
    return;
  }

  const s = getEstadoMateria(materia.id);
  const aulas = aulasPorMateria[materia.id] || [];
  const arquivos = arquivosPorMateria[materia.id] || [];
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
        <p class="resumo">${materia.resumo}</p>
        <div class="chip-row">${materia.topicos.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
        ${
          materia.proximaEntrega
            ? `<div class="entrega-flag ${materia.proximaEntrega.tipo === "prova" ? "badge-prova" : "badge-entrega"}">
                ${icon(materia.proximaEntrega.tipo === "prova" ? "alert" : "clipboard", 16)}
                Próxima ${materia.proximaEntrega.tipo === "prova" ? "prova" : "entrega"}: ${materia.proximaEntrega.titulo} — ${formatarDataLonga(materia.proximaEntrega.data)}
              </div>`
            : ""
        }
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
    renderAbaAnotacoes(tabContent, arquivos, s);
  } else {
    renderAbaPortfolio(tabContent, arquivosPorTipo);
  }
}

function renderAbaAnotacoes(el, arquivos, s) {
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
    listaAnotacoes.innerHTML = s.anotacoes.length
      ? s.anotacoes
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

    // Placeholder local do fluxo "anotação → IA organiza → salva".
    // No backend real isso vira uma chamada à Edge Function do Supabase.
    setTimeout(() => {
      s.anotacoes.unshift({ id: "local-" + Date.now(), usuario: "Você", data: new Date().toISOString().slice(0, 10), textoOrganizado: texto });
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
   11. PÁGINA: Simulados
   --------------------------------------------------------------------- */
function renderSimulados(container) {
  const materiaIdInicial = getQueryParam("materia") || materias[0].id;
  const s = { materiaId: materiaIdInicial, escopo: "materia" };

  container.innerHTML = `
    <div class="page page-narrow">
      <div>
        <h1 class="h1" style="font-size:30px">Simular provas</h1>
        <p class="empty-note" style="margin-top:4px">Gere um simulado com base no conteúdo já registrado pela turma.</p>
      </div>
      <div class="form-card">
        <div>
          <label class="field-label">Matéria</label>
          <select class="field" id="select-materia">
            ${materias.map((m) => `<option value="${m.id}" ${m.id === s.materiaId ? "selected" : ""}>${m.nome}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="field-label">Escopo</label>
          <div class="pill-group" id="escopo-group">
            <button class="pill-btn active" data-escopo="materia">Matéria toda</button>
            <button class="pill-btn" data-escopo="aula">Aula específica</button>
            <button class="pill-btn" data-escopo="tema">Por tema</button>
          </div>
        </div>
        <button class="btn btn-accent" id="btn-gerar" style="width:fit-content">${icon("sparkles", 16)} Gerar simulado</button>
      </div>
      <div id="resultado"></div>
    </div>
  `;

  container.querySelector("#select-materia").addEventListener("change", (e) => (s.materiaId = e.target.value));
  container.querySelectorAll("#escopo-group .pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      container.querySelectorAll("#escopo-group .pill-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      s.escopo = btn.dataset.escopo;
    });
  });

  const btnGerar = container.querySelector("#btn-gerar");
  const resultado = container.querySelector("#resultado");

  btnGerar.addEventListener("click", () => {
    btnGerar.disabled = true;
    btnGerar.innerHTML = `${icon("loader", 16, "spin")} Gerando simulado...`;
    resultado.innerHTML = "";

    // Placeholder local. No backend real, essa chamada aciona o pipeline de
    // RAG (busca os trechos indexados da matéria/aula e pede ao modelo
    // para gerar as questões).
    setTimeout(() => {
      const m = materias.find((x) => x.id === s.materiaId);
      resultado.innerHTML = `
        <div class="result-card">
          <h2 class="h2" style="margin-bottom:16px">Simulado — ${m.nome}</h2>
          <ol>${m.topicos.map((t, i) => `<li><span class="num">${i + 1}.</span>Explique o conceito de "${t}" e dê um exemplo prático visto em aula.</li>`).join("")}</ol>
        </div>`;
      btnGerar.disabled = false;
      btnGerar.innerHTML = `${icon("sparkles", 16)} Gerar simulado`;
    }, 1200);
  });
}

/* ---------------------------------------------------------------------
   12. PÁGINA: Minha Área
   --------------------------------------------------------------------- */
function renderMinhaArea(container) {
  const minhasAnotacoes = Object.entries(anotacoesPorMateria).flatMap(([materiaId, lista]) =>
    lista.filter((n) => n.usuario === "Você" || n.usuario === usuario.nome).map((n) => ({ ...n, materiaId }))
  );

  container.innerHTML = `
    <div class="page page-narrow">
      <div class="profile-row">
        <div class="avatar-lg">${usuario.nome.charAt(0)}</div>
        <div><h1 class="h1" style="font-size:24px">${usuario.nome}</h1><p class="empty-note">${materias.length} matérias este semestre</p></div>
      </div>
      <section>
        <h2 class="h2" style="margin-bottom:12px">Minhas anotações</h2>
        ${
          minhasAnotacoes.length
            ? `<div style="display:flex;flex-direction:column;gap:12px">
                ${minhasAnotacoes
                  .map((n) => {
                    const m = materias.find((x) => x.id === n.materiaId);
                    return `<div class="note-card"><span class="autor">${m?.nome ?? ""}</span><p style="margin-top:4px">${n.textoOrganizado}</p></div>`;
                  })
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
}

/* ---------------------------------------------------------------------
   13. INICIALIZAÇÃO
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
