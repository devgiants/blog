---
publicSlug: domofony-presentation
locale: fr
title: "Présentation de Domofony"
date: 2019-10-12 13:51:00 +0100
tags:
  - php
  - symfony
  - API
  - REST
  - home
  - automation
excerpt: "Cet article présente l’application Domofony pour le contrôle de la domotique."
---

## Domotique
Dans mes précédents essais de domotique DIY, j’utilisais l’excellent [openHAB](https://www.openhab.org/).
À première vue, il semblait réunir tout ce que je cherchais dans un contexte de domotique :

 - Entièrement open-source
 - __Agnostique vis-à-vis des technologies et des fournisseurs__ : c’est l’un des points les plus importants, je ne voulais pas dépendre d’une technologie propriétaire pour construire ce système. Tout doit être transparent du sol au plafond, et modifiable pour garantir une utilisation et une adaptation sur le long terme
 - __Capacité à programmer pour des usages sérieux__ : il est absolument important pour moi qu’une vraie fonctionnalité de programmation soit disponible. La manière dont je travaille ne correspond pas à une configuration à la souris. En utilisant [Xtend](https://www.eclipse.org/xtend/) (puisque openHAB est écrit en Java), cela permet de créer des programmes pour piloter l’installation.

Alors pourquoi changer ? Quelques inconvénients :

 - J’ai réalisé à l’usage que tout ce qui est embarqué (branching des items avec les technologies, configuration...) ne me convenait tout simplement pas
 - L’implémentation Xtend dans cet usage, bien que vraiment propre, ne permet pas certaines choses que je voulais (comme la réutilisation de scripts entre handlers...)
 - Toute la partie Java met la pression sur le hardware sous-jacent, obligeant à avoir quelque chose de puissant (les vieux Raspberry Pi n’étaient pas si bons)

Ne me faites pas dire ce que je n’ai pas dit : OpenHAB est un excellent travail utilisé par des milliers de personnes dans le monde. J’avais simplement besoin d’autre chose.

## Domofony
_Domotique_ + _Symfony_ = [__Domofony__](https://github.com/devgiants/domofony).

_Domotique_ est le mot français pour home automation. La première chose à savoir, c’est que j’ai créé ce projet pour moi-même et que je le partage comme bonne pratique, mais qu’à la base, tout ne sera pas forcément utilisable par tout le monde (comme l’application front-end que je prévois de développer pour mon usage).

__C’est une solution fournie par un développeur pour des développeurs__. Exit la click-land, toute la configuration est faite en YAML.

### Composants techniques

![Composants techniques](/images/posts/domofony/technical_components_with_items.png)

Toutes les parties visibles dans le schéma ci-dessus seront décrites et détaillées dans de futurs articles. Cela dit, voici une description rapide des blocs principaux.

#### Application front-end

C’est l’application qui permet à l’utilisateur d’interagir avec le système. Elle consommera l’API REST exposée par l’application serveur.

#### Broker Mosquitto

Le système repose pour l’instant sur le protocole [MQTT](https://en.wikipedia.org/wiki/MQTT)
([ici](https://www.linkedin.com/pulse/mqtt-un-protocole-bas%C3%A9-sur-tcp-et-orient%C3%A9-iot-nicolas-bonniot/) un tour d’horizon du protocole en français) pour les échanges entre le __système central__ et les __items__.
Ce protocole est idéal compte tenu de son caractère asynchrone et de sa légèreté.
La sécurité n’est pas laissée de côté, même si l’utilisation de certificats TLS implique que les items doivent être plus puissants que de simples microcontrôleurs.

_Note : un item est le périphérique final, comme un capteur ou un actionneur (ou les deux). Dans mon système de domotique, il s’agit surtout de [SBC](https://en.wikipedia.org/wiki/Single-board_computer) ou de microcontrôleurs de la série ESP._

Les prochains articles détailleront __les items__, __l’application Symfony__, __la configuration du broker et du client Mosquitto__ et __l’application front-end__.
