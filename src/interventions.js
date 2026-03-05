/************************************************************
 * interventions.js
 *************************************************************/
import { now, quarterOf, addMinutes } from "./time.js";
import { saveInterventions, loadInterventions } from "./storage.js";

export function getInterventions(){return loadInterventions()??[];}
function store(list){saveInterventions(list);} 
export function fuseInterventions(list){if(list.length<=1) return list; const result=[]; let current=list[0]; for(let i=1;i<list.length;i++){const next=list[i]; if(next.start.getTime()===current.end.getTime()){current={start:current.start,end:next.end};} else {result.push(current); current=next;}} result.push(current); return result;}
function pushIntervention(intervention){let list=getInterventions(); list.push(intervention); list.sort((a,b)=>a.start.getTime()-b.start.getTime()); list=fuseInterventions(list); store(list); return list;}
export function createQuickIntervention(dureeMin, feries, astreintePeriod){const n=now(); const start=quarterOf(n); const end=addMinutes(start,dureeMin); const isInside = true; return {start,end,isInsideAstreinte:isInside};}
export function addQuickIntervention(dureeMin, feries, astreintePeriod){const itv=createQuickIntervention(dureeMin,feries,astreintePeriod); return pushIntervention({start:itv.start,end:itv.end});}
export function addManualIntervention(dateStr,debutHM,finHM){const [h1,m1]=debutHM.split(":").map(Number); const [h2,m2]=finHM.split(":").map(Number); const start=new Date(dateStr+`T${h1.toString().padStart(2,"0")}:${m1.toString().padStart(2,"0")}:00`); const end=new Date(dateStr+`T${h2.toString().padStart(2,"0")}:${m2.toString().padStart(2,"0")}:00`); if(end.getTime()<start.getTime()){end.setDate(end.getDate()+1);} return pushIntervention({start,end});}
export function clearAllInterventions(){store([]);} 
