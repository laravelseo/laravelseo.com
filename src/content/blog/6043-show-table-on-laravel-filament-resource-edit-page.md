---
title: "Show table on laravel filament resource edit page"
description: "Show Table on Laravel Filament Resource Edit Page: Implementing Subscription History As a senior developer working with Laravel and Filament, you are..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with Laravel and Filament, you are constantly looking for ways to leverage the framework's power to create custom, highly interactive user experiences. The request—to display an app history similar to Shopify’s interface directly within the Filament resource edit page—is a perfect example of needing to bridge Eloquent relationships with Filament's table rendering capabilities.

While Filament excels at managing CRUD operations, displaying complex historical data often requires careful structuring of your Eloquent models and strategic use of relationship methods within the Resource classes.

This post will walk you through the architectural steps required to achieve this goal: showing a history of subscriptions in a tabular format when editing a specific subscription record in Filament.

## The Architectural Foundation: Eloquent Relationships

Before diving into the Filament implementation, we must establish the correct data structure on the backend. To show a history, your `Subscription` model needs a one-to-many relationship with a separate `SubscriptionHistory` model. This separation ensures that historical data is managed independently and can be queried efficiently.

### 1. Model Setup

Assume you have two models: `Subscription` and `SubscriptionHistory`.

**Subscription Model:**
```php
// app/Models/Subscription.php
class Subscription extends Model
{
    public function history()
    {
        return $this->hasMany(SubscriptionHistory::class);
    }
}
```

**SubscriptionHistory Model:**
```php
// app/Models/SubscriptionHistory.php
class SubscriptionHistory extends Model
{
    protected $fillable = ['subscription_id', 'event_type', 'details'];
}
```

By defining this relationship, you establish the bridge necessary to pull historical data when viewing a specific subscription record. This adherence to proper Eloquent relationships is fundamental to building robust applications, much like the principles demonstrated by the architecture discussed on [laravelcompany.com](https://laravelcompany.com).

## Implementing the History Table in Filament

The trick lies in how you configure the `form()` method or the table definition within your Filament Resource. Since you want this history visible *on* the edit page, you will typically use either a custom `DetailPage` setup or modify the main `EditRecord` form to include a relationship field that renders a nested table.

For displaying related data in a tabular format on an Edit screen, we will focus on using Filament's built-in relationship features.

### 2. Modifying the Resource for Display

If you are using the standard `EditRecord` view, the most elegant way to show this is by using a **`relationship()`** field within your form schema. This allows Filament to automatically handle fetching and displaying the related data in a nicely formatted table structure.

In your `SubscriptionResource.php`:

```php
// app/Filament/Resources/SubscriptionResource.php

use Filament\Forms;
use Filament\Resources\Resource;

class SubscriptionResource extends Resource
{
    // ... other methods

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name'),
                Forms\Components\Textarea::make('description'),
                
                // *** The key part: Displaying the History ***
                Forms\Components\Section::make('Subscription History')
                    ->schema([
                        Forms\Components\Repeater::make('historyItems')
                            ->relationship('history', 'history') // Links to the relationship defined in the model
                            ->schema(fn (Forms\Components\Repeater $repeater) => $repeater->schema([
                                Forms\Components\Select::make('event_type'),
                                Forms\Components\Textarea::make('details'),
                            ]),
                    ]),
            ]);
    }
}
```

### 3. Customizing the Table View (Alternative Approach)

If you need a dedicated, separate view for the history that mirrors the Shopify style more closely—especially if it's very long—you might opt to create a separate **`SubscriptionHistoryResource`** and link it via an Action Button or a dedicated Relationship Tab within your main resource.

When viewing the Subscription detail page (`view()` method), you can explicitly load and display this history in a custom table component:

```php
// app/Filament/Resources/SubscriptionResource.php (in the view method)

public static function getHeaderActions(): array
{
    return [
        Tables\Actions\ViewAction::make('history')
            ->url(fn (Subscription $record): string => route('filament.resources.subscription-history.view', $record)),
    ];
}
```

This approach separates the concerns: the main resource handles the subscription details, and a dedicated history resource handles the complex tabular view of events. This separation adheres to good architectural practices, making your code cleaner and easier to maintain, which aligns with best practices when developing large-scale applications on [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Achieving a dynamic, historical table within a Filament resource requires mastering the relationship between Eloquent models and Filament's form/table components. By correctly setting up your one-to-many relationship (`hasMany`) and utilizing built-in features like `relationship()` or dedicated related resources, you can transform complex data fetching into an intuitive user experience. Focus on structuring your data first, and the beautiful UI layer will follow seamlessly.
