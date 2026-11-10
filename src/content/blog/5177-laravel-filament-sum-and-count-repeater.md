---
title: "Laravel Filament: sum and count repeater"
description: "Mastering Repeater Aggregation in Laravel Filament: Summing and Counting Fields Building complex forms with dynamic structures is where frameworks like..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

Building complex forms with dynamic structures is where frameworks like Laravel Filament truly shine. When you use a `Repeater` field, you are dealing with nested data, and often, what you need next is to aggregate that data—calculating sums, counts, or averages—to populate summary fields above the repeater.

I’ve seen developers run into this exact challenge when trying to set default values for parent fields based on the contents of a repeater. The goal is clear: make "Total area" equal to the sum of all "Field area" inputs, and "Number of fields" equal to how many items are in the repeater.

Let's dive into why your initial attempt failed and how we can implement this aggregation correctly within the Filament framework.

## The Challenge: Why Simple Defaults Fail

Your instinct to use a closure with `$get()` inside the `default()` function is spot on, as it’s the standard way to access form data in Filament forms. However, the error you encountered—`count(): Argument #1 ($value) must be of type Countable|array, null given`—tells us that when Filament attempts to resolve `$get('fields')` during the initial schema rendering phase, it cannot find the repeater data yet, or the context for accessing it is not established correctly at that specific point in the form building process.

This often happens because the calculation needs to occur *after* the data is submitted and validated, rather than relying solely on PHP defaults during the UI construction phase. For complex aggregations within nested structures like repeaters, we need a strategy that accounts for the final submitted values.

## The Solution: Calculating Aggregates Post-Submission

Instead of trying to force these calculations into static default values that are difficult to resolve dynamically from a repeater structure, the most robust pattern in Filament is to calculate these derived values directly on the model or use Livewire properties to manage this state.

However, if you absolutely need the fields to display these sums immediately upon loading the form, we can leverage the fact that the underlying data for the repeater *will* be available when saving. The key is to structure the default logic to handle potential null states gracefully and ensure the calculation targets the correct data source.

A more reliable approach involves ensuring your repeater schema feeds correctly and then handling the aggregation in a way that doesn't rely on reading incomplete form state during the setup phase.

### Implementing Dynamic Defaults with Robust Logic

For this specific requirement, we can adjust how we define the defaults to be safer, although for true summation/counting based on submitted data, post-save validation or model events are often cleaner. For demonstration purposes within the schema, let’s refine the default logic:

```php
use Filament\Forms;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Illuminate\Support\Collection;

public static function form(Form $form): Form
{
    return $form
        ->schema([
            // --- Aggregation Fields First ---
            TextInput::make("total_area")
                ->label("Total area")
                ->postfix('m²')
                ->disabled()
                // We will set the default here, acknowledging that complex summation 
                // often requires post-processing if the data structure is complex.
                ->default(fn (Closure $get) => null), // Start null, calculate later

            TextInput::make("number_of_fields")
                ->label("Number of fields")
                ->disabled()
                ->default(fn (Closure $get) => 0), // Default count to zero

            // --- Repeater Definition ---
            Repeater::make('fields')
                ->label('Field')
                ->schema([
                    TextInput::make("field")
                        ->label("Field area")
                        ->postfix('m²')
                        ->required(),
                ])
        ])
        ->columns(2);
}
```

**Why this refined approach?**

By setting the defaults to `null` or `0`, we avoid the runtime error where Filament tries to count an empty or null collection during form rendering. The true power of Filament lies in using **Actions** or **Mutators** on the model to perform these complex calculations *after* the user submits their data, ensuring data integrity regardless of how the form defaults are structured.

If you need this information immediately visible on the form (as a live calculation), you would typically use Livewire properties bound to the repeater array and update the parent fields via reactive updates within your component class, rather than relying on static PHP defaults for cross-field calculations. This approach keeps the data flow explicit and testable, which is paramount when working with complex relationships in Laravel applications, as emphasized by best practices found on [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Dealing with aggregate data from repeater fields requires careful consideration of the rendering lifecycle within a framework like Filament. While attempting to set defaults directly inside the schema can lead to runtime errors when dealing with dynamic collections, the superior architectural choice is to handle complex sums and counts in the backend logic (the model or Livewire component). This ensures that your calculations are performed on valid, submitted data, making your application more robust and predictable. By separating presentation concerns from calculation concerns, you build more scalable applications.
