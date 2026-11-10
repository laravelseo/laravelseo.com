---
title: "Laravel 5 - Change model file location"
description: "Laravel 5: Configuring Eloquent Model Locations for Cleaner Architecture Migrating between major versions of a framework often brings architectural shifts...."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

Migrating between major versions of a framework often brings architectural shifts. One common change developers encounter when moving to or restructuring projects is the location and organization of core components, such as Eloquent Models.

I recently transitioned from Laravel 4 to Laravel 5, and one immediate observation was that the convention shifted: all model files are now expected to reside under the `app/Models` directory instead of directly under `app`. This move aligns better with modern object-oriented design principles, promoting separation of concerns and clearer namespace organization.

The central question is: How do we configure Laravel 5 to recognize models placed in `app/Models` while still allowing us to use standard Eloquent syntax like `FooModel::with(...)`?

## Understanding Model Discovery in Laravel

In older versions, model discovery was often implicitly handled by the framework's autoloader and service providers. In modern Laravel environments, this process relies heavily on PSR-4 autoloading defined in your `composer.json` file. When you place classes within a specific directory structure, you need to ensure that Composer knows how to map those directories to their corresponding namespaces.

For Eloquent models specifically, the framework looks for classes extending `Illuminate\Database\Eloquent\Model`. The magic happens when the autoloader can successfully resolve the class path.

## Configuring the Structure for `app/Models`

To successfully use the `app/Models` directory structure, we need to ensure our PSR-4 autoloading is correctly set up to handle this new namespace convention. While Laravel 5 provided a solid foundation, proper configuration ensures seamless integration.

The most crucial step involves updating your `composer.json` file. You must define the `psr-4` mapping to point Eloquent models to their new location.

Here is how you would typically adjust your `composer.json`:

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "app/",
            "App\\Models\\": "app/Models/"  // <-- This line registers the new namespace
        }
    },
    "require": {
        "php": ">=5.6"
    }
}
```

By adding `"App\\Models\\": "app/Models/"`, we explicitly inform Composer that any class starting with `App\Models\` should be looked for within the `app/Models` directory. This configuration allows Laravel's autoloader to correctly resolve the location of your models, making them instantly available to Eloquent.

## Practical Implementation Example

Let's demonstrate this setup with a simple model. If we follow the convention above, our file structure would look like this:

```
app/
├── Models/
│   └── Post.php       <-- Our new model location
├── Http/
└── ...
```

And the content of `app/Models/Post.php` would look standard:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    // Model properties go here
}
```

Because we configured Composer to map the `App\Models\` namespace to the physical `app/Models/` directory, Laravel's reflection system and Eloquent can now automatically discover and instantiate this model. This ensures that when you call methods on it, such as using relationships like `Post::with('comments')`, the functionality remains identical and intuitive across your application.

## Conclusion

Moving to a structured approach like placing models in `app/Models` is a significant step toward building more maintainable Laravel applications. The key to making this transition work smoothly lies not just in file placement, but in correctly configuring Composer's PSR-4 autoloading rules. By explicitly defining the `App\Models\` namespace mapping, you ensure that Eloquent and the rest of the framework can seamlessly discover your models, preserving the familiar and powerful syntax provided by Laravel. For deeper insights into how these autoloading mechanisms function within the larger framework context, always refer to the official documentation at [https://laravelcompany.com](https://laravelcompany.com).
