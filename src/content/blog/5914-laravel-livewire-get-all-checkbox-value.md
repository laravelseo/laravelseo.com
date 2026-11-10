---
title: "Laravel Livewire - Get all checkbox value"
description: "Laravel Livewire: How to Capture All Checkbox Values Efficiently As developers building dynamic interfaces with Livewire, one of the most common requirements..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP"]
featured: false
---

As developers building dynamic interfaces with Livewire, one of the most common requirements is managing state based on multiple selections, such as filtering data using checkboxes or toggles. When dealing with user selections like security levels, we need a robust way to ensure that all checked options are collected and sent back to the server in an easily usable format—specifically, an array.

This post addresses a common hurdle: how to make your Livewire component correctly aggregate all selected checkbox values into a single PHP array, rather than just capturing the last selected value. We will break down the problem and provide a complete, practical solution using idiomatic Laravel and Livewire patterns.

## The Challenge with Single-Value Binding

In your initial setup, you are binding multiple checkboxes to a single property: `wire:model="level"`.

```html
<input type="checkbox" value="O" wire:model="level" id="O">
<!-- ... other checkboxes -->
```

When Livewire processes this, it expects `$this->level` to be a single string or value. When you check multiple boxes, the behavior of `wire:model` often results in only one value being registered, causing your backend logic (like `getRowsQueryProperty()`) to receive an unexpected result, leading to incorrect filtering. You need the mechanism to collect these individual selections into a proper PHP array structure.

## The Solution: Binding to an Array Property

The correct approach is to define a property in your Livewire component as an array and bind the checkboxes to this array. When you use `wire:model` with arrays, Livewire automatically handles the synchronization of all selected values from the DOM into that PHP array on the server side.

### Step 1: Update the HTML (The View)

Instead of binding to a single property, we will bind the checkboxes to an array property, let's call it `$selectedLevels`.

```html
<div>
    <input type="checkbox" value="O" wire:model="selectedLevels" id="O">
    <label for="O">O</label>

    <input type="checkbox" value="a" wire:model="selectedLevels" id="a">
    <label for="a">A</label>

    <input type="checkbox" value="b" wire:model="selectedLevels" id="b">
    <label for="b">B</label>

    <input type="checkbox" value="c" wire:model="selectedLevels" id="c">
    <label for="c">C</label>
</div>
```

Notice that all checkboxes now use `wire:model="selectedLevels"`. Because they share the same model name, Livewire knows to treat this as a collection.

### Step 2: Update the Livewire Component (The Backend)

Now, we modify your component class (`Compliance`) to correctly handle the incoming array data. We will replace `$this->level` with the new `$selectedLevels` property and adjust how you query your database.

```php
<?php

namespace App\Http\Livewire;

use Livewire\Component;
use App\Models\User;

class Compliance extends Component
{
    // Change $level to $selectedLevels to reflect the array of choices
    public $selectedLevels = []; 

    public function render()
    {
        return view('livewire.compliance', [
            'customers' => $this->rows // We will calculate rows below
        ]);
    }

    public function getRowsQueryProperty()
    {
        // Use the array directly in the where clause
        if (!empty($this->selectedLevels)) {
            $query = User::query()
                ->whereIn('level', $this->selectedLevels);
        } else {
            // Optionally, return all if no filters are selected
            $query = User::query(); 
        }

        return $query;
    }

    public function getRowsProperty()
    {
        // Fetch the paginated results based on the filtered query
        return $this->rowsQuery->paginate(20);
    }
}
```

## Best Practices and Conclusion

By switching from a single property to an array property (`$selectedLevels`) and using the `whereIn()` method in your Eloquent query, you achieve dynamic filtering perfectly. This pattern is fundamental to building interactive forms in Livewire, allowing you to manage complex user input states efficiently without writing extensive manual JavaScript or overly complex Alpine directives.

Remember, when leveraging the power of Laravel and Livewire, focus on how your component state translates directly into clean Eloquent queries. As you continue to build sophisticated applications with Laravel, exploring these core concepts will only deepen your understanding of how powerful this framework is for building dynamic interfaces, much like the architecture promoted by the team at [laravelcompany.com](https://laravelcompany.com).

By correctly handling array bindings in Livewire, you ensure that your front-end interactions result in accurate, real-time data manipulation on the back end.
