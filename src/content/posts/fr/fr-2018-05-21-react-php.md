---
publicSlug: react-php
locale: fr
title: "Introduire React PHP"
date: 2018-05-21 11:00:00 +0100
tags:
  - php
  - react
  - reactive
  - programming
excerpt: "Voir comment utiliser la programmation réactive avec PHP !"
---

## Contexte

Lors d’une récente formation Angular 5 à laquelle j’ai eu la chance d’assister, le formateur a présenté la programmation réactive en JS (avec [RXJS](https://beta-rxjsdocs.firebaseapp.com/)). C’est un paradigme complètement nouveau, où tout est événement, imbriqué avec le reste. Une manière de coder très différente... mais extrêmement puissante.

Je me suis alors dit : quelle meilleure approche pour coller à mon modèle métier de domotique ? En pratique, l’IoT et la domotique sont surtout composés de __stimuli__ et de __réactions__.

Quoi de mieux, dans ce contexte, qu’une boucle réactive aux événements ? C’est ce qui m’a conduit vers [ReactPHP](https://reactphp.org/), une implémentation PHP du [Reactor pattern](https://fr.wikipedia.org/wiki/Reactor). Cette librairie est très bien faite, avec des responsabilités bien séparées.

## Quelques exemples

### Brique principale : [event-loop](https://github.com/reactphp/event-loop)

#### Factory pour créer l’objet loop

```php
$loop = React\EventLoop\Factory::create();
```
En coulisses, ce constructeur nommé utilise le meilleur scénario selon votre configuration.

```php
  public static function create()
    {
        // @codeCoverageIgnoreStart
        if (class_exists('libev\EventLoop', false)) {
            return new ExtLibevLoop();
        } elseif (class_exists('EvLoop', false)) {
            return new ExtEvLoop();
        } elseif (class_exists('EventBase', false)) {
            return new ExtEventLoop();
        } elseif (function_exists('event_base_new') && PHP_VERSION_ID < 70000) {
            // only use ext-libevent on PHP < 7 for now
            return new ExtLibeventLoop();
        }
        return new StreamSelectLoop();
        // @codeCoverageIgnoreEnd
    }
```
Plus de détails sur les différentes implémentations et extensions associées [ici](https://github.com/reactphp/event-loop#loop-implementations). Pour le moment j’utilise la version de secours (StreamSelect), mais ce point évoluera bientôt.


#### Exécution de la loop

```php
$loop->run();
```

Simple et efficace. Cette instruction doit être la dernière du script, car elle fait entrer dans une boucle infinie à partir de là.

#### Timers

```php
 $loop->addTimer(0.8, function () {
     echo 'world!' . PHP_EOL;
 });
 
 $loop->addTimer(0.3, function () {
     echo 'hello ';
 });
 $loop->run();
 ```
 
 C’est ici que la magie opère. Le script ci-dessus affichera `hello` 0.3s après le début, puis `world` à 0.5s (0.8s depuis le départ). Quel que soit l’ordre d’enregistrement des timers, la loop gère l’exécution.
 Grâce aux closures/callbacks, vous pouvez insérer vos traitements inline pour gagner en concision.
 
_Note : vous pouvez (et vous devrez certainement) utiliser le mot-clé `use` pour transporter des variables dans le contexte du bloc de callback._

```php
function hello($name, LoopInterface $loop)
{
    $loop->addTimer(1.0, function () use ($name) {
        echo "hello $name\n";
    });
}

hello('Tester', $loop);
 $loop->run();
 ```
 
### [stream](https://github.com/reactphp/stream)

#### ReadableStreamInterface

```php
$stream->on('data', function ($data) {
    echo $data;
});

$loop->run();
 ```

Par exemple, l’événement `end` sera émis une fois que le flux source aura atteint la fin du stream (EOF).

```php
$stream->on('end', function () {
    echo 'END';
});

$loop->run();
 ```
 
Parmi les événements disponibles : pipe, pause, resume, close...

#### WritableStreamInterface

Même idée côté [écriture](https://github.com/reactphp/stream#writablestreaminterface).

À l’heure où j’écris ces lignes, c’est seulement ce que je peux tester et utiliser concrètement.

À approfondir plus tard ici : socket, promise...
