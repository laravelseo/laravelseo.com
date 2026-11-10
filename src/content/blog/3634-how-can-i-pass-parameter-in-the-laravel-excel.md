---
title: "How can I pass parameter in the laravel excel?"
description: "Mastering Context: How to Pass Parameters into Laravel Excel Exports As developers working with data export tools like Laravel Excel (Maatwebsite\\Excel), a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with data export tools like Laravel Excel (Maatwebsite\Excel), a common challenge arises: how do you inject specific context—like an ID, a user preference, or a filter—into the export process? When building robust systems, passing parameters correctly is crucial for ensuring your exported files are accurate and relevant.

You’ve encountered a classic hurdle when integrating dependency injection with data export logic. In your attempt to pass the `$id` into your `ItemsDetailsExport`, you ran into issues because the mechanism you used (accessing global request input) doesn't correctly bridge the gap between the controller request and the export class constructor or collection method.

This post will walk you through the correct, robust ways to handle parameter passing for Laravel Excel exports, ensuring you can generate precisely the data you need.

## Why Direct Input Fails in Export Contexts

Your initial attempt involved trying to use `Input::get('id')` within the `collection()` method of your export class:

```php
public function collection()
{
    $test = Input::get('id'); // This often returns null or unexpected values during export
    dd('yeah', $test);
}
```

The reason this fails is that the `ItemsDetailsExport` object, when being instantiated by Laravel Excel, operates in a context that doesn't automatically inherit the request parameters unless they are explicitly passed to it via the constructor. The export process is designed to pull data from a defined source (like Eloquent models or collections), not necessarily the raw HTTP request directly.

## Solution 1: Injecting Parameters via the Export Class (The Cleanest Approach)

The most idiomatic Laravel approach involves passing the necessary context directly into your export class, often by injecting the necessary model or ID into the constructor. This adheres to the principles of Dependency Injection, which is a core concept in building maintainable applications, much like how you structure services on **[laravelcompany.com](https://laravelcompany.com)**.

Instead of trying to read the input inside `collection()`, let the export class be responsible for fetching the *specific* data it needs based on the context provided.

### Step-by-Step Implementation

**1. Update the Export Class:**
Modify your export class to accept the required ID in its constructor and use it to fetch the necessary data from your repository.

```php
namespace App\Exports;

use App\Repositories\Backend\ItemDetailRepository;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\Exportable;

class ItemsDetailsExport implements FromCollection
{
    protected $itemDetailRepository;
    protected $itemId; // Store the ID we need to export

    public function __construct(ItemDetailRepository $itemDetailRepository, $id) // Inject the repository AND the ID
    {
        $this->itemDetailRepository = $itemDetailRepository;
        $this->itemId = $id; // Store the passed ID
    }

    public function collection()
    {
        // Now use the injected ID to retrieve exactly what you need
        $item = $this->itemDetailRepository->find($this->itemId); 
        
        if (!$item) {
            return collect(); // Return empty if item is not found
        }

        // Return a collection containing only the desired data
        return collect([$item]);
    }
}
```

**2. Update the Controller:**
In your controller, you now pass the `$id` directly when creating the export instance.

```php
use App\Exports\ItemsDetailsExport;
use App\Repositories\Backend\ItemDetailRepository;

class ItemController extends Controller
{
    public function exportToExcel(ItemDetailRepository $repository, $id)
    {
        // Pass both the repository dependency and the required ID to the exporter
        return $repository->export(new ItemsDetailsExport($repository, $id));
    }
}
```

## Solution 2: Passing Data via a Custom Class (For Complex Exports)

If you are exporting multiple related items based on a parameter, it is often cleaner to prepare the data *before* handing it to the Excel exporter. This involves letting your Service or Controller handle the data fetching and structuring first.

In this scenario, the controller fetches all necessary records using the provided ID and then passes the resulting collection directly to the export class. This separates the concerns: the controller handles routing/fetching, and the export class only handles formatting.

## Conclusion

Passing parameters into Laravel Excel exports is less about accessing request input inside the `collection()` method and more about leveraging Dependency Injection to provide context *at instantiation time*. By injecting your necessary repositories or IDs into the export class constructor, you establish a clear contract for what data the exporter needs. This pattern makes your code cleaner, easier to test, and aligns perfectly with modern Laravel design principles, making your application more scalable and robust, just as good software architecture should be.
