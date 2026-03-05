
// kernel.js — logique métier (traduction du VBA)
// Tout en heures décimales pour les calculs.

export const DAY_LABELS = [
  'Lundi','Mardi','Mercredi semaine 1','Mercredi semaine 2','Jeudi','Vendredi','Samedi','Dimanche'
];

export function hmToDec(h, m){
  const H = Number(h)||0; const M = Number(m)||0; return H + (M/60);
}
export function decToHM(dec){
  const d = Math.max(0, Number(dec)||0);
  const h = Math.floor(d);
  const m = Math.round((d - h)*60);
  return {h, m};
}
export function decToText(dec){
  const {h,m} = decToHM(dec); return `${h} h ${m} min`;
}

// Convertir relativement au début d'astreinte (équiv. ConvertirDeb/Fin du VBA)
export function convertStart(heureDec, heureDecDebut){
  const hd = Number(heureDecDebut)||0; const x = Number(heureDec)||0;
  if (x < hd) return x + (24 - hd); else if (x === hd) return 0; else return x - hd;
}
export function convertEnd(heureDec, heureDecDebut){
  const hd = Number(heureDecDebut)||0; const x = Number(heureDec)||0;
  if (x < hd) return x + (24 - hd); else if (x === hd) return 24; else return x - hd;
}

// Calcule la durée de l'astreinte en décimal normalisé [0, D]
export function normalizeAstreinte(startH, startM, endH, endM){
  const start = hmToDec(startH, startM);
  const end = hmToDec(endH, endM);
  const D = convertEnd(end, start); // longueur d'astreinte
  return {startDec: start, length: D};
}

// Convertit les interventions en intervalles relatifs à 0 (début astreinte)
export function normalizeInterventions(rows, startDec){
  // rows: [{dh, dm, fh, fm}]
  const out = [];
  for(const r of rows){
    const deb = convertStart(hmToDec(r.dh, r.dm), startDec);
    let fin = convertEnd(hmToDec(r.fh, r.fm), startDec);
    // Coherence : si fin < deb après conversions (hors traversée), force au moins égal
    if (fin < deb) fin = deb; 
    out.push({s: deb, e: fin});
  }
  return out;
}

export function sumInterventions(ints){
  return ints.reduce((a,it)=>a + Math.max(0, it.e - it.s), 0);
}

// Détecte chevauchements (stricts) entre intervalles
export function hasOverlap(ints){
  const a = [...ints].sort((x,y)=> x.s - y.s || x.e - y.e);
  for(let i=1;i<a.length;i++){
    if (a[i].s < a[i-1].e - 1e-9) return true;
  }
  return false;
}

// Vérifie que toutes les interventions sont dans [0, D]
export function insideAstreinte(ints, D){
  return ints.every(it => it.s >= 0 && it.e <= D + 1e-9);
}

// Cumul d'interventions dans une fenêtre [t, t+11]
export function overlapWithWindow(ints, t0, t1){
  let s = 0; for(const it of ints){
    const s1 = Math.max(it.s, t0); const e1 = Math.min(it.e, t1);
    if (e1 > s1) s += (e1 - s1);
  } return s;
}

// Recherche de la fenêtre de 11h avec le minimum d'interventions (comme VBA TempsDeRecuperation)
export function bestWindow11(ints, D){
  const W = 11; const candidates = new Set([0, Math.max(0, D - W)]);
  for(const it of ints){
    candidates.add(Math.max(0, it.s));
    candidates.add(Math.max(0, it.s - W));
    candidates.add(Math.max(0, it.e));
    candidates.add(Math.max(0, it.e - W));
  }
  let best = {t:0, val: overlapWithWindow(ints, 0, W)};
  for(const t of candidates){
    if (t <= D){
      const t1 = Math.min(D, t + W);
      const v = overlapWithWindow(ints, t, t1);
      if (v < best.val - 1e-9) best = {t, val: v};
    }
  }
  return best; // {t, val}
}

export function validateAll(D, ints){
  const alerts = [];
  if (D < 11 - 1e-9) alerts.push("Durée d'astreinte < 11 h");
  if (!insideAstreinte(ints, D)) alerts.push("Intervention(s) hors de l'astreinte");
  if (hasOverlap(ints)) alerts.push("Chevauchement d'interventions");
  // Ordres début/fin sont traités via normalize; on signale si une ligne nulle
  if (ints.some(it => (it.e - it.s) < 0)) alerts.push("Heures incohérentes");
  return alerts;
}

// Préréglages
export function presetFerieJ1(){ return {start:{h:17,m:15}, end:{h:17,m:15}}; }
export function presetFerie(){ return {start:{h:17,m:15}, end:{h:7,m:30}}; }

// Suggestion selon la date (semaine vs week-end)
export function suggestHoursFromDate(dateStr){
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T12:00:00');
  const dow = d.getDay(); // 0=Dim,1=Lun,...6=Sam
  const weekend = (dow === 0 || dow === 6);
  if (weekend){ // week-end
    return {start:{h:7,m:30}, end:{h:7,m:30}};
  }
  // semaine
  return {start:{h:17,m:15}, end:{h:7,m:30}};
}
