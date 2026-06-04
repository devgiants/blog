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

<div class="project-gallery my-8">
  <input class="project-gallery__input" type="radio" name="thread-solid-modeler-gallery" id="tsm-slide-1" checked />
  <input class="project-gallery__input" type="radio" name="thread-solid-modeler-gallery" id="tsm-slide-2" />
  <input class="project-gallery__input" type="radio" name="thread-solid-modeler-gallery" id="tsm-slide-3" />
  <input class="project-gallery__input" type="radio" name="thread-solid-modeler-gallery" id="tsm-slide-4" />

  <div class="project-gallery__stage">
    <figure class="project-gallery__slide project-gallery__slide--1">
      <img src="/thread-solid-modeler/female_thread.png" alt="Taraudage modélisé" />
      <figcaption class="project-gallery__caption">Vue principale du taraudage modélisé</figcaption>
    </figure>
    <figure class="project-gallery__slide project-gallery__slide--2">
      <img src="/thread-solid-modeler/male_thread_with_progressive_start.png" alt="Filetage mâle avec démarrage progressif" />
      <figcaption class="project-gallery__caption">Filetage mâle avec démarrage progressif</figcaption>
    </figure>
    <figure class="project-gallery__slide project-gallery__slide--3">
      <img src="/thread-solid-modeler/thread_male_female_with_clearance_1.png" alt="Assemblage mâle et femelle avec jeu" />
      <figcaption class="project-gallery__caption">Assemblage mâle / femelle avec jeu</figcaption>
    </figure>
    <figure class="project-gallery__slide project-gallery__slide--4">
      <img src="/thread-solid-modeler/thread_male_female_with_clearance_2.png" alt="Assemblage mâle et femelle avec jeu, autre vue" />
      <figcaption class="project-gallery__caption">Assemblage mâle / femelle avec jeu, autre vue</figcaption>
    </figure>
  </div>

  <div class="project-gallery__thumbs">
    <label class="project-gallery__thumb" for="tsm-slide-1">
      <img src="/thread-solid-modeler/female_thread.png" alt="Miniature du taraudage modélisé" />
      <span>Vue principale</span>
    </label>
    <label class="project-gallery__thumb" for="tsm-slide-2">
      <img src="/thread-solid-modeler/male_thread_with_progressive_start.png" alt="Miniature du filetage mâle avec démarrage progressif" />
      <span>Démarrage progressif</span>
    </label>
    <label class="project-gallery__thumb" for="tsm-slide-3">
      <img src="/thread-solid-modeler/thread_male_female_with_clearance_1.png" alt="Miniature de l'assemblage mâle et femelle avec jeu" />
      <span>Jeu de montage</span>
    </label>
    <label class="project-gallery__thumb" for="tsm-slide-4">
      <img src="/thread-solid-modeler/thread_male_female_with_clearance_2.png" alt="Miniature de l'assemblage mâle et femelle avec jeu, autre vue" />
      <span>Autre vue</span>
    </label>
  </div>
</div>

Le modèle est ensuite construit à partir du template ou du profil dédié, puis le filetage cosmétique d'origine est supprimé par suppression de la feature.

La génération classique supporte les filetages standards et coniques. Le template par défaut est `ISO Template.ipt`, avec `BSW Template.ipt` également fourni dans le bundle.

Le projet est terminé et le dépôt est disponible sur [GitHub](https://github.com/devgiants/thread-solid-modeler).
