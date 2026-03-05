
import { DAY_LABELS } from './kernel.js';

export function getState(){
  const day = document.getElementById('daySelect').value;
  const date = document.getElementById('dateInput').value;
  const startH = Number(document.getElementById('startH').value)||0;
  const startM = Number(document.getElementById('startM').value)||0;
  const endH = Number(document.getElementById('endH').value)||0;
  const endM = Number(document.getElementById('endM').value)||0;
  const rows = [...document.querySelectorAll('#tbodyInterv tr')].map(tr => ({
    dh: Number(tr.querySelector('.dh').value)||0,
    dm: Number(tr.querySelector('.dm').value)||0,
    fh: Number(tr.querySelector('.fh').value)||0,
    fm: Number(tr.querySelector('.fm').value)||0,
  }));
  return {day, date, startH, startM, endH, endM, rows};
}

export function setState(state){
  document.getElementById('daySelect').value = state.day || DAY_LABELS[0];
  document.getElementById('dateInput').value = state.date || '';
  document.getElementById('startH').value = state.startH ?? 17;
  document.getElementById('startM').value = state.startM ?? 15;
  document.getElementById('endH').value = state.endH ?? 7;
  document.getElementById('endM').value = state.endM ?? 30;
  setRows(state.rows||[]);
}

export function addRow(values={dh:'',dm:'',fh:'',fm:''}){
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="idx"></td>
    <td><input class="dh" type="number" min="0" max="23" step="1" value="${values.dh ?? ''}"/></td>
    <td><input class="dm" type="number" min="0" max="59" step="5" value="${values.dm ?? ''}"/></td>
    <td><input class="fh" type="number" min="0" max="23" step="1" value="${values.fh ?? ''}"/></td>
    <td><input class="fm" type="number" min="0" max="59" step="5" value="${values.fm ?? ''}"/></td>
    <td><button class="delBtn">Suppr</button></td>
  `;
  const tbody = document.getElementById('tbodyInterv');
  tbody.appendChild(tr);
  renumber();
  tr.querySelector('.delBtn').addEventListener('click', ()=>{ tr.remove(); renumber(); });
}

export function setRows(rows){
  const tbody = document.getElementById('tbodyInterv');
  tbody.innerHTML = '';
  (rows||[]).forEach(r => addRow(r));
  renumber();
}

export function clearRows(){
  document.getElementById('tbodyInterv').innerHTML = '';
  renumber();
}

function renumber(){
  [...document.querySelectorAll('#tbodyInterv tr')].forEach((tr,i)=> tr.querySelector('.idx').textContent = String(i+1));
}

export function setSummary({totalText, recupText, bestText, alerts}){
  document.getElementById('sumInterv').textContent = 'Interventions : ' + totalText;
  document.getElementById('sumRecup').textContent = 'Récupération 089 : ' + recupText;
  document.getElementById('sumWindow').textContent = 'Fenêtre 11 h : ' + bestText;
  document.getElementById('alerts').textContent = (alerts||[]).join(' • ');
}

export function setSaveBadge(saved){
  const b = document.getElementById('saveBadge');
  b.textContent = saved ? 'enregistré' : 'non enregistré';
  b.style.background = saved ? '#064e3b' : '#0b1220';
}
