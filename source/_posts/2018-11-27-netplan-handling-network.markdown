---
layout: post
title:  "Netplan : new way to handle network in Ubuntu 17+"
date:   2018-11-27 17:55:00 +0100
tags:
    - Ubuntu
    - system
    - Netplan
    - network
excerpt: "Netplan is a new network configuration abstraction renderer, available in Ubuntu 17+. It drastically simplifies stuff when it comes to network handling."
    
---

## Context
I started recently a new project : turn a fanless computer to a router (actually it will handle more than that but it goes beyond this post focus). I chose Ubuntu Server 18.10, and when I came to network management and configuration, I discover [Netplan](https://netplan.io/).
 
## What it does
It gives a bit of __abstraction on network management__ mainly by using __ YAML configuration files__. Examples :

__For allowing DHCP address assignation for a given interface__ 
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp3s0:
      dhcp4: true
```         

You may notice there is a `renderer` key : you can choose between 2 renderers, networkd (used on server) and NetworkManager (used on desktop machines)
Below is the system design explanation : 
![Netplan design explanation](https://assets.ubuntu.com/v1/a1a80854-netplan_design_overview.svg)

## My needs
Having 5 network interfaces on my machine (4 Gigabits LAN + 1 wifi), I wanted to start by assigning comprehensive names. Here it starts :

To rename for example my future WAN interface :

```yaml
network:
    ethernets:
        enp1s0:
            match:
                macaddress: 40:62:31:01:14:ad
            addresses: []
            dhcp4: true
            set-name: wan
```
This makes sure I handle the right one by matching with MAC address, and set the comprehensive name I'm waiting for.

After each modification, y ou must run `sudo netplan apply` to handle changes.

After reboot, the `ifconfig` command gives me : 

```
wan: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.0.108  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::4262:31ff:fe01:14ad  prefixlen 64  scopeid 0x20<link>
        ether 40:62:31:01:14:ad  txqueuelen 1000  (Ethernet)
        RX packets 376  bytes 393184 (393.1 KB)
        RX errors 0  dropped 7  overruns 0  frame 0
        TX packets 321  bytes 28694 (28.6 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
        device memory 0xf7c00000-f7c1ffff  

```