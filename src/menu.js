/**********************************************************************
 * menu.js
 *
 * Gère :
 *  - Navigation du menu burger (Synthèse, Liste, Export, Reset)
 *  - Affichage de la synthèse complète (089 + total + 11h)
 *  - Liste d’interventions
 *  - Export PDF / Excel
 *  - Reset période
 *
 **********************************************************************/

import { buildSynthese } from "./engine.js";
import { loadInterventions, loadPeriod, clearAll } from "./storage.js";
import { formatHM } from "./time.js";

/* ============================================================
   NAVIGATION DE BASE
   ============================================================ */
export function navigateTo(page) {
  window.location.href = page;
}

/* ============================================================
   AFFICHER SYNTHÈSE (synthese.html)
   ============================================================ */
export function renderSynthese() {
  const period = loadPeriod();
  const interventions = loadInterventions() ?? [];

  const s = buildSynthese(interventions, period);

  const box = document.getElementById("synthBox");
  if (!box) return;

  box.innerHTML = `
    <h2>Synthèse période</h2>

    <p><strong>Période :</strong><br>
    ${period.start.toLocaleString()} → ${period.end.toLocaleString()}</p>

    <p><strong>Total interventions :</strong>
       ${s.totalHeures.toFixed(2)} h
    </p>

    <p><strong>Fenêtre 11 h minimale :</strong><br>
       ${s.bestWindow.start.toLocaleString()} → <br>
       ${s.bestWindow.end.toLocaleString()}<br>
       <em>Interventions dans fenêtre :</em>
       ${(s.bestWindow.minutes / 60).toFixed(2)} h
    </p>

    <p><strong>Récupération 089 :</strong><br>
       ${s.recup089.text}
    </p>
  `;
}

/* ============================================================
   AFFICHER LISTE DES INTERVENTIONS (interventions.html)
   ============================================================ */
export function renderInterventionsList() {

  const list = loadInterventions() ?? [];

  const box = document.getElementById("intervList");
  if (!box) return;

  if (list.length === 0) {
    box.innerHTML = "<p>Aucune intervention enregistrée.</p>";
    return;
  }

  let html = "<ul class='list'>";
  list.forEach((it, i) => {
    html += `
      <li>
        <strong>${i + 1}.</strong> 
        ${formatHM(it.start)} → ${formatHM(it.end)}
        <br><small>${it.start.toLocaleDateString()}</small>
      </li>
    `;
  });
  html += "</ul>";

  box.innerHTML = html;
}

/* ============================================================
   EXPORT PDF (simple version)
   ============================================================ */
export function exportPDF() {
  alert("Export PDF : version simplifiée.\n(La version finale avec jsPDF sera ajoutée après installation.)");
}

/* ============================================================
   EXPORT EXCEL (simple version)
   ============================================================ */
export function exportExcel() {
  alert("Export Excel : version simplifiée.\n(La version finale avec SheetJS sera ajoutée après installation.)");
}

/* ============================================================
   RESET PÉRIODE
   ============================================================ */
export function resetAll() {
  if (!confirm("Réinitialiser complètement la période ?")) return;

  clearAll();
  window.location.href = "index.html";
}