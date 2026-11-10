---
title: "Laravel 5: cascade soft delete"
description: "Mastering Relational Integrity: Implementing Cascade Soft Deletes in Laravel As developers working with relational databases in frameworks like Laravel,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers working with relational databases in frameworks like Laravel, managing data integrity across related models is paramount. When you introduce soft deletion—a pattern where records are marked as deleted rather than physically removed—you face a crucial architectural decision: how do you ensure that dependent records are handled consistently?

This post dives into a common scenario: handling cascading soft deletes between a parent model (like `Offer`) and its child models (like `Service`). We will explore the best practices, moving from simple database constraints to sophisticated Eloquent event handling to achieve seamless data management.

## The Challenge: Cascading Soft Deletes

You have established an `offers` table and an `services` table, linked by a foreign key. Both tables utilize Laravel's built-in `softDeletes()` trait. Your goal is to ensure that when an `Offer` record is soft-deleted, all associated `Service` records are also marked as deleted, maintaining complete data consistency without manual intervention.

The setup you provided demonstrates the correct foundational steps:

1.  **Migrations:** Both tables correctly include the `softDeletes()` timestamp columns.
2.  **Relationships:** The `Offer` model has a `hasMany` relationship to `Service`, and vice versa, establishing the necessary Eloquent connections.
3.  **Deletion Logic:** You are currently handling the soft delete on the parent (`Offer`) manually in the controller/service layer.

The missing piece is the *cascade*—the automatic action that triggers when the parent record changes state.

## Strategy 1: Database-Level Cascading (The Foundation)

The most direct way to handle cascading behavior is at the database level using Foreign Key constraints. While Laravel excels at ORM operations, ensuring data integrity first happens in the database layer.

You can modify your `services` migration to include a cascade action on the foreign key:

```php
// Migration for services table (Example)
Schema::table('services', function($table) {
    $table->foreign('offer_id')
          ->references('id')
          ->on('offers')
          ->onDelete('cascade'); // <-- This is the critical line
});
```

**A Note on Soft Deletes:** When using `onDelete('cascade')` with soft deletes, you must be careful. In a standard database setup, cascading deletion physically removes rows. With Laravel's `softDeletes`, we want to ensure that when an offer is deleted, the services are *also* soft-deleted. While some advanced database setups can handle this via triggers, relying solely on application logic (Eloquent) often provides better abstraction and portability across different database systems.

## Strategy 2: Eloquent Event Handling (The Laravel Way)

For robust, application-level control—which is highly recommended when dealing with complex business rules like soft deletes—we leverage Eloquent Events and Observers. This approach keeps the logic tightly coupled within your models, which aligns perfectly with the principles of clean code advocated by the Laravel community.

We will use the `deleting` or `deleted` event on the `Offer` model to trigger the deletion logic in the related `Service` models.

### Step 1: Implement the Observer

Create an Observer for the `Offer` model. This observer will listen for the moment an offer is marked as deleted and queue the necessary actions for its services.

```php
// app/Observers/OfferObserver.php

class OfferObserver
{
    public function deleting(Offer $offer)
    {
        // When the offer is about to be soft-deleted, find all related services.
        $services = $offer->services;

        foreach ($services as $service) {
            // Perform the soft delete on the service record
            $service->delete(); 
        }
    }
}
```

### Step 2: Register the Observer

Ensure you register this observer in your `Offer` model's boot method:

```php
// app/Offer.php
use Illuminate\Support\Facades\Route;
use App\Observers\OfferObserver;

class Offer extends Model
{
    use SoftDeletes;

    public function deleting(array $models = [])
    {
        foreach ($models as $offer) {
            // Logic defined above goes here, or you can call a dedicated service.
            $this->handleServiceDeletion($offer); 
        }
    }
    
    // ... other methods
}
```

### Step 3: The Execution Flow

When you execute `$offer->delete()` in your controller, the `deleting` event fires, iterates through the related services, and calls `$service->delete()`, successfully cascading the soft delete operation down to the child records. This pattern demonstrates how powerful Eloquent relationships are when combined with lifecycle events—a core concept in efficient data management within Laravel.

## Conclusion

Managing relational data integrity, especially with soft deletes, requires a layered approach. While database constraints offer a safety net, implementing custom logic via Eloquent Observers provides the necessary control and application-specific business rules. By mastering the interplay between migrations, relationships, and events, you ensure that your Laravel applications maintain perfectly synchronized and reliable data structures. For further deep dives into these powerful features, always refer to the official documentation on the [Laravel Company website](https://laravelcompany.com).
