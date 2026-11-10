---
title: "Laravel 5 - Interface is not instantiable"
description: "Title: Resolving \"Target [App\\Contracts\\CustomModelInterface] is not instantiable\" Exception in Laravel 5 Applications Body: I know that this question has..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Resolving "Target [App\Contracts\CustomModelInterface] is not instantiable" Exception in Laravel 5 Applications
Body:

I know that this question has been asked numerous times before, but none of the answers have helped all users equally. You might be getting an exception in your Laravel 5 application with a message like this:

<pre><code>BindingResolutionException in Container.php line 785: Target [App\Contracts\CustomModelInterface] is not instantiable.</code></pre>

You've tried several things without any success, such as registering your providers, using the `clear-compiled` command, and replacing interfaces on repositories in your MyService class. You wonder if it should be handled by the IoC container or not. You have a clear structure of directories (app) with contracts, models, repositories, providers, and services. Below are some steps to help you understand how to fix this issue.

First, let's take a look at each file involved in your example:

App\Contracts\CustomModelInterface.php - This is the interface for the CustomModel class. It defines the methods that any implementation of it should have access to.

App\Repositories\CustomModelRepository.php - An implementation of the CustomModelInterface, providing a get() method which returns 'result'. It extends App\Models\CustomModel and implements App\Contracts\CustomModelInterface.

App\Services\MyService.php - This class is used to encapsulate all business logic between controllers and repositories. You've implemented it as a service, by registering the MyService class, which depends on an instance of CustomModelInterface (CustomModel is provided by Eloquent).

App\Providers\AppRepositoryProvider.php - This is a Service Provider responsible for binding your models and interfaces. It uses Laravel's IoC container to map every model class to its related interface implementation automatically.

App\Http\Controllers\SuperController.php - The controller where you call the methods of MyService class and return results from it.

composer.json - This file defines how your application should load the classes and files. It ensures that all the necessary namespaces and auto-loading are correctly set up for Laravel and your custom packages.

Now let's examine what could be causing this issue:

1. Ensure that you have installed and configured your project dependencies properly, by running `composer install` or `composer update`. If there are any outdated or missing dependencies, these can cause issues with the IoC container and result in exceptions like the one mentioned above.

2. Check if your service provider has been correctly registered in your boot() method:

   <pre><code>&lt;?php namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppRepositoryProvider extends ServiceProvider {
    public function boot() {}

    public function register() {
        $models = array(
            'CustomModel'
        );

        foreach ($models as $idx => $model) {
            $this-&gt;app-&gt;bind("App\Contracts\{$model}Interface", "App\Repositories\{$model}Repository");
        }
    }
}</code></pre>

3. If your bindings are correct and the error persists, double-check that all your classes are properly defined in the correct namespaces:

   <pre><code>&lt;?php namespace App\Contracts; &lt;br />
namespace App\Repositories; &lt;br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;namespace App\Providers; &lt;br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;namespace App\\Contracts\AppCompany; &lt;/pre>

4. Finally, check your controller code:

   <pre><code>&lt;?php namespace App\Http\Controllers;

use App\Services\MyService;

class SuperController extends Controller {
    private $My;

    public function __construct(MyService $myService) {
        $this-&gt;My = $myService;
    }

    public function getDetails() {
        return $this-&gt;My-&gt;getAll();
    }
}</code></pre>

If all else fails, you might need to rethink your application's architecture. Laravel provides many tools and features that can help you achieve good separation of concerns, such as dependency injection, which would avoid the problematic nature of creating instances of interfaces directly. The most important takeaway from this is that using IoC containers with interfaces and implementing proper binding between them helps maintain a cleaner and more scalable Laravel application.
