/**********************************************************************
 * menu.js
 **********************************************************************/
import { buildSynthese } from './engine.js';
import { loadInterventions, loadPeriod, clearAll } from './storage.js';
import { formatHM } from './time.js';

export function navigateTo(page){ window.location.href=page; }
export function renderSynthese(){ const period=loadPeriod(); const interventions=loadInterventions()??[]; const s=buildSynthese(interventions, period); const box=document.getElementById('synthBox'); if(!box) return; box.innerHTML=`
  <h2>Synthèse période</h2>
  <p><strong>Période :</strong><br>${period.start.toLocaleString()} → ${period.end.toLocaleString()}</p>
  <p><strong>Total interventions :</strong> ${s.totalHeures.toFixed(2)} h</p>
  <p><strong>Fenêtre 11 h minimale :</strong><br>${s.bestWindow.start.toLocaleString()} → <br>${s.bestWindow.end.toLocaleString()}<br>
     <em>Interventions dans fenêtre :</em> ${(s.bestWindow.minutes/60).toFixed(2)} h</p>
  <p><strong>Récupération 089 :</strong><br>${s.recup089.text}</p>`; }
export function renderInterventionsList(){ const list=loadInterventions()??[]; const box=document.getElementById('intervList'); if(!box) return; if(list.length===0){ box.innerHTML='<p>Aucune intervention enregistrée.</p>'; return;} let html='<ul class="list">'; list.forEach((it,i)=>{ html+=`<li><strong>${i+1}.</strong> ${formatHM(it.start)} → ${formatHM(it.end)}<br><small>${it.start.toLocaleDateString()}</small></li>`;}); html+='</ul>'; box.innerHTML=html; }
export function exportPDF(){ alert('Export PDF : version simplifiée.'); }
export function exportExcel(){ alert('Export Excel : version simplifiée.'); }
export function resetAll(){ if(!confirm('Réinitialiser complètement la période ?')) return; clearAll(); window.location.href='index.html'; }
