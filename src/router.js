/*********************************************************************
 * router.js
 * 
 * Petit module centralisé de navigation interne.
 * 
 * Avantages :
 * - évite de réécrire window.location.href partout
 * - uniformise les chemins des pages
 * - rend possible une évolution vers une navigation AJAX
 *********************************************************************/


/* ================================================================
   TABLE DES ROUTES
   ================================================================ */

export const ROUTES = {
  accueil:        "index.html",
  actions:        "actions.html",
  synthese:       "synthese.html",
  interventions:  "interventions.html"
};


/* ================================================================
   NAVIGATION SIMPLIFIÉE
   ================================================================ */

export function goTo(page) {
  if (!ROUTES[page]) {
    console.error("Route inconnue :", page);
    return;
  }
  window.location.href = ROUTES[page];
}


/* ================================================================
   LIENS DANS LE MENU BURGER
   (Le HTML du menu utilise : <li data-route="actions"> ...)
   ================================================================ */

export function initRouterLinks() {
  const links = document.querySelectorAll("[data-route]");

  links.forEach(li => {
    const route = li.dataset.route;

    li.addEventListener("click", () => {
      goTo(route);
    });
  });
}


/* ================================================================
   UTILITAIRE FACULTATIF :
   RETOUR SIMPLE
   ================================================================ */

export function goBack() {
  window.history.back();
}