---
layout: post
title:  "Docker stacks presentation"
date:   2018-02-15 13:24:14 +0100
tags:
    - docker
    - stack
excerpt: This post presents the stack I created for my everyday job around Symfony and Wordpress.
---

## My goals

Docker is one the (too many) things __I wanted to step into__ for a while now, without necessary time to dive in. I finally board the train, and even if I stay closer from padawan to guru, I could build __2 stacks I will introduce below__ : one for [Symfony][symfony-stack], and another one for [Wordpress][wordpress-stack].

Both are new boilerplates used for all news projects either [@LCH][LCH] or personal.

## Symfony stack
![Symfony stack]({{ site.url }}/assets/posts-images/stack-symfony.png)

It allows to install __a complete working environment for Symfony 2.X or 3.X__. Symfony Flex (usable on 3.4+) is not in here, we created a 4.X [specific branch][symfony-4-branch]). Here you find 4 containers:

* mysql
* php
* apache
* phpmyadmin

Below the specifics highlighted.

### Environment vars
All `docker-compose.yml` needed variables are stored in a `.env` file (Docker documentation [here][env-file-documentation]). 
This `.env` file is also defined inside the very containers to expose needed environment variables. To do so, just pass `.env` file as `env_file` option (documentation [here][env-file-option])

This gives the interesting ability __to use them in files added to container__ (like the [app.conf][app.conf] which defines app vhost by using `$FPM_HOST`). You can do the same in the very `Dockerfile`. 

_Important note : to do so, just explicitely define them with the `ARG` keyword ([example][dockerfile-arg-definition])._


### Volumes
I create 3 volumes in here :
* [Database one][database-volume]
* [Application files][app-volume]
* [Apache logs][apache-logs-volume]

_Stay tuned for a volume focused post to come._

### Start bash
To help starting with, I created a [bash file][bash-file] that executes following actions :
1. Volume folders creation (if it turns they does not exist already)
2. Download and setup Symfony installer (if `symfony` command not already registered)
3. Install Symfony using the version number specified in `.env` file.
4. `.env` file copy to allow Symfony application access to its variables (described [here][dotenv] and [here][external_params])
5. `parameters.yml.dist` file copy and params substitution using `envsubst` command. _Note: I chosed not to use [DotEnv component][dotenv] to ensure total 2.X and 3.4- retro-compatibility._
6. `docker-compose` install if not already here and registered as `docker-compose`
7. Set container up (with building)
8. `parameters.yml` file removing to trigger regeneration (I've bumped to this case during my tests where a `composer update` will not refresh `parameters.yml` file)
9. `composer update`

## Wordpress stack
![Wordpress stack]({{ site.url }}/assets/posts-images/stack-wordpress.png)

Wordpress stack does the same trick as above, adding WP-CLI. I set it up using [YAML configuration file way][wp-cli-conf-file] to execute commands bare, without any arguments (as they are specified [in file][project-wp-cli])

Bash script interesting actions : last version core download, installation, configuration, first user creation, remove Hello Dolly (RIP) and tests page/post, permalink configuration to `%postname%`

Finally, the script installs an sets up a [ready-to-work-with Sage theme][sage] (8.5.3 version, gulp/bower/npm one). 

## What's next ?
This is just a start. Several noticeable features will eventually be added.

### For both

* Elastic stack integration
* Test addition

### For Symfony stack

* Continue [Symfony 4 branch][symfony-4-branch]
* Add Webpack Encore for assets management
* Add Angular for front boilerplate

### For Wordpress stack

* ACF Pro setup

[LCH]: https://www.compagnie-hyperactive.com
[wordpress-stack]: https://github.com/compagnie-hyperactive/docker-boilerplate-wordpress
[symfony-stack]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony
[symfony-4-branch]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony/tree/symfony4
[env-file-documentation]: https://docs.docker.com/compose/environment-variables/#the-env-file
[env-file-option]: https://docs.docker.com/compose/environment-variables/#the-env_file-configuration-option
[app.conf]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony/blob/master/docker/images/apache2.4/app.conf
[dockerfile-arg-definition]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony/blob/master/docker/images/apache2.4/Dockerfile#L5
[database-volume]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony/blob/master/docker-compose.yml#L11
[app-volume]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony/blob/master/docker-compose.yml#L30
[apache-logs-volume]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony/blob/master/docker-compose.yml#L47
[bash-file]: https://github.com/compagnie-hyperactive/docker-boilerplate-symfony/init.bash
[dotenv]: https://symfony.com/doc/3.3/components/dotenv.html
[external_params]: https://symfony.com/doc/current/configuration/external_parameters.html
[wp-cli-conf-file]: https://make.wordpress.org/cli/handbook/config/#config-files
[project-wp-cli]: https://github.com/compagnie-hyperactive/docker-boilerplate-wordpress/blob/master/wp-cli.yml
[sage]: https://roots.io/sage/