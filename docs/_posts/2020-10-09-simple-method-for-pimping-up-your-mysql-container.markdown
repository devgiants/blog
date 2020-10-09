<hr />

<p>layout: post
title:  "Simple  method to override configuration for your MySQL container"
date:   2020-09-10 09:00:00 +0100
tags:
    - docker
    - mysql</p>

<p>excerpt: "How to quickly override any configuration parameter for a MySQL parameter"</p>

<h2 id="first-approach-%3A-wrong-one">First approach : wrong one</h2>

<p>All started while I was doing another dumb import, first using PhpMyAdmin. Despite the fact than the file wasn't
particularily large, it keeped ended by error <code>MySQL server has gone away</code> with a strange mention to missing data close
to an <code>ON</code> directive.</p>

<p>Few searches quickly pointed me on configuration directive <code>max_allowed_packet</code>. If too short, it indeed leads to above 
error. Beware the packet size here refers to a TCP packet, on transport layer. Too large query can trigger this.</p>

<p>As I use <a href="https://github.com/devgiants/docker-boilerplate-wordpress">my stack</a> for making project live on local, I first
thought that I would have to overkill stuff by making custom image from MySQL one, with overriding <code>my.ini</code>, exactly as I
did for <a href="https://github.com/devgiants/docker-boilerplate-wordpress/blob/master/docker/images/php-fpm7.3/Dockerfile">PHP container</a>.</p>

<p>Then I realized that exactly like PHP and Apache, a <code>conf.d</code> folder was existing with MySQL folder architecture.</p>

<h2 id="lightweight-approach">Lightweight approach</h2>

<p>So the solution was quite easier : just define a <code>override_max_packet_size.cnf</code> (you name it like you want), that lies
in <code>docker/images/mysql/conf</code>. I put this inside :</p>

<pre><code class="ini">[mysqld]
max_allowed_packet=64M
</code></pre>

<p>Then just mount a volume targeting this host folder and bind it with <code>/etc/mysql/conf.d</code></p>

<pre><code class="yaml">services:
  mysql:
    env_file: ./.env
    image: mysql:5.7
    ports:
      - ${MYSQL_HOST_PORT}:${MYSQL_PORT}
    environment:
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - ${MYSQL_HOST_VOLUME_PATH}:/var/lib/mysql
      - ./docker/images/mysql/config:/etc/mysql/conf.d
</code></pre>

<p>Complete stack rebuild, and try to reimport : bingo, it works.
Using this method, you can safely override any MySQL configuration directive while keeping image untouched.</p>
