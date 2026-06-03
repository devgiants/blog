---
publicSlug: symfony-workflow-component-walkthrough-part-1
locale: fr
title:  "Composant Symfony Workflow - partie 1"
date:   2020-03-02 13:30:00 +0100
tags:
    - php
    - symfony
    - component
    - workflow    
        
excerpt: "Nous entamons ici un parcours autour du composant Workflow, souvent sous-utilisé."
    
---
Le [composant Symfony Workflow](https://symfony.com/doc/current/components/workflow.html), selon la documentation,
permet de :
>  Le composant Workflow fournit des outils pour gérer un workflow ou une finite state machine.

Cette simple phrase peut être impressionnante quand on mesure la complexité réelle de la tâche.
Une fois cet effet passé, voyons comment cette implémentation peut nous aider à faire respecter de façon drastique certaines règles définies par les
__places__ et les __transitions__.

Pour rappel (encore d’après la doc), un workflow est :

> Une manière de définir un process ou un cycle de vie traversé par votre objet.

## 2 types de workflows

Il existe 2 approches : __workflow__ ou __finite state machine__. La principale différence est que le __workflow permet au sujet d’occuper plusieurs
états simultanément__, alors que la finite state machine n’en autorise __qu’un seul à la fois__. Cet article se concentre sur cette dernière.
Pour commencer, la finite state machine est plus simple à manipuler.

### Vocabulaire
Définissons d’abord le vocabulaire :

- __Place__ : état donné marquant le statut de l’objet (par exemple "Draft", "Published", "Review"...).
- __Transition__ : action nommée permettant de passer d’une place à une autre (par exemple "Publication"
fera passer le marqueur d’état de la place "Draft" à la place "Publish").
- __Definition__ : ensemble des places et transitions

Prenons un système de tickets classique, comme Redmine. Une définition de workflow (simplifiée) pourrait être :

![Ticket workflow example](/images/posts/workflow/ticket_workflow_example.png)

Nous avons maintenant une definition. Traduisons-la en configuration :

<kbd>workflow.yaml</kbd>
```yaml
framework:
  workflows:
    ticket:
      # Only one state at a time for target entities
      type: 'state_machine'

      # Make log trail cruise
      #      audit_trail:
      #        enabled: true
      marking_store:
        type: 'method'
        property: 'state'
      supports:
        - App\Entity\Ticket
      initial_marking: !php/const App\Workflow\Status\TicketStatuses::NEW
      places:
        - !php/const App\Workflow\Status\TicketStatuses::NEW
        - !php/const App\Workflow\Status\TicketStatuses::IN_PROGRESS
        - !php/const App\Workflow\Status\TicketStatuses::COMMENT
        - !php/const App\Workflow\Status\TicketStatuses::SOLVED
        - !php/const App\Workflow\Status\TicketStatuses::CLOSED
      transitions:
        !php/const App\Workflow\Transition\TicketTransitions::START_PROCESS:
          from:
            - !php/const App\Workflow\Status\TicketStatuses::NEW
            - !php/const App\Workflow\Status\TicketStatuses::COMMENT
          to: !php/const App\Workflow\Status\TicketStatuses::IN_PROGRESS
        !php/const App\Workflow\Transition\TicketTransitions::COMMENT:
          from: !php/const App\Workflow\Status\TicketStatuses::IN_PROGRESS
          to:   !php/const App\Workflow\Status\TicketStatuses::COMMENT
        !php/const App\Workflow\Transition\TicketTransitions::SOLVE:
          from: !php/const App\Workflow\Status\TicketStatuses::IN_PROGRESS
          to:   !php/const App\Workflow\Status\TicketStatuses::SOLVED
        !php/const App\Workflow\Transition\TicketTransitions::UNSOLVE:
          from: !php/const App\Workflow\Status\TicketStatuses::SOLVED
          to:   !php/const App\Workflow\Status\TicketStatuses::IN_PROGRESS
        !php/const App\Workflow\Transition\TicketTransitions::CLOSE:
          from: !php/const App\Workflow\Status\TicketStatuses::SOLVED
          to:   !php/const App\Workflow\Status\TicketStatuses::CLOSED
```

<kbd>App\Workflow\Transition\TicketTransitions</kbd>

```php
<?php

namespace App\Workflow\Transition;


final class TicketTransitions
{
    public const START_PROCESS = 'start_process';
    public const COMMENT = 'comment';
    public const SOLVE = 'solve';
    public const UNSOLVE = 'unsolve';
    public const CLOSE = 'close';
}
```


<kbd>App\Workflow\Status\TicketStatuses</kbd>

```php
<?php

namespace App\Workflow\Status;


final class TicketStatuses
{
    public const NEW = 'new';
    public const IN_PROGRESS = 'in_progress';
    public const COMMENT = 'comment';
    public const SOLVED = 'solved';
    public const CLOSED = 'closed';
}
```

Vous noterez l’usage intensif des constantes PHP dans YAML. YAML devient donc un peu moins lisible, mais cela permet
de définir clairement les choses en PHP et de les réutiliser dans les fichiers YAML. Coupler cet usage avec des Enumerations Doctrine
(par exemple [DoctrineEnumBundle](https://github.com/fre5h/DoctrineEnumBundle)) est une bonne pratique.

[La documentation](https://symfony.com/doc/current/workflow.html#creating-a-workflow) détaille les clés et valeurs attendues pour cette configuration.

## Le marking store

J’ai volontairement redéfini la partie suivante :

<kbd>workflow.yaml</kbd>
```yaml
      marking_store:
        type: 'method'
        property: 'state'
```

La clé `property` contient l’attribut de l’entité qui portera l’état (la place) dans lequel se trouve l’entité.
Une [évolution assez récente](https://symfony.com/blog/new-in-symfony-4-3-workflow-improvements) de la core team a introduit plusieurs choses,
notamment des [context data](https://symfony.com/blog/new-in-symfony-4-3-workflow-improvements#added-a-context-to-workflow-apply)
qui peuvent s’avérer utiles.

L’entité `Ticket` ressemblera donc à ceci :

```php
<?php

namespace App\Entity;

use App\Behavior\Workflowable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TicketRepository")
 */
class Ticket
{
    use Workflowable;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $title;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Ticket", inversedBy="relatedTickets")
     */
    protected $parentTicket;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Ticket", mappedBy="parentTicket")
     */
    protected $relatedTickets;

    public function __construct()
    {
        $this->relatedTickets = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getParentTicket(): ?self
    {
        return $this->parentTicket;
    }

    public function setParentTicket(?self $parentTicket): self
    {
        $this->parentTicket = $parentTicket;

        return $this;
    }

    /**
     * @return Collection|self[]
     */
    public function getRelatedTickets(): Collection
    {
        return $this->relatedTickets;
    }

    public function addRelatedTicket(self $relatedTicket): self
    {
        if (!$this->relatedTickets->contains($relatedTicket)) {
            $this->relatedTickets[] = $relatedTicket;
            $relatedTicket->setParentTicket($this);
        }

        return $this;
    }

    public function removeRelatedTicket(self $relatedTicket): self
    {
        if ($this->relatedTickets->contains($relatedTicket)) {
            $this->relatedTickets->removeElement($relatedTicket);
            // set the owning side to null (unless already changed)
            if ($relatedTicket->getParentTicket() === $this) {
                $relatedTicket->setParentTicket(null);
            }
        }

        return $this;
    }
}
```

Vous noterez le trait `Workflowable`. Toutes les finite state machines auront le même attribut pour transporter la place,
il est donc pertinent de factoriser cela :

```php
<?php

namespace App\Behavior;


trait Workflowable
{
    /**
     * @ORM\Column(type="string", length=15, nullable=false)
     *
     * @var string
     */
    protected $state;

    /**
     * @return string
     */
    public function getState(): ?string
    {
        return $this->state;
    }

    /**
     * @param string $state
     *
     * @return Workflowable
     */
    public function setState(string $state,  $context = []): self
    {
        $this->state = $state;

        return $this;
    }
}
```  

## Que pouvez-vous faire avec ça ?

Cela étant dit, comment exploiter la definition que vous venez de créer ? Créons un ticket et faisons-le avancer :
L’exemple est donné dans un controller pour simplifier l’injection de dépendances et faciliter l’accès, mais gardons à l’esprit
que cela ne doit pas être fait en vrai projet (Single Responsibility Principle, et pas dans un controller).

```php
public function index(Registry $registry)
    {
        /*****************************************
         * Simple example
         */
        // Create new ticket
        $ticket = new Ticket();
        $ticket->setTitle('Nice title');

        // Find workflow by entity
        // Will throw an exception if a same entity is targeted by multiple workflows
        // unless you provide second argument
        $ticketWorkflow = $registry->get($ticket);

        // Apply transition
        // Will try to play the transition (move from A place to B place) on the given entity 
        $ticketWorkflow->apply($ticket, TicketTransitions::START_PROCESS);
      
        return $this->render('main.html.twig');
    }
```
La méthode `apply` tente d’exécuter la transition afin de faire changer l’état de l’entité donnée. Deux possibilités s’offrent alors à nous :

### La transition donnée est applicable
Cela signifie que la liste `from` de la transition contient l’état actuel de l’entité.

_Exemple : comme indiqué dans la configuration, le marquage initial de l’entité `Ticket` est la place `TicketStatuses::NEW`.
Un coup d’œil rapide à la configuration confirme que cette place est autorisée comme place de départ pour `TicketTransitions::START_PROCESS`._

Le workflow présenté ci-dessus est très simple, mais comme beaucoup d’entre vous l’auront remarqué, __vous pouvez définir plus d’une place de départ__.
L’inverse n’est pas possible, car on ne saurait pas quelle place choisir une fois la transition effectuée.


### La transition donnée n’est pas applicable
L’inverse du cas précédent. Vous ne pouvez pas appliquer cette transition. Si vous essayez, une `LogicException` sera levée :

### Quelques réflexions

Pour ajouter du dynamisme, vous pouvez __faire un peu de reflection sur l’objet workflow__. Vous pouvez :

- Vérifier si l’entité peut effectuer une transition : `$ticketWorkflow->can($ticket, TicketTransitions::START_PROCESS)`
- Récupérer les transitions disponibles pour l’entité : `$ticketWorkflow->getEnabledTransitions($ticket)`

Ces deux helpers sont extrêmement utiles, car __vous pouvez faire avancer votre objet en toute sécurité en fonction des données du runtime__.  


## Conclusion rapide

J’espère que vous voyez à quel point cette structure est puissante et comment elle peut aider à renforcer vos règles métier,
en contraignant les entités à un parcours planifié pendant leur cycle de vie.


Le prochain article se concentrera sur la vraie matière : les events dispatchés par le système, qui permettront de
faire les choses sérieuses.
