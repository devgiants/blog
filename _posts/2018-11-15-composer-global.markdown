---
layout: post
title:  "Composer usage can also be global"
date:   2018-11-15 10:00:00 +0100
categories: php composer
---


As an every-day [Composer](https://getcomposer.org) user, I always used it on a project scope, i.e with a `composer.json` lying in a specific project directory.
I discover recently than it can also be used on a [global way](https://getcomposer.org/doc/03-cli.md#global) (meaning not related to a project) using `global` modifier : 

```
composer global require squizlabs/php_codesniffer
``` 

The globally installed package will be accessible user-system wide. On my Ubuntu system, global `vendor` folder lies on `~/.config/composer/`.

It strikes me yesterday that this feature is exactly the same one which is provided by `npm`, `yarn` or `bower`, other packages/dependencies manager.