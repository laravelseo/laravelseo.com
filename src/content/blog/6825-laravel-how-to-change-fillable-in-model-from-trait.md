---
title: "LARAVEL how to change $fillable in Model from trait?"
description: "LARAVEL: How to Manage $fillable in Models When Using Traits As a senior developer working within the Laravel ecosystem, managing model properties and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working within the Laravel ecosystem, managing model properties and configuration across inheritance structures is a common challenge. When we leverage Traits for code reuse—which is a fantastic pattern for DRY (Don't Repeat Yourself) principles—we often run into questions about how to handle inherited properties like `$fillable`.

This post dives into your specific scenario: attempting to define a base set of fillable attributes in a Trait and then extending that set in the consuming Model. We will explore why direct modification within a trait is tricky, and, more importantly, show you the robust, idiomatic Laravel way to achieve flexible attribute management.

## The Challenge: Traits and Property Inheritance

You are attempting to establish a default set of fillable fields in a trait, and then allow the implementing model to add extra fields on top of that default.

Here is the setup you described:

```php
// In your Trait file (e.g., app/Traits/SeoTrait.php)
trait seoTrait {
    protected $fillable = [
        'name', 'title', 'description'
    ];
}

// In your Model file (e.g., app/Models/Post.php)
use App\Traits\SeoTrait;

class Post extends Model
{
    use SeoTrait;

    // You want to add 'seoMeta' here:
    protected $fillable = [
        'name', 'title', 'description', 'seoMeta' // Attempting to extend the trait's array
    ];
}
```

The core issue here is related to how PHP handles property visibility and inheritance versus how Eloquent expects model configuration to be structured. While traits allow sharing methods and properties, direct overriding of protected class properties defined in a trait can lead to unexpected behavior or runtime errors if not handled carefully within the context of Eloquent's expectations.

## The Solution: Extending Configuration, Not Overriding Properties

The most stable and recommended approach in Laravel is to use the trait to define *defaults* that are then explicitly merged or extended by the consuming class. You should avoid trying to redefine the entire `$fillable` array inside every model if you want true reusability.

Instead of relying on direct property inheritance for configuration, we can use static methods within the trait or leverage Model Scopes, which align better with Laravel's design philosophy regarding Eloquent relationships and data handling (as discussed in official documentation like [laravelcompany.com](https://laravelcompany.com)).

### Best Practice 1: Using a Static Helper Method in the Trait

A cleaner approach is to make the trait responsible for providing default configuration, allowing the model to assemble the final array.

**Step 1: Modify the Trait to Provide Defaults**

The trait should provide a method that returns the base set of fillable attributes.

```php
// app/Traits/SeoTrait.php
namespace App\Traits;

trait SeoTrait
{
    /**
     * Get the default fillable attributes for SEO related models.
     *
     * @return array
     */
    public static function getSeoFillables(): array
    {
        return [
            'name', 'title', 'description'
        ];
    }
}
```

**Step 2: Implement the Model to Merge the Attributes**

In your model, you retrieve the trait's base attributes and use PHP's array merging capabilities to add your custom fields.

```php
// app/Models/Post.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\SeoTrait;

class Post extends Model
{
    use SeoTrait;

    protected $fillable = []; // Start with an empty array

    protected static function boot()
    {
        parent::boot();
        // Load the base fillables from the trait
        $baseFillables = self::getSeoFillables();
        self::$fillable = array_merge($baseFillables, ['seoMeta']);
    }
}
```

### Best Practice 2: Using Model Observers or Mutators (The Eloquent Way)

For complex scenarios, defining `$fillable` directly in the model is fine, but if you need dynamic control over what data can be mass-assigned based on the context of the trait, consider using **Model Observers** or **Mutators**. This keeps the core model clean and delegates the responsibility for attribute definition to external logic.

When defining `$fillable` directly in a model, remember that Laravel relies heavily on this array for security when performing mass assignment. Ensure that any modification is intentional and controlled by your application logic rather than relying solely on trait inheritance for configuration setup.

## Conclusion

While it is technically possible to attempt to redefine `$fillable` within a trait, the most robust pattern in object-oriented PHP and Laravel development is to use traits for **behavior** (methods) and **default values**, not for direct property inheritance of critical data structures like mass assignment rules. By using static methods within your trait to provide defaults and merging them in the consuming model, you achieve code reusability without compromising the integrity or predictability of your Eloquent models. This approach ensures that your application remains scalable and easy to maintain, adhering to best practices seen across the Laravel framework.
