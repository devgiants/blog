---
layout: post
title:  "Domofony presentation"
date:   2019-10-12 13:51:00 +0100
tags:
    - php
    - symfony
    - API
    - REST
    - home
    - automation
        
excerpt: "This post presents Domofony application for home automation control"
    
---

## Home automation
On my previous attempts on DIY home automation, I used the excellent [openHAB](https://www.openhab.org/).
At first glance, it seemed to have everything I looked for in an home automation context :
- Completely open-source
- __Technology and vendor agnostic__ : one of the most important thing, I didn't want to rely on proprietary technology to build this system. Everything has to be transparent from ground to roof, and modifiable to ensure long-term usage and adaptation
- __Ability to program for serious work__ : it's utterly important to me that real programmation feature would be available. Way I do things doesn't match with a click-land configuration job. Using [Xtend](https://www.eclipse.org/xtend/) (because openHAB written in Java), it allows to create programs to drive your installation.

So why change? Some cons :
- I realized after usage that all the stuff embedded (item branching with technologies, configuration...) simply wasn't for me
- Xtend implementation in this usage, though really neat, does not allow things I wanted (such as script reuse accross handlers...)
- All the Java stuff creates pressure on underlying hardware, thus forcing to have something powerful (old Raspberry Pis was not so good)

Don't misunderstand me : OpenHAB is great job used y thousand of people accross the world. I just needed something else.

## Domofony
_Domotique_ + _Symfony_ = [__Domofony__](https://github.com/devgiants/domofony).

_Domotique_ is the french word for home automation. First thing to know, I created this project for myself, and share it a good practice, but at start, not all things will be usable by everyone (such as the front-end app I plan to develop tailored to my use).

__This is a solution provided by a developer for developers__. Exit click-land, all configuration is done in YAML.

### Technical components

![Technical components](https://devgiants.fr/images/posts/domofony/technical_components.png)

All part showed on above layout will be described and detailed in future posts. That being said, below is a quick description for bigger parts.

#### Front-end application

This is the application allowing user to interact with the system. It will consume REST API exposed by the server application.

#### Mosquitto broker

The system relies so far on [MQTT protocol](https://en.wikipedia.org/wiki/MQTT) 
([here](https://www.linkedin.com/pulse/mqtt-un-protocole-bas%C3%A9-sur-tcp-et-orient%C3%A9-iot-nicolas-bonniot/) a protocol tour in french) for exchanges between __central system__ and __items__.
This protocol is ideal regarding it's asynchronous sequence and its lightweight. 
Security is not left aside, although TLS certificate usage means items must be more powerful than simple microcontrollers.

_Note : an item is the end-device, such as sensor or actuator (or both). In my home automation system, this is mostly [SBC](https://en.wikipedia.org/wiki/Single-board_computer) or ESP series microcontrollers_

Future posts will handle in details __items__, __Symfony application__, __Mosquitto broker & client configuration__ and __front-end application__.
