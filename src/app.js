/**************************************************************
 * app.js
 * Contrôleur de la page d’accueil (index.html)
 * - Sélection du mercredi de début
 * - Gestion fériés (Option B)
 * - Calcul période mercredi 17:15 → mercredi+7j 07:30
 * - Sauvegarde + redirection vers actions.html
 **************************************************************/

import { computeAstreintePeriod } from "./time.js";
import { savePeriod, loadPeriod } from "./storage.js";
import { getFeries, addFerie, removeFerie } from "./feries.js";

/* ============================================================
   Helpers (format YYYY-MM-DD en local)
   ============================================================ */
function pad(n) { return n.toString().padStart(2, "0"); }

function toYMDLocal(date) {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `${y}-${m}-${d}`;
}

function fromYMD(ymd) {
  // ymd = "YYYY-MM-DD"
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, (m - 1), d, 0, 0, 0, 0);
}

/* ============================================================
   Normalisation : s’assurer d’avoir un mercredi
   - Si l’utilisateur choisit un autre jour → on prend le
     PROCHAIN mercredi >= date saisie
   ============================================================ */
function ensureWednesday(ymd) {
  if (!ymd) return null;
  let dt = fromYMD(ymd);
  // getDay() : 0=dim, 1=lun, 2=mar, 3=mer, 4=jeu, 5=ven, 6=sam
  while (dt.getDay() !== 3) {
    dt.setDate(dt.getDate() + 1);
  }
  return toYMDLocal(dt);
}

/* ============================================================
   Rendu de la liste des fériés avec bouton supprimer
   ============================================================ */
function renderFeries(list) {
  const ul = document.getElementById("feriesList");
  if (!ul) return;

  ul.innerHTML = "";

  if (!list || list.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Aucun férié ajouté pour cette période.";
    ul.appendChild(li);
    return;
  }

  list.forEach(dateStr => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "space-between";
    li.style.gap = "10px";

    const span = document.createElement("span");
    span.textContent = dateStr;

    const btn = document.createElement("button");
    btn.className = "btn secondary";
    btn.textContent = "Supprimer";
    btn.addEventListener("click", () => {
      const updated = removeFerie(dateStr);
      renderFeries(updated);
    });

    li.appendChild(span);
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

/* ============================================================
   Initialisation de la page
   ============================================================ */
window.addEventListener("DOMContentLoaded", () => {

  const inputWed  = document.getElementById("startWednesday");
  const btnAddFer = document.getElementById("addFerieBtn");
  const btnStart  = document.getElementById("startBtn");

  // 1) Pré-remplir si une période existe déjà
  const existing = loadPeriod();
  if (existing && inputWed) {
    // Remettre le mercredi d’origine dans le champ
    // (la période stocke start=mercredi 17:15)
    const startYMD = toYMDLocal(existing.start);
    inputWed.value = startYMD;
  }

  // 2) Lister les fériés
  renderFeries(getFeries());

  // 3) Ajout férié (prompt simple) — tu pourras remplacer par une popup plus tard
  if (btnAddFer) {
    btnAddFer.addEventListener("click", () => {
      const val = window.prompt("Date fériée (YYYY-MM-DD) :");
      if (!val) return;

      // Validation rapide
      const ok = /^\d{4}-\d{2}-\d{2}$/.test(val);
      if (!ok) { alert("Format attendu : YYYY-MM-DD"); return; }

      const d = fromYMD(val);
      if (isNaN(d.getTime())) { alert("Date invalide."); return; }

      renderFeries(addFerie(val));
    });
  }

  // 4) Validation + enregistrement de la période + redirection
  if (btnStart) {
    btnStart.addEventListener("click", () => {
      let chosen = (inputWed && inputWed.value) ? inputWed.value : null;
      if (!chosen) { alert("Sélectionne d’abord le mercredi de début."); return; }

      // S’assurer que c’est bien un mercredi (normalisation)
      const wed = ensureWednesday(chosen);
      if (wed !== chosen && inputWed) {
        // On corrige visuellement la valeur affichée
        inputWed.value = wed;
      }

      // Calcul période et sauvegarde
      const period = computeAstreintePeriod(wed);
      savePeriod({
        start: period.start,
        end: period.end
      });

      // Navigation directe vers Actions (Option A validée)
      window.location.href = "actions.html";
    });
  }
});