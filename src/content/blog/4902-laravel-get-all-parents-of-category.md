---
title: "Laravel get all parents of category"
description: "Laravel: Recursively Finding All Ancestors of a Category Dealing with hierarchical data—like categories, organizational trees, or file systems—is a common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

Dealing with hierarchical data—like categories, organizational trees, or file systems—is a common challenge in application development. When you have a simple `belongsTo` relationship for a single parent, moving to finding *all* ancestral parents requires stepping beyond basic Eloquent relationships and utilizing recursive logic.

This post will walk you through how to efficiently retrieve the entire lineage of parent categories for any given category in your Laravel application, moving from a single parent lookup to displaying the full path.

## Understanding the Eloquent Setup

You have correctly established the foundational relationship between your `Category` models:

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';

    public function parent()
    {
        // This finds only the immediate parent.
        return $this->belongsTo('App\Category', 'parent_id');
    }

    public function children()
    {
        return $this->hasMany('App\Category', 'parent_id');
    }
}
```

As you noted, this setup is perfect for finding the immediate parent using `$category->parent`. However, to achieve your goal—retrieving the full path: "Test -> Subcategory of Test -> Sub-subcategory of Test"—we need a method that can recursively traverse up the chain.

## The Challenge: Recursive Traversal in Eloquent

The standard Eloquent relationships are designed for one-to-many or one-to-one mappings, not deep graph traversal. To solve this, we must implement custom logic within the model itself to perform recursive queries or iterative lookups.

Since Eloquent is built upon a robust ORM, utilizing database capabilities for complex joins or recursive Common Table Expressions (CTEs) can often be the most performant approach, especially when dealing with deep hierarchies. However, for clarity and control, implementing a recursive method on the model is highly practical in Laravel.

## Solution: Implementing a Recursive Parent Finder Method

We will add a method to the `Category` model that recursively collects all ancestors. This method will use recursion (or an iterative stack approach) to climb up the `parent_id` chain until it reaches the root category.

Here is how you can enhance your `Category` model:

```php
namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class Category extends Model
{
    protected $table = 'categories';

    public function parent()
    {
        return $this->belongsTo('App\Category', 'parent_id');
    }

    public function children()
    {
        return $this->hasMany('App\Category', 'parent_id');
    }

    /**
     * Recursively finds all parent categories for the current category.
     *
     * @return Collection
     */
    public function getAllParents(): Collection
    {
        $parents = collect();
        $current = $this->parent;

        // Iterate upwards until we hit null (the root)
        while ($current) {
            // Add the current parent to the collection
            $parents->push($current);
            // Move up to the next level
            $current = $current->parent;
        }

        return $parents;
    }
}
```

### How the Solution Works

1.  **Start Point:** The method begins by setting `$current` to the immediate `parent` of the current category (`$this->parent`).
2.  **Iteration:** It enters a `while` loop that continues as long as `$current` is not null (meaning we haven't reached the top-level root).
3.  **Traversal:** Inside the loop, it collects the current parent and then updates `$current` to be the parent of the current `$current`. This process repeats until the chain terminates at the top-most category.

This method effectively traces the entire lineage, gathering all necessary parent models into a Laravel `Collection`.

## Using the Result in Your View

Now that you have a method to retrieve all parents, you can easily display the full breadcrumb trail in your Blade view:

```blade
@php
    $category = App\Category::findOrFail($id);
    $parents = $category->getAllParents();
@endphp

<div>
    @foreach ($parents as $parent)
        <!-- Displaying the path using a separator -->
        <td class="breadcrumb">
            {{ $parent->name }}
            @if ($parent !== $category->parent)
                <strong class="separator">&gt;</strong>
            @endif
        </td>
    @endforeach
    <td class="current-category">{{ $category->name }}</td>
</div>
```

## Conclusion

Finding all ancestors in a relational database structure requires moving beyond simple Eloquent relationships. By incorporating custom, recursive logic directly into your Eloquent models, as demonstrated above, you gain powerful control over your data retrieval. This approach keeps the business logic neatly encapsulated within the model while leveraging the efficiency of the underlying database structure. For more advanced, highly complex hierarchy management in Laravel, exploring database-level solutions like Recursive CTEs can also offer superior performance, ensuring that your application remains fast and scalable, much like the principles guiding robust architecture at resources such as https://laravelcompany.com.
