---
publicSlug: api-versionning
locale: fr
title: "Stratégies de versioning d'API"
date: 2018-12-11 17:04:00 +0100
tags:
  - php
  - symfony
  - API
  - REST
  - FOS
excerpt: "Cet article présente quelques façons de versionner des APIs."
---

## Contexte
Les APIs sont comme tout autre système programmé : elles évoluent dans le temps, que ce soit avec des correctifs ou des ajouts de fonctionnalités. Il existe une feuille de route qui peut, à terme, conduire à une __rupture de compatibilité ascendante__ afin d’assurer une évolution correcte vis-à-vis des nouvelles fonctionnalités.

## Versioning
Le versioning est important, surtout pour donner aux clients de l’API des moyens de s’assurer qu’ils utilisent la bonne version selon leurs besoins.

Quelques façons de faire :
 - Nom de domaine : `https://v4.your-api.com`
 - Préfixe d’URI : `https://your-api.com/api/v4`
 - Query string : `https://your-api.com/api/?v=4.0.0`
 - En-tête HTTP custom : `X-API-Version: 4.0.0`
 - En-tête HTTP `Accept` :  `Accept: application/vendor.app.your-app+json; version=4.0.0`

Gardez comme règle générale que changer les URLs est __généralement une mauvaise idée__. Les en-têtes HTTP sont la bonne approche. Ci-dessous, un exemple de configuration pour l’en-tête `Accept`.

## Configuration FOSRestBundle pour l’en-tête `Accept`

2 clés sont à ajouter à la configuration de FOSRestBundle : `versionning` et `view:meme_types`

### Versionning

Il faut dire à FOSRestBundle que vous utilisez le versioning dans votre application :

```yaml
fos_rest:
  ...
  versioning:
    enabled: true
    resolvers:
      media_type: # Accept header
        enabled: true
        regex: '/(v|version)=(?P<version>[0-9\.]+)/'
```
Bien sûr, vous pouvez adapter librement la regex à vos besoins.

### Ajouter un MIME type

Comme on le voit ci-dessus, le MIME type envoyé est maintenant custom (`application/vendor.app.your-app+json; version=4.0.0`). Il faut dire à FOSRestBundle de l’accepter :

```yaml
fos_rest:
  ...
  view:
    ...    
    mime_types:
      json: ['application/json', 'application/json;version=1.0', 'application/json;version=2.0']
```

Par souci de brièveté, je n’ai mis ici que la clé de configuration correspondant à l’en-tête `Accept`.
