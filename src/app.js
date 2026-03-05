/**************************************************************
 * app.js
 **************************************************************/
import { computeAstreintePeriod } from './time.js';
import { savePeriod, loadPeriod } from './storage.js';
import { getFeries, addFerie, removeFerie } from './feries.js';

function pad(n){return n.toString().padStart(2,'0');}
function toYMDLocal(date){const y=date.getFullYear(); const m=pad(date.getMonth()+1); const d=pad(date.getDate()); return `${y}-${m}-${d}`;}
function fromYMD(ymd){const [y,m,d]=ymd.split('-').map(Number); return new Date(y, m-1, d, 0,0,0,0);} 
function ensureWednesday(ymd){ if(!ymd) return null; let dt=fromYMD(ymd); while(dt.getDay()!==3){ dt.setDate(dt.getDate()+1);} return toYMDLocal(dt);} 
function renderFeries(list){const ul=document.getElementById('feriesList'); if(!ul) return; ul.innerHTML=''; if(!list||list.length===0){ const li=document.createElement('li'); li.textContent='Aucun férié ajouté pour cette période.'; ul.appendChild(li); return;} list.forEach(dateStr=>{ const li=document.createElement('li'); li.style.display='flex'; li.style.alignItems='center'; li.style.justifyContent='space-between'; li.style.gap='10px'; const span=document.createElement('span'); span.textContent=dateStr; const btn=document.createElement('button'); btn.className='btn secondary'; btn.textContent='Supprimer'; btn.addEventListener('click', ()=>{ const updated=removeFerie(dateStr); renderFeries(updated);}); li.appendChild(span); li.appendChild(btn); ul.appendChild(li);});}

window.addEventListener('DOMContentLoaded', ()=>{
  const inputWed=document.getElementById('startWednesday');
  const btnAddFer=document.getElementById('addFerieBtn');
  const btnStart=document.getElementById('startBtn');
  const existing=loadPeriod();
  if(existing && inputWed){ inputWed.value=toYMDLocal(existing.start); }
  renderFeries(getFeries());
  if(btnAddFer){ btnAddFer.addEventListener('click', ()=>{ const val=window.prompt('Date fériée (YYYY-MM-DD) :'); if(!val) return; const ok=/^\d{4}-\d{2}-\d{2}$/.test(val); if(!ok){ alert('Format attendu : YYYY-MM-DD'); return;} const d=fromYMD(val); if(isNaN(d.getTime())){ alert('Date invalide.'); return;} renderFeries(addFerie(val)); }); }
  if(btnStart){ btnStart.addEventListener('click', ()=>{ let chosen=(inputWed&&inputWed.value)?inputWed.value:null; if(!chosen){ alert('Sélectionne d’abord le mercredi de début.'); return;} const wed=ensureWednesday(chosen); if(wed!==chosen && inputWed){ inputWed.value=wed; }
    const period=computeAstreintePeriod(wed); savePeriod({start:period.start, end:period.end}); window.location.href='actions.html'; }); }
});
