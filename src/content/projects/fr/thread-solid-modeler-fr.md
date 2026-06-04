---
key: thread-solid-modeler
slug: thread-solid-modeler-fr
publicSlug: thread-solid-modeler
locale: fr
title: ThreadSolidModeler
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

Le flux ISO ouvre une boîte de dialogue modeless pour choisir le template de sketch et l'offset de pas. Le flux `3D Print` part de la géométrie de thread sélectionnée, pré-remplit un profil trapézoïdal basé sur le diamètre nominal et permet d'ajuster les dimensions manuellement.

Le modèle est ensuite construit à partir du template ou du profil dédié, puis le thread cosmétique d'origine est supprimé par suppression de la feature.

Le projet supporte les threads standards et coniques. Le template par défaut est `ISO Template.ipt`, avec `BSW Template.ipt` également fourni dans le bundle.

Le projet est terminé et le dépôt est disponible sur [GitHub](https://github.com/devgiants/thread-solid-modeler).
