/* =============================================================
   APP.JS — Lógica compartida entre todas las páginas del curso
   - Dashboard con persistencia localStorage
   - Tracking de módulos completados
   - "Continuar donde dejé"
   - Modo oscuro · Buscador · Volver arriba · Barra progreso scroll
   - Auto-injection de "Marcar como completado" en módulos
   - Botón imprimir página
   ============================================================= */

// ============ STATS / DASHBOARD ============
function getStats() {
  return JSON.parse(localStorage.getItem('enfStats') || '{"mc":0,"mcCorrect":0,"lab":0,"labCorrect":0,"calc":0}');
}
function setStats(s) { localStorage.setItem('enfStats', JSON.stringify(s)); }

function getCompletedModules() {
  return JSON.parse(localStorage.getItem('enfCompleted') || '[]');
}
function setCompletedModules(arr) { localStorage.setItem('enfCompleted', JSON.stringify(arr)); }

function getLastVisited() {
  return JSON.parse(localStorage.getItem('enfLastVisited') || 'null');
}
function setLastVisited(data) { localStorage.setItem('enfLastVisited', JSON.stringify(data)); }

function updateDashboard() {
  const s = getStats();
  const mcEl = document.getElementById('stat-mc');
  if (!mcEl) return;

  document.getElementById('stat-mc').textContent = s.mc;
  document.getElementById('stat-mc-correct').textContent = s.mcCorrect;
  document.getElementById('bar-mc').style.width = Math.min(s.mc / 61 * 100, 100) + '%';

  document.getElementById('stat-lab').textContent = s.lab;
  document.getElementById('stat-lab-correct').textContent = s.labCorrect;
  document.getElementById('bar-lab').style.width = Math.min(s.lab / 30 * 100, 100) + '%';

  document.getElementById('stat-calc').textContent = s.calc;
  document.getElementById('bar-calc').style.width = Math.min(s.calc / 30 * 100, 100) + '%';

  const totalAns = s.mc + s.lab;
  const totalCorrect = s.mcCorrect + s.labCorrect;
  const acc = totalAns > 0 ? Math.round(totalCorrect / totalAns * 100) : 0;
  document.getElementById('stat-acc').textContent = acc + '%';
  document.getElementById('bar-acc').style.width = acc + '%';

  let grade = 'Sin datos';
  if (totalAns > 0) {
    if (acc >= 90) grade = '🏆 Excelente';
    else if (acc >= 80) grade = '⭐ Muy bueno';
    else if (acc >= 70) grade = '✅ Aprobado';
    else if (acc >= 60) grade = '⚠ Mejorable';
    else grade = '❌ Necesita repaso';
  }
  document.getElementById('stat-grade').textContent = grade;

  // Módulos completados
  const completed = getCompletedModules();
  const modEl = document.getElementById('stat-modules');
  if (modEl) {
    modEl.textContent = completed.length;
    document.getElementById('bar-modules').style.width = (completed.length / 15 * 100) + '%';
    const pct = Math.round(completed.length / 15 * 100);
    document.getElementById('stat-modules-pct').textContent = pct + '% del curso';
  }

  // Marcar tarjetas de módulos completados
  document.querySelectorAll('.module-card').forEach(card => {
    const href = card.getAttribute('href') || '';
    const match = href.match(/(\d+)-/);
    if (match) {
      const moduleId = parseInt(match[1]);
      if (completed.includes(moduleId)) {
        card.classList.add('completed');
      } else {
        card.classList.remove('completed');
      }
    }
  });
}

function resetStats() {
  if (confirm('¿Reiniciar todo el progreso (estadísticas + módulos completados)? Esta acción no se puede deshacer.')) {
    localStorage.removeItem('enfStats');
    localStorage.removeItem('enfAnswered');
    localStorage.removeItem('enfCompleted');
    localStorage.removeItem('enfLastVisited');
    location.reload();
  }
}

function recordAnswer(type, isCorrect) {
  const s = getStats();
  if (type === 'mc') { s.mc++; if (isCorrect) s.mcCorrect++; }
  if (type === 'lab') { s.lab++; if (isCorrect) s.labCorrect++; }
  if (type === 'calc') { s.calc++; }
  setStats(s);
  updateDashboard();
}

// ============ "CONTINUAR DONDE DEJÉ" ============
function trackVisit() {
  const path = location.pathname;
  const match = path.match(/modulos\/(\d+)-([^.]+)\.html/);
  if (match) {
    const num = parseInt(match[1]);
    const slug = match[2];
    const title = document.querySelector('.page-title')?.textContent.split('\n')[0].trim() || slug;
    setLastVisited({ num, slug, title, path: `modulos/${match[1]}-${slug}.html`, ts: Date.now() });
  }
}

function renderContinueBanner() {
  const last = getLastVisited();
  const banner = document.getElementById('continue-banner');
  if (!banner) return;
  if (!last) { banner.style.display = 'none'; return; }
  const completed = getCompletedModules();
  const isCompleted = completed.includes(last.num);
  banner.innerHTML = `
    <div class="continue-icon">${isCompleted ? '✅' : '📖'}</div>
    <div class="continue-body">
      <div class="continue-label">${isCompleted ? 'Última visita (completado)' : 'Continuar donde dejaste'}</div>
      <div class="continue-title">Módulo ${last.num}: ${last.title}</div>
    </div>
    <a href="${last.path}" class="continue-btn">Continuar →</a>
  `;
  banner.style.display = 'flex';
}

// ============ BOTÓN "MARCAR COMO COMPLETADO" ============
function injectCompleteButton() {
  const path = location.pathname;
  const match = path.match(/modulos\/(\d+)-/);
  if (!match) return;
  const moduleId = parseInt(match[1]);
  const nav = document.querySelector('.module-nav');
  if (!nav) return;

  const completed = getCompletedModules();
  const isCompleted = completed.includes(moduleId);

  const wrapper = document.createElement('div');
  wrapper.className = 'complete-section';
  wrapper.innerHTML = `
    <button id="complete-btn" class="complete-btn ${isCompleted ? 'is-completed' : ''}">
      ${isCompleted ? '✅ Módulo completado' : '☐ Marcar módulo como completado'}
    </button>
    <button id="print-btn" class="print-btn">🖨️ Imprimir este módulo</button>
  `;
  nav.parentNode.insertBefore(wrapper, nav);

  document.getElementById('complete-btn').addEventListener('click', () => {
    let comp = getCompletedModules();
    if (comp.includes(moduleId)) {
      comp = comp.filter(id => id !== moduleId);
    } else {
      comp.push(moduleId);
      comp.sort((a, b) => a - b);
    }
    setCompletedModules(comp);
    const btn = document.getElementById('complete-btn');
    const nowCompleted = comp.includes(moduleId);
    btn.textContent = nowCompleted ? '✅ Módulo completado' : '☐ Marcar módulo como completado';
    btn.classList.toggle('is-completed', nowCompleted);
    if (nowCompleted) showToast('🎉 ¡Módulo completado! Bien hecho.');
  });

  document.getElementById('print-btn').addEventListener('click', () => window.print());
}

// ============ BREADCRUMBS automáticos ============
function injectBreadcrumbs() {
  const path = location.pathname;
  const moduleContent = document.querySelector('.module-content');
  if (!moduleContent) return;

  let breadcrumbs = '';
  if (path.includes('/modulos/')) {
    const match = path.match(/(\d+)-/);
    const num = match ? match[1] : '';
    breadcrumbs = `<a href="../index.html">🏠 Inicio</a> <span>›</span> <span>Módulo ${num}</span>`;
  } else if (path.includes('/examenes/')) {
    breadcrumbs = `<a href="../index.html">🏠 Inicio</a> <span>›</span> <span>Examen</span>`;
  } else if (path.includes('/anexos/')) {
    breadcrumbs = `<a href="../index.html">🏠 Inicio</a> <span>›</span> <span>Anexo</span>`;
  } else {
    return;
  }

  const bc = document.createElement('nav');
  bc.className = 'breadcrumbs';
  bc.innerHTML = breadcrumbs;
  moduleContent.insertBefore(bc, moduleContent.firstChild);
}

// ============ TOAST ============
function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ============ EXAMEN: render genérico ============
function renderExam(containerId, questions, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  questions.forEach((q, idx) => {
    const div = document.createElement('div');
    div.className = 'question';
    div.innerHTML = `
      <div class="question-text"><span class="question-number">${idx+1}</span>${q.q}</div>
      <ul class="options exam-${type}-options" data-correct="${q.correct}" data-idx="${idx}" data-type="${type}">
        ${q.o.map((opt, i) => `<li data-opt="${i}">${String.fromCharCode(65+i)}) ${opt}</li>`).join('')}
      </ul>
      <button class="check-btn" data-action="check" data-idx="${idx}" data-type="${type}">Comprobar</button>
      <div class="explanation" id="exp-${type}-${idx}"><strong>Explicación:</strong> ${q.exp}</div>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll(`.exam-${type}-options`).forEach(ul => {
    ul.addEventListener('click', e => {
      if (e.target.tagName === 'LI' && !e.target.classList.contains('correct') && !e.target.classList.contains('incorrect')) {
        ul.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
        e.target.classList.add('selected');
      }
    });
  });

  container.addEventListener('click', e => {
    if (e.target.dataset && e.target.dataset.action === 'check') {
      const idx = parseInt(e.target.dataset.idx);
      const t = e.target.dataset.type;
      const ul = document.querySelectorAll(`.exam-${t}-options`)[idx];
      const selected = ul.querySelector('.selected');
      if (!selected) { showToast('⚠ Seleccioná una opción'); return; }
      if (ul.dataset.answered === 'true') return;

      const correctIdx = parseInt(ul.dataset.correct);
      ul.querySelectorAll('li').forEach((li, i) => {
        if (i === correctIdx) li.classList.add('correct');
        else if (li === selected) li.classList.add('incorrect');
      });
      document.getElementById(`exp-${t}-${idx}`).classList.add('show');
      const isCorrect = parseInt(selected.dataset.opt) === correctIdx;
      recordAnswer(t, isCorrect);
      ul.dataset.answered = 'true';
      updateExamScore(t);
    }
  });
}

function updateExamScore(type) {
  const total = document.querySelectorAll(`.exam-${type}-options`).length;
  const answered = document.querySelectorAll(`.exam-${type}-options[data-answered="true"]`).length;
  const correctAnswered = Array.from(document.querySelectorAll(`.exam-${type}-options[data-answered="true"]`))
    .filter(ul => {
      const sel = ul.querySelector('.selected');
      return sel && parseInt(sel.dataset.opt) === parseInt(ul.dataset.correct);
    }).length;
  const scoreEl = document.getElementById(`${type}-score`);
  if (scoreEl) {
    const pct = answered > 0 ? Math.round(correctAnswered / answered * 100) : 0;
    scoreEl.innerHTML = `Respondidas: <strong>${answered}/${total}</strong> · Correctas: <strong>${correctAnswered}</strong> · Precisión: <strong>${pct}%</strong>`;
  }
}

function renderCalc(containerId, calcQuestions) {
  const container = document.getElementById(containerId);
  if (!container) return;
  calcQuestions.forEach((q, idx) => {
    const div = document.createElement('div');
    div.className = 'question';
    div.innerHTML = `
      <div class="question-text">${q.q}</div>
      <button class="check-btn" data-action="show-calc" data-idx="${idx}">Mostrar respuesta</button>
      <div class="explanation" id="calc-exp-${idx}"><strong>Respuesta:</strong> ${q.a}<br><strong>Cálculo:</strong> ${q.exp}</div>
    `;
    container.appendChild(div);
  });
  container.addEventListener('click', e => {
    if (e.target.dataset && e.target.dataset.action === 'show-calc') {
      const idx = parseInt(e.target.dataset.idx);
      const exp = document.getElementById(`calc-exp-${idx}`);
      exp.classList.toggle('show');
      if (exp.classList.contains('show') && !exp.dataset.counted) {
        recordAnswer('calc', true);
        exp.dataset.counted = 'true';
      }
    }
  });
}

// ============ MODO OSCURO ============
function initDarkMode() {
  const btn = document.getElementById('darkToggle');
  if (!btn) return;
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
    btn.textContent = '☀️';
  }
  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    btn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDark);
  });
}

// ============ NAVEGACIÓN UI ============
function initUI() {
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = percent + '%';

    const toTop = document.getElementById('toTop');
    if (toTop) {
      if (scrollTop > 400) toTop.classList.add('show');
      else toTop.classList.remove('show');
    }
  });

  const toTop = document.getElementById('toTop');
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      const term = e.target.value.toLowerCase().trim();
      const rows = document.querySelectorAll('tbody tr');
      const cards = document.querySelectorAll('.card, .module-card');
      if (term === '') {
        rows.forEach(r => r.style.display = '');
        cards.forEach(c => { c.style.opacity = '1'; c.style.display = ''; });
        return;
      }
      rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
      });
      cards.forEach(card => {
        const matches = card.textContent.toLowerCase().includes(term);
        card.style.opacity = matches ? '1' : '0.2';
      });
    });
  }
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initUI();
  injectBreadcrumbs();
  injectCompleteButton();
  trackVisit();
  renderContinueBanner();
  updateDashboard();
});
