---
publicSlug: fos-rest-query-param-strict
locale: fr
title: "FOS REST Bundle : imposer un comportement strict sur les query params"
date: 2018-11-16 17:15:00 +0100
tags:
  - php
  - symfony
  - API
  - REST
  - FOS
excerpt: "FOS REST Bundle permet de choisir quoi faire quand les contraintes sur les query params ne sont pas respectées. Voyons comment faire ce choix."
---

## Contexte
En expérimentant [FOS REST Bundle](https://github.com/FriendsOfSymfony/FOSRestBundle) dans mon parcours pour apprendre à créer des APIs solides, j’ai commencé à écrire l’action suivante :

```php
/**
     * @param PostHandler $postHandler
     * @param ParamFetcherInterface $paramFetcher
     * @Rest\Get("/posts/list")
     * @Rest\QueryParam(
     *     name="keyword",
     *     requirements="[a-zA-Z0-9]*",     
     *     nullable=true,
     *     description="The keyword to search for."
     * )
     * @Rest\QueryParam(
     *     name="order",
     *     requirements="asc|desc",
     *     default="asc",     
     *     description="Sort order (asc or desc)"
     * )
     * @Rest\QueryParam(
     *     name="limit",
     *     requirements="\d+",
     *     default="3",     
     *     description="Max number of posts per page."
     * )
     * @Rest\QueryParam(
     *     name="page",
     *     requirements="\d+",
     *     default="1",     
     *     description="The page wanted"
     * )
     * @Rest\View(
     *     statusCode = 200,
     *     serializerGroups = {"list"}
     * )
     *
     * @return Paginator
     */
    public function list(PostHandler $postHandler, ParamFetcherInterface $paramFetcher)
    {


        $postsList = $postHandler->search(
            intval($paramFetcher->get('limit')),
            intval($paramFetcher->get('page')),
            $paramFetcher->get('order'),
            $paramFetcher->get('keyword')
        );

        return $postsList;
    }
```

Cela expose simplement un endpoint GET, à l’URL `/posts/list`, afin de renvoyer une... liste d’articles. Plusieurs `QueryParam` peuvent être passés pour filtrer la liste obtenue. Selon les contraintes définies, les appels suivants sont donc acceptés (et traités) :
- `/posts/list?page=2` pour obtenir la page 2, avec le `limit` par défaut
- `/posts/list?order=desc` pour trier les articles par ID décroissant
- `/posts/list?keyword=test` pour récupérer uniquement les articles contenant le mot-clé `test`.

## Et si... on ne respecte pas les contraintes ?

Pour chaque `QueryParam`, les contraintes sont données [sous forme d’expression régulière](https://symfony.com/doc/current/routing/conditions.html). En réalité, les annotations de contraintes sont compilées en PHP. Donc, si j’essaie :
 
 - `/posts/list?page=a`
 - `/posts/list?order=other`
 - `/posts/list?keyword=test%20test2`
 
Que se passe-t-il ? Rien. Par défaut, FOS REST Bundle prendra __la valeur par défaut du `QueryParam` fautif__ à la place de votre valeur invalide.
 
## Et si on voulait lever une erreur ?
Selon le `QueryParam` avec lequel vous travaillez, vous pouvez vouloir lever une erreur ou non. Dans l’exemple ci-dessus, les développeurs clients vous remercieront si vous fournissez des erreurs explicites et des messages complets pour ces `QueryParam`. La solution est simple : ajoutez l’attribut `strict` à `true` sur le `QueryParam` pour forcer FOS REST Bundle à lever une Exception.
Avec la bonne configuration (comme `ExceptionController`), vous obtenez des exceptions prêtes à l’emploi comme celle-ci :
 
```
GET http://localhost:8081/posts/list?page=a
 
HTTP/1.1 400 Bad Request
Date: Fri, 16 Nov 2018 16:34:15 GMT
Server: Apache/2.4.18 (Ubuntu)
Cache-Control: no-cache, private
X-Debug-Token: 34ff9b
X-Debug-Token-Link: http://localhost:8081/_profiler/34ff9b
X-Previous-Debug-Token: fd05dc
Connection: close
Transfer-Encoding: chunked
Content-Type: application/json
 
{
  "error": "Parameter \"page\" of value \"a\" violated a constraint \"Parameter 'page' value, does not match requirements '\\d+'\""
}
 
Response code: 400 (Bad Request); Time: 4106ms; Content length: 137 bytes
```
