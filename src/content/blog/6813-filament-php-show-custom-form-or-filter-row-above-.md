---
title: "Filament PHP show custom form or filter row above header widgets and link them with header widgets"
description: "Show Custom Forms and Filters Above Header Widgets in Filament As a senior developer working with the powerful framework of Filament, you are often looking..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

As a senior developer working with the powerful framework of Filament, you are often looking for ways to extend its capabilities beyond the default scaffolding. Creating custom pages that combine complex data visualization (like charts) with interactive filtering controls requires careful consideration of how Filament manages layout and data context.

You've encountered a common hurdle when trying to integrate dynamic forms and filters directly above header widgets in a custom `Page`. While Filament provides excellent tools for filtering resources, applying those mechanisms seamlessly to arbitrary page layouts—especially involving `getHeaderWidgets()`—requires an architectural shift.

This post will diagnose why your attempts with `HasFiltersForm` and `InteractsWithForms` didn't yield the desired results, and I will provide a practical, developer-focused solution for displaying interactive filters above your header widgets and linking them to your data visualizations.

## Diagnosing the Filtering Challenge in Custom Pages

The reason you are not seeing any forms or filters displayed is rooted in how Filament scopes its filtering capabilities. Features like `HasFiltersForm` and `InteractsWithForms` are primarily designed to attach context-aware filtering mechanisms directly to **Resource pages** or standard **Panel layouts**. They hook into the underlying data query of the resource, which simplifies binding filters to the main content area.

When you create a custom `Page`, you gain control over the layout via Blade views and methods like `getHeaderWidgets()`. However, these methods operate on presentation rather than direct data querying scope. Therefore, simply calling `filtersForm()` within your Page class does not automatically render the necessary interactive components unless they are explicitly placed within a context Filament recognizes as filterable (like a Resource).

To achieve dynamic filtering for widgets on a custom page, we need to manually define the input structure and ensure the data context for those inputs is correctly established.

## The Solution: Manual Layout Integration and Context Passing

Since you need filters above your header widgets, the most robust approach is to treat the filter row as a standard layout component within your custom Page view, rather than relying solely on Filament's built-in filtering hooks which are optimized for resource management.

We will combine the power of Filament components with standard Blade structure to achieve this goal.

### Step 1: Define the Filter Schema (The Inputs)

First, define the actual form schema you want to display in your custom page. This remains crucial for defining *what* inputs exist.

```php
// In your Page class or a dedicated Trait if preferred
protected function getFilterSchema(): array
{
    return [
        Section::make('Date Filters')
            ->schema([
                DatePicker::make('startDate')
                    ->label('Start Date')
                    ->default(now()->startOfMonth),
                DatePicker::make('endDate')
                    ->label('End Date')
                    ->default(now()->endOfQuarter),
                // Add other necessary filters here
            ])
    ];
}
```

### Step 2: Render the Filters in the View

Instead of relying on automatic widget integration, you will explicitly render this schema within your custom page's view file (`show-clicks.blade.php`). This gives you full control over placement relative to `getHeaderWidgets()`.

In your Blade file, structure the content like this:

```blade
{{-- Custom Filter Row --}}
<div class="flex justify-between items-center border-b pb-4 mb-6">
    @include('filament::components.form.section', ['schema' => $this->getFilterSchema()])
</div>

{{-- Header Widgets --}}
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {{-- Your existing header widgets go here --}}
    @include('filament::widgets.chart', ['widget' => $this->getHeaderWidgets()[0]])
    @include('filament::widgets.table', ['widget' => $this->getHeaderWidgets()[1]])
</div>
```

By explicitly using `@include` or standard Blade rendering for your filter schema, you ensure the form elements are rendered exactly where you need them—above the widgets—and they become visible interactive controls within your custom page. This pattern is highly effective when customizing complex layouts outside of standard CRUD flows, aligning with best practices in building tailored applications on Laravel and Filament.

## Conclusion

The difficulty you experienced stems from attempting to force a resource-centric filtering mechanism onto a presentation-centric page layout. By shifting the strategy—from relying on automatic widget integration to explicitly rendering your filter schema within the custom view structure—you regain complete control over the placement and interaction of your UI elements. Remember, when building complex interfaces with Filament, mastering the interplay between data context (what filters affect) and presentation (where filters are displayed) is key to unlocking truly customized experiences. For deeper architectural insights into optimizing these interactions, always refer back to the official documentation on [https://laravelcompany.com](https://laravelcompany.com).
