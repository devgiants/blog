---
key: thread-solid-modeler
slug: thread-solid-modeler-fr
publicSlug: thread-solid-modeler
locale: fr
title: Thread Solid Modeler
summary: Add-in Autodesk Inventor qui transforme les threads cosmétiques en géométrie 3D modélisée.
url: https://github.com/devgiants/thread-solid-modeler
date: 2026-02-01
status: Terminé
stack:
  - C#
  - .NET Framework 4.8
  - Autodesk Inventor
  - Windows
featured: true
---

ThreadSolidModeler est un add-in Autodesk Inventor qui transforme des threads cosmétiques existants en géométrie 3D réellement modélisée.

Le projet reprend la base de `ThreadModeler` de coolOrange / Philippe Leefsma et la poursuit pour Autodesk Inventor 2026.

L'add-in fonctionne sur des `ThreadFeature` sélectionnés dans un document Part. Il expose deux commandes dans le ruban du Part:

- le flux ISO
- le flux `3D Print`

Le flux ISO ouvre une boîte de dialogue modeless pour choisir le template de sketch et l'offset de pas.
Le flux `3D Print` part de la géométrie de thread sélectionnée, pré-remplit un profil trapézoïdal basé sur le diamètre nominal et permet d'ajuster les dimensions manuellement. Il se base sur certaines caractéristiques du filetage initial, mais permet la modification des paramètres (donc la sortie du standard choisi) pour s'assurer que **le filetage sera imprimable et fonctionnel**. Il permet notamment **l'ajout d'un jeu** pour faciliter l'ajustement en fonction de la précision de l'imprimante 3D utilisée.

<div class="project-gallery my-8" data-thread-gallery>
  <div class="project-gallery__stage">
    <figure class="project-gallery__slide is-active" data-gallery-slide>
      <img src="/thread-solid-modeler/female_thread.png" alt="Taraudage modélisé" data-gallery-main-image />
      <figcaption class="project-gallery__caption" data-gallery-main-caption>Vue principale du taraudage modélisé</figcaption>
    </figure>
  </div>

  <div class="project-gallery__thumbs" role="tablist" aria-label="Galerie Thread Solid Modeler">
    <button class="project-gallery__thumb is-active" type="button" data-gallery-thumb data-image="/thread-solid-modeler/female_thread.png" data-alt="Taraudage modélisé" data-caption="Vue principale du taraudage modélisé">
      <img src="/thread-solid-modeler/female_thread.png" alt="" aria-hidden="true" />
      <span>Vue principale</span>
    </button>
    <button class="project-gallery__thumb" type="button" data-gallery-thumb data-image="/thread-solid-modeler/male_thread_with_progressive_start.png" data-alt="Filetage mâle avec démarrage progressif" data-caption="Filetage mâle avec démarrage progressif">
      <img src="/thread-solid-modeler/male_thread_with_progressive_start.png" alt="" aria-hidden="true" />
      <span>Démarrage progressif</span>
    </button>
    <button class="project-gallery__thumb" type="button" data-gallery-thumb data-image="/thread-solid-modeler/thread_male_female_with_clearance_1.png" data-alt="Assemblage mâle et femelle avec jeu" data-caption="Assemblage mâle / femelle avec jeu">
      <img src="/thread-solid-modeler/thread_male_female_with_clearance_1.png" alt="" aria-hidden="true" />
      <span>Jeu de montage</span>
    </button>
    <button class="project-gallery__thumb" type="button" data-gallery-thumb data-image="/thread-solid-modeler/thread_male_female_with_clearance_2.png" data-alt="Assemblage mâle et femelle avec jeu, autre vue" data-caption="Assemblage mâle / femelle avec jeu, autre vue">
      <img src="/thread-solid-modeler/thread_male_female_with_clearance_2.png" alt="" aria-hidden="true" />
      <span>Autre vue</span>
    </button>
  </div>
</div>

Le modèle est ensuite construit à partir du template ou du profil dédié, puis le filetage cosmétique d'origine est supprimé par suppression de la feature.

La génération classique supporte les filetages standards et coniques. Le template par défaut est `ISO Template.ipt`, avec `BSW Template.ipt` également fourni dans le bundle.

Le projet est terminé et le dépôt est disponible sur [GitHub](https://github.com/devgiants/thread-solid-modeler).

<script is:inline>
  const gallery = document.querySelector('[data-thread-gallery]');
  if (gallery) {
    const mainImage = gallery.querySelector('[data-gallery-main-image]');
    const mainCaption = gallery.querySelector('[data-gallery-main-caption]');
    const thumbButtons = [...gallery.querySelectorAll('[data-gallery-thumb]')];

    const activate = (button) => {
      thumbButtons.forEach((thumb) => thumb.classList.toggle('is-active', thumb === button));
      mainImage.src = button.dataset.image;
      mainImage.alt = button.dataset.alt || '';
      mainCaption.textContent = button.dataset.caption || '';
    };

    thumbButtons.forEach((button) => {
      button.addEventListener('click', () => activate(button));
    });
  }
</script>
