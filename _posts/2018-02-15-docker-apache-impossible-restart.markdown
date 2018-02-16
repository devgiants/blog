---
layout: post
title:  "Docker Apache impossible restart : httpd already running"
date:   2018-02-15 18:35:36 +0100
categories: docker apache
---

## Context

In Docker stacks I created ([here][wordpress-stack] and [here][symfony-stack]), I realized after few usages that I could encounter problem during stack restart. __Apache will not start__ with following message : `httpd (pid: XX) already running.`

## Explanation

I usually use `docker-compose stop` to stop my stacks between projects. It's different from `docker-compose down` because it doesn't destroy containers, but just stop them. In an ideal world, no problem with that, furthermore it's a bit faster.

In other hand, if stack stops because of any crash, __containers can be totally unusable__. Due to Apache internal architecture, a new start will find `/var/run/apache2/apache2.pid` file and container system will not launch Apache __to avoid (as it seems to it) second running instance__. 

## Solution

2 parts here :
1. Use `docker-compose down` rather than `docker-compose stop`. Dockerily speaking, it's best practice because __each container will be recreated from scratch__ each time you need to work with. As you have persisted what you need to store in volumes, you lost nothing.
2. Customize you Apache image [to remove this lock file][remove-pid] when container is re-created.

[wordpress-stack]: https://github.com/compagnie-hyperactive/docker-boilerplate-wordpress
[symfony-stack]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony
[remove-pid]: https://github.com/compagnie-hyperactive/docker-boilerplate-wordpress/blob/f7086f7fa23362b6c64707816fafaee2dbf73e6c/docker/images/apache2.4/Dockerfile#L17