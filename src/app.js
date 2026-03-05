
import { DAY_LABELS, hmToDec, decToText, convertStart, convertEnd, normalizeAstreinte, normalizeInterventions, sumInterventions, bestWindow11, validateAll, presetFerie, presetFerieJ1, suggestHoursFromDate } from './kernel.js';
import { addRow, setRows, clearRows, getState, setState, setSummary, setSaveBadge } from './ui.js';
import { drawSchema } from './schema.js';
import { exportPDF, exportXLSX } from './export.js';

const KEY = 'astreinte-state-v1';

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addRowBtn').addEventListener('click', ()=> addRow());
  document.getElementById('clearRowsBtn').addEventListener('click', ()=> { clearRows(); dirty(); });
  document.getElementById('calcBtn').addEventListener('click', onCalc);
  document.getElementById('saveBtn').addEventListener('click', onSave);
  document.getElementById('loadBtn').addEventListener('click', onLoad);
  document.getElementById('exportPdfBtn').addEventListener('click', ()=> exportPDF(getState(), lastCalc||{}));
  document.getElementById('exportXlsxBtn').addEventListener('click', ()=> exportXLSX(getState(), lastCalc||{}));
  document.getElementById('ferieBtn').addEventListener('click', ()=>{ const p = presetFerie(); setTimes(p); dirty();});
  document.getElementById('ferieJ1Btn').addEventListener('click', ()=>{ const p = presetFerieJ1(); setTimes(p); dirty();});
  document.getElementById('resetBtn').addEventListener('click', ()=>{ setRows([]); dirty(); });
  document.getElementById('presetWeekBtn').addEventListener('click', ()=>{ const p = suggestHoursFromDate(document.getElementById('dateInput').value); if(p) setTimes(p); dirty(); });

  document.querySelectorAll('input,select').forEach(el => el.addEventListener('input', dirty));

  // valeur initiale
  const init = { day: DAY_LABELS[0], date: '', startH:17, startM:15, endH:7, endM:30, rows:[] };
  setState(init); setSaveBadge(false);
});

function setTimes(p){
  document.getElementById('startH').value = p.start.h; document.getElementById('startM').value = p.start.m;
  document.getElementById('endH').value = p.end.h; document.getElementById('endM').value = p.end.m;
}

let lastCalc = null; let isDirty = false;
function dirty(){ isDirty = true; setSaveBadge(false); }

function onSave(){
  const s = getState();
  localStorage.setItem(KEY, JSON.stringify(s));
  isDirty = false; setSaveBadge(true);
}
function onLoad(){
  const txt = localStorage.getItem(KEY); if(!txt){ alert('Aucune sauvegarde'); return; }
  const s = JSON.parse(txt); setState(s); setSaveBadge(true);
}

function onCalc(){
  const s = getState();
  const ast = normalizeAstreinte(s.startH, s.startM, s.endH, s.endM);
  const ints = normalizeInterventions(s.rows, ast.startDec);
  const total = sumInterventions(ints);
  const best = bestWindow11(ints, ast.length);
  const alerts = validateAll(ast.length, ints);

  const totalText = `${total.toFixed(2).replace('.',',')} h (${decToText(total)})`;
  const bestText = `${best.val.toFixed(2).replace('.',',')} h (début à ${best.t.toFixed(2).replace('.',',')} h relatifs)`;
  const recup = best.val; // équivalent au temps d'interventions présent dans la fenêtre 11h
  const recupText = recup < 6 ? `${recup.toFixed(2).replace('.',',')} h (${decToText(recup)})` : `Journée de repos (${recup.toFixed(2)} h > 6 h)`;

  setSummary({totalText, recupText, bestText, alerts});
  lastCalc = { total, totalText, bestText, recup, recupText, bestStart: best.t };

  const canvas = document.getElementById('schema');
  drawSchema(canvas, Math.max(ast.length, 11), ints, {t: best.t, val: best.val});
}
