---
title: "Laravel transformer vs resource"
description: "Laravel Eloquent Resources vs. API Transformers: Which One Should You Use? As a senior developer working within the Laravel ecosystem, it’s common to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working within the Laravel ecosystem, it’s common to encounter confusion when dealing with data transformation for API responses. Both Eloquent Resources and API Transformers appear to serve the same goal—shaping your database models into clean JSON—which often leads to debate about which tool to choose.

The short answer is that while they share a common objective, they are designed for different levels of complexity and architectural separation. Understanding this distinction is key to writing maintainable, scalable Laravel applications.

Let's dive deep into the differences, use cases, and best practices for when to employ each pattern.

---

## Eloquent Resources: The Convenient Shortcut

Eloquent Resources are a built-in feature within Laravel that provide a convenient way to transform an Eloquent model into a JSON representation. They are essentially syntactic sugar designed to simplify the process of serializing a model's attributes.

### How Resources Work
Resources are tightly coupled with the model they represent. When you use a Resource, it’s straightforward: define the structure, and Laravel handles the serialization based on the model's data.

**When to Use Resources:**
Use Eloquent Resources when your transformation logic is relatively simple, primarily involving mapping attributes directly from the model to the desired output structure. They are excellent for standard CRUD operations where you need a quick way to format existing data without introducing complex, separate classes.

**Example (Conceptual):**

```php
// app/Http/Resources/UserResource.php
class UserResource extends Resource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            // Simple attribute mapping is the strength here
        ];
    }
}

// Controller Usage:
// return new UserResource($user);
```

Resources are great for quick data formatting, fitting neatly into standard RESTful endpoints where you are returning the full representation of a single model.

---

## API Transformers: The Power of Decoupling and Logic

API Transformers, on the other hand, represent a more decoupled, dedicated approach to data shaping. They are typically implemented as separate classes that focus solely on transforming data—often involving complex business logic, nested relationships, custom calculations, or conditional field inclusion based on external criteria.

### How Transformers Work
Transformers operate independently of the Eloquent model itself. This separation is crucial because it allows you to handle highly intricate transformations without cluttering your Eloquent models or relying on Laravel's built-in serialization mechanisms for complex needs.

**When to Use Transformers:**
Use API Transformers when you need sophisticated data manipulation. This includes:
1. **Nesting Relationships:** Transforming a user model into a response that includes deeply nested details from related models (e.g., embedding addresses).
2. **Custom Calculations:** Performing calculations or formatting data before it is sent over the wire (e.g., calculating full names, currency conversions).
3. **Filtering/Exclusion:** Conditionally including or excluding fields based on the request context.

**Example (Conceptual):**

```php
// app/Transformers/UserTransformer.php
class UserTransformer extends TransformerAbstract
{
    public function transform(User $user)
    {
        return new CursorResource(
            $user->id,
            $user->name . ' ' . $user->last_name, // Custom calculation
            $user->email
        );
    }
}
```

---

## The Developer's Decision Matrix

The choice between Resources and Transformers boils down to **complexity** and **separation of concerns**.

| Feature | Eloquent Resources | API Transformers |
| :--- | :--- | :--- |
| **Coupling** | Tightly coupled with the Eloquent Model. | Decoupled from the Eloquent Model. |
| **Complexity** | Simple attribute mapping; good for basic needs. | Complex logic, nesting, custom calculations. |
| **Use Case** | Standard CRUD responses, simple data formatting. | Complex API structures, nested relationships, business logic application. |
| **Maintainability** | Can become unwieldy if logic is complex. | Highly maintainable; transformation logic is isolated. |

If you are simply retrieving a model and formatting its basic fields for a standard resource endpoint, Eloquent Resources offer a quick win. However, as your application grows and your API requirements demand sophisticated nesting, custom calculations, or strict separation between data retrieval (Eloquent) and data presentation (API layer), **API Transformers** provide the necessary architectural flexibility.

For truly advanced Laravel development, focusing on decoupled patterns like using dedicated Transformer classes ensures that your models remain clean domain objects, adhering to SOLID principles. This approach aligns perfectly with best practices emphasized by the wider Laravel community, including the principles found at [https://laravelcompany.com](https://laravelcompany.com).

## Conclusion

There is no single "better" tool; there is only the *right* tool for the job. Start with Eloquent Resources for simple data formatting. As your API requirements evolve and you need to introduce complex business logic or deeply nested relationships, migrate to dedicated API Transformers. This decision will ensure that your Laravel application remains clean, scalable, and easy to maintain as it grows.
