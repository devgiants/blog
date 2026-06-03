---
publicSlug: mixing-autowiring-with-old-fashoned-service-way
locale: fr
title: "Flex : mélanger autowiring et déclaration de services à l'ancienne"
date: 2018-02-20 16:44:24 +0100
tags:
  - symfony
  - service
  - container
excerpt: "Pour de nombreuses raisons, vous pouvez vouloir câbler manuellement vos services tout en utilisant Symfony Flex."
---

## Contexte

[Symfony Flex][flex] réduit et simplifie énormément l’usage quotidien de Symfony. Entre autres choses, [autowiring] est l’un des apports les plus importants.
__Mais que faire si vous avez besoin d’utiliser un ancien mode de nommage des services pour un usage ultérieur ?__

## Solution
Pour le bundle CMS sur lequel je travaille, j’avais besoin de faire référence à un handler pour la sécurité (authentification réussie/échouée). La documentation indique que je peux utiliser un nom de service dans `security.yaml` :

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

Le handler :

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

Mais du point de vue Flex, __le constructeur avec des arguments typés suffit__.

La solution se fait en 2 étapes

1. Définir le service « à l’ancienne »
```yaml
app.security_handler:
  class: App\Listener\Security\SecurityHandler
```
Mais en procédant ainsi, le coeur bascule sur l’ancien mode de chargement des services. Cela signifie que vous devrez fournir manuellement les paramètres/services pour l’injection de dépendances.

2. Définir un [alias de service][service_alias]
```yaml
App\Listener\Security\SecurityHandler: '@app.security_handler'
```
Cette dernière étape __active l’autowiring pour votre service__. Je peux alors utiliser le nom dans `security.yaml` comme ci-dessus.


[flex]: https://symfony.com/doc/current/setup/flex.html
[autowiring]: https://symfony.com/doc/current/service_container.html#creating-configuring-services-in-the-container
[service_alias]: https://github.com/compagnie-hyperactive/UserBundle
[security_handler]: https://github.com/compagnie-hyperactive/cms/blob/master/config/services.yaml#L36
