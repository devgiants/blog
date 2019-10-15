---
layout: post
title:  "Domofony Symfony application - part 1"
date:   2019-10-13 10:30:00 +0100
tags:
    - php
    - symfony
    - API
    - REST
    - home
    - automation
        
excerpt: "This post presents Domofony Symfony application in details, with some specific implementations used."
    
---
This post presents some implementation & architecture choices made for achieving previous exposed goal in __home automation
platform development wich would be focus on code and yaml configuration__.

![Technical components](https://devgiants.fr/images/posts/domofony/technical_components_with_items.png)

## Items
As stated in [previous post][previous_post], items are the __end-of-chain component__, 
but also the most important part of this very chain (from home automation point-of-view): 
temperature sensor, switch, relay, devices with all of this... 
Actuators like switches will handle orders they receive through the MQTT bus (by listening on correct channels), 
while sensors will publish their data on time on the same bus. As central system [will listen to all channels](https://github.com/devgiants/domofony/blob/master/src/Command/MainMQTTLoopCommand.php#L62), 
it will have the capability to __trigger good code portions regarding to what happens__.

According to what explained above, `Item` does not deserve the Entity status. 
Each item will require code, that will lie on `ItemHandler`. 
So just add it as a record line in database is irrelevant.

That's why I decided the best way IMHO to declare and describe an `Item` was by `yaml` configuration. Here is a typical
declaration :

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
The item ID will be used as query parameter when invoking API `Item` endpoint (see below).

## Items handlers

This application have to let you develop the behavior you want while providing you the context needed to take home automation decisions. 
So the goals are :

- __Let you write code within the application__ : only the code the application can't provide so __your home automation code only__.  
- __Automatic insertion__ of your custom code in application architecture. Neither complex configuration nor manual inclusion.

### Handler creation

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

Each `ItemHandler` must implements `ItemHandlerInterface`, so it will be recognized as real item handler. 
The handler FQCN will be the same as the one used in above configuration.

The payload is the one given when item update endpoint is consumed. The request is the classical HttpFoundation `Request`
object, in case you need more than payload to get context for your item handling.

### Item handler tagging
In order to make it work out-of-the-box without manual service registration, __automatic service tagging__ is used :

__config/services.yaml__
```yaml
services:
   #...

    _instanceof:
        App\Model\ItemHandlerInterface:
            tags: ['app.item_handler']
            lazy: true
``` 
Above configuration will add `app.item_handler` tag __automatically to all classes implementing `App\Model\ItemHandlerInterface`__

Next, [quite recent feature from Symfony 3.4](https://symfony.com/blog/new-in-symfony-3-4-simpler-injection-of-tagged-services) allow to __locate and collect all those tagged services to pass them as argument__ :

__config/services.yaml__
```yaml
services:
    App\Controller\ItemUpdateController:
        arguments: [!tagged app.item_handler]
```

The argument got here is an `ìterable` : 

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
_Note : only relevant arguments are kept here, for sake of brevity. Complete file [here](https://github.com/devgiants/domofony/blob/master/src/Controller/ItemUpdateController.php)._

### Item updater behind the scene

Now, we just have to invoke the matching item handler. This is done when `ItemUpdateController` is itself invoked :

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
_Note : only relevant code is kept here, for sake of brevity. Complete file [here](https://github.com/devgiants/domofony/blob/master/src/Controller/ItemUpdateController.php)._


## API usage

The application exposes an `Item` API, used for retrieving item state (`GET`), and also send updates (`PUT`). 

Reusing `Ìtem` example configured above, REST requests endpoint would be `http://mydomain.com/api/item/west_wall_shutter_1`.


API part is handled by wonderful [API Plaftorm](https://api-platform.com/). As stated in first part of this post, 
I ended up to the fact that `Item` ar not real entity. As I treated them with yaml configuration, 
I needed __custom DataProvider allowed by API Platform for retrieving data that are not in Doctrine__:

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
This `DataProvider` relies on an `ItemFinder` service that have access to the `items` declared in configuration.

API configuration misses now specific route configuration, as we got out of the normal CRUD scope. 

This is done here for ItemGetterController (`GET` requests) :

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

And the same stands for `ItemUpdateController` :

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

At start, I wanted to make a bundle, that can be plugged onto any other application. 
I quickly realized that __required specific configuration__ and __above-described architecture__ 
needed __a complete boilerplate application__, that will be installable with a `composer create-project` command.

Furthermore, this app business purpose makes it quite exclusive regarding usage : it will be used only for home 
automation context and __it's highly improbable that it will be added to other existing application__.

### Application custom extension

In order to be able to use custom configuration namespace, and trigger configuration checks, __I registered a custom extension 
within the application itself__ (this configuration usually lies on bundle). This is done by manually registering the
extension in `Kernel` :

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

We are done here with specific implementations that required enlightments. 
Next post will be dedicated to the __security part__ and __MQTT loop command__.

[previous_post]:https://devgiants.fr/blog/2019/10/12/domofony-presentation/

