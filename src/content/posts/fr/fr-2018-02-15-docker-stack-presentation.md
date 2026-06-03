---
publicSlug: docker-stack-presentation
locale: fr
title: "Présentation des stacks Docker"
date: 2018-02-15 13:24:14 +0100
tags:
  - docker
  - stack
excerpt: "Cet article présente la stack que j’ai créée pour mon travail quotidien autour de Symfony et Wordpress."
---

## Mes objectifs

Docker était l’une de ces choses __dans lesquelles je voulais me lancer__ depuis un moment, sans forcément avoir le temps de m’y plonger. J’ai finalement pris le train en marche et, même si je reste plus proche du padawan que du guru, j’ai pu construire __2 stacks que je présente ci-dessous__ : une pour [Symfony][symfony-stack], et une autre pour [Wordpress][wordpress-stack].

Les deux sont de nouveaux boilerplates utilisés pour tous les nouveaux projets, qu’ils soient [@LCH][LCH] ou personnels.

## Stack Symfony
![Symfony stack](/assets/posts-images/stack-symfony.svg)

Elle permet d’installer __un environnement de travail complet pour Symfony 2.X ou 3.X__. Symfony Flex (utilisable à partir de 3.4+) n’est pas inclus ici, nous avons créé une [branche spécifique][symfony-4-branch] pour la 4.X. Vous y trouvez 4 containers :

* mysql
* php
* apache
* phpmyadmin

Voici les spécificités importantes.

### Variables d’environnement
Toutes les variables nécessaires au `docker-compose.yml` sont stockées dans un fichier `.env` (documentation Docker [ici][env-file-documentation]).
Ce fichier `.env` est aussi défini à l’intérieur des containers pour exposer les variables d’environnement nécessaires. Pour cela, il suffit de passer le fichier `.env` via l’option `env_file` (documentation [ici][env-file-option]).

Cela donne la possibilité intéressante __de les utiliser dans les fichiers ajoutés au container__ (comme le [app.conf][app.conf] qui définit le vhost de l’application en utilisant `$FPM_HOST`). Vous pouvez faire la même chose directement dans le `Dockerfile`.

_Note importante : pour cela, il faut simplement les déclarer explicitement avec le mot-clé `ARG` ([exemple][dockerfile-arg-definition])._

### Volumes
J’y crée 3 volumes :
* [Celui de la base de données][database-volume]
* [Celui des fichiers de l’application][app-volume]
* [Celui des logs Apache][apache-logs-volume]

_Restez à l’écoute pour un article dédié aux volumes._

### Start bash
Pour faciliter le démarrage, j’ai créé un [fichier bash][bash-file] qui exécute les actions suivantes :
1. Création des dossiers des volumes (s’ils n’existent pas déjà)
2. Téléchargement et installation du Symfony installer (si la commande `symfony` n’est pas encore enregistrée)
3. Installation de Symfony en utilisant le numéro de version spécifié dans le fichier `.env`
4. Copie du fichier `.env` pour permettre à l’application Symfony d’accéder à ses variables (décrit [ici][dotenv] et [ici][external_params])
5. Copie du fichier `parameters.yml.dist` et substitution des paramètres avec la commande `envsubst`. _Note : j’ai choisi de ne pas utiliser le [DotEnv component][dotenv] afin de garantir une rétro-compatibilité totale avec 2.X et 3.4-._
6. Installation de `docker-compose` s’il n’est pas déjà présent et enregistré sous le nom `docker-compose`
7. Mise en route des containers (avec build)
8. Suppression du fichier `parameters.yml` pour forcer sa régénération (j’ai rencontré ce cas lors de mes tests, où un `composer update` ne rafraîchit pas le fichier `parameters.yml`)
9. `composer update`

## Stack Wordpress
![Wordpress stack](/assets/posts-images/stack-wordpress.svg)

La stack Wordpress fait la même chose qu’au-dessus, avec en plus WP-CLI. Je l’ai mise en place en utilisant [le fichier de configuration YAML][wp-cli-conf-file] pour exécuter les commandes à vide, sans arguments (puisqu’ils sont spécifiés [dans le fichier][project-wp-cli]).

Les actions intéressantes du script bash : téléchargement de la dernière version du core, installation, configuration, création du premier utilisateur, suppression de Hello Dolly (RIP) et des pages/articles de test, configuration des permaliens en `%postname%`.

Enfin, le script installe et configure un [thème Sage prêt à l’emploi][sage] (version 8.5.3, avec gulp/bower/npm).

## Et ensuite ?
Ce n’est qu’un début. Plusieurs fonctionnalités notables seront ajoutées par la suite.

### Pour les deux

* Elastic stack integration
* Test addition

### Pour la stack Symfony

* Continue [Symfony 4 branch][symfony-4-branch]
* Add Webpack Encore for assets management
* Add Angular for front boilerplate

### Pour la stack Wordpress

* ACF Pro setup

[LCH]: https://www.compagnie-hyperactive.com
[wordpress-stack]: https://github.com/compagnie-hyperactive/docker-boilerplate-wordpress
[symfony-stack]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony
[symfony-4-branch]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony/tree/symfony4
[env-file-documentation]: https://docs.docker.com/compose/environment-variables/#the-env-file
[env-file-option]: https://docs.docker.com/compose/environment-variables/#the-env_file-configuration-option
[app.conf]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony/blob/master/docker/images/apache2.4/app.conf
[dockerfile-arg-definition]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony/blob/master/docker/images/apache2.4/Dockerfile#L5
[database-volume]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony/blob/master/docker-compose.yml#L11
[app-volume]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony/blob/master/docker-compose.yml#L30
[apache-logs-volume]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony/blob/master/docker-compose.yml#L47
[bash-file]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony/init.bash
[dotenv]: https://symfony.com/doc/3.3/components/dotenv.html
[external_params]: https://symfony.com/doc/current/configuration/external_parameters.html
[wp-cli-conf-file]: https://make.wordpress.org/cli/handbook/config/#config-files
[project-wp-cli]: https://github.com/compagnie-hyperactive/docker-boilerplate-wordpress/blob/master/wp-cli.yml
[sage]: https://roots.io/sage/
