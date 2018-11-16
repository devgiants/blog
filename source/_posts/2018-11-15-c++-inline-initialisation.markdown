---
layout: post
title:  "C++ allow inline initialisation"
date:   2018-11-15 10:00:00 +0100
tags: 
    - c++
    - initialisation
excerpt: "I recently discover this C++ syntaxic sugar to light up C++ constructor"
---


As a PHP developer, I was greatly surprised when discovering, while learning C++, the __inline initialisation__ process

Using PHP 7, you would start a class for example with :

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

Using C++, same class would become

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

The inline initialization takes place where nowadays in PHP you would specify return type. Using this notation, you clearly __light up constructor method body__.