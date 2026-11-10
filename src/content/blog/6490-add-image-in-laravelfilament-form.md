---
title: "Add image in Laravel/Filament form"
description: "Dynamic Image Display in Filament Wizards: Bridging Data Between Steps Building multi step wizards in Filament is a fantastic way to guide users through..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

Building multi-step wizards in Filament is a fantastic way to guide users through complex processes, such as product configuration or onboarding. However, when you need dynamic data—like fetching an image URL based on a user input from a previous step—you run into a common challenge: how do you persist and display that information across separate form steps?

This post dives deep into solving exactly this problem: displaying dynamically fetched image URLs within a Filament wizard workflow. We will explore why simple `ViewField` usage might seem insufficient, and show you the robust method for passing data between steps using Laravel and Filament best practices.

## The Challenge: Data Flow in Multi-Step Forms

You are correct that simply placing a `ViewField` might not immediately solve the issue if the data isn't explicitly stored in the underlying model or the form state in a way Filament automatically recognizes. When dealing with dynamic lookups (like fetching an image based on a product ID), the process requires careful orchestration:

1.  **Input:** User enters `product_id` in Step 1.
2.  **Processing:** The system uses this ID to query an external service or database to get the `image_url`.
3.  **Persistence:** This URL must be saved somewhere accessible to Step 2.
4.  **Display:** Step 2 needs to read that persisted URL and display it using a field like `ViewField`.

The key is ensuring that the data fetched during validation in one step is correctly written back to the entity or form state so it can be retrieved by the next step.

## The Solution: Using After Validation for State Setting

Your approach using the `afterValidation` hook is excellent because it allows you to execute custom logic right after a field is validated, making it the perfect place to trigger data fetching. The trick lies in ensuring that the set value is accessible to subsequent steps.

For complex wizard flows, relying solely on temporary session state can become brittle. A more robust pattern involves updating the underlying model or an associated data structure immediately upon successful validation. This aligns perfectly with principles of data integrity you see in modern Laravel applications where Eloquent models are the backbone of data management, much like those promoted by the [Laravel Company](https://laravelcompany.com).

Here is how you can refine your implementation to ensure the data flows correctly:

```php
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ViewField;
use Filament\Forms\Steps\Step;
use App\Models\Product; // Assuming you have a Product model

// Inside your Form class method (e.g., getSteps())

public function getSteps(): array
{
    return [
        Step::make('Product ID')
            ->description('Write a product id you want')
            ->schema([
                TextInput::make('product_id')
                    ->required()
                    ->reactive() // Important for real-time updates
            ])
            ->afterValidation(function (Get $get, Set $set) {
                $id = $get('product_id');

                // 1. Fetch the dynamic data
                $product = Product::findOrFail($id);
                $product_image_url = $product->image_url; // Assuming this is a relation or attribute

                // 2. Set the value for the next step via the setter mechanism
                $set('product_image', $product_image_url);
            }),

        Step::make('Confirmation')
            ->description('Check a product one more time and confirm you want it')
            ->schema([
                // 3. Read the previously set value using ViewField
                ViewField::make('product_image')
                    ->label('Product Image Preview')
                    ->content(function (callable $get) {
                        // Optional: Add logic here to display or handle the URL prettily
                        return $get('product_image');
                    }),
            ]),
    ];
}
```

## Best Practices for Wizard Data Handling

1.  **Model-Centric Approach:** Whenever possible, try to store derived data on your Eloquent models rather than relying purely on form state variables. This ensures that if you navigate away and come back, the data remains consistent with the database state. When fetching URLs, ensure your service layer is clean and follows good architectural patterns, keeping performance in mind—a principle highly valued by the [Laravel Company](https://laravelcompany.com).
2.  **Reactive Fields:** Using `reactive()` on inputs helps Filament manage the state efficiently during the flow. The `afterValidation` hook then acts as the bridge to calculate and set the next required piece of data.
3.  **Clarity in ViewFields:** Use `ViewField` when you only need to display information that has *already* been determined by previous steps or model associations. Using a closure within `content()` gives you full control over how that dynamic URL is rendered, allowing you to add context (like a label) without cluttering the underlying data structure.

## Conclusion

Displaying dynamically fetched data across sequential Filament form steps requires treating the validation hook not just as a trigger, but as a persistence mechanism. By strategically using `afterValidation` to calculate and set values, and then utilizing `ViewField` in subsequent steps to retrieve those stored values, you can successfully build complex, data-driven wizards. Master this flow, and you'll be able to create incredibly intuitive and powerful user experiences within your Laravel and Filament applications.
