---
title: "Laravel trying to get property of non object eloquent relationship"
description: "Laravel Trying to Get Property of Non Object: Mastering Nested Eloquent Relationships As senior developers working with Laravel, one of the most common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

As senior developers working with Laravel, one of the most common stumbling blocks when dealing with relational data is navigating nested Eloquent relationships. You successfully retrieve your data from the database, but when you try to access related models within a loop in your Blade view, you often run into frustrating errors like "Trying to get property of non-object."

This post dives deep into the scenario you presented—retrieving tasks and their associated status names—and explains exactly why this error occurs and how to implement robust, production-ready solutions using Laravel’s powerful Eloquent features.

## The Scenario: Nested Relationships in Action

You have a classic one-to-many relationship setup: Users have many Tasks, and each Task has one Status.

**Database Schema Overview:**
*   **Statuses Table:** `id`, `user_id`, `status_name`
*   **Tasks Table:** `id`, `user_id`, `status_id`, `task_name`

Your goal is to fetch all tasks for a user and display the related status name on a dashboard. You correctly used eager loading in your controller:

```php
$user = User::with(array('tasks', 'tasks.status'))->find(Auth::user()->id);
```

This setup tells Eloquent to load the `tasks` collection for the user, and for each task within that collection, load its singular `status` relationship.

## Diagnosing the "Trying to get property of non-object" Error

The error occurs in your Blade file when you attempt to access properties on a relationship that doesn't exist or is null:

```blade
@foreach($user->tasks as $task)
    {{ $task->task_name }}
    {{ $task->status->status_name }}  <-- Error happens here if $task->status is null
    {{-- ... rest of the code ... --}}
@endforeach
```

The error message, `Trying to get property of non-object`, tells us that at some point in the execution chain, you tried to access a property (like `status_name`) on a variable that held `null` instead of an object. In this case, it means that for one or more `$task` objects in your loop, the relationship `$task->status` returned `null`.

**Why does this happen?**
Even with eager loading (`with(...)`), if there is no matching foreign key (e.g., a task has a `status_id` of 99 which doesn't exist in the `statuses` table), or if the relationship definition itself results in null for that specific record, attempting to access `$task->status->status_name` will crash the application.

## The Solution: Implementing Null-Safe Access and Robust Logic

To prevent runtime errors, we must stop assuming a relationship always exists. We need to check if the relationship object is present *before* trying to access its properties. This practice is fundamental to writing resilient Laravel applications, aligning with best practices promoted by the **Laravel Company** for clean code architecture.

### 1. Safe Access in Blade (The Immediate Fix)

Instead of direct property access, use the null-safe operator (`
