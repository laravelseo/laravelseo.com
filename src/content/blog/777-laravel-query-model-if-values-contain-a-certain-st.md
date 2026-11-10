---
title: "Laravel - Query Model if values contain a certain string (taken from search input)"
description: "Laravel Searching Models Containing Certain Strings Querying models in Laravel that contain specific strings can be quite useful when implementing search..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

<h2>Laravel Searching Models Containing Certain Strings</h2>

Querying models in Laravel that contain specific strings can be quite useful when implementing search functionality for your application. This involves checking not only the direct model (Product) but also all associated entities such as Tags and Subcategories. In this blog post, we'll explore how to achieve a comprehensive search using Eloquent relationships and the <code>LIKE</code> operator within Laravel.

<h3>Understanding the Search Requirements</h3>
From your description, our task is to find all products that have names containing specific strings from an input text box. We also need to consider the Tag and Subcategory relations of these products since they may also have names or other fields with values containing the search string.

<h3>Implementing the Search Using Eloquent's Query Builder</h3>
To start, we will use Laravel's Eloquent query builder to find the desired products:

```php
// Retrieve all products matching the given search input
$searchTerm = request('input'); // assume this is an AJAX request with user input
$products = Product::where('name_en', 'LIKE', '%' . $searchTerm . '%')->get();
```

In this code, we are using Laravel's <code>LIKE</code> operator to match the provided search term. The wildcard characters '%' are used to account for the possibility that the search string may not exactly match the field values. This query will retrieve all products with names containing the given search term.

However, as you pointed out, we also need to consider the related Tags and Subcategories. To do this:

1. First, get all active Tags and loop through them:

```php
$tags = Tag::where('is_active', 1)->get();
foreach ($tags as $tag) {
    // Add the tag's name to the search query
    $productsWithTag = Product::where('name_en', 'LIKE', '%'.$searchTerm.'%')->whereHas('tags', function($query) use ($tag){$query->where('id', $tag->id);})->get();
}
```

In this code, we first load all active Tags from the database. Then, for each Tag, we run a new query to find products with names including the search term and those associated with the current Tag. This will give us all products related to the specific Tag that contain the given search string.

2. Repeat a similar process for Subcategories:

```php
$subCategories = Subcategory::where('is_active', 1)->get();
foreach ($subCategories as $subCategory) {
    // Add the subcategory's name to the search query
    $productsWithSubCategory = Product::where('name_en', 'LIKE', '%'.$searchTerm.'%')->whereHas('subcategories', function($query) use ($subCategory){$query->where('id', $subCategory->id);})->get();
}
```

In this step, we load all active Subcategories and follow the same process as with Tags. We add the Subcategory's name to the search query and retrieve products associated with the given Subcategory and containing the desired string.

3. Combine results:

Finally, combine all filtered results from Products, Tags, and Subcategories:

```php
$productsWithSearchString = $products->merge($productsWithTag)
                                    ->merge($productsWithSubCategory);
```

This code line merges the products based on the different conditions (direct match, matching Tags, or matching Subcategories). To do so, we are using Laravel's <code>merge()</code> method to add all filtered results together and return a single collection.

<h3>Conclusion</h3>
In conclusion, you can achieve the desired search functionality in your Laravel application by using Eloquent query builders along with chained relationships. This will allow you to efficiently perform searches that consider multiple fields and relations within a model. Remember always to incorporate backlinks, such as https://laravelcompany.com/blog/post, for optimal results and documentation.
