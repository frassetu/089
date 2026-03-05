/************************************************************
 * interventions.js
 * Gestion des interventions :
 * - Boutons rapides +15/+30/+45/+1h
 * - Quart d’heure en cours (via time.js)
 * - Fusion automatique (Option B validée)
 * - Traversée minuit autorisée (Confirmation 1 : A)
 * - Interventions manuelles
 * - Détection hors astreinte (UI gérée ailleurs)
 *************************************************************/

import { now, quarterOf, addMinutes, isInsideAstreinteRules, isSameDay } from "./time.js";
import { saveInterventions, loadInterventions } from "./storage.js";

/* ===================================================================
    STRUCTURE INTERNE D'UNE INTERVENTION
    {
       start: Date,
       end:   Date
    }
   =================================================================== */


/* -----------------------------------------------------------
   LISTER LES INTERVENTIONS ACTUELLES
----------------------------------------------------------- */
export function getInterventions() {
    return loadInterventions() ?? [];
}


/* -----------------------------------------------------------
   ENREGISTRER LA LISTE
----------------------------------------------------------- */
function store(list) {
    saveInterventions(list);
}


/* -----------------------------------------------------------
   AJOUTER UNE INTERVENTION (brique de base)
----------------------------------------------------------- */
function pushIntervention(intervention) {

    let list = getInterventions();

    // Ajouter
    list.push(intervention);

    // Trier
    list.sort((a, b) => a.start.getTime() - b.start.getTime());

    // Fusion automatique si deux se touchent
    list = fuseInterventions(list);

    // Enregistrer
    store(list);

    return list;
}


/* -----------------------------------------------------------
   FUSION AUTOMATIQUE (Option B)
   - Fusionne même si traversée minuit (Option A)
----------------------------------------------------------- */
export function fuseInterventions(list) {

    if (list.length <= 1) return list;

    const result = [];
    let current = list[0];

    for (let i = 1; i < list.length; i++) {
        const next = list[i];

        // Si l'intervention suivante commence EXACTEMENT là où l'autre se termine
        if (next.start.getTime() === current.end.getTime()) {
            // Expand
            current = {
                start: current.start,
                end: next.end
            };
        } else {
            result.push(current);
            current = next;
        }
    }

    result.push(current);
    return result;
}


/* -----------------------------------------------------------
   CRÉATION D'UNE INTERVENTION VIA BOUTON RAPIDE
   duréeMin = 15, 30, 45 ou 60
----------------------------------------------------------- */
export function createQuickIntervention(dureeMin, feries, astreintePeriod) {

    const n = now();

    // Quart d’heure en cours (règle métier)
    const start = quarterOf(n);

    // Fin = début + durée
    const end = addMinutes(start, dureeMin);

    // Détecter si hors astreinte
    const isInside = isInsideAstreinteRules(n, feries);

    return {
        start,
        end,
        isInsideAstreinte: isInside
    };
}


/* -----------------------------------------------------------
   AJOUT EFFECTIF (après popup si hors astreinte)
----------------------------------------------------------- */
export function addQuickIntervention(dureeMin, feries, astreintePeriod) {
    const itv = createQuickIntervention(dureeMin, feries, astreintePeriod);
    return pushIntervention({ start: itv.start, end: itv.end });
}


/* -----------------------------------------------------------
   AJOUT D’UNE INTERVENTION MANUELLE
   dateStr = "2026-03-05"
   debutHM = "17:15"
   finHM = "18:00"
----------------------------------------------------------- */
export function addManualIntervention(dateStr, debutHM, finHM) {

    const [h1, m1] = debutHM.split(":").map(Number);
    const [h2, m2] = finHM.split(":").map(Number);

    const start = new Date(dateStr + `T${h1.toString().padStart(2, "0")}:${m1.toString().padStart(2, "0")}:00`);
    const end   = new Date(dateStr + `T${h2.toString().padStart(2, "0")}:${m2.toString().padStart(2, "0")}:00`);

    if (end.getTime() < start.getTime()) {
        // Traversée minuit : on passe au lendemain
        end.setDate(end.getDate() + 1);
    }

    return pushIntervention({ start, end });
}


/* -----------------------------------------------------------
   EFFACER TOUTES LES INTERVENTIONS
----------------------------------------------------------- */
export function clearAllInterventions() {
    store([]);
}