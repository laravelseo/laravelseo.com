---
title: "How to make deep nest resources in Laravel filament"
description: "How to Make Deeply Nested Resources in Laravel Filament As developers building complex applications with Laravel and Filament, managing hierarchical data..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers building complex applications with Laravel and Filament, managing hierarchical data structures efficiently is crucial. When you have relationships like `Material Selection > Quotation > Addendum`, representing this cleanly within a panel interface requires more than just basic Eloquent relations; it demands thoughtful UI/UX design. The challenge you’ve identified—how to make each level of the hierarchy feel like a navigable, self-contained Filament resource—is very common.

While Filament excels at managing flat or one-to-many relationships via its Relation Manager, deeply nested structures often require a hybrid approach that leverages Eloquent relationships for data retrieval and custom Livewire components for navigation.

## Understanding the Limitation of Standard Relations

You are correct in observing that Filament's built-in Relation Manager is designed primarily for displaying simple one-to-many relationships directly within the parent resource view (e.g., listing all Quotations from a Material Selection). It doesn't inherently provide the mechanism to render an entire nested resource as an interactive link or section on the parent page easily, especially when dealing with multiple levels of nesting like yours.

Trying to force deep nesting solely through standard relations often results in overly complex query logic or requires digging into raw Livewire components, which defeats the purpose of using Filament's abstraction layer.

## The Recommended Solution: Custom Navigation via Actions and Components

The most elegant solution in a Filament context is to treat the parent resource as the container and use custom actions or components to manage the navigation to the child resources. This keeps your data model clean while providing the desired user experience.

Here is a practical strategy for implementing nested resource navigation:

### 1. Establish Clear Eloquent Relationships

First, ensure your database structure accurately reflects the hierarchy using standard Laravel Eloquent relationships. This foundation is critical, as Filament builds its interface directly on these relations.

```php
// In MaterialSelection Model
public function quotations()
{
    return $this->hasMany(Quotation::class);
}

// In Quotation Model
public function addendums()
{
    return $this->hasMany(Addendum::class);
}
```

### 2. Implementing Navigation within the Resource View

Instead of relying solely on the Relation Manager, you can inject custom components or actions into your Filament Resource pages to provide explicit navigation pathways.

For the `MaterialSelection` resource page, you can iterate over its related `Quotations` and display them as clickable links that navigate directly to the respective `Quotation` resource view. This is often achieved by overriding the `getActions()` or using custom table columns within the Resource page.

**Conceptual Example (Focusing on the Parent View):**

In your `MaterialSelectionResource`, you can use a custom table column or an action to list related items.

```php
use Filament\Tables;
use Filament\Tables\Table;

// Inside the form or table definition for MaterialSelection
->columns([
    Tables\Column::make('name'),
    Tables\Column::make('quotations')
        ->label('Quotations')
        ->getStateUsing(function ($record) {
            // Return a link that triggers navigation to the quotations listing page
            return \Filament\Navigation\Page::make('quotations')
                ->route('filament.resources.quotations.manage')
                ->url();
        })
])
```

### 3. Creating Nested Resource Views (The Deep Dive)

Once you navigate to a specific `Quotation` record, the process repeats. Within the `QuotationResource`, you would implement logic similar to the above to list its related `Addendums`. This pattern ensures that each level of the hierarchy is managed by its own dedicated Filament resource, maintaining separation of concerns.

This approach moves away from trying to force a single "nested resource" object and instead uses Filament's navigation capabilities to stitch together multiple distinct, manageable resources into a cohesive user flow. It aligns perfectly with the principles of modular design often discussed in modern Laravel architecture, similar to how components are structured within the broader Laravel ecosystem, which is why understanding the core concepts behind tools like those at [laravelcompany.com](https://laravelcompany.com) is so important for building scalable applications.

## Conclusion

While a single "nested resource" object might seem appealing, achieving deep, navigable hierarchies in Filament is best done by leveraging its strengths: robust Eloquent relationships combined with custom Livewire interactions within the Resource views. By using explicit navigation links based on your established relationships, you gain the necessary control to create a highly intuitive and powerful dashboard experience without resorting to overly complex custom page development.
