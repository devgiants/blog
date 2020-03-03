---
layout: post
title:  "Symfony Workflow component - part 1"
date:   2020-03-02 13:30:00 +0100
tags:
    - php
    - symfony
    - component
    - workflow    
        
excerpt: "We start here a journey in often underused Workflow component."
    
---
The [Symfony Workflow component](https://symfony.com/doc/current/components/workflow.html), according to documentation,
allows to :
>  The Workflow component provides tools for managing a workflow or finite state machine.

This one-line program can be breathtaking, when we measure the complexity the task can be.
This feeling passed away, let's see how this implementation can drastically help us to enforce some rules defined by 
__places__ & __transitions__.

As a reminder (from doc again), a workflow is

> A way to define a process or a life cycle that your object goes through.

## 2 types of workflows

There are 2 ways : __workflow__ or __finite state machine__. Main difference is __workflow allows subject to take simultaneous 
states as the same time__, whereas finite state machine authorize __only one at a time__. This post focuses on the latter.
As a start, the finite state machine is easier to deal with.

### Vocabulary
Let's define vocabulary first :

- __Place__ : given state marking the object status (for example "Draft", "Published", "Review"...). 
- __Transition__ : named action for moving from one place to another (for example "Publication" 
will drag the state marker from place "Draft" to place "Publish").
- __Definition__ : set of places and transitions

Let's focus on a classical ticket system, like Redmine. A workflow definition (simplified) could be :

![Ticket workflow example](https://devgiants.fr/images/posts/workflow/ticket_workflow_example.png)

We now have a definition. Let's transcript this in configuration :

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

You may note the heavy use of YAML PHP constant. YAML is therefore a bit less readable, but this allow to define in a clear way things in PHP 
and use them in YAML files. Coupling usage with Doctrine Enumerations (for example [DoctrineEnumBundle](https://github.com/fre5h/DoctrineEnumBundle)) is good practice.

[Documentation](https://symfony.com/doc/current/workflow.html#creating-a-workflow) goes through keys and values expected regarding to this configuration.

## The marking store

I redefined on purpose the following part:

<kbd>workflow.yaml</kbd>
```yaml
      marking_store:
        type: 'method'
        property: 'state'
```

The `property` key contains the entity attribute that will carry the state (the place)
the entity is. A [quite recent move](https://symfony.com/blog/new-in-symfony-4-3-workflow-improvements) from core team 
introduce few things, especially [context data](https://symfony.com/blog/new-in-symfony-4-3-workflow-improvements#added-a-context-to-workflow-apply) that can be useful. 

So the `Ticket` entity will look like :

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

You may note the trait `Workflowable`. All finite state machine will have the same attribute for carrying place,
so it can be DRYed like that :

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

## What can you do with this ?

That being said, how can you lever the definition you just made ? Let's create a ticket and make a cruise :
The example is given in a controller for DI simplicy and easy access sake, but let's keep in mind that must not be done
in real projects (Single Responsability Principle, not for controller).

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
The `apply` method will try to play transition for changing given entity state. 2 possibilities from here :

### Given transition is applyable
it means that transition `from` places contains actual entity state.

_Example : as stated in configuration, initial marking for `Ticket` entity is `TicketStatuses::NEW` place. 
Quick_look to configuration confirms that this place is allowed as start place for TicketTransitions::START_PROCESS_  

The workflow given above is dead simple, but as most of you have noticed, __you may specify more than one start place__.
The opposite is not possible because you wouldn't know which place to pick up once transition done.


### Given transition is not applyable
The opposite from above. You can't apply this transition. If you try it, a `LogicException` will be raised :

### Some reflection

For adding dynamism, you can make __some reflection on workflow object__. You can :

- Check if given entity can do transition : `$ticketWorkflow->can($ticket, TicketTransitions::START_PROCESS)`
- Retrieve available transitions for given entity : `$ticketWorkflow->getEnabledTransitions($ticket)`

Those 2 helpers are immensively useful, because __you can safely make your object cruising according to runtime data__.  


## Quick conclusion

I hope you realize how powerful this structure is and how it can help to strenghten you business rules,
by constraining entities to planned cruise during its lifetime.


Next post will focus on the real stuff : events dispatched by the system that will allow you to 
do the serious things.
