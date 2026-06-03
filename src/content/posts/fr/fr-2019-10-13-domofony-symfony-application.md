---
publicSlug: domofony-symfony-application
locale: fr
title:  "Application Symfony Domofony - partie 1"
date:   2019-10-13 10:30:00 +0100
tags:
    - php
    - symfony
    - API
    - REST
    - home
    - automation
        
excerpt: "Cet article présente en détail l’application Symfony Domofony, avec quelques implémentations spécifiques utilisées."
    
---
Cet article présente certains choix d’architecture et d’implémentation retenus pour atteindre l’objectif exposé précédemment : 
__développer une plateforme de home automation centrée sur le code et la configuration YAML__.

![Technical components](/images/posts/domofony/technical_components_with_items.png)

## Items
Comme expliqué dans [l’article précédent][previous_post], les items sont le __composant en bout de chaîne__,
mais aussi la partie la plus importante de cette chaîne du point de vue home automation : capteur de température,
switch, relay, device intégrant tout cela... Les actuateurs comme les switches recevront les ordres via le bus MQTT
(en écoutant les bons channels), tandis que les sensors publieront leurs données à intervalle régulier sur ce même bus.
Comme le système central [écoutera tous les channels](https://github.com/devgiants/domofony/blob/master/src/Command/MainMQTTLoopCommand.php#L62),
il pourra __déclencher les bonnes portions de code en fonction de ce qui se passe__.

Au vu de ce qui précède, `Item` ne mérite pas le statut d’Entity. Chaque item nécessitera du code, qui se trouvera dans `ItemHandler`.
Le déclarer comme une simple ligne d’enregistrement en base n’a donc pas vraiment de sens.

C’est pourquoi j’ai décidé que la meilleure façon, selon moi, de déclarer et décrire un `Item` était de passer par une configuration `yaml`.
Voici une déclaration typique :

__config/services.yaml__
```yaml
    items:
        west_wall_shutter_1:                        # The item ID
            handler: App\ItemHandler\TestHandler    # The handler FQCN
            api:                                    # API configuration
                accepted_arguments:                 # Accepted arguments
                    - open
                    - close
```
L’ID de l’item sera utilisé comme paramètre de requête lors de l’appel du endpoint API `Item` (voir plus bas).

## Item handlers

Cette application doit vous laisser développer le comportement que vous souhaitez tout en fournissant le contexte nécessaire pour prendre des décisions de home automation.
Les objectifs sont donc :

- __Vous laisser écrire du code dans l’application__ : uniquement le code que l’application ne peut pas fournir, donc __votre code de home automation uniquement__.
- __Insertion automatique__ de votre code personnalisé dans l’architecture de l’application. Ni configuration complexe, ni inclusion manuelle.

### Création d’un handler

__App\ItemHandler\TestHandler__
```php
class TestHandler implements ItemHandlerInterface
{
    public function __invoke(array $payload, RequestInterface $request)
        {
            // TODO: Implement __invoke() method, using parameters
        }
}
```

Chaque `ItemHandler` doit implémenter `ItemHandlerInterface`, afin d’être reconnu comme un vrai item handler.
Le FQCN du handler sera le même que celui utilisé dans la configuration ci-dessus.

Le payload est celui fourni lorsque le endpoint de mise à jour d’un item est consommé.
La request est l’objet classique `Request` de HttpFoundation, au cas où vous auriez besoin de plus que le payload pour contextualiser le traitement de l’item.

### Tagging du handler
Pour que tout fonctionne out-of-the-box sans enregistrement manuel du service, __le service tagging automatique__ est utilisé :

__config/services.yaml__
```yaml
services:
   #...

    _instanceof:
        App\Model\ItemHandlerInterface:
            tags: ['app.item_handler']
            lazy: true
``` 
La configuration ci-dessus ajoutera automatiquement le tag `app.item_handler` à toutes les classes implémentant `App\Model\ItemHandlerInterface`.

Ensuite, [une fonctionnalité assez récente de Symfony 3.4](https://symfony.com/blog/new-in-symfony-3-4-simpler-injection-of-tagged-services)
permet de __repérer et collecter tous ces services tagués pour les passer en argument__ :

__config/services.yaml__
```yaml
services:
    App\Controller\ItemUpdateController:
        arguments: [!tagged app.item_handler]
```

L’argument obtenu ici est un `ìterable` :

__App\Controller\ItemUpdateController__
```php
/**
 * Class ItemUpdateController
 *
 * @package App\Controller
 */
class ItemUpdateController extends AbstractController
{

    /**
     * @var iterable $itemHandlers
     */
    protected $itemHandlers;

    /**
     * ItemUpdateController constructor.
     *
     * @param iterable $itemHandlers
     */
    public function __construct(
        iterable $itemHandlers
    ) {
        $this->itemHandlers    = $itemHandlers;
    }
    
    // ....

}
```
_Note : seuls les arguments pertinents sont conservés ici, pour plus de brièveté. Le fichier complet est [ici](https://github.com/devgiants/domofony/blob/master/src/Controller/ItemUpdateController.php)._

### Le moteur de mise à jour derrière le rideau

Maintenant, il ne nous reste plus qu’à invoquer le handler correspondant à l’item. Cela se fait lorsque `ItemUpdateController`
est lui-même appelé :

__App\Controller\ItemUpdateController__
```php
class ItemUpdateController extends AbstractController
{
    public function __invoke(
        string $id,
        RequestStack $requestStack,
        ItemFinder $itemFinder
    ) {
        // Find item
        $item = $itemFinder->findById($id);

        // Extract and create handler instance
        $handlerFQCN = $item->getHandlerFQCN();

        if ( ! class_exists($handlerFQCN)) {
            throw new ClassNotFoundException();
        }

        foreach ($this->itemHandlers as $itemHandler) {
            // If handler found, extract payload and invoke it
            if ($itemHandler instanceof $handlerFQCN) {
                $request = $requestStack->getCurrentRequest();
                $payload = json_decode($request->getContent());

                // Pre handler event
                $preHandlerEvent = new PreHandlerCallEvent($item, $payload,
                    $request);
                $this->eventDispatcher->dispatch($preHandlerEvent);

                // Item handler invocation
                call_user_func($itemHandler, $preHandlerEvent->getPayload(),
                    $preHandlerEvent->getRequest());

                // Post handler event
                $postHandlerEvent = new PostHandlerCallEvent($preHandlerEvent->getItem(),
                    $preHandlerEvent->getPayload(),
                    $preHandlerEvent->getRequest());
                $this->eventDispatcher->dispatch($preHandlerEvent);

                return $postHandlerEvent->getItem();
            }
        }

        return $item;
    }
}
```
_Note : seuls les morceaux de code pertinents sont conservés ici, pour plus de brièveté. Le fichier complet est [ici](https://github.com/devgiants/domofony/blob/master/src/Controller/ItemUpdateController.php)._


## Utilisation de l’API

L’application expose une API `Item`, utilisée pour récupérer l’état d’un item (`GET`) et aussi pour envoyer des mises à jour (`PUT`).

En reprenant l’exemple `Ìtem` configuré ci-dessus, le endpoint REST serait `http://mydomain.com/api/item/west_wall_shutter_1`.


La partie API est gérée par l’excellent [API Platform](https://api-platform.com/). Comme expliqué dans la première partie de cet article,
j’en suis arrivé à la conclusion que `Item` n’était pas une vraie entity. Comme je les gérais via configuration `yaml`,
j’avais besoin d’un __custom DataProvider autorisé par API Platform pour récupérer des données qui ne se trouvent pas dans Doctrine__ :

__App\DataProvider\ItemDataProvider__

```php
namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Model\Item;
use App\Service\ItemFinder;

/**
 * Class ItemDataProvider
 *
 * @package App\DataProvider
 */
final class ItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{

    /**
     * @var ItemFinder
     */
    protected $itemFinder;

    /**
     * ItemDataProvider constructor.
     *
     * @param ItemFinder $itemFinder
     */
    public function __construct(ItemFinder $itemFinder)
    {
        $this->itemFinder = $itemFinder;
    }

    /**
     * @inheritDoc
     */
    public function supports(
        string $resourceClass,
        string $operationName = null,
        array $context = []
    ): bool {
        return Item::class === $resourceClass;
    }

    /**
     * @inheritDoc
     */
    public function getItem(
        string $resourceClass,
        $id,
        string $operationName = null,
        array $context = []
    ) {
        return $this->itemFinder->findById($id);
    }
}
```
Ce `DataProvider` s’appuie sur un service `ItemFinder` qui a accès aux `items` déclarés dans la configuration.

La configuration de l’API n’a désormais plus de route spécifique, puisque nous sommes sortis du cadre CRUD habituel.

Cela se fait ici pour `ItemGetterController` (`GET` requests) :

__App\Controller\ItemGetterController__

```php
namespace App\Controller;

use App\Service\ItemFinder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Model\Item;

/**
 * Class ItemGetterController
 *
 * @package App\Controller
 */
class ItemGetterController extends AbstractController
{
    /**
     * @Route(
     *     name="devgiants.domofony.item.get",
     *     path="/api/item/{id}",
     *     methods={"GET"},
     *     defaults={
     *       "_api_resource_class": "App\Model\Item",
     *       "_api_item_operation_name": "get"
     *     }
     * )
     *
     * @param string $id
     * @param ItemFinder $itemFinder
     * @return Item
     */
    public function __invoke(string $id, ItemFinder $itemFinder)
    {
        return $itemFinder->findById($id);
    }
}
```

Et il en va de même pour `ItemUpdateController` :

__App\Controller\ItemUpdateController__
```php
/**
 * Class ItemUpdateController
 *
 * @package App\Controller
 */
class ItemUpdateController extends AbstractController
{
    /**
     * @Route(
     *     name="devgiants.domofony.item.update",
     *     path="/api/item/{id}",
     *     methods={"PUT"},
     *     defaults={
     *       "_api_resource_class": "App\Model\Item",
     *       "_api_item_operation_name": "put"
     *     }
     * )
     *
     * @param string $id
     * @param RequestStack $requestStack
     * @param ItemFinder $itemFinder
     *
     * @return Item
     * @throws ClassNotFoundException
     */
    public function __invoke(
        string $id,
        RequestStack $requestStack,
        ItemFinder $itemFinder
    ) {
        // ...
    }
}
```

## Bundle versus application

Au départ, je voulais en faire un bundle, que l’on pourrait brancher sur n’importe quelle autre application.
J’ai rapidement compris qu’__une configuration spécifique obligatoire__ et __l’architecture décrite ci-dessus__
nécessitaient __une application boilerplate complète__, installable avec une commande `composer create-project`.

De plus, l’objectif métier de cette application la rend assez exclusive dans son usage : elle servira uniquement dans
un contexte de home automation et __il est très improbable qu’elle soit ajoutée à une autre application existante__.

### Extension personnalisée de l’application

Pour pouvoir utiliser un namespace de configuration personnalisé et déclencher les vérifications de configuration,
__j’ai enregistré une extension personnalisée directement dans l’application elle-même__ (ce type de configuration se trouve d’ordinaire dans un bundle).
Cela se fait en enregistrant manuellement l’extension dans `Kernel` :

__App\Kernel__
```php
class Kernel extends BaseKernel
{
    protected function configureContainer(ContainerBuilder $container, LoaderInterface $loader)
    {
        $devgiantsDomofonyExtension = new DevgiantsDomofonyExtension();

        $container
            ->addResource(new FileResource($this->getProjectDir().'/config/bundles.php'))
            // Register extension to make configuration working
            ->registerExtension($devgiantsDomofonyExtension)
        ;
        // ...
    }
}
```

Nous avons terminé ici avec les implémentations spécifiques qui méritaient d’être mises en lumière.
Le prochain article sera consacré à la __partie sécurité__ et à la __MQTT loop command__.

[previous_post]:/blog/2019/10/12/domofony-presentation/
