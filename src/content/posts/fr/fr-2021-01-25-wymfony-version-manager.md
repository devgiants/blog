---
publicSlug: wymfony-version-manager
locale: fr
title:  "Gestionnaire de version Symfony"
date:   2021-01-25 09:40:00 +0100
tags:
- symfony
- version

excerpt: "Depuis un moment je me demandais comment gérer proprement l’affichage et la gestion de version dans une application Symfony. Connaissez-vous Shivas Versioning Bundle ?"

---
## Afficher la version. Pour quoi faire ?
Sur le long terme, afficher la version de l’application est essentiel pour des raisons de __repérage__.
Vos utilisateurs peuvent citer ce numéro lorsqu’ils contactent le support, et vous pouvez aussi l’utiliser pour vérifier rapidement qu’un déploiement s’est bien déroulé (en plus des autres outils fournis par votre stack CI/CD, bien sûr).

## Comment le gérer ?
Même si la question me trottait dans la tête depuis longtemps, je n’avais jamais vraiment pris le temps de chercher une solution simple sur ce sujet.
En le faisant, j’ai trouvé [Shivas versionning bundle](https://github.com/shivas/versioning-bundle). Il fait tout simplement __tout ce que je voulais__ :

- Une extension Twig pour gérer le numéro de version.
- Plusieurs fournisseurs de version (du fichier `VERSION` à la gestion des tags Git) adaptés aux usages courants.
- Basé sur [SemVer](https://semver.org/).
- Des formatters par défaut pour être opérationnel immédiatement.

Comme pour tous les bundles bien conçus, vous pouvez enregistrer vos propres providers et formatters en tant que services.

Merci à son auteur pour ce travail mis à disposition de la communauté.
