---
publicSlug: simple-method-for-pimping-up-your-mysql-container
locale: fr
title:  "Méthode simple pour surcharger la configuration de votre conteneur MySQL"
date:   2020-09-10 09:00:00 +0100
tags:
    - docker
    - mysql
        
excerpt: "Comment surcharger rapidement n’importe quel paramètre de configuration d’un conteneur MySQL."

---
## Première approche : la mauvaise

Tout a commencé pendant un autre import un peu bête, d’abord via PhpMyAdmin. Malgré le fait que le fichier n’était pas
particulièrement gros, l’opération finissait toujours par l’erreur `MySQL server has gone away`, avec une étrange mention
à des données manquantes près d’une directive `ON`.

Quelques recherches ont rapidement pointé vers la directive de configuration `max_allowed_packet`. Si elle est trop courte, elle provoque effectivement l’erreur ci-dessus. Attention, la taille du paquet fait ici référence à un paquet TCP, au niveau transport. Une requête trop volumineuse peut déclencher ce comportement.

Comme j’utilise [ma stack](https://github.com/devgiants/docker-boilerplate-wordpress) pour faire tourner les projets en local, j’ai d’abord pensé qu’il faudrait sortir l’artillerie lourde en créant une image MySQL personnalisée, avec remplacement de `my.ini`, exactement comme je l’avais fait pour le [conteneur PHP](https://github.com/devgiants/docker-boilerplate-wordpress/blob/master/docker/images/php-fpm7.3/Dockerfile).

Puis j’ai réalisé que, comme pour PHP et Apache, un dossier `conf.d` existait aussi dans l’arborescence MySQL.

## Approche légère

La solution était donc bien plus simple : il suffit de définir un fichier `override_max_packet_size.cnf` (nommez-le comme vous voulez), placé dans `docker/images/mysql/conf`. J’y mets ceci :

```ini
[mysqld]
max_allowed_packet=64M
```
 
Il suffit ensuite de monter un volume pointant vers ce dossier hôte et de le relier à `/etc/mysql/conf.d`
```yaml
services:
  mysql:
    env_file: ./.env
    image: mysql:5.7
    ports:
      - ${MYSQL_HOST_PORT}:${MYSQL_PORT}
    environment:
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - ${MYSQL_HOST_VOLUME_PATH}:/var/lib/mysql
      - ./docker/images/mysql/config:/etc/mysql/conf.d
```

Reconstruisez complètement la stack, puis essayez de réimporter : bingo, ça fonctionne.
Avec cette méthode, vous pouvez surcharger sans risque n’importe quelle directive de configuration MySQL tout en laissant l’image intacte.
