---
title: "Using same model for multiple resource in Laravel Filament"
description: "Achieving Dynamic Navigation in Filament: Using Multiple Resources for Different States As senior developers building complex admin panels with Laravel and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As senior developers building complex admin panels with Laravel and Filament, we often encounter scenarios where we need to manage related data through distinct views or states. The desire to replicate features seen in tools like Laravel Nova—where a single Eloquent model can power multiple, state-specific navigation links—is very common.

This post dives into the specific challenge you faced: how to use the same underlying `Order` model to generate dynamic, filtered menu items (like "Pending Orders" and "Completed Orders") in the Filament sidebar rather than creating duplicate root resources. We will dissect why your initial approach resulted in duplicated menus and explore the best practices for structuring data and navigation within Filament.

## The Challenge: Model Reuse vs. Navigation Structure

You correctly identified the need to separate concerns by creating `PendingOrdersResource` and `CompletedOrdersResource`, both referencing the same `Order` model. You also correctly used the `getEloquentQuery()` method within each resource to filter the data relevant to that specific view.

However, when Filament generates the primary navigation menu, it primarily looks at the registered resources. Since you registered two distinct resources (`PendingOrdersResource` and `CompletedOrdersResource`), Filament naturally creates two separate top-level entries in the sidebar: "Pending Orders" and "Completed Orders." The issue arises because these are treated as completely separate entities rather than filtered views of a single parent, leading to potential confusion or redundant routing if not handled carefully.

The goal is to achieve state-based grouping under a unified parent menu, which requires moving beyond just defining standalone resources and leveraging Filament’s layout capabilities.

## The Solution: Grouping Resources for Unified Navigation

To achieve the desired "Pending Orders / Completed Orders" structure, we need to shift the focus from creating two separate root resources to creating one central resource that manages the state logic, and then structuring the navigation around it. While direct, instance-level filtering across separate resources is challenging for top-level menu generation, we can use parent/child relationships or custom layouts to achieve a similar effect.

A more robust approach involves using a single base resource and defining dynamic grouping within that context, often using custom actions or dashboard components instead of relying solely on resource registration for primary navigation.

### Best Practice: Leveraging Relationship Grouping

If the filtering is purely state-based (Pending vs. Completed), the most idiomatic Laravel/Filament way to manage this data is through relationships and conditional display rather than creating parallel resources, unless those states require entirely different forms or permissions.

1.  **Single Resource Focus:** Keep your primary resource as `OrderResource`.
2.  **Dynamic Filtering via Scope:** Use Eloquent Local Scopes (which are excellent for filtering) instead of complex `getEloquentQuery` modifications within every resource. This keeps the data logic centralized, which is a core tenet of good Laravel development, aligning with principles found in the wider Laravel ecosystem [https://laravelcompany.com](https://laravelcompany.com).

**Example using Local Scopes:**

In your `Order` model:
```php
// app/Models/Order.php
public function scopePending($query)
{
    return $query->where('status', 'pending');
}

public function scopeCompleted($query)
{
    return $query->where('status', 'completed');
}
```

Now, within your Filament Resource, you can easily call these scopes when fetching data. While this doesn't automatically generate the sidebar links directly from the scope calls, it ensures that *any* query built on this model respects the defined states consistently.

### Implementing Custom Sidebar Navigation

If you absolutely require those two specific menu items in the main navigation bar, you must define them explicitly within your Filament panel configuration rather than relying solely on resource registration. This gives you full control over the UI structure:

```php
// In your Panel Provider or custom layout file (e.g., App\Providers\Filament\AdminPanelProvider.php)

protected function getNavigationItems(): array
{
    return [
        // Define a custom item for Pending Orders
        \Filament\Navigation\NavigationItem::make('Pending Orders')
            ->url('/admin/orders?status=pending') // Custom route filtering
            ->icon('heroicon-o-clock')
            ->isActive(fn () => auth()->user()->can('view_pending_orders')),

        // Define a custom item for Completed Orders
        \Filament\Navigation\NavigationItem::make('Completed Orders')
            ->url('/admin/orders?status=completed') // Custom route filtering
            ->icon('heroicon-o-check-circle')
            ->isActive(fn () => auth()->user()->can('view_completed_orders')),
    ];
}
```

By defining these items manually, you bypass the automatic resource registration system and inject exactly the navigation structure you need. This approach gives you explicit control over how your data states are presented to the end-user, ensuring that the sidebar perfectly reflects the state-based filtering you intended, regardless of whether you use separate resources or a unified one.

## Conclusion

Replicating sophisticated UI patterns like those seen in Nova requires understanding the separation between data modeling (Eloquent), resource definition (Filament Resources), and navigation architecture (Filament Layouts). While creating separate resources works for distinct functionality, achieving dynamic, state-based menu filtering demands explicit control over the navigation structure. By combining clean Eloquent scoping with custom navigation item definitions within the Filament configuration, you can build highly customized and intuitive administrative interfaces that scale well as your application grows.
