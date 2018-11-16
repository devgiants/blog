---
layout: post
title:  "Symfony Config : how to handle entire section require status ?"
date:   2018-02-20 16:44:24 +0100
tags: 
    - symfony
    - config
excerpt: "See how to force entire section to be specified in YAML config file."
---

## Context 
[Symfony Config Component][sf_config] is an extremely powerful way of configuring bundles and apps. 
For my work in progress in [LCH User bundle][lch_user_bundle], I wanted to set `templates` array node as __not required__.

## What's at stake
All other nodes types are not required unless you add the `isRequired()` ([example][is_required]) method to your node. Doing so, you will have an exception thrown saying that you have to define this key, which is what you want.

For the array node, it's __different__ : it's enabled by default and you have to specify the `canBeEnabled()` ([example][can_be_enabled]) method to your array node to ensure that it will be disabled by default, but enabled if needed. 

[sf_config]: http://symfony.com/doc/current/components/config.html
[lch_user_bundle]: https://github.com/compagnie-hyperactive/UserBundle
[is_required]: https://github.com/compagnie-hyperactive/UserBundle/blob/master/DependencyInjection/Configuration.php#L62
[can_be_enabled]: https://github.com/compagnie-hyperactive/UserBundle/blob/master/DependencyInjection/Configuration.php#L83
[optional_sections]: http://symfony.com/doc/current/components/config/definition.html#optional-sections