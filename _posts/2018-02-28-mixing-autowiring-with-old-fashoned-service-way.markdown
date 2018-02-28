---
layout: post
title:  "Flex : mixing autowiring and old-fashioned service way"
date:   2018-02-20 16:44:24 +0100
categories: symfony service container
---

## Context 

[Symfony Flex][flex] incredibly reduces and simplifies day-to-day Symfony usage. Among other things, [autowiring] is one of the biggest.
__But what if you need to use some old-school service naming for further usage ?__

## Solution
For the CMS bundle I'm working on, I needed to refer to an handler for security (successful/failure authentication). Docs states I can use a service name in `security.yaml` :

```yaml
admin:
    provider: db_provider # Use any declared provider above
    form_login:
        login_path: /admin/login
        check_path: /admin/login
        default_target_path: /admin
        username_parameter: login[username_or_email]
        password_parameter: login[password]
    
        success_handler:    app.security_handler
        failure_handler:    app.security_handler
```

The handler :

```php
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class SecurityHandler implements AuthenticationSuccessHandlerInterface, AuthenticationFailureHandlerInterface
{

	private $router;

	public function __construct(RouterInterface $router)
	{
		$this->router = $router;
	}

	public function onAuthenticationSuccess(Request $request, TokenInterface $token)
	{
        // TODO make necessary check to ensure proper redirection after successful authentication   
        return new RedirectResponse($this->router->generate('index'));
	}

	public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
	{
		// TODO make necessary check to ensure proper redirection after failure authen authentication
		return new RedirectResponse($this->router->generate('app_login'));
	}
}

```

But from a Flex point of view, __the constructor with type-hinted arguments is enough__.

The solution is in 2 steps

1. Define the service "old-fashioned" way 
```yaml
app.security_handler:
  class: App\Listener\Security\SecurityHandler
```
But doing so, to core will switch to old way to load service. Meaning that you would have to provide parameters/services for dependancy injection manually.

2. Define a [service alias][service_alias]
```yaml
App\Listener\Security\SecurityHandler: '@app.security_handler'
```
This very last step __enable autowiring for your service__. I can use the name in security.yaml as above.


[flex]: https://symfony.com/doc/current/setup/flex.html
[autowiring]: https://symfony.com/doc/current/service_container.html#creating-configuring-services-in-the-container
[service_alias]: https://github.com/compagnie-hyperactive/UserBundle
[security_handler]: https://github.com/compagnie-hyperactive/cms/blob/master/config/services.yaml#L36