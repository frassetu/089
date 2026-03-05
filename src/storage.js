/*******************************************************************
 * storage.js
 * Sauvegarde locale de :
 * - période d'astreinte
 * - interventions
 * - jours fériés
 * 
 * Utilise localStorage car :
 * - fonctionne offline
 * - rapide
 * - persistant
 * 
 * Toutes les fonctions renvoient des objets JS, jamais du texte brut
 *******************************************************************/


/* ===============================================================
    CLÉS DE STOCKAGE
   =============================================================== */
const KEY_PERIOD = "astreinte_period";
const KEY_INTERVS = "astreinte_interventions";
const KEY_FERIES  = "astreinte_feries";



/* ===============================================================
    SAUVEGARDE PÉRIODE ASTREINTE
   =============================================================== */
export function savePeriod(periodObj) {
    localStorage.setItem(KEY_PERIOD, JSON.stringify(periodObj));
}

export function loadPeriod() {
    const txt = localStorage.getItem(KEY_PERIOD);
    if (!txt) return null;

    const obj = JSON.parse(txt);

    // Les dates sont stockées en string → conversion en Date
    return {
        start: new Date(obj.start),
        end: new Date(obj.end)
    };
}



/* ===============================================================
    SAUVEGARDE JOURS FÉRIÉS
   =============================================================== */
export function saveFeries(list) {
    localStorage.setItem(KEY_FERIES, JSON.stringify(list));
}

export function loadFeries() {
    const txt = localStorage.getItem(KEY_FERIES);
    if (!txt) return null;
    return JSON.parse(txt);
}



/* ===============================================================
    INTERVENTIONS
   =============================================================== */
export function saveInterventions(list) {

    // On stocke des strings ISO (pas des objets Date)
    const arr = list.map(it => ({
        start: it.start.toISOString(),
        end:   it.end.toISOString()
    }));

    localStorage.setItem(KEY_INTERVS, JSON.stringify(arr));
}


export function loadInterventions() {
    const txt = localStorage.getItem(KEY_INTERVS);
    if (!txt) return null;

    const arr = JSON.parse(txt);

    // Reconvertir en Date
    return arr.map(it => ({
        start: new Date(it.start),
        end:   new Date(it.end)
    }));
}



/* ===============================================================
    RESET TOTAL
   =============================================================== */
export function clearAll() {
    localStorage.removeItem(KEY_PERIOD);
    localStorage.removeItem(KEY_INTERVS);
    localStorage.removeItem(KEY_FERIES);
}