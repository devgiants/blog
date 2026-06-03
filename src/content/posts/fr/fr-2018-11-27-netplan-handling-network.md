---
publicSlug: netplan-handling-network
locale: fr
title: "Netplan : une nouvelle façon de gérer le réseau sous Ubuntu 17+"
date: 2018-11-27 17:55:00 +0100
tags:
  - Ubuntu
  - system
  - Netplan
  - network
  - router
excerpt: "Netplan est un nouveau moteur d’abstraction pour la configuration réseau, disponible sous Ubuntu 17+. Il simplifie radicalement les choses pour gérer le réseau... ou pas."
---

## Contexte
J’ai récemment démarré un nouveau projet : transformer un ordinateur fanless en routeur (en réalité, il gèrera plus que ça, mais cela dépasse le cadre de cet article). J’ai choisi Ubuntu Server 18.10, et lorsque je suis arrivé à la gestion et à la configuration réseau, j’ai découvert [Netplan](https://netplan.io/).
 
## Ce que ça fait
Cela apporte un peu d’__abstraction à la gestion réseau__ principalement à l’aide de __fichiers de configuration YAML__. Exemples :

__Pour autoriser l’attribution DHCP sur une interface donnée__ 
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp3s0:
      dhcp4: true
```         

Vous remarquerez peut-être la clé `renderer` : vous pouvez choisir entre 2 renderers, networkd (utilisé sur serveur) et NetworkManager (utilisé sur les machines de bureau)
Voici l’explication du design du système : 
![Netplan design explanation](https://assets.ubuntu.com/v1/a1a80854-netplan_design_overview.svg)

## Mes besoins
Avec 5 interfaces réseau sur ma machine (4 LAN Gigabit + 1 wifi), j’ai voulu commencer par leur donner des noms plus explicites. Ça commence ici :

Pour renommer par exemple ma future interface WAN :

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
Cela garantit que je cible la bonne interface en la faisant correspondre à son adresse MAC, et que je lui donne le nom explicite que j’attends.

Après chaque modification, il faut exécuter `sudo netplan apply` pour appliquer les changements.

Après redémarrage, la commande `ifconfig` me donne : 

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

## Le piège
Quelques grattages plus tard, j’ai commencé à me rendre compte que ce n’était peut-être pas une si bonne idée. Beaucoup de monde lui reproche de ne pas offrir de manière simple et propre de revenir en arrière (c’est-à-dire retourner à `/etc/network/interfaces`). Il y a aussi de nombreuses limitations, la première que j’ai rencontrée concernant le wifi. J’ai essayé de renommer l’interface wifi de la même manière que ci-dessus, et j’ai obtenu un message d’erreur m’indiquant que pour le wifi, la condition `match` ne peut pas être utilisée.

C’est pourquoi j’ai changé mes plans et choisi une distribution Debian 9.6 pour démarrer ma machine.
