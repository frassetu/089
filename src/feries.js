/******************************************************************
 * feries.js
 * Gestion des jours fériés (Option B validée)
 * - Ajout d'un férié par date
 * - Suppression
 * - Stockage local
 * - Logiciel métier : un férié compte comme un jour “week-end”
 *   pour les calculs 089 / fenêtre 11h / astreinte 24h
 * - MAIS ne crée aucune intervention automatique
 ******************************************************************/

import { loadFeries, saveFeries } from "./storage.js";

/* ---------------------------------------------------------
   LISTER LES JOURS FÉRIÉS (array de strings "YYYY-MM-DD")
--------------------------------------------------------- */
export function getFeries() {
    return loadFeries() ?? [];
}

/* ---------------------------------------------------------
   AJOUTER UN JOUR FÉRIÉ
--------------------------------------------------------- */
export function addFerie(dateStr) {
    if (!dateStr) return;

    const list = getFeries();

    // éviter les doublons
    if (!list.includes(dateStr)) {
        list.push(dateStr);
        list.sort();
        saveFeries(list);
    }

    return list;
}

/* ---------------------------------------------------------
   SUPPRIMER UN JOUR FÉRIÉ
--------------------------------------------------------- */
export function removeFerie(dateStr) {
    const list = getFeries().filter(f => f !== dateStr);
    saveFeries(list);
    return list;
}

/* ---------------------------------------------------------
   VÉRIFIER SI UNE DATE JS EST FÉRIÉE
--------------------------------------------------------- */
export function isFerieDate(dateObj) {
    const y = dateObj.getFullYear();
    const m = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const d = dateObj.getDate().toString().padStart(2, "0");

    const key = `${y}-${m}-${d}`;
    return getFeries().includes(key);
}