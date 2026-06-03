---
publicSlug: entire-section-requirements-symfony-config
locale: fr
title: "Symfony Config : comment gérer une section entière obligatoire ?"
date: 2018-02-20 16:44:24 +0100
tags:
  - symfony
  - config
excerpt: "Voir comment forcer une section entière dans un fichier de configuration YAML."
---

## Contexte
[Symfony Config Component][sf_config] est une manière extrêmement puissante de configurer des bundles et des applications.
Dans mon travail en cours sur le [LCH User bundle][lch_user_bundle], je voulais définir le nœud tableau `templates` comme __non requis__.

## Enjeu
Tous les autres types de nœuds ne sont pas requis, sauf si vous ajoutez la méthode `isRequired()` ([exemple][is_required]) à votre nœud. Dans ce cas, une exception est levée pour vous dire que vous devez définir cette clé, ce qui est bien le comportement recherché.

Pour un nœud de type array, c’est __différent__ : il est activé par défaut et vous devez utiliser la méthode `canBeEnabled()` ([exemple][can_be_enabled]) sur ce nœud pour vous assurer qu’il soit désactivé par défaut, puis activable si nécessaire.

[sf_config]: http://symfony.com/doc/current/components/config.html
[lch_user_bundle]: https://github.com/compagnie-hyperactive/UserBundle
[is_required]: https://github.com/compagnie-hyperactive/UserBundle/blob/master/DependencyInjection/Configuration.php#L62
[can_be_enabled]: https://github.com/compagnie-hyperactive/UserBundle/blob/master/DependencyInjection/Configuration.php#L83
[optional_sections]: http://symfony.com/doc/current/components/config/definition.html#optional-sections
