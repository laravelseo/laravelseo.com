---
title: "Argument 1 passed to Illuminate\\\\Database\\\\Eloquent\\\\Model::__construct() must be of the type array, object given"
description: "Mastering Data Flow: Resolving Eloquent Type Errors in Laravel Repositories As senior developers working with the Laravel ecosystem, we often structure our..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers working with the Laravel ecosystem, we often structure our applications using patterns like the Repository pattern to separate business logic from data access. This separation enhances maintainability and testability. However, when dealing with Eloquent models, subtle mismatches in data types—especially when passing parameters between controllers, contracts, and repositories—can lead to frustrating runtime errors.

Today, we will dissect a very common error: `Argument 1 passed to Illuminate\Database\Eloquent\Model::__construct() must be of the type array, object given`. We will walk through a practical scenario involving adding items to a wishlist using a repository structure, diagnose the root cause, and implement the robust solution.

## The Scenario: Wishlist Implementation with Repository Pattern

We are implementing a feature where a user adds a product ID to their wishlist. This involves a Controller handling the request, a Contract defining the required operations, and a Repository handling the actual database interaction.

The reported error occurs when attempting to instantiate an Eloquent Model inside the repository method:

```
Argument 1 passed to Illuminate\Database\Eloquent\Model::__construct() must be of the type array, object given, called in .... WishlistRepository.php
```

This error signals a fundamental mismatch between what the Eloquent model expects during initialization and what the repository is providing.

## Diagnosing the Type Mismatch

Let's examine the provided code structure to pinpoint where the issue lies:

1.  **`WishlistContract`:** Defines `addToWishlist(array $params)`. It correctly specifies that it expects an array of parameters.
2.  **`WishlistController`:** Collects input and prepares the data as a standard PHP array: `$data = ['product_id' => $productID, 'user_id' => $userID];`. This is correct.
3.  **`WishlistRepository::addToWishlist(array $params)`:** This method receives the `$params` array. The error arises in how this array is used to construct a new model:

    ```php
    public function addToWishlist(array $params)
    {
        try {
            $collection = collect($params); // $params is an array, resulting in a Collection object.
            $wishlist = new Wishlist($collection); // <-- The error points here.
            $wishlist->save();
            return $wishlist;
        } catch (QueryException $exception) {
            throw new InvalidArgumentException($exception->getMessage());
        }
    }
    ```

The core issue is that while the contract mandates an `array`, and the controller provides one, the repository attempts to pass a Laravel Collection object (`$collection`) as the first argument during the model's constructor call. Eloquent models, by default, expect either no arguments or specific attributes when instantiated, not a collection object directly in this manner.

## The Solution: Using Mass Assignment for Model Creation

The correct approach within the Repository pattern is to use the data provided to *fill* an existing model instance or use mass assignment methods (`create` or `fill`) rather than passing raw collections into the constructor. This keeps the repository focused on CRUD operations, adhering to SOLID principles and ensuring clean data flow, which aligns perfectly with Laravel's philosophy on Eloquent relationships and data handling found on the [Laravel Company website](https://laravelcompany.com).

We should modify the `addToWishlist` method in `WishlistRepository` to utilize the `$params` array for creating a new record instead of trying to initialize the model with it directly.

### Corrected Repository Implementation

Instead of instantiating the model with a collection, we should use the data to create an instance and then save it. If we assume the `Wishlist` model is set up correctly with mass assignment, this simplifies the process significantly:

```php
namespace App\Repositories;

use App\Models\Wishlist; // Ensure you are using the correct Model namespace
use App\Contracts\WishlistContract;
use Illuminate\Database\QueryException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Doctrine\Instantiator\Exception\InvalidArgumentException;

class WishlistRepository extends BaseRepository implements WishlistContract
{
    // ... existing methods ...

    public function addToWishlist(array $params)
    {
        try {
            // 1. Validate and prepare data (ensure required fields are present)
            $data = $params; // Use the received array directly

            // 2. Create a new model instance using mass assignment
            $wishlist = Wishlist::create($data);

            // 3. Save or handle relationships if necessary
            $wishlist->save();
            
            return $wishlist;
        } catch (QueryException $exception) {
            // Re-throw a more specific application exception
            throw new InvalidArgumentException("Failed to add item to wishlist: " . $exception->getMessage());
        }
    }

    // ... other methods ...
}
```

### Why This Fix Works

By replacing `new Wishlist($collection)` with `Wishlist::create($data)`, we leverage Eloquent’s built-in mechanisms for inserting data. The `$data` array is correctly interpreted by the static `create()` method, which handles mapping the keys to the database columns, satisfying the expectations of the Eloquent model constructor without causing a type error related to passing an object where an array was expected.

## Conclusion

The experience highlights that while interfaces define contracts beautifully, the implementation within the repository layer must strictly adhere to the expectations of the underlying ORM—in this case, Eloquent. By focusing on data transfer and using appropriate Eloquent methods like `create()` or `fill()`, we ensure our Repository pattern remains clean, robust, and free from type-related errors. Always prioritize how your data flows between layers; treating input parameters as plain arrays when dealing with model creation is a foundational practice for building scalable applications on Laravel.
