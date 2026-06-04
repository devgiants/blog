---
key: din-electrical-panel-labeler
slug: din-electrical-panel-labeler-fr
publicSlug: din-electrical-panel-labeler
locale: fr
title: DIN Electrical Panel Labels Generator
summary: Générateur HTML autonome pour produire des étiquettes de tableau électrique DIN imprimables à l'échelle réelle.
url: https://gitlab.com/devgiants/web/din-electrical-panel-labeler
date: 2026-03-01
status: Terminé
stack:
  - HTML
  - CSS
  - JavaScript
  - Print
featured: true
---

DIN Electrical Panel Labels Generator est un outil HTML/CSS/JavaScript autonome pour générer des étiquettes de tableau électrique DIN imprimables à l'échelle réelle.

Le fichier est volontairement unique et ne demande aucune installation, aucun build step et aucune dépendance. Il s'ouvre directement dans le navigateur, ce qui permet d'éditer les étiquettes puis d'imprimer ou d'exporter en PDF à 100 % de l'échelle.

Le document intègre une calibration sur les dimensions DIN, avec `1U = 17,5 mm`, et propose une configuration fine du panneau:

- nombre de rangées
- nombre de modules par rangée
- hauteur d'étiquette
- positionnement automatique des emplacements
- support du texte multilignes
- icônes SVG monochromes
- tag pièce optionnel
- couleur de fond optionnelle
- sauvegarde et chargement JSON

Les étiquettes peuvent porter un numéro de rangée, une position, une largeur en modules, une icône, un tag pièce, une couleur de fond et du texte sur plusieurs lignes.

Le projet est terminé et le dépôt est disponible sur [GitLab](https://gitlab.com/devgiants/web/din-electrical-panel-labeler).
