---
title: "Call to a member function count() on a non-object (Laravel 5)"
description: "Avoiding Null Pointer Errors: Safely Counting Eloquent Relationships in Laravel As developers working with Laravel and Eloquent, one of the most common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with Laravel and Eloquent, one of the most common stumbling blocks we encounter is dealing with data integrity—specifically, ensuring that relationships exist before attempting to interact with them. This often manifests as a dreaded "Attempt to call a method on null" error when trying to count items in a relationship.

This post dives into the specific issue you are facing when iterating over related models (like tasks for a project) and shows you the robust, defensive programming techniques required to prevent these runtime errors, ensuring your application remains stable and predictable.

## The Pitfall: Calling Methods on Null Relationships

You are dealing with a scenario where you fetch a `Project` model, and it has a relationship defined to `Task` models. When you try to access this relationship via `$project->tasks`, if no tasks exist for that project (or if the relationship hasn't been loaded correctly), Eloquent will return `null`.

The error occurs when your code immediately tries to invoke a method on that `null` value:

```php
@if ( !$project->tasks->count()) // Error happens here if $project->tasks is null
    There are no tasks for this project.
@else
    // ... rest of the logic
@endif
```

When `$project->tasks` is `null`, calling `->count()` results in a fatal error because you cannot call a method on a non-object. This breaks the flow of your Blade view and crashes the request, which is unacceptable in production environments.

## The Solution: Defensive Coding with Null Coalescing

The key to solving this lies in defensive coding: checking for the existence of the relationship *before* attempting to use it. In modern PHP and Laravel development, the null-coalescing operator (`?->`) and explicit conditional checks are your best tools here.

### Method 1: Using Null Coalescing with Optional Chaining (PHP 8+)

If you are using PHP 8 or newer, the null-safe operator (`?->`) allows you to safely attempt method calls only if the preceding object exists. However, for conditional logic that requires an actual count, explicit checks remain clearer.

### Method 2: Explicitly Checking for Existence (The Safest Approach)

The most robust way is to check if the relationship exists before calling methods on it. You can use the `exists()` method or simply check if the property is not null before counting.

Here is how you can restructure your Blade logic to safely handle missing relationships:

```blade
{{-- Assuming $project is the current project model --}}

@if ($project->tasks && $project->tasks->count() > 0)
    {{-- Tasks exist, display the list --}}
    <ul>
        @foreach($project->tasks as $task)
            <li><a href="{{ route('projects.tasks.show', [$project->slug, $task->slug]) }}">{{ $task->name }}</a></li>
        @endforeach
    </ul>
@elseif ($project->tasks && $project->tasks->count() === 0)
    {{-- Tasks exist but the count is zero --}}
    <p>There are no tasks for this project.</p>
@else
    {{-- The relationship does not exist (or it was null) --}}
    <p>No tasks defined for this project.</p>
@endif
```

### Method 3: Leveraging Eloquent's Collection Methods

A cleaner approach, especially when dealing with collections, is to use the collection methods directly in your conditional checks. If you only need to know if there are records, checking the count is fine, but ensuring the relationship loads correctly via eager loading is paramount for performance and reliability. Always ensure you are utilizing features like Eloquent relationships effectively, as discussed on platforms like [laravelcompany.com](https://laravelcompany.com).

## Best Practices for Relationship Handling

1.  **Eager Loading:** Before rendering any view that relies on a relationship count or data, always use eager loading (`with()`). This prevents the N+1 query problem, ensuring you fetch all necessary data in one or two efficient queries:
    ```php
    $projects = Project::with('tasks')->get();
    ```

2.  **Handling Nulls at the Model Level:** In your Eloquent models, ensure that missing relationships are handled gracefully, perhaps by defining them as `nullable()` if they might genuinely not exist on every model instance, although for standard one-to-many relationships, checking the existence in the controller or view layer is often sufficient.

By adopting these defensive programming patterns, you shift
