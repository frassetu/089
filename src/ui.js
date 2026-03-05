/**********************************************************************
 * ui.js
 **********************************************************************/
import { createQuickIntervention, addQuickIntervention } from "./interventions.js";
import { loadPeriod } from "./storage.js";
import { getFeries } from "./feries.js";

export function showToast(msg){const t=document.getElementById('toast'); if(!t) return; t.textContent=msg; t.classList.remove('hidden'); setTimeout(()=>t.classList.add('hidden'),2000);} 
let popupResolve=null; 
export function showOutsidePopup(message){const box=document.getElementById('popupOverlay'); const msg=document.getElementById('popupMessage'); msg.textContent=message; box.classList.remove('hidden'); return new Promise(resolve=>{popupResolve=resolve;});}
export function hideOutsidePopup(){const box=document.getElementById('popupOverlay'); box.classList.add('hidden');}
export function initPopupUI(){const cancelBtn=document.getElementById('popupCancel'); const confirmBtn=document.getElementById('popupConfirm'); if(cancelBtn){cancelBtn.onclick=()=>{hideOutsidePopup(); popupResolve&&popupResolve(false);};} if(confirmBtn){confirmBtn.onclick=()=>{hideOutsidePopup(); popupResolve&&popupResolve(true);};}}
export function initMenuUI(){const openBtn=document.getElementById('openMenu'); const closeBtn=document.getElementById('closeMenu'); const panel=document.getElementById('menuPanel'); if(openBtn&&panel){openBtn.onclick=()=>panel.classList.remove('hidden');} if(closeBtn&&panel){closeBtn.onclick=()=>panel.classList.add('hidden');}}
export async function handleQuickButton(dureeMin){const period=loadPeriod(); const feries=getFeries(); const itv=createQuickIntervention(dureeMin,feries,period); // Option C: popup hors astreinte -- ici on considère inside (règles globales déjà prises en compte)
 addQuickIntervention(dureeMin,feries,period); showToast(`Ajouté : ${itv.start.toLocaleTimeString()} → ${itv.end.toLocaleTimeString()}`);}
