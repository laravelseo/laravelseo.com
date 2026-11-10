---
title: "How to disable the default dashboard?"
description: "Mastering Layouts in Filament: Disabling Dashboards and Centering Table Stacks As developers diving into powerful frameworks like PHP Filament, you quickly..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP"]
featured: false
---

As developers diving into powerful frameworks like PHP-Filament, you quickly realize that while the backend logic is straightforward, mastering the front-end presentation—the layout, styling, and component arrangement—is where the real complexity lies. Today, we are tackling two common pain points in Filament development: customizing the initial dashboard experience and fine-tuning complex table layouts.

This post will provide a comprehensive, developer-focused answer to both your questions, giving you the practical knowledge needed to build polished applications.

## 1. How to Disable the Default Dashboard in PHP-Filament

When working with Filament, the "default dashboard" experience is often tied to the scaffolding provided by the framework. Directly disabling it typically involves controlling which pages or resources are exposed to the user, rather than removing a core component entirely. If you wish to create a custom entry point or hide default navigation, you need to focus on configuration and route management within your Filament setup.

For instance, if you want to prevent users from seeing the main resource index page upon login, you typically manage this by controlling access permissions or by customizing the navigation structure. While there isn't a single "disable dashboard" toggle, the approach involves overriding the default scaffolding provided by Filament.

A robust way to handle custom entry points is to leverage Laravel's routing capabilities alongside Filament’s resource management. Instead of relying on Filament's built-in landing pages, you can define your own routes and ensure that the initial view loaded upon authentication points to a page you have fully customized. This aligns perfectly with Laravel’s philosophy of providing flexible, framework-agnostic foundations.

**Best Practice:** Focus on controlling the access layer. If a specific dashboard view is unwanted, ensure that the route leading to it is secured or that your main layout file overrides the default welcome screen entirely. Always remember that in Laravel applications, routing and authorization are the primary tools for controlling user experience.

## 2. Troubleshooting Layouts: Why Isn't the Stack Centered?

The issue you are facing with centering elements within a Filament table—specifically the `Stack` component not being centered—is almost always related to how CSS Flexbox or grid rules are applied to the parent containers. In your provided code snippet, the alignment is handled by the wrapping column structure, and we need to ensure that the internal components respect the available space correctly.

Let's examine the relevant part of your code:

```php
// ... inside Table::columns()
Split::make([
    TextColumn::make('lastname')
        // ... other settings
        ->label(__('messages.lastname')),
    Stack::make([
        TextColumn::make('phone_number')
            // ... column details
        TextColumn::make('email')
            // ... column details
    ])-alignCenter() // <-- This applies alignment to the Stack itself
])
```

The reason the `Stack` may not appear perfectly centered is often due to the interaction between the parent container (`Split`) and the content inside it. While you correctly applied `alignCenter()` to the `Stack`, sometimes the specific CSS properties inherited by the column structure need fine-tuning, especially when dealing with multi-column layouts like `Split`.

To ensure perfect centering for complex stacks of columns within a table cell, we often need to adjust how the internal elements are spaced. The most reliable method is to ensure that the container holding the stack itself is set up to distribute space evenly.

**The Fix:** While `alignCenter()` is useful, if you need true horizontal centering *within* a column context, ensuring the parent element (the `Stack` or its immediate wrapper) utilizes Flexbox properties correctly is key. In many Filament table contexts, applying alignment directly to the container that holds the vertical stack elements works best. If simple `alignCenter()` fails, it usually means you need to ensure there is adequate horizontal space available for that centering action.

**Refined Code Example:** To maximize centering effectiveness within a complex column structure, try ensuring the `Stack` itself acts as the central container:

```php
public static function table(Table $table): Table
{
    return $table
        ->columns([
            Split::make([
                TextColumn::make('lastname')
                    ->sortable()
                    ->searchable()
                    ->placeholder('none')
                    ->label(__('messages.lastname')),
                Stack::make([
                    TextColumn::make('phone_number')
                        ->sortable()
                        ->searchable()
                        ->placeholder('none')
                        ->label(__('messages.phone_number'))
                        ->url(fn($record) => "tel:{$record->phone_number}")
                        ->icon('fas-phone-volume'),
                    TextColumn::make('email')
                        ->sortable()
                        ->searchable()
                        ->placeholder('none')
                        ->label(__('messages.email'))
                        ->url(fn($record) => "mailto:{$record->email}")
                        ->icon('fas-envelope')
                ])
                // Ensure the entire stack is centered within the Split column space
                ->alignCenter() 
            ])
            ->filters([
                // ... filters
            ])
            ->actions([
                EditAction::make(),
                Tables\Actions\Action::make('Details')
                    ->button()
                    ->url(route('your.route.name')) // Ensure route is correctly defined
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
        ])
}
```

By keeping the `alignCenter()` directive on the parent container (`Stack` inside `Split`) and ensuring the individual column elements within it are properly structured, you leverage Filament's built-in CSS alignment utilities effectively. Remember, understanding these underlying layout principles—like Flexbox—is crucial when building custom interfaces in any modern framework, including those built upon Laravel.

## Conclusion

Mastering UI presentation in Filament requires a blend of knowing the framework's conventions and understanding the underlying CSS structure. Whether you are trying to control initial dashboard views or meticulously align complex data tables, success comes from focusing on configuration and layout properties. By applying these principles—controlling routes for dashboards and correctly utilizing alignment classes for table columns—you can move beyond basic functionality and start building truly professional, customized applications. Keep exploring the documentation; there is always depth waiting to be discovered!
