---
draft
layout: post
title:  "API versionning strategies"
date:   2018-12-11 17:04:00 +0100
tags:
    - php
    - symfony
    - API
    - REST
    - FOS    
excerpt: "This post presents few ways for versionning APIs."
    
---

## Context
API are like any other programmed systems : they evolve during time, either with bugfixes or feature addition. There is a roadmap that can eventually bring to a __backward compatibility break__ to ensure proper evolution regarding new features.

## Versionning
Versionning is important, mainly to provide your API clients ways to ensure they use the proper version regarding their needs.

Few ways : 
- Domain name : `https://v4.your-api.com`
- URI prefix : `https://your-api.com/api/v4`
- Query string : `https://your-api.com/api/?v=4.0.0`
- Custom HTTP header : `X-API-Version: 4.0.0`
- `Accept` HTTP header :  `Accept: application/vendor.app.your-app+json; version=4.0.0`

Keep as the rule of thumb than changing URLs are __generally bad idea__. HTTP headers are the way to go. Below is a configuration possibility for the `Accept` header.

## FOSRestBundle configuration for `Accept` header

2 keys to add to FOSRestBundle configuration : `versionning` and `view:meme_types`

### Versionning

You need to tell FOSRestBundle you are using versionning in your app :

```yaml
fos_rest:
  ...
  versioning:
    enabled: true
    resolvers:
      media_type: # Accept header
        enabled: true
        regex: '/(v|version)=(?P<version>[0-9\.]+)/'
```
Of course, you an freely adapt the regex to your needs.

### Add MIME type

As you can see above, the MIME type you send is now custom (`application/vendor.app.your-app+json; version=4.0.0`). You need to tell FOSRestBundle to accept it :

```yaml
fos_rest:
  ...
  view:
    ...    
    mime_types:
      json: ['application/json', 'application/json;version=1.0', 'application/json;version=2.0']
```

For the sake of brevity, I just put the matching configurations key with `Accept` header.