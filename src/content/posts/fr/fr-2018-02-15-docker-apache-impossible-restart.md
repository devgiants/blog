---
publicSlug: docker-apache-impossible-restart
locale: fr
title: "Docker Apache impossible à relancer : httpd already running"
date: 2018-02-15 18:35:36 +0100
tags:
  - docker
  - apache
excerpt: "Comment corriger cette erreur avec mes stacks Docker."
---

## Contexte

Dans les stacks Docker que j’ai créées ([ici][wordpress-stack] et [ici][symfony-stack]), j’ai fini par constater après quelques usages que je pouvais rencontrer un problème au redémarrage de la stack. __Apache ne démarre pas__ avec le message suivant : `httpd (pid: XX) already running.`

## Explication

J’utilise généralement `docker-compose stop` pour arrêter mes stacks entre deux projets. C’est différent de `docker-compose down` parce que cela ne détruit pas les containers, mais les arrête seulement. Dans un monde idéal, il n’y aurait aucun souci, et en plus c’est un peu plus rapide.

En revanche, si la stack s’arrête à cause d’un crash, __les containers peuvent devenir totalement inutilisables__. À cause de l’architecture interne d’Apache, un nouveau démarrage va trouver le fichier `/var/run/apache2/apache2.pid` et le système du container ne lancera pas Apache __afin d’éviter (du moins c’est ce qu’il comprend) une seconde instance déjà active__.

## Solution

Il y a deux points ici :
1. Utiliser `docker-compose down` plutôt que `docker-compose stop`. D’un point de vue Docker, c’est la bonne pratique, parce que __chaque container sera recréé from scratch__ à chaque fois que vous en aurez besoin. Comme vous avez persisté ce qu’il faut dans des volumes, vous ne perdez rien.
2. Personnaliser votre image Apache [pour supprimer ce fichier de lock][remove-pid] quand le container est recréé.

[wordpress-stack]: https://github.com/compagnie-hyperactive/docker-boilerplate-wordpress
[symfony-stack]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony
[remove-pid]: https://github.com/compagnie-hyperactive/docker-boilerplate-wordpress/blob/f7086f7fa23362b6c64707816fafaee2dbf73e6c/docker/images/apache2.4/Dockerfile#L17
