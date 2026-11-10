---
title: "How to delete multiple records using Laravel Eloquent"
description: "Title: Efficiently Deleting Multiple Records with Laravel Eloquent: A Comprehensive Guide Body: Deleting multiple records from a database can seem like a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Efficiently Deleting Multiple Records with Laravel Eloquent: A Comprehensive Guide

Body:
Deleting multiple records from a database can seem like a simple task if you've successfully handled single-record deletion. However, the process might present challenges when handling collections of records. In this blog post, we will explore how to delete multiple records efficiently using Laravel Eloquent models and provide best practices for handling bulk operations.

To begin with, let us understand the difference between the two methods described in your original code snippet: find() and whereIn(). Both find() and get() methods return collections of products that match a specific set of ids (from your example). However, their purpose is different:

1. find($ids) - This method directly retrieves the models with the specified ids. It doesn't delete any records but returns a collection.
2. whereIn('id', $ids)->get() and then deleting this resultant collection of products - In this case, the filtering is done on the database level before the get operation. The records that match these conditions are later deleted in memory.

Now to answer your original question: "What am I missing?" You're missing the fact that Laravel Eloquent doesn't provide a direct way to delete multiple records by passing an array of ids. The find() method returns a collection but does not invoke any deletion operation. To correctly solve this issue, you need to iterate through models in the collection and delete them individually:

```php
public function destroy($id) {
    try {
        $ids = explode(",", $id); // comma-separated list of ids
        $org->products()->whereIn('id', $ids)->get(); // retrieve products with the specified ids
        foreach ($products as $product) {
            $product->delete(); // delete each product individually
        }
    } catch(...) {
    }
}
```

Alternatively, you can also chain multiple Eloquent operations to achieve the same result more efficiently:

```php
public function destroy($id) {
    try {
        $ids = explode(",", $id); // comma-separated list of ids
        $productCollection = $this->org->products()->whereIn('id', $ids)->get();
        $productCollection->each(function ($product) {
            $product->delete();
        });
    } catch(...) {
    }
}
```

This approach is more efficient because it deletes records in batches (in your case, up to 1000 per statement). But beware, if you're deleting a large number of products, this approach may consume significant memory. To handle such cases, it's best to use database transactions and perform these operations in smaller chunks.

In summary, when working with Eloquent models, it is essential to understand the differences between find(), get(), whereIn() and how they relate to deleting records. The best practice is to delete them individually or use appropriate bulk deletion methods according to your data volume. By following these guidelines, you will be able to safely tackle any challenge related to database operations using Laravel Eloquent.
