---
title: "Laravel 5.6 - Model events: Can you combine static::creating and static::updating on one?"
description: "Laravel Model Events: Can You Combine creating and updating? A Deep Dive into Eloquent Hooks As developers working with Eloquent in Laravel, we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers working with Eloquent in Laravel, we frequently dive into the world of Model Events. These hooks are incredibly powerful tools, allowing you to inject custom logic at critical points during the lifecycle of a model—whether it's being created, updated, or deleted.

A common question that surfaces when building complex applications is: Can we simplify this by combining related events? Specifically, can we merge `creating` and `updating` into a single event handler?

Let's unpack this question from a developer’s perspective, exploring the mechanics, the limitations, and the best architectural patterns for handling these crucial moments.

## The Separation of Concerns: Why Separate Events Matter

In Laravel, Model Events like `creating`, `created`, `updating`, and `updated` exist to provide granular control over the state changes. While it might seem convenient to combine them, separating these events offers distinct advantages in terms of clarity, debugging, and maintainability.

The primary difference lies in *what* action is being performed:

1.  **`creating`**: Fires only when a new model instance is about to be persisted (i.e., saved for the first time).
2.  **`updating`**: Fires only when an existing model instance is about to be updated.

Attempting to combine them into one event, say `saving`, would force your logic to constantly inspect the context of the event (checking if it's a creation or an update), which often leads to complex, brittle conditional logic inside your hook.

## The Dilemma: Combining vs. Reusing Logic

While you *could* technically merge them by listening to the parent `saving` event and then inspecting the model state inside that handler, this approach is generally considered an anti-pattern for simple record manipulation. It violates the principle of least surprise.

**The better architectural choice is not merging the events, but reusing the actual logic.**

If you have common code that needs to execute *both* during creation and updating (for example, setting timestamps or applying soft deletes), it is far cleaner and more explicit to define that logic once and reuse it within both event handlers. This keeps your code highly readable and aligns with how Laravel structures its hooks.

### Reusing Logic via Abstraction

Instead of duplicating code in both `creating` and `updating`, we should abstract the shared behavior into a reusable function or, more robustly, use Eloquent Observers.

Consider the example you provided:

```php
protected static function boot()
{
    parent::boot();

    static::creating(function ($questionnaire) {
        // Logic specific to creation
    });

    static::updating(function ($questionnaire) {
        // Logic specific to updating
    });
}
```

If the logic inside both closures is identical—for instance, setting a `status` field or logging an action—we should extract that logic.

## Best Practice: Using Observers for Clean Separation

For handling complex model events, especially when you need to manage relationships or ensure data integrity across many models, **Eloquent Observers** are the superior pattern over placing all event logic directly in the model's `boot()` method.

Observers allow you to separate the business logic (what happens) from the model definition itself. This aligns perfectly with Laravel’s philosophy of keeping components focused and loosely coupled. As discussed in documentation regarding Eloquent relationships and data lifecycle, using Observers is a highly recommended way to manage these side effects effectively. For robust application development, understanding these patterns is key when building scalable solutions on platforms like the one provided by [laravelcompany.com](https://laravelcompany.com).

### Example of Reusable Logic (Conceptual)

If you needed to ensure a field was always set before saving, you could define a helper method or use a trait:

```php
// In your Model
public function prepareForSave(array $attributes)
{
    // This logic runs for both creating and updating scenarios.
    $attributes['updated_at'] = now();
    if (!isset($attributes['status'])) {
        $attributes['status'] = 'pending'; // Default status on creation
    }
}

protected static function boot()
{
    parent::boot();

    static::creating(function ($model) {
        $model->prepareForSave($model->attributes);
    });

    static::updating(function ($model) {
        $model->prepareForSave($model->attributes);
    });
}
```

By abstracting the shared work into a method like `prepareForSave()`, you achieve code reuse without sacrificing the separation offered by the distinct `creating` and `updating` hooks.

## Conclusion

To directly answer your question: **No, it is generally not recommended to combine `creating` and `updating` into a single event.** The distinction between creation and updating is important for precise control over application state.

Instead of merging the events, adopt a pattern of code reuse. Extract identical logic into helper methods or utilize dedicated classes like Observers. This approach results in models that are cleaner, easier to test, and more maintainable, ensuring your Laravel application remains scalable and robust.
