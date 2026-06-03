---
publicSlug: c++-inline-initialisation
locale: fr
title: "C++ permet l'inline initialisation"
date: 2018-11-15 10:00:00 +0100
tags:
  - c++
  - initialisation
excerpt: "J’ai récemment découvert ce sucre syntaxique du C++ pour alléger un constructeur."
---

En tant que développeur PHP, j’ai été très surpris en découvrant, en apprenant le C++, le __inline initialisation__ process.

Avec PHP 7, vous commenceriez par exemple une classe comme ceci :

```php
/**
 * Class User
 * @package
 */
class User {
    /**
     * @var int $id
     */
    private int $id;

    /**
     * @var string $name
     */
    private string $name;

    /**
     * User constructor.
     *
     * @param int $id
     * @param string $name
     */
    public function __construct(int $id, string $name) {
        $this->id = $id;
        $this->name = $name;
    }
}
```

En C++, la même classe deviendrait :

__user.h__
```c
#ifndef USER_USER_H
#define USER_USER_H

#include <iostream>


class User {
private:
    /**
     *
     */
    int m_id;

    /**
     *
     */
    std::string m_name;
public:
    /**
     * Constructor
     * @param id
     * @param name
     */
    User(int id, std::string name);
};

#endif //USER_USER_H
```

__user.cpp__
```c
#include "user.h"

User::User(int id, std::string name) : m_id(id), m_name(name) {
    // Other logic in constructor
}
```

L’inline initialisation se place là où, aujourd’hui, en PHP, vous spécifieriez le type de retour. Avec cette notation, vous __allégez clairement le corps du constructeur__.
