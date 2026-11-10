---
title: "Disable eager relations"
description: "Mastering Eloquent Performance: How to Disable Eager Relations When You Need Plain Models As senior developers working with Laravel and Eloquent, we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Performance"]
featured: false
---

As senior developers working with Laravel and Eloquent, we constantly strive for code that is not only functional but also highly performant. One of the most common performance pitfalls in Eloquent applications stems from eager loading (`with()`). While eager loading is fantastic for avoiding N+1 query problems, it can sometimes lead to over-fetching data when you only need a simple, plain model without any associated relationships.

The question we often face is: How do we retrieve a single model or a collection of models *without* triggering the loading of all those expensive eager relations? Can we simply ask Eloquent for "just the model"?

Let's dive into how we can achieve this efficiently, avoiding the need to build complex custom query builders just for a few specific scenarios.

## The Performance Cost of Eager Loading

When you use `$model->with('relation1', 'relation2')`, Eloquent executes additional queries (usually one or two extra `JOIN`s or separate `SELECT` statements) to fetch the related data alongside the main model. While convenient, if your endpoint only requires the primary data fields and no relational data, this extra overhead wastes database resources and increases memory consumption unnecessarily.

If you only need the base model data—the columns directly associated with that table—we should default to lazy loading or explicit selection to maintain optimal performance.

## The Solution: Retrieving Plain Models Efficiently

While there isn't a direct, built-in method like `Model::noRelations()->all()` in standard Eloquent that magically strips all relations from the query builder layer, we can achieve this goal using two highly effective, developer-friendly patterns: **selecting specific columns** and **using relationship constraints**.

### Method 1: Selecting Only Necessary Columns (The Most Direct Approach)

If you only need the attributes of the primary model itself, you should instruct Eloquent to select *only* those columns. This prevents Eloquent from even attempting to hydrate related models if they aren't explicitly requested.

**Example:** Instead of loading a Post and all its relations when you only need the Post data:

```php
// Inefficient (loads potential relations if $with is set elsewhere):
$post = Post::with('comments')->find(1);

// Efficient (loads only the post's columns, ignoring relations):
$post = Post::select('*')->find(1);
// Or, even more specific:
$post = Post::select('id', 'title', 'content')->find(1);
```

By using `select()`, you are telling the database exactly what data to retrieve. If no relations are explicitly requested via `with()`, Eloquent will fetch only the necessary columns for that single model instance, significantly reducing the payload size. This approach aligns perfectly with Laravel's philosophy of explicit data retrieval.

### Method 2: Controlling Relationships During Retrieval (When Relations *Must* Be Explicitly Controlled)

If you are dealing with a collection and want to ensure no relations are loaded, you can rely on standard query constraints rather than trying to negate eager loading, which is often handled at the model level. For instance, if you fetch a list of users where you know you don't need any related data:

```php
// Fetching only the user models, no eager loading applied.
$users = User::withoutRelations()->get(); // Conceptual usage, see note below.

// Practical implementation focusing on scope control:
$users = User::query()->withNoRelations()->get(); // Hypothetical concept for clarity
```

**A More Robust Alternative (Best Practice):**

Since manipulating the query builder to *remove* relations is often complex and brittle across different Eloquent versions, the most reliable method remains ensuring that your controllers or services only request what they need. If you find yourself needing plain models frequently, consider creating dedicated **Read Models** or **DTOs (Data Transfer Objects)**.

These classes are simple PHP objects that contain only the necessary data, completely decoupling your presentation layer from the complex internal structure of the Eloquent model. This practice keeps your application clean and extremely performant, adhering to high standards seen in frameworks like Laravel.

## Conclusion

The desire to bypass eager loading for specific retrievals is a performance-driven one. While an elegant `Model::noRelations()` method might seem tempting, mastering Eloquent means understanding *why* data is loaded. By defaulting to explicit column selection (`select()`) or structuring your application around Data Transfer Objects, you achieve the goal of retrieving plain models efficiently without introducing messy, bespoke query logic. Focus on precise data requests; this is the key to unlocking truly high-performance Laravel applications.
