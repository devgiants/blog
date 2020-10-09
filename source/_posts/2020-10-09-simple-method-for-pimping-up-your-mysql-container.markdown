---
layout: post
title:  "Simple  method to override configuration for your MySQL container"
date:   2020-09-10 09:00:00 +0100
tags:
    - docker
    - mysql
        
excerpt: "How to quickly override any configuration parameter for a MySQL parameter"

## First approach : wrong one

All started while I was doing another dumb import, first using PhpMyAdmin. Despite the fact than the file wasn't
particularily large, it keeped ended by error `MySQL server has gone away` with a strange mention to missing data close
to an `ON` directive.

Few searches quickly pointed me on configuration directive `max_allowed_packet`. If too short, it indeed leads to above 
error. Beware the packet size here refers to a TCP packet, on transport layer. Too large query can trigger this.

As I use [my stack](https://github.com/devgiants/docker-boilerplate-wordpress) for making project live on local, I first
thought that I would have to overkill stuff by making custom image from MySQL one, with overriding `my.ini`, exactly as I
did for [PHP container](https://github.com/devgiants/docker-boilerplate-wordpress/blob/master/docker/images/php-fpm7.3/Dockerfile).

Then I realized that exactly like PHP and Apache, a `conf.d` folder was existing with MySQL folder architecture.

## Lightweight approach

So the solution was quite easier : just define a `override_max_packet_size.cnf` (you name it like you want), that lies
in `docker/images/mysql/conf`. I put this inside : 

```ini
[mysqld]
max_allowed_packet=64M
```
 
Then just mount a volume targeting this host folder and bind it with `/etc/mysql/conf.d`
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

Complete stack rebuild, and try to reimport : bingo, it works.
Using this method, you can safely override any MySQL configuration directive while keeping image untouched.
