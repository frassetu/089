/********************************************************************
 * engine.js
 * 
 * Module de calcul central :
 *  - Total heures interventions
 *  - Fenêtre de 11h minimisant les interventions (089)
 *  - Calcul temps de repos 089 (ta règle = si < 6h OK sinon repos)
 *  - Synthèse complète
 * 
 * Compatible :
 *  - week-end 24h/24
 *  - jour férié traité comme week-end (Option B)
 *  - traversée minuit
 * 
 ********************************************************************/

import { diffMinutes, isSameDay } from "./time.js";
import { getFeries } from "./feries.js";


/* ======================================================
   1) TOTAL D’HEURES D’INTERVENTIONS (en minutes)
   ====================================================== */
export function computeTotalMinutes(interventions) {
    let total = 0;

    for (const it of interventions) {
        total += diffMinutes(it.start, it.end);
    }
    return total;
}


/* ======================================================
   2) FENÊTRE DE 11 HEURES MINIMISANT LES INTERVENTIONS
      ( équivalent : TempsInterOnzeH + TempsDeRecuperation )
   ====================================================== */
export function computeBest11hWindow(interventions, period) {

    const DURATION = 11 * 60; // 11 heures en minutes

    // Pour éviter les listes vides
    if (interventions.length === 0) {
        return {
            start: period.start,
            end: new Date(period.start.getTime() + DURATION),
            minutes: 0
        };
    }

    // On constitue une liste de points candidats :
    // - début et fin de chaque intervention
    // - début / fin période
    const points = new Set();

    points.add(period.start.getTime());
    points.add(period.end.getTime());

    for (const it of interventions) {
        points.add(it.start.getTime());
        points.add(it.end.getTime());
        // On ajoute aussi des points 11h avant / après
        points.add(it.start.getTime() - DURATION);
        points.add(it.end.getTime()   - DURATION);
    }

    // On va tester chaque point comme début potentiel
    let best = {
        start: period.start,
        end: new Date(period.start.getTime() + DURATION),
        minutes: Infinity
    };

    for (const t of points) {

        const windowStart = new Date(t);
        const windowEnd   = new Date(t + DURATION);

        // La fenêtre doit rester dans la période
        if (windowStart.getTime() < period.start.getTime()) continue;
        if (windowEnd.getTime()   > period.end.getTime())   continue;

        // Calcul du chevauchement total
        let overlap = 0;

        for (const it of interventions) {

            const is = it.start.getTime();
            const ie = it.end.getTime();

            const ws = windowStart.getTime();
            const we = windowEnd.getTime();

            // Chevauchement = intersection entre [it] et [fenêtre]
            const s = Math.max(is, ws);
            const e = Math.min(ie, we);

            if (e > s) {
                overlap += (e - s) / 60000; // en minutes
            }
        }

        // Nouveau minimum ?
        if (overlap < best.minutes) {
            best.minutes = overlap;
            best.start = windowStart;
            best.end = windowEnd;
        }
    }

    return best;
}



/* ======================================================
   3) CALCUL REPOS 089
   Règle : 
   - Si temps d'interventions dans la fenêtre 11h < 6h → OK
   - Si ≥ 6h → "Journée de repos"
   ====================================================== */
export function computeRecuperation089(bestWindowMinutes) {

    const heures = bestWindowMinutes / 60;

    if (heures < 6) {
        return {
            type: "normal",
            heures: heures,
            text: `${heures.toFixed(2)} h (OK)`
        };
    }

    return {
        type: "repos",
        heures: heures,
        text: `Journée de repos (${heures.toFixed(2)} h > 6 h)`
    };
}



/* ======================================================
   4) SYNTHÈSE COMPLÈTE POUR AFFICHAGE
   ====================================================== */
export function buildSynthese(interventions, period) {

    // Total global
    const totalMin = computeTotalMinutes(interventions);
    const totalH   = (totalMin / 60);

    // Fenêtre 11h
    const best = computeBest11hWindow(interventions, period);

    // 089
    const recup = computeRecuperation089(best.minutes);

    return {
        totalMinutes: totalMin,
        totalHeures: totalH,
        bestWindow: best,
        recup089: recup
    };
}


/* ======================================================
   5) TEXTE LISIBLE POUR LES EXPORTS / SYNTHÈSES
   ====================================================== */

export function formatSyntheseText(s) {

    const tHM = `${s.totalHeures.toFixed(2)} h`;
    const wStart = s.bestWindow.start.toLocaleString();
    const wEnd   = s.bestWindow.end.toLocaleString();
    const wMin   = `${(s.bestWindow.minutes / 60).toFixed(2)} h`;

    return `
Total interventions : ${tHM}
Fenêtre 11h       : ${wStart} → ${wEnd}
Durée interventions dans fenêtre : ${wMin}
Récup 089 : ${s.recup089.text}
`;
}