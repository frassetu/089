/******************************************************************
 * feries.js
 ******************************************************************/
import { loadFeries, saveFeries } from "./storage.js";
export function getFeries(){return loadFeries()??[]}
export function addFerie(dateStr){if(!dateStr) return; const list=getFeries(); if(notIn(list,dateStr)){list.push(dateStr); list.sort(); saveFeries(list);} return list; function notIn(a,x){return a.indexOf(x)===-1;}}
export function removeFerie(dateStr){const list=getFeries().filter(f=>f!==dateStr); saveFeries(list); return list;}
export function isFerieDate(dateObj){const y=dateObj.getFullYear(); const m=(dateObj.getMonth()+1).toString().padStart(2,"0"); const d=dateObj.getDate().toString().padStart(2,"0"); const key=`${y}-${m}-${d}`; return getFeries().includes(key);} 
