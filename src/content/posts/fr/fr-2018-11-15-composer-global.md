---
publicSlug: composer-global
locale: fr
title: "Composer peut aussi s'utiliser globalement"
date: 2018-11-15 10:00:00 +0100
tags:
  - php
  - composer
excerpt: "Composer peut être utilisé globalement. Voyons comment."
---

En tant qu’utilisateur quotidien de [Composer](https://getcomposer.org), je l’ai toujours utilisé dans le cadre d’un projet, c’est-à-dire avec un `composer.json` présent dans un répertoire de projet spécifique.
J’ai découvert récemment qu’il peut aussi être utilisé de manière [globale](https://getcomposer.org/doc/03-cli.md#global) (donc sans lien avec un projet) à l’aide du modificateur `global` :

```
composer global require squizlabs/php_codesniffer
``` 

Le package installé globalement sera accessible à l’échelle de l’utilisateur. Sur mon système Ubuntu, le dossier `vendor` global se trouve dans `~/.config/composer/`.

J’ai réalisé hier que cette fonctionnalité est exactement la même que celle proposée par `npm`, `yarn` ou `bower`, d’autres gestionnaires de packages/dépendances.
