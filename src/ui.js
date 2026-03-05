/**********************************************************************
 * ui.js
 *
 * Gère :
 *  - Toast de confirmation
 *  - Popup hors astreinte (Option C)
 *  - Menu burger (ouverture/fermeture)
 *  - Navigation entre pages
 *
 *  Les actions rapides sont reliées à actions.js
 **********************************************************************/

import { createQuickIntervention, addQuickIntervention } from "./interventions.js";
import { loadPeriod } from "./storage.js";
import { isInsideAstreinteRules } from "./time.js";
import { getFeries } from "./feries.js";


/* ============================================================
   TOAST (notification courte en bas de l’écran)
   ============================================================ */
export function showToast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;

    t.textContent = msg;
    t.classList.remove("hidden");

    setTimeout(() => {
        t.classList.add("hidden");
    }, 2000);
}


/* ============================================================
   POPUP HORS ASTREINTE (Option C)
   ============================================================ */
let popupResolve = null;

export function showOutsidePopup(message) {
    const box = document.getElementById("popupOverlay");
    const msg = document.getElementById("popupMessage");

    msg.textContent = message;
    box.classList.remove("hidden");

    return new Promise(resolve => {
        popupResolve = resolve;
    });
}

export function hideOutsidePopup() {
    const box = document.getElementById("popupOverlay");
    box.classList.add("hidden");
}


/* ============================================================
   ATTACHER ÉVÉNEMENTS POPUP
   ============================================================ */
export function initPopupUI() {
    const cancelBtn = document.getElementById("popupCancel");
    const confirmBtn = document.getElementById("popupConfirm");

    if (cancelBtn) {
        cancelBtn.onclick = () => {
            hideOutsidePopup();
            popupResolve && popupResolve(false);
        };
    }

    if (confirmBtn) {
        confirmBtn.onclick = () => {
            hideOutsidePopup();
            popupResolve && popupResolve(true);
        };
    }
}


/* ============================================================
   MENU BURGER : ouvrir / fermer
   ============================================================ */
export function initMenuUI() {
    const openBtn = document.getElementById("openMenu");
    const closeBtn = document.getElementById("closeMenu");
    const panel = document.getElementById("menuPanel");

    if (openBtn && panel) {
        openBtn.onclick = () => panel.classList.remove("hidden");
    }

    if (closeBtn && panel) {
        closeBtn.onclick = () => panel.classList.add("hidden");
    }
}


/* ============================================================
   LOGIQUE D’AJOUT D’UNE INTERVENTION RAPIDE
   (boutons +15 / +30 / +45 / +1h)
   ============================================================ */
export async function handleQuickButton(dureeMin) {

    const period = loadPeriod();
    const feries = getFeries();

    // 1) Création de l’intervention candidate
    const itv = createQuickIntervention(dureeMin, feries, period);

    // 2) Si hors astreinte → popup Option C
    if (!itv.isInsideAstreinte) {

        const msg =
            `Il est ${itv.start.toLocaleTimeString()}.\n` +
            `Quart d’heure appliqué : ${itv.start.toLocaleTimeString()} → ` +
            `${itv.end.toLocaleTimeString()}.\n\n` +
            `⚠ Cette intervention est hors astreinte.\n` +
            `Confirmer ?`;

        const confirm = await showOutsidePopup(msg);

        if (!confirm) {
            return; // annulée par utilisateur
        }
    }

    // 3) Ajout effectif
    addQuickIntervention(dureeMin, feries, period);

    // 4) Confirmation visuelle
    showToast(
        `Ajouté : ${itv.start.toLocaleTimeString()} → ${itv.end.toLocaleTimeString()}`
    );
}