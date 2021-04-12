---
layout: post
title:  "Docker compose port mapping subtlety"
date:   2021-04-12 09:40:00 +0100
tags:
- docker
- compose
- port

excerpt: "I turned quite mad while mounting new stack until I found the following tip."

---
## `docker-compose` port mapping description
`docker-compose` allows you to specify port mapping between the container you're defining and the host.
Thus you can reach any service you would register to this port container (i.e Apache/Nginx on 80/443, FTP on 20/21/22...)
by host ports. According to [compose file syntax](https://docs.docker.com/compose/compose-file/compose-file-v3/#ports), you can use several markups to do so :

```yaml
ports:
- "3000"
- "3000-3005"
- "8000:8000"
- "9090-9091:8080-8081"
- "49100:22"
- "127.0.0.1:8001:8001"
- "127.0.0.1:5000-5010:5000-5010"
- "127.0.0.1::5000"
- "6060:6060/udp"
- "12400-12500:1240"
```

## Problem that can arise

I took wrong habits on my early days with `docker-compose`, such as __not double quoting port mapping specification__.
So above example become :

```yaml
ports:
- 3000
- 3000-3005
- 8000:8000
- 9090-9091:8080-8081
- 49100:22
- 127.0.0.1:8001:8001
- 127.0.0.1:5000-5010:5000-5010
- 127.0.0.1::5000
- 6060:6060/udp
- 12400-12500:1240
```
Unquoted, expression like `21:21` will be handled by [YAML engine](https://yaml.org/spec/1.1/) by [a sexagesimal notation](https://en.wikipedia.org/wiki/Sexagesimal#cite_note-17) (base-60 value expression)
The integer obtained can be quite large and will definitely not be the one you expected.

- Best case : it raises an exception on your `up` process because your port number computed is above the ![equation](http://www.sciweavers.org/tex2img.php?eq=%202%5E%7B16%7D%20-1&bc=Transparent&fc=Gray&im=png&fs=12&ff=arev&edit=0) limit.
- Worst case: it generates a valid free port number and you realize at runtime there is a port communcation problem.

_Note this will only happens if the port is lower than 60 (to be able to enter in a modulo calculus regarding to base-60)._

`docker-compose` documentation added a note to underline this case :

>When mapping ports in the HOST:CONTAINER format, you may experience erroneous results when using a container port lower than 60, because YAML parses numbers in the format xx:yy as a base-60 value. For this reason, we recommend always explicitly specifying your port mappings as strings.

__So ALWAYS quote you ports mapping in order to express them as strings.__
