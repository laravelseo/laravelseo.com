---
title: "How do I use whenLoaded() for deeper than one level relations?"
description: "Mastering Deep Relations: Using whenLoaded() Effectively in Laravel As developers working with Eloquent, we constantly strive for efficient data retrieval...."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "Errors"]
featured: false
---

As developers working with Eloquent, we constantly strive for efficient data retrieval. One of the most powerful tools at our disposal is the relationship system, which allows us to model complex database structures elegantly. However, when dealing with deeply nested relationships combined with conditional loading—especially when optimizing for performance using methods like `whenLoaded()`—it can become surprisingly tricky.

This post dives into the confusion surrounding using `whenLoaded()` for relations beyond the first level and provides a practical, developer-focused solution to ensure you avoid N+1 problems while keeping your resources clean.

## The Challenge with Deeply Nested Conditional Loading

The core issue you are encountering stems from how Eloquent loads relationships and how resource transformers process them. You correctly noted that standard usage often seems limited to the immediate relationship: `whenLoaded('origin', ...)` works well for loading the parent model, but chaining it deeper, like trying `$this->whenLoaded('origin.season', ...)` inside a Resource, doesn't work as expected because Eloquent does not inherently store these composite paths on the model instance itself in a way that `whenLoaded` can directly query without prior eager loading.

The goal is to conditionally load nested data efficiently. If we rely solely on conditional checks within a resource, we risk triggering lazy loading just when we want to avoid it, leading straight back to the N+1 anti-pattern.

## The Developer Solution: Eager Loading First

Before attempting complex conditional logic on deep relations, the single most important step is ensuring all necessary data is loaded upfront using eager loading. This shifts the burden of fetching related data from runtime (which causes N+1) to the initial query execution, which is vastly more efficient.

For deeply nested relations, you must use nested `with()` statements in your query builder:

```php
$models = User::with('origin.season')->get();
```

By structuring your initial query this way, Eloquent fetches the user, their associated origin, and the season linked to that origin in a minimal number of database queries (usually just two or three, depending on the structure). This pre-loading ensures that when you access `$user->origin->season` within your Resource, the data is already present in memory.

## Implementing Conditional Logic in Resources

Once the data is eagerly loaded, `whenLoaded()` becomes a tool for conditional *presentation* rather than conditional *loading*. We use it to decide whether to render an attribute based on whether the relationship actually exists (i.e., if it was eager-loaded).

Here is how you can safely access and conditionally format deeply nested data within your Resource:

```php
// In your Resource class (e.g., SeasonResource)

public function toArray($request)
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        // Safely access the nested relationship only if it was loaded via eager loading
        'origin_season_details' => $this->whenLoaded('origin.season', function () {
            // This closure only runs if 'origin' and 'season' were successfully loaded
            return [
                'origin_id' => $this->origin->id,
                'season_name
