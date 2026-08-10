
/* IntegraAlunoFTC — frontend Supabase sem build.
   Este arquivo substitui o script.js antigo que ainda usava arrays locais.
*/
const SUPABASE_URL = "https://zknqnzikwzgckluyarxm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_5Y9y3MaWtMHd7TgUsdL9zg_qEYUk3PU";
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const state = {
  session: null, profile: null, turma: null,
  materias: [], aulas: [], entregas: [], anotacoes: [], arquivos: [],
  materiaId: null, aulaId: null, tab: "visao-geral", sidebarOpen: true,
  authMode: "login", loading: true
};

const ICON_PATHS = {
  alert:'<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  clipboard:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6"/><path d="M9 16h6"/>',
  arrowRight:'<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  arrowLeft:'<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  paperclip:'<path d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  sparkles:'<path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="M5.6 5.6l2.8 2.8"/><path d="M15.6 15.6l2.8 2.8"/><path d="M18.4 5.6l-2.8 2.8"/><path d="M8.4 15.6l-2.8 2.8"/>',
  loader:'<line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.9" y1="4.9" x2="7.8" y2="7.8"/><line x1="16.2" y1="16.2" x2="19.1" y2="19.1"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.9" y1="19.1" x2="7.8" y2="16.2"/><line x1="16.2" y1="7.8" x2="19.1" y2="4.9"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/>',
  presentation:'<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M12 17v4"/><path d="M8 21h8"/>',
  sheet:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>',
  grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
  cap:'<path d="M22 10L12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  panelClose:'<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><path d="M14 9l-2 3 2 3"/>',
  panelOpen:'<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><path d="M13 9l2 3-2 3"/>',
  logOut:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>'
};
function icon(n,s=16,c=""){return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${c}">${ICON_PATHS[n]||""}</svg>`}
const esc = s => String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const dateShort = d => d ? String(d).slice(8,10)+"/"+String(d).slice(5,7) : "";
const dateLong = d => d ? String(d).slice(8,10)+"/"+String(d).slice(5,7)+"/"+String(d).slice(0,4) : "";
const todayIso=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
const isStaff=()=>["admin","monitor"].includes(state.profile?.papel);

function currentPath(){const h=location.hash.slice(1)||"/";return h.split("?")[0]||"/"}
function queryParam(n){return new URLSearchParams((location.hash.split("?")[1]||"")).get(n)}
function navigate(p){location.hash=p}
function setMain(html){document.getElementById("main").innerHTML=html}

async function loadData(){
  if(!state.profile?.turma_id){state.turma=null;state.materias=[];state.aulas=[];state.entregas=[];state.anotacoes=[];state.arquivos=[];return}
  const turmaId=state.profile.turma_id;
  const [t,m,a,e] = await Promise.all([
    sb.from("turmas").select("*").eq("id",turmaId).single(),
    sb.from("materias").select("*").eq("turma_id",turmaId).order("nome"),
    sb.from("aulas").select("*, materias!inner(turma_id)").eq("materias.turma_id",turmaId).order("data",{ascending:false}),
    sb.from("entregas").select("*, materias!inner(turma_id)").eq("materias.turma_id",turmaId).order("data")
  ]);
  const errors=[t,m,a,e].filter(x=>x.error);
  if(errors.length) throw errors[0].error;
  state.turma=t.data; state.materias=m.data||[]; state.aulas=a.data||[]; state.entregas=e.data||[];
  const aulaIds=state.aulas.map(x=>x.id);
  if(aulaIds.length){
    const [n,f]=await Promise.all([
      sb.from("anotacoes").select("*, perfis!anotacoes_usuario_id_fkey(nome)").in("aula_id",aulaIds).order("created_at",{ascending:false}),
      sb.from("arquivos").select("*").in("materia_id",state.materias.map(x=>x.id)).order("created_at",{ascending:false})
    ]);
    if(n.error) throw n.error; if(f.error) throw f.error;
    state.anotacoes=n.data||[]; state.arquivos=f.data||[];
  }else{
    state.anotacoes=[]; state.arquivos=[];
  }
}

async function loadSession(){
  const {data:{session}}=await sb.auth.getSession();
  state.session=session;
  if(!session){state.profile=null;state.loading=false;render();return}
  const {data,error}=await sb.from("perfis").select("*").eq("id",session.user.id).single();
  if(error){console.error(error); state.profile=null; state.loading=false; renderError("Não foi possível carregar seu perfil. Execute o schema.sql e tente novamente."); return}
  state.profile=data;
  try{await loadData()}catch(e){console.error(e);state.loading=false;renderError("Erro ao carregar os dados do Supabase: "+e.message);return}
  state.loading=false; render();
}

function render(){
  const app=document.getElementById("app"), side=document.getElementById("sidebar"), main=document.getElementById("main");
  if(state.loading){side.innerHTML="";main.innerHTML=`<div class="loading-state">${icon("loader",22,"spin")} &nbsp; Carregando IntegraAlunoFTC...</div>`;return}
  if(!state.session){side.innerHTML="";main.innerHTML=authHtml();app.className="layout";bindAuth();return}
  app.className="layout";renderSidebar(side);route(main)
}

function renderError(msg){
  document.getElementById("sidebar").innerHTML="";
  document.getElementById("main").innerHTML=`<div class="page page-narrow"><div class="auth-error">${esc(msg)}</div><button class="btn btn-primary" id="retry">Tentar novamente</button></div>`;
  document.getElementById("retry").onclick=()=>{state.loading=true;render();loadSession()};
}

function authHtml(){
  const register=state.authMode==="register";
  return `<div class="auth-screen"><div class="auth-card">
    <h1 class="auth-brand">IntegraAlunoFTC</h1>
    <p class="auth-subtitle">Sua turma, matérias, aulas, anotações e materiais em um só lugar.</p>
    <div class="auth-tabs"><button class="auth-tab ${!register?"active":""}" data-mode="login">Entrar</button><button class="auth-tab ${register?"active":""}" data-mode="register">Criar conta</button></div>
    <div id="auth-message"></div>
    <form id="auth-form">
      ${register?`<div><label class="field-label">Nome</label><input class="field" name="nome" required maxlength="80" placeholder="Seu nome"></div>
      <div style="margin-top:14px"><label class="field-label">Código da turma</label><input class="field" name="turma" required placeholder="Ex.: FTC-2026-1" autocomplete="off"></div>`:""}
      <div style="margin-top:14px"><label class="field-label">E-mail</label><input class="field" type="email" name="email" required autocomplete="email" placeholder="voce@email.com"></div>
      <div style="margin-top:14px"><label class="field-label">Senha</label><input class="field" type="password" name="senha" required minlength="6" autocomplete="${register?"new-password":"current-password"}" placeholder="Mínimo de 6 caracteres"></div>
      <button class="btn btn-primary" style="width:100%;margin-top:20px" id="auth-submit">${register?"Criar conta":"Entrar"}</button>
    </form>
    <p class="empty-note" style="margin-top:18px">Acesso protegido pelo Supabase Auth. Não use a chave service_role no site.</p>
  </div></div>`
}
function bindAuth(){
  document.querySelectorAll(".auth-tab").forEach(b=>b.onclick=()=>{state.authMode=b.dataset.mode;render()});
  document.getElementById("auth-form").onsubmit=async e=>{
    e.preventDefault(); const f=new FormData(e.target), msg=document.getElementById("auth-message"), btn=document.getElementById("auth-submit");
    btn.disabled=true;btn.innerHTML=`${icon("loader",16,"spin")} Aguarde...`;msg.innerHTML="";
    try{
      const email=f.get("email").trim(), senha=f.get("senha");
      let res;
      if(state.authMode==="register"){
        const turma=f.get("turma").trim();
        const {data:turmaData,error:turmaErr}=await sb.from("turmas").select("id").ilike("codigo",turma).maybeSingle();
        if(turmaErr)throw turmaErr;if(!turmaData)throw new Error("Código de turma não encontrado.");
        res=await sb.auth.signUp({email,password:senha,options:{data:{nome:f.get("nome").trim(),turma_codigo:turma}}});
        if(res.error)throw res.error;
        if(!res.data.session){msg.innerHTML=`<div class="auth-success">Conta criada. Verifique seu e-mail se a confirmação estiver habilitada no Supabase.</div>`}
        else{await loadSession()}
      }else{
        res=await sb.auth.signInWithPassword({email,password:senha});
        if(res.error)throw res.error; await loadSession();
      }
    }catch(err){msg.innerHTML=`<div class="auth-error">${esc(err.message||"Erro de autenticação.")}</div>`;btn.disabled=false;btn.textContent=state.authMode==="register"?"Criar conta":"Entrar"}
  }
}

function renderSidebar(el){
  const path=currentPath(), name=state.profile?.nome||"Aluno";
  const links=[["/","Início","grid"],["/materias","Matérias","book"],["/simulados","Simular provas","cap"],["/minha-area","Minha área","user"]];
  el.className="sidebar"+(state.sidebarOpen?"":" collapsed");
  el.innerHTML=`<div class="sidebar-header"><div class="avatar">${esc(name.charAt(0).toUpperCase())}</div>${state.sidebarOpen?`<div><p class="sidebar-user-label">Bem-vindo(a),</p><p class="sidebar-user-name">${esc(name)}</p></div>`:""}</div>
  <nav class="sidebar-nav">${links.map(([to,label,ic])=>`<a href="#${to}" class="nav-link ${to==="/"?(path==="/"):(path.startsWith(to))?"active":""}">${icon(ic,18)}${state.sidebarOpen?`<span>${label}</span>`:""}</a>`).join("")}</nav>
  <div style="padding:10px 12px">${state.sidebarOpen?`<span class="mono-label"><span class="status-dot"></span>online · ${esc(state.turma?.codigo||"sem turma")}</span>`:""}</div>
  <button class="sidebar-toggle" id="toggle">${icon(state.sidebarOpen?"panelClose":"panelOpen",18)}${state.sidebarOpen?"<span>Recolher</span>":""}</button>
  ${state.sidebarOpen?`<button class="sidebar-toggle" id="logout">${icon("logOut",18)}<span>Sair</span></button>`:""}`;
  el.querySelector("#toggle").onclick=()=>{state.sidebarOpen=!state.sidebarOpen;renderSidebar(el)};
  el.querySelector("#logout")?.addEventListener("click",async()=>{await sb.auth.signOut();state.session=null;state.profile=null;render()});
}

function route(main){
  const p=currentPath();
  if(p==="/")return home(main);
  if(p==="/materias")return materiasPage(main);
  if(p.startsWith("/materia/"))return materiaPage(main,p.split("/")[2]);
  if(p==="/simulados")return simuladosPage(main);
  if(p==="/minha-area")return minhaArea(main);
  main.innerHTML=`<div class="page"><p class="empty-note">Página não encontrada.</p></div>`;
}

function nextEntrega(materiaId){
  const now=todayIso();
  return state.entregas.filter(e=>e.materia_id===materiaId).sort((a,b)=>a.data.localeCompare(b.data)).find(e=>e.data>=now)
      || state.entregas.filter(e=>e.materia_id===materiaId).sort((a,b)=>b.data.localeCompare(a.data))[0];
}
function materiaCard(m){
  const e=nextEntrega(m.id), prova=e?.tipo==="prova";
  return `<button class="subject-card corner-fold" style="--fold-color:${m.cor||"var(--color-subj-1)"}" data-open-materia="${m.id}">
    <div class="meta-row"><span class="dot" style="background:${m.cor||"var(--color-subj-1)"}"></span><span class="mono-label">${esc(m.dia_semana||"")} · ${esc(m.horario||"")}</span></div>
    <div><h3>${esc(m.nome)}</h3><p class="professor">${esc(m.professor||"")}</p></div><p class="resumo">${esc(m.resumo||"")}</p>
    ${e?`<div class="badge ${prova?"badge-prova":"badge-entrega"}">${icon(prova?"alert":"clipboard",14)}<span>${prova?"Prova":"Entrega"} · ${esc(e.titulo)} em ${dateShort(e.data)}</span></div>`:""}</button>`
}
function bindOpenMateria(){document.querySelectorAll("[data-open-materia]").forEach(b=>b.onclick=()=>navigate("/materia/"+b.dataset.openMateria))}
function home(main){
  const d=new Date(), weekday=["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"][d.getDay()];
  const hoje=state.materias.find(m=>m.dia_semana===weekday);
  const date=d.toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long"});
  main.innerHTML=`<div class="page"><section><p class="date-label">${date}</p><h1 class="h1">${d.getHours()<12?"Bom dia":d.getHours()<18?"Boa tarde":"Boa noite"}, ${esc(state.profile.nome)}.</h1>
  ${hoje?`<div class="today-banner corner-fold" style="--fold-color:${hoje.cor}"><div><p class="label">Aula de hoje</p><p class="title">${esc(hoje.nome)}</p><p class="sub">${esc(hoje.professor||"")} · ${esc(hoje.horario||"")}</p></div><button class="btn btn-accent" data-open-materia="${hoje.id}">Ir para a matéria ${icon("arrowRight",16)}</button></div>`:`<div class="today-empty">Sem aula prevista para hoje. Aproveite para revisar uma matéria ou gerar um simulado.</div>`}</section>
  <section><div class="section-header"><h2 class="h2">Suas matérias</h2><a href="#/materias" class="btn-link">ver grade completa</a></div><div class="subject-grid">${state.materias.map(materiaCard).join("")}</div></section>${timeline()}</div>`;
  bindOpenMateria();
}
function timeline(){
  const days=[];const base=new Date();base.setHours(0,0,0,0);for(let i=0;i<16;i++){const d=new Date(base);d.setDate(base.getDate()+i);days.push(d)}
  const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`, now=iso(base);
  const cells=days.map(d=>`<th class="timeline-day${iso(d)===now?" today":""}"><span class="dow">${["dom","seg","ter","qua","qui","sex","sáb"][d.getDay()]}</span><span class="dnum">${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}</span></th>`).join("");
  const rows=state.materias.map(m=>`<tr><td class="timeline-row-name"><span class="dot" style="background:${m.cor}"></span>${esc(m.nome)}</td>${days.map(d=>{const x=iso(d), es=state.entregas.filter(e=>e.materia_id===m.id&&e.data===x);return `<td class="timeline-cell${x===now?" is-today":""}">${es.map(e=>`<span class="timeline-marker ${e.tipo==="prova"?"prova":"entrega"}" title="${esc(e.titulo)}">${icon(e.tipo==="prova"?"alert":"clipboard",10)}</span>`).join("")}</td>`}).join("")}</tr>`).join("");
  const legend=state.entregas.filter(e=>e.data>=now&&e.data<=iso(days[15])).sort((a,b)=>a.data.localeCompare(b.data)).map(e=>{const m=state.materias.find(x=>x.id===e.materia_id);return `<li><strong>${dateLong(e.data)}</strong> — ${esc(m?.nome||"")} : ${esc(e.titulo)}</li>`}).join("");
  return `<section><div class="section-header"><h2 class="h2">Linha do tempo de entregas</h2><span class="mono-label">próximos 16 dias</span></div><div class="timeline-wrap"><table class="timeline-table"><thead><tr><th class="timeline-row-name"></th>${cells}</tr></thead><tbody>${rows}</tbody></table></div>${legend?`<ul class="timeline-legend">${legend}</ul>`:`<p class="empty-note" style="margin-top:12px">Nenhuma entrega nos próximos 16 dias.</p>`}</section>`
}
function materiasPage(main){
  main.innerHTML=`<div class="page"><div><h1 class="h1" style="font-size:30px">Grade de matérias</h1><p class="empty-note" style="margin-top:4px">Dados carregados do Supabase.</p></div><div class="table-wrap"><table><thead><tr><th>Matéria</th><th>Professor</th><th>Horário</th><th>Próxima entrega</th></tr></thead><tbody>${state.materias.map(m=>{const e=nextEntrega(m.id),p=e?.tipo==="prova";return `<tr data-open-materia="${m.id}"><td><div class="meta-row"><span class="dot" style="background:${m.cor}"></span><span class="nome">${esc(m.nome)}</span></div></td><td class="empty-note">${esc(m.professor||"")}</td><td class="mono-label">${esc(m.dia_semana||"")} · ${esc(m.horario||"")}</td><td>${e?`<span class="badge ${p?"badge-prova":"badge-entrega"}">${esc(e.titulo)} · ${dateLong(e.data)}</span>`:"—"}</td></tr>`}).join("")}</tbody></table></div></div>`;
  bindOpenMateria();
}

function materiaPage(main,materiaId){
  const m=state.materias.find(x=>x.id===materiaId); if(!m){main.innerHTML=`<div class="page"><p class="empty-note">Matéria não encontrada.</p></div>`;return}
  state.materiaId=m.id;
  const aulas=state.aulas.filter(a=>a.materia_id===m.id).sort((a,b)=>b.data.localeCompare(a.data));
  if(!state.aulaId || !aulas.some(a=>a.id===state.aulaId)) state.aulaId=aulas[0]?.id||null;
  const aula=aulas.find(a=>a.id===state.aulaId);
  const arquivos=state.arquivos.filter(a=>a.materia_id===m.id);
  const notas=state.anotacoes.filter(n=>aula&&n.aula_id===aula.id);
  const entrega=nextEntrega(m.id);
  main.innerHTML=`<div class="page">
    <button class="back-link" id="back">${icon("arrowLeft",15)} Voltar</button>
    <header class="materia-header corner-fold" style="--fold-color:${m.cor}"><span class="mono-label">${esc(m.dia_semana||"")} · ${esc(m.horario||"")}</span><h1>${esc(m.nome)}</h1><p class="professor">${esc(m.professor||"")}</p><p class="resumo">${esc(m.resumo||"")}</p><div class="chip-row">${(m.topicos||[]).map(t=>`<span class="chip">${esc(t)}</span>`).join("")}</div>${entrega?`<div class="entrega-flag ${entrega.tipo==="prova"?"badge-prova":"badge-entrega"}">${icon(entrega.tipo==="prova"?"alert":"clipboard",16)} Próxima ${entrega.tipo==="prova"?"prova":"entrega"}: ${esc(entrega.titulo)} — ${dateLong(entrega.data)}</div>`:""}</header>
    <section class="aula-selector-row"><div class="aula-pills">${aulas.length?aulas.map(a=>`<button class="aula-pill ${a.id===state.aulaId?"active":""}" data-aula="${a.id}">${dateShort(a.data)} · ${esc(a.titulo)}${a.status!=="pronta"?" · "+esc(a.status):""}</button>`).join(""):`<span class="empty-note">Nenhuma aula registrada.</span>`}</div><button class="btn btn-primary" id="simulado">${icon("sparkles",16)} Gerar simulado</button></section>
    <div class="tabs"><button class="tab ${state.tab==="visao-geral"?"active":""}" data-tab="visao-geral">Anotações &amp; upload</button><button class="tab ${state.tab==="portfolio"?"active":""}" data-tab="portfolio">Portfólio de arquivos</button></div>
    <div id="tab-content"></div></div>`;
  main.querySelector("#back").onclick=()=>navigate("/materias");
  main.querySelector("#simulado").onclick=()=>navigate("/simulados?materia="+m.id);
  main.querySelectorAll("[data-aula]").forEach(b=>b.onclick=()=>{state.aulaId=b.dataset.aula;state.tab="visao-geral";materiaPage(main,m.id)});
  main.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;materiaPage(main,m.id)});
  const tab=main.querySelector("#tab-content");
  if(state.tab==="portfolio") renderPortfolio(tab,arquivos); else renderNotes(tab,m,aula,notas);
}
function renderNotes(el,m,aula,notas){
  el.innerHTML=`<div style="display:flex;flex-direction:column;gap:24px">
    <div class="two-col">
      <div class="panel"><div class="section-header"><h2 class="h2">Anotações da turma</h2><span class="mono-label">${notas.length} registro(s)</span></div><div id="notes-list">${notas.map(n=>`<div class="note-card"><div class="top"><span class="autor">${esc(n.perfis?.nome||"Aluno")}</span><span class="data">${dateLong(n.created_at)}</span></div><p>${esc(n.texto_organizado_ia||n.texto_original)}</p></div>`).join("")||`<p class="empty-note">Nenhuma anotação ainda. Seja o primeiro.</p>`}</div></div>
      <div class="panel"><h2 class="h2">Registrar anotação</h2><p class="empty-note" style="margin:6px 0 12px">O texto é salvo imediatamente no Supabase. A organização por IA entra na próxima etapa.</p>${aula?`<textarea id="note" class="field" rows="9" placeholder="Escreva o que você aprendeu..."></textarea><button id="save-note" class="btn btn-accent" style="margin-top:10px">${icon("sparkles",16)} Salvar anotação</button>`:`<p class="empty-note">Selecione uma aula para registrar uma anotação.</p>`}</div>
    </div>
    <div class="panel"><div class="section-header"><h2 class="h2">Enviar material</h2><span class="mono-label">máx. 20 MB</span></div>${aula?`<label class="btn btn-secondary" style="display:inline-flex;align-items:center;gap:8px">${icon("paperclip",16)} Selecionar arquivo<input id="file" type="file" accept=".pptx,.docx,.xlsx,.txt,.pdf" hidden></label><span id="file-status" class="empty-note" style="margin-left:10px"></span>`:`<p class="empty-note">Selecione uma aula antes de enviar.</p>`}</div>
  </div>`;
  el.querySelector("#save-note")?.addEventListener("click",async()=>{
    const btn=el.querySelector("#save-note"), text=el.querySelector("#note").value.trim();if(!text)return;
    btn.disabled=true;btn.innerHTML=`${icon("loader",16,"spin")} Salvando...`;
    const {error}=await sb.from("anotacoes").insert({aula_id:aula.id,usuario_id:state.session.user.id,texto_original:text,texto_organizado_ia:text});
    if(error)alert("Não foi possível salvar: "+error.message);else{await loadData();materiaPage(document.getElementById("main"),m.id)}
  });
  el.querySelector("#file")?.addEventListener("change",async e=>{
    const file=e.target.files[0];if(!file)return;
    const status=el.querySelector("#file-status");
    if(file.size>20*1024*1024){status.textContent="Arquivo maior que 20 MB.";return}
    status.textContent="Enviando...";
    const ext=(file.name.split(".").pop()||"bin").toLowerCase().replace(/[^a-z0-9]/g,"");
    const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"_");
    const path=`${state.profile.turma_id}/${aula.id}/${crypto.randomUUID()}-${safe}`;
    const up=await sb.storage.from("materiais").upload(path,file,{upsert:false,contentType:file.type||"application/octet-stream"});
    if(up.error){status.textContent="Erro: "+up.error.message;return}
    const ins=await sb.from("arquivos").insert({aula_id:aula.id,materia_id:m.id,enviado_por:state.session.user.id,nome:file.name,tipo:ext,mime_type:file.type||null,tamanho:file.size,storage_path:path});
    if(ins.error){await sb.storage.from("materiais").remove([path]);status.textContent="Erro ao registrar arquivo: "+ins.error.message;return}
    status.textContent="Arquivo enviado.";await loadData();materiaPage(document.getElementById("main"),m.id);
  });
}
function renderPortfolio(el,files){
  const groups={};files.forEach(f=>(groups[f.tipo]??=[]).push(f));
  el.innerHTML=`<div style="display:flex;flex-direction:column;gap:24px">${Object.entries(groups).map(([tipo,arr])=>`<div><h3 class="h3" style="margin-bottom:12px">${icon("file",16)} ${esc(tipo.toUpperCase())} <span class="mono-label">(${arr.length})</span></h3><div class="file-grid">${arr.map(f=>`<button class="file-row" data-file="${esc(f.storage_path)}">${icon("file",16)}<div style="min-width:0;text-align:left"><p class="nome">${esc(f.nome)}</p><p class="info">${dateLong(f.created_at)}</p></div></button>`).join("")}</div></div>`).join("")||`<p class="empty-note">Nenhum arquivo enviado ainda.</p>`}</div>`;
  el.querySelectorAll("[data-file]").forEach(b=>b.onclick=async()=>{const {data,error}=await sb.storage.from("materiais").createSignedUrl(b.dataset.file,300);if(error)alert(error.message);else window.open(data.signedUrl,"_blank","noopener")})
}
function simuladosPage(main){
  const mid=queryParam("materia")||state.materias[0]?.id;
  main.innerHTML=`<div class="page page-narrow"><div><h1 class="h1" style="font-size:30px">Simular provas</h1><p class="empty-note">MVP: as questões abaixo são geradas a partir dos tópicos cadastrados. A IA/RAG será ligada depois.</p></div><div class="form-card"><label class="field-label">Matéria</label><select id="sim-materia" class="field">${state.materias.map(m=>`<option value="${m.id}" ${m.id===mid?"selected":""}>${esc(m.nome)}</option>`).join("")}</select><button id="gen" class="btn btn-accent" style="margin-top:16px">${icon("sparkles",16)} Gerar simulado</button></div><div id="result"></div></div>`;
  main.querySelector("#gen").onclick=()=>{const m=state.materias.find(x=>x.id===main.querySelector("#sim-materia").value);main.querySelector("#result").innerHTML=`<div class="result-card"><h2 class="h2">Simulado — ${esc(m.nome)}</h2><ol>${(m.topicos||[]).map((t,i)=>`<li><span class="num">${i+1}.</span> Explique "${esc(t)}" e dê um exemplo prático.</li>`).join("")}</ol></div>`}
}
function minhaArea(main){
  const mine=state.anotacoes.filter(n=>n.usuario_id===state.session.user.id);
  main.innerHTML=`<div class="page page-narrow"><div class="profile-row"><div class="avatar-lg">${esc(state.profile.nome.charAt(0).toUpperCase())}</div><div><h1 class="h1" style="font-size:24px">${esc(state.profile.nome)}</h1><p class="empty-note">${state.materias.length} matérias · ${esc(state.turma?.nome||"sem turma")}</p></div></div><section><h2 class="h2" style="margin-bottom:12px">Minhas anotações</h2>${mine.length?`<div style="display:flex;flex-direction:column;gap:12px">${mine.map(n=>`<div class="note-card"><p>${esc(n.texto_organizado_ia||n.texto_original)}</p></div>`).join("")}</div>`:`<p class="empty-note">Você ainda não registrou anotações.</p>`}</section><section><h2 class="h2" style="margin-bottom:12px">Conta</h2><p class="empty-note">${esc(state.session.user.email||"")}</p><button class="btn btn-danger" id="logout2">${icon("logOut",16)} Sair</button></section></div>`;
  main.querySelector("#logout2").onclick=async()=>{await sb.auth.signOut()}
}

function setupRealtime(){
  sb.channel("integraaluno-realtime")
    .on("postgres_changes",{event:"*",schema:"public",table:"materias"},async()=>{await loadData();render()})
    .on("postgres_changes",{event:"*",schema:"public",table:"aulas"},async()=>{await loadData();render()})
    .on("postgres_changes",{event:"*",schema:"public",table:"entregas"},async()=>{await loadData();render()})
    .on("postgres_changes",{event:"*",schema:"public",table:"anotacoes"},async()=>{await loadData();render()})
    .on("postgres_changes",{event:"*",schema:"public",table:"arquivos"},async()=>{await loadData();render()})
    .subscribe();
}

window.addEventListener("hashchange",()=>{if(state.session)render()});
sb.auth.onAuthStateChange((_event,session)=>{state.session=session; if(!session){state.profile=null;render()}});
document.addEventListener("DOMContentLoaded",async()=>{
  setupRealtime();
  try{await loadSession()}catch(e){console.error(e);state.loading=false;renderError(e.message)}
});
