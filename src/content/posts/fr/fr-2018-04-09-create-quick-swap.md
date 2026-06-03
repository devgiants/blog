---
publicSlug: create-quick-swap
locale: fr
title: "Comment créer une swap pour l’usage des sessions"
date: 2018-04-09 16:44:24 +0100
tags:
  - linux
  - swap
  - session
excerpt: "Moyen rapide de créer une swap temporaire."
---

## Contexte

Long silence de ma part ces dernières semaines, car je travaillais sur l’architecture de ma domotique, surtout du point de vue IoT. Je publierai tout cela ici, mais aujourd’hui je voulais partager une astuce rapide pour créer __un espace de swap sur un système Linux qui n’en a pas__.

## Pourquoi ?
Je teste intensivement [NanoPi NEO](http://www.friendlyarm.com/index.php?route=product/product&product_id=132) ces jours-ci et, sans aucun doute, ce sera la pierre angulaire de ma domotique. J’ai commencé avec la version 256Mo, et l’image Ubuntu Core fournie ne contient pas d’espace de swap.

Lorsque j’ai commencé à lancer quelques `composer update` (parce que toute mon interaction bas niveau passe par [ReactPHP](https://reactphp.org/), restez à l’écoute !), l’appareil a explosé en messages de ce genre :

```
The following exception is caused by a lack of memory or swap, or not having swap configured
Check https://getcomposer.org/doc/articles/troubleshooting.md#proc-open-fork-failed-errors for details

PHP Warning:  proc_open(): fork failed - Cannot allocate memory in phar:///usr/local/bin/composer/vendor/symfony/console/Application.php on line 958

Warning: proc_open(): fork failed - Cannot allocate memory in phar:///usr/local/bin/composer/vendor/symfony/console/Application.php on line 958
                                                     
  [ErrorException]                                   
  proc_open(): fork failed - Cannot allocate memory  
                                                     

```

J’avais oublié que 256Mo, ce n’est vraiment pas beaucoup... Solution : créer une swap (qui restera en place jusqu’au prochain reboot)

```
# Use dd to create a 256 Mo sxap space, filled with 0, and named /var/swap.1
sudo /bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=256

# Inform system that swap exists and where
sudo /sbin/mkswap /var/swap.1

# Enable
sudo /sbin/swapon /var/swap.1
```
