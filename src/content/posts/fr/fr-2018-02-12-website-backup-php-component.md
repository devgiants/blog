---
publicSlug: website-backup-php-component
locale: fr
title: "Composant PHP de sauvegarde de sites web"
date: 2018-02-12 16:55:24 +0100
tags:
  - symfony
  - console
  - command
excerpt: "Je présente ici un composant PHP pour sauvegarder des sites web. Packagé en application PHAR avec auto-update, il permet plusieurs options pour sauvegarder les assets des sites (databases et fichiers) sur plusieurs storages."
---

## Contexte

J’avais besoin depuis un moment de packager un composant PHP qui me permette de sauvegarder __rapidement__ et __sûrement__ les sites que je réalise. Les objectifs étaient les suivants :
* exécution en ligne de commande (approche automatisable)
* grande configurabilité (ajout de sites, backup medias...)
* approche basée sur Composer (PHAR, auto-update)

J’ai donc développé [websites-backup][websites-backup]. Les détails sont ci-dessous.

## Utilisation du composant

À l’aide d’un fichier de configuration [YAML][yaml], vous pouvez définir :
* __Plusieurs sites à sauvegarder__ (présents physiquement sur le serveur et accessibles par l’utilisateur système de la commande) : chaque site est composé d’un couple databases/fichiers (seulement MySQL pour le moment)
* __Plusieurs backup medias__ : à ce stade, seul FTP est développé. À terme, j’aimerais mettre en place une passerelle Amazon et Dropbox. L’objectif ici est clairement de permettre plusieurs storages simultanés et synchronisés.

_Note : d’un point de vue sécurité, je recommande de créer un utilisateur système par site, avec des droits en lecture seule._

## Basé sur des components Symfony...

J’ai utilisé ce projet comme __terrain d’entraînement pour n’utiliser que quelques components Symfony__. De mon point de vue, c’est une très bonne manière de les prendre en main pour de vrai et de se concentrer sur leurs périmètres et leurs limitations. Un rapide coup d’œil à `composer.json` donne la liste des components :
* __Console component__ : il fournit l’approche et les outils en ligne de commande. Arguments, options, console styling...
* __Config component__ : il apporte la gestion de configuration, avec des méthodes chaînées puissantes pour vérifier et décider quoi faire des valeurs de configuration transmises à l’application.
* __YAML component__ : le parser YAML, utile pour lire le fichier de configuration cité au-dessus.

## ...Mais pas seulement

Pour renforcer l’application du point de vue usage et maintenance, j’utilise aussi quelques packages :
* [The excellent Box][box] : permet de créer un PHAR configurable en un rien de temps.
* Phar update (ancien mais toujours fonctionnel) : avec un système de manifest, il fournit la logique nécessaire pour vérifier l’existence de nouvelles versions et mettre à jour si besoin.

Voici le process que je suis :
1. Faire les mises à jour (code, README...) qui feront partie de la future release
2. Commiter les changements et créer un tag cohérent (par exemple : 1.0.13)
3. Packager l’application avec Box
4. Publier l’archive et le manifest de mise à jour sur GitHub pages (branche gh-pages)

Au prochain lancement, l’application décide, à partir du manifest, si une version plus récente est disponible (comparaison numérique des versions, d’où l’intérêt d’un tagging cohérent et séquentiel). La commande `self-update` met alors effectivement l’application à jour.

## Aussi

Étant donné que plusieurs commandes sont disponibles via websites-backup, j’ai choisi [Pimple][pimple] pour disposer d’un container d’injection de dépendances simple mais puissant. Je peux instancier les dépendances au point d’entrée principal de l’application :
```php
$container = new Container();
$container['tools'] = new BackupTools();
```

Puis passer le container à toutes les commandes :

```php
$application->add(new Command\BackupCommand('backup', $container));
$application->add(new Command\RetrieveBackupCommand('retrieve', $container));
```

## Roadmap

OK, ça fonctionne, mais il y a [de nombreuses fonctionnalités et améliorations][project] que je souhaite ajouter. Si le projet vous intéresse et que vous souhaitez donner un coup de main, n’hésitez pas à me contacter !

[websites-backup]: https://github.com/devgiants/websites-backup
[yaml]: https://github.com/devgiants/websites-backup#backup
[pimple]: https://pimple.symfony.com/
[box]: https://github.com/box-project/box2
[project]: https://github.com/devgiants/websites-backup/projects/1
