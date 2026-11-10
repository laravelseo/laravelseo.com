---
title: "How to use Laravel Livewire with Eloquent Models?"
description: "How to Use Laravel Livewire with Eloquent Models: Mastering Data Flow Welcome to the world of dynamic application building with Laravel Livewire! Livewire is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Welcome to the world of dynamic application building with Laravel Livewire! Livewire is an incredibly powerful tool that bridges the gap between traditional server-side rendering and reactive front-end interactivity. When you start integrating Livewire with Eloquent models, you often run into subtle data flow issues related to how PHP handles object serialization and collection binding.

If you've encountered the situation where passing an Eloquent object results in a string representation, preventing you from accessing properties like `id` or `name`, you are not alone. This is a common hurdle when dealing with nested data and lifecycle hooks. As a senior developer, I can tell you that the solution lies in understanding how Livewire handles state synchronization versus raw PHP object access.

Let's dive into your specific scenario and fix this issue by implementing robust data handling practices.

## The Root of the Problem: Data Type Mismatches

The error you are seeing—`Trying to get property 'id' of non-object`—occurs because when Livewire binds data from the view back into a component property (especially when dealing with collections or single models), it sometimes serializes the result in a way that PHP interprets as a string or an array, rather than the actual Eloquent model instance.

In your case, when you select a manufacturer and attempt to access `$this->manufacturer->id` in the `updated()` hook, Livewire might be feeding back the selected value (which looks like JSON or an array representation of the object) instead of the full Eloquent object itself.

The core principle we must follow is: **Store only what you need for the interaction, and fetch the full model when necessary.**

## Solution 1: Storing IDs for Relationships (The Best Practice)

For cascading dropdowns and relational data, the most efficient and robust approach is to store the primary key (the ID) in your Livewire component state. You only need the ID to perform subsequent database queries; you don't need the entire model object in the component properties unless you intend to render it directly.

### Refactoring Your Component Logic

Instead of trying to pass the full Eloquent objects around, let's modify your component to store identifiers:

**`PostComponent.php` (Refactored)**

```php
class PostComponent extends Component
{
    public $manufacturerId; // Store the ID directly
    public $cars;

    public function mount()
    {
        // Load only the necessary data initially: the list of manufacturers
        $this->manufacturers = Manufacturer::orderBy('name')->get(); 
        $this->manufacturerId = null; // Initialize the ID
    }
    
    public function updated(string $propertyName)
    {
        if ($propertyName === 'manufacturer') {
            // When the manufacturer is updated, grab the ID from the selected value.
            // We assume the input sent back by Livewire is the ID (or we fetch it).
            $this->manufacturerId = $this->manufacturer->id; 

            // Now use the stored ID to fetch the related cars
            $this->cars = Car::where('manufacturer_id', $this->manufacturerId)->get();
        }
    }

    public function render()
    {
        return view('livewire.post-component');
    }
}
```

### Adjusting the Blade View

You must ensure that when you bind the dropdown, you are binding to the ID, not the entire object. This often involves using `wire:model.live` or ensuring your form submission sends only the necessary key. For select boxes, binding directly to the ID is cleaner.

**Blade File (Refactored)**

```html
<label for="manufacturer">Manufacturer</label>
<select wire:model="manufacturer" id="manufacturer">
    <option selected disabled value="">Select a Manufacturer</option>
    @foreach($manufacturers as $selectableManufacturer)
        {{-- Bind the VALUE to the model field --}}
        <option value="{{ $selectableManufacturer->id }}">{{ $selectableManufacturer->name }}</option>
    @endforeach
</select>
```

By binding the `<option value="...">` to `$selectableManufacturer->id`, you ensure that when Livewire updates `$this->manufacturer`, it receives a clean integer ID, which you can safely store and use in your `updated()` hook without hitting data type errors. This pattern is fundamental to building performant and reliable interfaces with Eloquent relationships, which aligns perfectly with best practices found on the official Laravel documentation.

## Conclusion

Dealing with data types in Livewire often requires shifting your mindset from "passing objects" to "passing identifiers." By storing foreign keys (IDs) instead of full Eloquent models within your component state, you eliminate ambiguity and prevent those frustrating runtime errors. This approach results in cleaner, more predictable, and far more maintainable Livewire components. Keep leveraging the power of Laravel and Livewire to build amazing applications!
