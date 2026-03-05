/*********************************************************************
 * router.js
 *********************************************************************/
export const ROUTES={ accueil:'index.html', actions:'actions.html', synthese:'synthese.html', interventions:'interventions.html' };
export function goTo(page){ if(!ROUTES[page]){ console.error('Route inconnue :', page); return;} window.location.href=ROUTES[page]; }
export function initRouterLinks(){ const links=document.querySelectorAll('[data-route]'); links.forEach(li=>{ const route=li.dataset.route; li.addEventListener('click', ()=> goTo(route));}); }
export function goBack(){ window.history.back(); }
