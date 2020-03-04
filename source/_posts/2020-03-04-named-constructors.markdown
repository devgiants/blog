---
layout: post
title:  "Named constructor"
date:   2020-03-04 17:30:00 +0100
tags:
    - php
    - oop
    - semantic
    - ddd
        
excerpt: "Why use named constructor ? Semantic, readability, override... Name it !"
    
---
## How to create an instance ?

### Classical OOP
In classical OOP approach, you will use the
`__construct` magic method to do the job. Let's reuse our `Ticket` entity 
described in [SymfonyWorkflow journey - part 1](https://devgiants.fr/blog/2020/03/02/symfony-workflow-component-walkthrough-part-1/)

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

_Note : I cleared unnecessary stuff, such as getters/setters, annotations... 
So the rest look much more like a __value object__._

So far, so good. What's wrong with this? Nothing technically speaking, __this does the job__.
But what if the object is complex, and you have more than one way to create instance (from a business POV) ?
This is where __named constructors__ come into light.

### Named constructor

This is mostly a kind of static factory (a system to create an object) embedded in object class itself. Above example 
become :

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

So instead of doing `$ticket = new Ticket()` you would do `$ticket = Ticket::fromTitle('new title')`.

_Notes :_
- _Pay attention to `self` return type. This allow not to hardcode the class return type, hence offers 
dynamism on override (with precautions though)._
- _In the same way, the `new static()` allow to instantiate current object instance. In case you extended `Ticket`,
you will obtain here the last-in-chain class type._ 


## Advantages and... advantages

Not really drawbacks here, let's focus on the advantages

### Nice semantics
`$ticket = Ticket::fromTitle('new title')` speaks for itself. More than creating an instance, you __describe the
intent__ which is a key part in complex applications.

### Override constructors
Unlike other languages (such as C++) , __PHP can only have one constructor per class__. If you stick to your class 
to get an instance, the only way to fulfill different instance creation scenarii is to 
- Low the signature exigence (parameters type-hinting, nullable,...)
- Creates several checks and tests to ensure params passed on creation are still consistent

As named constructors are simple static methods, and considering the fact that `__construct()` is no more available 
from outside world, you can create __as much named constructors as you want__. And guess what ?

- Design intents are still here (`Ticket::fromTitle()`, `Ticket::fromAnotherTicket()`...).
- All coherence checks are separated and lies only in named constructor they belong to.   

Last but not least, this is totally __framework agnostic__. You can start using them now, with nothing but
intention.

