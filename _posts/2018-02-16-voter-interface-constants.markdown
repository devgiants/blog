---
layout: post
title:  "VoterInterface interface constants"
date:   2018-02-16 11:39:24 +0100
categories: symfony voters
---

## What's happening

Few weeks ago, I got __strange behavior__ in voters return while using constants from `VoterInterface` interface ( `VoterInterface::ACCESS_GRANTED`, `VoterInterface::ACCESS_DENIED` and `VoterInterface::ACCESS_ABSTAIN`). As sidenote, here is the [involved interface][voter_interface].

Below my `Voter` initial code: 

```php
 /**
     * @param string $attributes
     * @param mixed $subject
     * @param TokenInterface $token
     * @return int
     */
    public function voteOnAttribute($attributes, $subject, TokenInterface $token) {

      $user = $token->getUser();

      // If managed here, meaning support method said yes and subject got Rolable trait, and therefore getAuthorizedRoles() method.

      // skip everything if no roles set
      if(count($subject->getAuthorizedRoles()) > 0) {

        // Roles set and no user. Deny
        if(!$user instanceof User) {
            return static::ACCESS_DENIED;
        }

        // user connected (but skip if admin)
        if(!$user->hasRole(User::ROLE_ADMIN)) {

          // User connected, not admin, check roles intersections
          if(count(array_intersect($subject->getAuthorizedRoles(), $user->getRoles())) === 0) {
            return static::ACCESS_DENIED;
          }
        }
      }

      return static::ACCESS_GRANTED;
    }
```

## A legacy


As a matter of fact, my [StackOverflow post][so_post] on topic is pointed on __a back-compatibility SF 2.5-__. Doc says for SF 2.5+, voters must return `true` or `false`.

It’s really important when it comes to `VoterInterface::ACCESS_DENIED` because where a today regular Voter must return `false` in __denied access__ case, the matching constant got assigned to -1.

Nonetheless, still a question from my point of view so far : what about `VoterInterface::ACCESS_ABSTAIN` ? I found the abstaining capability very useful if `Voter` concludes that it can’t vote.

I will keep this post updated as soon as I will have the answer.


[voter_interface]: http://api.symfony.com/3.4/Symfony/Component/Security/Core/Authorization/Voter/VoterInterface.html
[so_post]: https://stackoverflow.com/questions/44906743/symfony-voter-constant-usages#answer-46253196