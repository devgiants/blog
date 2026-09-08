---
key: silorium
slug: silorium-fr
publicSlug: silorium
locale: fr
title: Silorium
summary: Gestion locale et résiliente des réserves d'un foyer, avec saisie mobile, rotation des stocks et synchronisation hors ligne.
url: https://gitlab.com/devgiants/kotlin/silorium
date: 2026-09-08
status: En cours
stack: [Kotlin Multiplatform, Compose Desktop & Android, Ktor, SQLDelight, Architecture hexagonale]
featured: true
---

## Le problème traité

Une réserve n'est utile que si l'on sait ce qu'elle contient, où chaque lot se trouve et ce qui doit être consommé en premier. Silorium vise un suivi assez rapide pour rester fidèle au stock réel : saisie immédiate après les courses, récupération guidée au quotidien et enrichissement progressif des informations.

Le produit associe une application centrale d'administration et un compagnon Android utilisable dans les lieux de stockage. Le compagnon continue à enregistrer les mouvements hors ligne, puis expose clairement l'état de synchronisation et les éventuelles divergences.

<div class="project-gallery my-8" data-project-gallery>
  <div class="project-gallery__stage"><figure class="project-gallery__slide is-active"><img src="/silorium/central-dashboard.png" alt="Tableau de bord central Silorium" data-gallery-main-image /><figcaption class="project-gallery__caption" data-gallery-main-caption>Le tableau de bord fait remonter les décisions, les écarts aux objectifs et les prochaines expirations.</figcaption></figure></div>
  <div class="project-gallery__thumbs" role="tablist" aria-label="Maquettes Silorium">
    <button class="project-gallery__thumb is-active" type="button" data-gallery-thumb data-image="/silorium/central-dashboard.png" data-alt="Tableau de bord central Silorium" data-caption="Le tableau de bord fait remonter les décisions, les écarts aux objectifs et les prochaines expirations."><img src="/silorium/central-dashboard.png" alt="" aria-hidden="true" /><span>Vue centrale</span></button>
    <button class="project-gallery__thumb" type="button" data-gallery-thumb data-image="/silorium/companion-home.png" data-alt="Accueil du compagnon mobile Silorium" data-caption="Le compagnon garde les deux gestes essentiels accessibles, même hors ligne."><img src="/silorium/companion-home.png" alt="" aria-hidden="true" /><span>Accueil mobile</span></button>
    <button class="project-gallery__thumb" type="button" data-gallery-thumb data-image="/silorium/companion-intake.png" data-alt="Parcours de rangement Silorium" data-caption="La capture privilégie la vitesse, avec enrichissement et confirmation au bon moment."><img src="/silorium/companion-intake.png" alt="" aria-hidden="true" /><span>Ranger</span></button>
    <button class="project-gallery__thumb" type="button" data-gallery-thumb data-image="/silorium/companion-retrieve.png" data-alt="Parcours de récupération Silorium" data-caption="La récupération recommande le lot à utiliser et indique précisément son emplacement."><img src="/silorium/companion-retrieve.png" alt="" aria-hidden="true" /><span>Récupérer</span></button>
  </div>
</div>

## Une expérience orientée action

- Scanner un code-barres ou rechercher un produit sans configuration préalable lourde.
- Photographier temporairement une date d'expiration pour assister sa saisie, puis supprimer l'image.
- Recommander le lot à sortir selon sa date et indiquer son emplacement avant confirmation.
- Suivre des objectifs quantitatifs et rendre visibles les données utilisées pour les estimations.
- Signaler les expirations urgentes, les écarts de stock et les opérations qui demandent une décision.

## Une architecture pour les situations réelles

Silorium repose sur deux monolithes modulaires spécialisés, Central et Companion, reliés par un protocole versionné. Le domaine partagé reste déterministe et isolé des interfaces, du stockage, du réseau et des connecteurs externes.

Les mouvements qui déterminent le stock forment un journal immuable. Les projections de lecture peuvent être reconstruites, les corrections préservent l'observation physique et l'autorité centrale sérialise les mutations. La synchronisation REST sur le réseau local est conçue pour supporter les répétitions, les interruptions et les opérations mobiles créées hors ligne sans perte silencieuse.

## État du projet

Le cadrage produit, les parcours UX, le système visuel, le modèle fonctionnel et l'architecture de référence sont établis. Les maquettes présentées décrivent la cible en cours de réalisation ; elles permettent de valider les gestes principaux, les états hors ligne et l'accessibilité avant l'implémentation complète.

[Suivre le développement sur GitLab](https://gitlab.com/devgiants/kotlin/silorium).

<script is:inline>
  document.querySelectorAll('[data-project-gallery]').forEach((gallery) => {
    const image = gallery.querySelector('[data-gallery-main-image]'); const caption = gallery.querySelector('[data-gallery-main-caption]'); const thumbs = [...gallery.querySelectorAll('[data-gallery-thumb]')];
    thumbs.forEach((button) => button.addEventListener('click', () => { thumbs.forEach((thumb) => thumb.classList.toggle('is-active', thumb === button)); image.src = button.dataset.image; image.alt = button.dataset.alt || ''; caption.textContent = button.dataset.caption || ''; }));
  });
</script>
