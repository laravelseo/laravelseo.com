---
title: "Get data without appends and relations in Laravel from Eloquent"
description: "Getting Only What You Need: Mastering Eloquent Retrieval Without Unwanted Relations and Appends As developers working with Laravel and Eloquent, optimizing..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Performance", "PHP"]
featured: false
---

As developers working with Laravel and Eloquent, optimizing data retrieval is paramount. We often find ourselves in situations where fetching a single parent model seems simple, but the underlying mechanism of Eloquent—lazy loading and relationship management—can inadvertently pull in massive amounts of related data, leading to unnecessary database queries and bloated memory consumption.

This post tackles a common performance conundrum: how do we retrieve just one `Project` model without accidentally triggering the loading of its many associated relations (like `pages`, or complex appends within those pages), especially when we don't explicitly use the `with()` method?

## The Problem with Default Eloquent Loading

Consider your scenario involving the `Project` model, which has relationships (`pages`, `brands`, `status`) and nested appends. When you execute a simple query like `Project::find($id)`, Eloquent generally loads the primary model. However, if that model structure is complex, or if subsequent operations implicitly check for related data (even during initialization), it can lead to performance issues.

The core issue arises when you later iterate over these results and access relationships, triggering N+1 problems:

```php
$project = Project::find($id); // Loads the project and potentially triggers initial relation checks
foreach ($project->pages as $page) {
    // Accessing pages loads related data for each page individually if not eager loaded
    echo $page->some_attribute; 
}
```

If you are *only* interested in the `Project` entity itself—the core data—loading all associated relational data just to discard it is a waste of resources. You want minimal payload for maximum efficiency. While using raw queries (`DB::table(...)`) avoids eager loading entirely, our goal here is to find an Eloquent-centric solution that remains expressive and maintains the benefits of the ORM structure.

## The Superior Eloquent Approach: Selecting Specific Columns

The most effective way to load only the necessary data from a database, without fetching entire related models or unnecessary columns, is by utilizing the `select()` method. This forces the query builder to retrieve *only* the fields you explicitly request, significantly reducing the data transferred from the database and minimizing the hydration overhead in PHP memory.

By restricting the selection, you tell Eloquent exactly what it needs, bypassing the automatic loading of relations that are not explicitly requested.

Here is how you can retrieve only the `Project` model, without loading its related `pages` or other complex appends:

```php
$projectId = 123;

// Retrieve ONLY the columns from the projects table. No relations or appends are loaded by default.
$projectData = \App\Models\Project::select('id', 'name', 'status')->find($projectId);

if ($projectData) {
    // $projectData will only contain the base Project data, not nested relations.
    echo "Project Name: " . $projectData->name;
}
```

### Why This Works Better

1.  **Reduced Database Load:** The database only needs to process and return the specified columns, which is faster than retrieving all columns (including potentially large JSON or serialized data from appends and relations).
2.  **Minimized Memory Footprint:** Eloquent avoids instantiating complex related models entirely, saving significant memory, especially when dealing with deeply nested structures like those involving `Page` appends.
3.  **Clarity:** It clearly signals your intent to the ORM: "I only need this basic entity right now."

This technique is a cornerstone of writing performant Laravel applications. For deeper insights into optimizing Eloquent queries and relationships, exploring resources from [Laravel Company](https://laravelcompany.com) is highly recommended.

## Conclusion

While methods like `with()` are essential for optimizing relations when you *do* need them loaded (eager loading
