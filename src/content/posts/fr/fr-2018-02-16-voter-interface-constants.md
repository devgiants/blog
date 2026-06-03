---
publicSlug: voter-interface-constants
locale: fr
title: "Constantes de l'interface VoterInterface"
date: 2018-02-16 11:39:24 +0100
tags:
  - symfony
  - voters
excerpt: "Un regard plus attentif sur les constantes de l'interface voter pour le contrôle d'accès."
---

## Ce qui se passe

Il y a quelques semaines, j’ai obtenu un __comportement étrange__ dans le retour des voters en utilisant les constantes de l’interface `VoterInterface` (`VoterInterface::ACCESS_GRANTED`, `VoterInterface::ACCESS_DENIED` et `VoterInterface::ACCESS_ABSTAIN`). En aparté, voici [l’interface concernée][voter_interface].

Voici le code initial de mon `Voter` :

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

## Un héritage

En réalité, mon [post StackOverflow][so_post] sur le sujet pointe vers une __compatibilité ascendante SF 2.5-__. La doc indique qu’à partir de SF 2.5+, les voters doivent retourner `true` ou `false`.

C’est particulièrement important pour `VoterInterface::ACCESS_DENIED`, parce que là où un Voter moderne doit retourner `false` en cas d’accès refusé, la constante correspondante vaut `-1`.

Cela dit, une question reste ouverte de mon côté : qu’en est-il de `VoterInterface::ACCESS_ABSTAIN` ? Je trouve la capacité d’abstention très utile quand un `Voter` conclut qu’il ne peut pas voter.

Je mettrai cet article à jour dès que j’aurai la réponse.

[voter_interface]: http://api.symfony.com/3.4/Symfony/Component/Security/Core/Authorization/Voter/VoterInterface.html
[so_post]: https://stackoverflow.com/questions/44906743/symfony-voter-constant-usages#answer-46253196
