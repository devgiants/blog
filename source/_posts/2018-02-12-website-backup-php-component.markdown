---
layout: post
title:  "Website backup PHP component"
date:   2018-02-12 16:55:24 +0100
tags: 
    - symfony
    - console
    - command
excerpt: "I present here a PHP component to backup websites. Packaged as a PHAR application with self-update, it allows several options to backup sites assets (databases and files) accross several storages."
---

## Context

I needed for a while to package a PHP component which will allow me to __quickly__ and __safely__ backup websites I do. Goals below :
* Command line execution (automation approach)
* Highly configurable (websites addition, backup medias…)
* Composer-based approach (PHAR, auto-update).

So I developed [websites-backup][websites-backup]. Details are below.

## Component usage

Using a [YAML configuration][yaml] file, you can setup :
* __Several sites to backup__ (physically on the server and accessible to command system user) : each site is composed with a couple database/files (only MySQL so far)
* __Several backup medias__ : So far, only FTP is developed. Eventually I would like to setup an Amazon and Dropbox gateway. Main goal here is clearly allowing simultaneous and synchronised muliple backup storages.

_Note : from a security point of view, I recommand to create a system user per site, with read-only rights._

## Symfony components based...

I used this project as a __training to use only few Symfony components__. As far as I’m concerned, it’s a very good way to really handle them and focus on their perimeters & limitations. Quick check on `composer.json` gives the components list:
* __Console component__ : it gives the command line approach & tools. Arguments, options, console styling…
* __Config component__ : it provides the configuration ability, with powerful chained methods to allow you to check and decides what to do with configuration values transmitted to your application.
* __YAML component__ :  the YAML parser, useful to read the quoted above configuration file.

## ...But not only

In order to strenghten the application on usage and maintenance point of views, I alwo use packages :
* [The excellent Box][box] : allows you to make configurable PHAR in no-time.
* Phar update (old but still working) : with a manifest system, provide necessary logic to check newer versions and update if necessary.
Below is the process I follow :
1. Make the updates (code, README…) which will be future release
2. Git updates and coherent tag creation (i.e : 1.0.13)
3. Application packaging  with Box
4. Archive and up-to-date manifest publication on GitHub pages (gh-pages branch)

Then, next time application runs, it decides using the manifest if a newer version is available (version numeric comparison, that’s why coherent and consecutive tagging does the trick).  `self-update` command will actually update the application.

## Also

Considering the fact that multiple commands are available using websites-backup, I chose [Pimple][pimple] to have a simple but powerful dependency injection container system. I can instanciate dependencies on main application entry point :
```php
$container = new Container();
$container['tools'] = new BackupTools();
```

And then pass container to all commands :

```php
$application->add(new Command\BackupCommand('backup', $container));
$application->add(new Command\RetrieveBackupCommand('retrieve', $container));
```

## Roadmap

OK, things work, but there are [numerous features and improvements][project] I wish to add. If you find the project interesting and would like to give an hand, fell free to contact me !

[websites-backup]: https://github.com/devgiants/websites-backup
[yaml]: https://github.com/devgiants/websites-backup#backup
[pimple]: https://pimple.symfony.com/
[box]: https://github.com/box-project/box2
[project]: https://github.com/devgiants/websites-backup/projects/1