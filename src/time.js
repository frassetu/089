/*****************************************************
 * time.js
 *****************************************************/
export function now(){return new Date();}
export function quarterOf(date){const minutes=date.getMinutes();const quarter=Math.floor(minutes/15)*15;return new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),quarter,0);}
export function addMinutes(date,min){return new Date(date.getTime()+min*60000);} 
export function formatHM(date){let h=date.getHours();let m=date.getMinutes();return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`;}
export function diffMinutes(start,end){return Math.round((end.getTime()-start.getTime())/60000);} 
export function computeAstreintePeriod(wedDateStr){const d=new Date(wedDateStr+"T00:00:00");const start=new Date(d.getFullYear(),d.getMonth(),d.getDate(),17,15,0);const end=new Date(d.getFullYear(),d.getMonth(),d.getDate()+7,7,30,0);return {start,end};}
export function isInAstreinte(date,period){return date.getTime()>=period.start.getTime()&&date.getTime()<=period.end.getTime();}
export function isInsideAstreinteRules(date,feries){const day=date.getDay();const hm=date.getHours()*60+date.getMinutes();const isFerie=feries.some(f=>isSameDay(date,new Date(f)));if(day===0||day===6||isFerie){return true;}const start=17*60+15;const end=7*60+30;return (hm>=start)||(hm<=end);} 
export function isSameDay(a,b){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();}
export function nextDay(date){return new Date(date.getFullYear(),date.getMonth(),date.getDate()+1,date.getHours(),date.getMinutes(),0);} 
