/*****************************************************
 * time.js
 * Module de gestion du temps pour la PWA Astreinte
 * - Quart d’heure en cours
 * - Formatage des heures
 * - Traversée minuit
 * - Durées en minutes
 * - Période d'astreinte mercredi → mercredi suivant
 *****************************************************/


/* ----------------------------------------------
   LIRE HEURE ACTUELLE
---------------------------------------------- */
export function now() {
    return new Date();
}


/* ----------------------------------------------
   QUART D’HEURE EN COURS (ta règle métier)
   Exemples :
   - 17h18 → 17h15
   - 19h55 → 19h45
   - 20h12 → 20h00
---------------------------------------------- */
export function quarterOf(date) {
    const minutes = date.getMinutes();
    const quarter = Math.floor(minutes / 15) * 15;

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        quarter,
        0
    );
}


/* ----------------------------------------------
   AJOUTER DES MINUTES À UNE DATE
---------------------------------------------- */
export function addMinutes(date, min) {
    return new Date(date.getTime() + min * 60000);
}


/* ----------------------------------------------
   FORMAT HEURE "HH:MM"
---------------------------------------------- */
export function formatHM(date) {
    let h = date.getHours();
    let m = date.getMinutes();
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}


/* ----------------------------------------------
   DURÉE EN MINUTES entre deux Date
---------------------------------------------- */
export function diffMinutes(start, end) {
    return Math.round((end.getTime() - start.getTime()) / 60000);
}


/* ----------------------------------------------
   PÉRIODE D’ASTREINTE
   - Tu sélectionnes un mercredi (start)
   - Début = mercredi 17h15
   - Fin = mercredi +7 jours à 7h30
---------------------------------------------- */
export function computeAstreintePeriod(wedDateStr) {
    const d = new Date(wedDateStr + "T00:00:00");

    // Début mercredi 17h15
    const start = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        17, 15, 0
    );

    // Fin mercredi suivant 7h30
    const end = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate() + 7,
        7, 30, 0
    );

    return { start, end };
}


/* ----------------------------------------------
   VÉRIFIER SI UNE DATE EST DANS LA PÉRIODE
---------------------------------------------- */
export function isInAstreinte(date, period) {
    return date.getTime() >= period.start.getTime() &&
           date.getTime() <= period.end.getTime();
}


/* ----------------------------------------------
   RENVOIE vrai si l’heure réelle est “en astreinte”
   selon tes règles :
   - en semaine (lundi→vendredi) : 17h15→7h30
   - samedi & dimanche : 24h/24
   - férié : 24h/24
---------------------------------------------- */
export function isInsideAstreinteRules(date, feries) {

    const day = date.getDay(); // 0 dimanche … 6 samedi
    const hm = date.getHours() * 60 + date.getMinutes();
    const isFerie = feries.some(f => isSameDay(date, new Date(f)));

    // Jours week-end ou fériés → astreinte 24h/24
    if (day === 0 || day === 6 || isFerie) {
        return true;
    }

    // Semaine : astreinte seulement 17h15 → minuit + 00h00 → 07h30
    const start = 17 * 60 + 15;
    const end = 7 * 60 + 30;

    // Deux possibilités :
    // - soir : hm >= 17h15
    // - matin : hm <= 07h30
    return (hm >= start) || (hm <= end);
}


/* ----------------------------------------------
   TESTER SI DEUX DATES SONT LE MÊME JOUR
---------------------------------------------- */
export function isSameDay(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}


/* ----------------------------------------------
   AVANCER D’UN JOUR (utile pour fusion)
---------------------------------------------- */
export function nextDay(date) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1,
        date.getHours(),
        date.getMinutes(),
        0
    );
}