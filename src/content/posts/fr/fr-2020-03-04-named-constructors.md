---
publicSlug: named-constructors
locale: fr
title:  "Constructeur nommé"
date:   2020-03-04 17:30:00 +0100
tags:
    - php
    - oop
    - semantic
    - ddd
        
excerpt: "Pourquoi utiliser un named constructor ? Sémantique, lisibilité, surcharge... Donnez-lui un nom !"
    
---
## Comment créer une instance ?

### OOP classique
Dans une approche OOP classique, on utilise la méthode magique `__construct` pour faire le travail. Reprenons notre entité `Ticket` décrite dans [SymfonyWorkflow journey - part 1](/blog/2020/03/02/symfony-workflow-component-walkthrough-part-1/)

```php
/**
 * All attributes protected, stick to SOLID principles    
 */
class Ticket
{       
    protected $id;

    protected $title;

    /**
    * Classical constructor magic method
    */
    public function __construct()
    {
        
    }

}
```

_Note : j’ai supprimé tout ce qui était inutile, comme les getters/setters ou les annotations... 
Le reste ressemble donc davantage à un __value object__._

Jusqu’ici, tout va bien. Qu’est-ce qui cloche ? Rien, techniquement parlant, __ça fait le travail__.
Mais que faire si l’objet est complexe, et qu’on a plus d’une façon de créer une instance (du point de vue métier) ?
C’est là que les __named constructors__ entrent en scène.

### Named constructor

C’est surtout une forme de factory statique, intégrée dans la classe elle-même. L’exemple ci-dessus
devient :

```php
/**
  * All attributes protected, stick to SOLID principles    
  */
 class Ticket
 {       
     protected $id;
 
     protected $title;
 
     /**
     * Constructor becomes protected to ensure there is direct call
     */
     protected function __construct()
     {
         
     }
    
     /**
     * Named constructor example. Static to be called from class itself
     */
     public static function fromTitle(string $title): self
     {
        $ticket = new static();
        $ticket->setTitle($title);
        return $ticket;  
     } 
 }
 ```

Au lieu de faire `$ticket = new Ticket()`, vous feriez donc `$ticket = Ticket::fromTitle('new title')`.

_Notes : 
- _Faites attention au type de retour `self`. Il permet de ne pas figer le type de retour dans la classe, et offre
ainsi du dynamisme en cas de surcharge (avec précaution néanmoins).
- _De la même manière, `new static()` permet d’instancier l’objet courant. Si vous étendez `Ticket`,
vous obtiendrez ici le type de classe le plus bas dans la chaîne._ 


## Avantages et... avantages

Pas vraiment d’inconvénient ici, concentrons-nous sur les avantages

### Sémantique agréable
`$ticket = Ticket::fromTitle('new title')` parle de lui-même. Plus qu’une simple création d’instance, vous
__décrivez l’intention__, ce qui est essentiel dans les applications complexes.

### Surcharger les constructeurs
Contrairement à d’autres langages (comme C++), __PHP ne peut avoir qu’un seul constructeur par classe__. Si vous tenez à ce que votre classe fournisse une instance, le seul moyen de gérer différents scénarios de création est de :
 
- Réduire les exigences de signature (typage des paramètres, nullable, ...)
- Ajouter plusieurs contrôles et tests pour s’assurer que les paramètres fournis à la création restent cohérents

Comme les named constructors sont de simples méthodes statiques, et puisque `__construct()` n’est plus accessible depuis l’extérieur, vous pouvez créer __autant de named constructors que nécessaire__. Et devinez quoi ?

- Les intentions de design restent visibles (`Ticket::fromTitle()`, `Ticket::fromAnotherTicket()`...).
- Tous les contrôles de cohérence sont séparés et restent uniquement dans le named constructor auquel ils appartiennent.   

Enfin, et ce n’est pas le moindre avantage, c’est totalement __framework agnostic__. Vous pouvez commencer à les utiliser dès maintenant, sans autre intention que celle-là.
