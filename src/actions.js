/**********************************************************************
 * actions.js
 **********************************************************************/
import { handleQuickButton, initPopupUI, initMenuUI } from './ui.js';
import { addManualIntervention } from './interventions.js';

window.addEventListener('DOMContentLoaded', ()=>{
  initPopupUI();
  initMenuUI();
  document.querySelectorAll('.fast').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const d=parseInt(btn.dataset.duree); handleQuickButton(d);
    });
  });
  const manualBtn=document.getElementById('manual');
  if(manualBtn){ manualBtn.addEventListener('click', ()=>openManualPopup()); }
});

function openManualPopup(){
  const container=document.createElement('div');
  container.className='popup'; container.style.background='#0009';
  container.innerHTML=`
    <div class="popup-box">
      <h2>Intervention manuelle</h2>
      <label>Date : <input id="manDate" type="date" class="input"/></label>
      <label>Heure début : <input id="manDeb" type="time" class="input"/></label>
      <label>Heure fin : <input id="manFin" type="time" class="input"/></label>
      <div class="popup-buttons">
        <button id="manCancel" class="btn secondary">Annuler</button>
        <button id="manOK" class="btn primary">Valider</button>
      </div>
    </div>`;
  document.body.appendChild(container);
  container.querySelector('#manCancel').onclick=()=>container.remove();
  container.querySelector('#manOK').onclick=()=>{
    const date=container.querySelector('#manDate').value;
    const deb =container.querySelector('#manDeb').value;
    const fin =container.querySelector('#manFin').value;
    if(date&&deb&&fin){ addManualIntervention(date,deb,fin); }
    container.remove();
  };
}
