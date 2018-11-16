---
layout: post
title:  "How to create a swap for session usage"
date:   2018-04-09 16:44:24 +0100
tags: 
    - linux
    - swap
    - session
excerpt: "Quick way to create temporary swap."
---

## Context 

Long silence from me past weeks as I was working on my home automation architecture, especially on IoT POV. I will publish everything here, but today I wanted to share a quick tip to create __a swap space on a Linx system that doesn't have one__.
 

## Why so?
I'm deeply testing [NanoPi NEO](http://www.friendlyarm.com/index.php?route=product/product&product_id=132) these days and without any doubt it will be my home automation corner stone. I started using the 256Mo version and the Ubuntu Core Linux image provided comes without any swap space.

As I started to make some `composer update` (because all my low level interaction is done with [ReactPHP](https://reactphp.org/), stay tuned !), device exploded in such messages :

```
The following exception is caused by a lack of memory or swap, or not having swap configured
Check https://getcomposer.org/doc/articles/troubleshooting.md#proc-open-fork-failed-errors for details

PHP Warning:  proc_open(): fork failed - Cannot allocate memory in phar:///usr/local/bin/composer/vendor/symfony/console/Application.php on line 958

Warning: proc_open(): fork failed - Cannot allocate memory in phar:///usr/local/bin/composer/vendor/symfony/console/Application.php on line 958
                                                     
  [ErrorException]                                   
  proc_open(): fork failed - Cannot allocate memory  
                                                     

```

I forgot that 256Mo is not a lot... Solution : make a swap (that will stand until the next reboot)

```
# Use dd to create a 256 Mo sxap space, filled with 0, and named /var/swap.1
sudo /bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=256

# Inform system that swap exists and where
sudo /sbin/mkswap /var/swap.1

# Enable
sudo /sbin/swapon /var/swap.1
```
