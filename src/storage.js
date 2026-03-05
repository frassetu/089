/*******************************************************************
 * storage.js
 *******************************************************************/
const KEY_PERIOD = "astreinte_period";
const KEY_INTERVS = "astreinte_interventions";
const KEY_FERIES  = "astreinte_feries";
export function savePeriod(p){localStorage.setItem(KEY_PERIOD, JSON.stringify(p));}
export function loadPeriod(){const txt=localStorage.getItem(KEY_PERIOD); if(!txt) return null; const obj=JSON.parse(txt); return {start:new Date(obj.start), end:new Date(obj.end)};}
export function saveFeries(list){localStorage.setItem(KEY_FERIES, JSON.stringify(list));}
export function loadFeries(){const txt=localStorage.getItem(KEY_FERIES); if(!txt) return null; return JSON.parse(txt);} 
export function saveInterventions(list){const arr=list.map(it=>({start:it.start.toISOString(), end:it.end.toISOString()})); localStorage.setItem(KEY_INTERVS, JSON.stringify(arr));}
export function loadInterventions(){const txt=localStorage.getItem(KEY_INTERVS); if(!txt) return null; const arr=JSON.parse(txt); return arr.map(it=>({start:new Date(it.start), end:new Date(it.end)}));}
export function clearAll(){localStorage.removeItem(KEY_PERIOD); localStorage.removeItem(KEY_INTERVS); localStorage.removeItem(KEY_FERIES);} 
