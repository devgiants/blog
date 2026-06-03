---
publicSlug: docker-compose-port-mapping-subtlety
locale: fr
title:  "Subtilité du mapping de ports avec Docker Compose"
date:   2021-04-12 09:40:00 +0100
tags:
- docker
- compose
- port

excerpt: "Je suis devenu un peu fou en montant une nouvelle stack avant de trouver l’astuce suivante."

---
## Description du mapping de ports avec `docker-compose`
`docker-compose` permet de définir un mapping de ports entre le conteneur que vous décrivez et l’hôte.
Vous pouvez ainsi atteindre via les ports de l’hôte n’importe quel service exposé par ce conteneur (par exemple Apache/Nginx sur 80/443, FTP sur 20/21/22...)
Selon la [syntaxe du fichier compose](https://docs.docker.com/compose/compose-file/compose-file-v3/#ports), plusieurs notations sont possibles :

```yaml
ports:
- "3000"
- "3000-3005"
- "8000:8000"
- "9090-9091:8080-8081"
- "49100:22"
- "127.0.0.1:8001:8001"
- "127.0.0.1:5000-5010:5000-5010"
- "127.0.0.1::5000"
- "6060:6060/udp"
- "12400-12500:1240"
```

## Le problème qui peut apparaître

J’ai pris de mauvaises habitudes au début avec `docker-compose`, notamment __ne pas mettre de guillemets doubles autour des ports__.  
L’exemple ci-dessus devient alors :

```yaml
ports:
- 3000
- 3000-3005
- 8000:8000
- 9090-9091:8080-8081
- 49100:22
- 127.0.0.1:8001:8001
- 127.0.0.1:5000-5010:5000-5010
- 127.0.0.1::5000
- 6060:6060/udp
- 12400-12500:1240
```
Sans guillemets, une expression comme `21:21` sera interprétée par le [moteur YAML](https://yaml.org/spec/1.1/) comme une [notation sexagésimale](https://en.wikipedia.org/wiki/Sexagesimal#cite_note-17) (expression de valeur en base 60).
L’entier obtenu peut être très grand et ne sera clairement pas celui que vous attendiez.

- Au mieux : cela déclenche une exception au moment du `up`, car le port calculé dépasse la limite du ![equation](http://www.sciweavers.org/tex2img.php?eq=%202%5E%7B16%7D%20-1&bc=Transparent&fc=Gray&im=png&fs=12&ff=arev&edit=0)
.
- Au pire : cela génère un numéro de port libre valide, et vous découvrez seulement au runtime qu’il y a un problème de communication sur le port.

_Note : cela n’arrive que si le port est inférieur à 60, afin de pouvoir entrer dans un calcul modulo en base 60._

La documentation de `docker-compose` a ajouté une note pour souligner ce cas :

>When mapping ports in the HOST:CONTAINER format, you may experience erroneous results when using a container port lower than 60, because YAML parses numbers in the format xx:yy as a base-60 value. For this reason, we recommend always explicitly specifying your port mappings as strings.

__Donc, mettez TOUJOURS vos ports entre guillemets pour les exprimer comme des chaînes.__
