---
layout: post
title:  "FOS REST Bundle : enforce strict behavior with query params requirements"
date:   2018-11-16 17:15:00 +0100
tags:
    - php
    - symfony
    - REST
    - FOS
excerpt: "FOS REST Bundle allows you to choose what to do when query params requirements are not met. Let's see how to choose."
    
---

## Context
Playing with [FOS REST Bundle](https://github.com/FriendsOfSymfony/FOSRestBundle) on my journey to learn how to create rock-solid APIs, I started to create following action :
 
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

This simply expose a GET endpoint, with URL `/posts/list`, in order to return a... posts list. Several `QueryParam` can be passed in order to filter the obtained list. So, according to requirements given, following calls are acceptable (and processed) :
- `/posts/list?page=2` to get page 2, with default `limit`
- `/posts/list?order=desc` to order posts by ID descendant
- `/posts/list?keyword=test` to retrieves only posts with 'test' keyword.

## What if... we don't follow requirements ?

For each `QueryParam`, requirements are given in [an regexp way](https://symfony.com/doc/current/routing/conditions.html). Actually, requirements annotations are compiled to PHP. So, if I try :
 
 - `/posts/list?page=a`
 - `/posts/list?order=other`
 - `/posts/list?keyword=test%20test2`
 
 What will happen? Nothing. By default, FOS REST Bundle will take __the offending `QueryParam` default value instead__ of your offending value.
 
 ## What if we want to raise an error?
 Depending to which `QueryParam` you deal with, you may want to raise an error or not. For the above example, client developers will love you if you provide explicit errors and comprehensive messages for those `QueryParam`. The solution for that is simple : just add the `QueryParam` attribute `strict` to true in order to force FOS REST Bundle to raise an Exception.
 With proper configuration (such as `ExceptionController`), you achieve to throw out-of-the-box exceptions like this :
 
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
 