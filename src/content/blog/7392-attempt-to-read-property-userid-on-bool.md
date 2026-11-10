---
title: "Attempt to read property \"userID\" on bool"
description: "Mastering Eloquent: Solving the \"Attempt to read property on bool\" Error in Laravel Deletions As a senior developer, I often encounter frustrating runtime..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I often encounter frustrating runtime errors that seem arbitrary but stem from subtle misunderstandings of how object-oriented frameworks like Laravel and Eloquent handle data. The error you are facing—`Attempt to read property "userID" on bool`—is a classic symptom of attempting to access a property on a variable that holds a boolean value (`true` or `false`) instead of an expected object, string, or integer.

This issue commonly arises in scenarios involving database operations where data retrieval might fail, leading to `null` values being implicitly cast or misinterpreted when used in presentation layers like Blade templates.

In this post, we will diagnose exactly why this happens in your Laravel application, review the provided code snippets, and implement robust solutions using best practices to ensure your application remains stable and predictable.

---

## Understanding the Root Cause: Why Booleans Appear

The error occurs when you try to execute `$review->userID` but `$review` is not an Eloquent model instance; rather, it is `null`, or in some specific contexts, a boolean value was returned where an object was expected.

In your scenario, the most likely cause is that during the deletion process, the query executed by the controller (`Doctor_review::where(...)`) failed to find a matching record. When `first()` is called on a query that returns no results, it returns `null`. If you pass this `null` value directly into the view layer without checking for its existence, PHP or Blade attempts to treat `null` as an object property, resulting in the fatal error: "Attempt to read property on bool" (since `null` is often treated loosely in type juggling).

Let's look at your setup:

```php
// In your controller:
public function deletereview(Request $request){
    $review = Doctor_review::where('doctorReviewID', $request->doctorReviewID)->first(); // $review might be null here
    return view('admin.docreviews')->with('doctor_reviews', $review);
}
```

If no record is found, `$review` becomes `null`. When you iterate in the Blade file:

```blade
{{$review->userID}} 
```

If `$review` is `null`, this line triggers the error because you cannot read the property `userID` from a non-object.

## Practical Solution: Defensive Coding with Null Checks

The solution is to implement defensive programming. Before attempting to access any properties on an Eloquent model instance, you must verify that the instance actually exists. This practice is fundamental when working with database results in Laravel and aligns perfectly with the principles taught by resources like [laravelcompany.com](https://laravelcompany.com).

### 1. Fixing the Blade View (The Immediate Fix)

You must check if `$review` is not null before accessing its properties. We can use the null-safe operator (`?->`) introduced in modern PHP, or a simple `if` statement. Using the null-safe operator is cleaner for this specific task:

**Before (Error-Prone):**
```blade
<td>{{$review->userID}}</td>
```

**After (Safe Implementation):**
```blade
@foreach($doctor_reviews as $review)
    <tr>
        {{-- Use the null-safe operator to safely access properties --}}
        <td>{{ $review?->userID ?? 'N/A' }}</td> 
        <td>{{ $review?->doctorID ?? 'N/A' }}</td>
        <td>{{ $review?->description ?? '' }}</td>
        <td>{{ $review?->point ?? 'N/A' }}</td>
        <td class="text-right"><a href="/deletereview/{{$review->doctorReviewID}}">Delete</a></td>
    </tr>
@endforeach
```

By using the null-safe operator (`?->`), if `$review` is `null`, the expression short-circuits and returns `null` instead of throwing an error. We then use the null coalescing operator (`??`) to provide a fallback value (like `'N/A'` or an empty string) if the property doesn't exist or if the object itself is missing.

### 2. Ensuring Data Integrity in the Controller

While the Blade fix solves the display issue, it’s good practice to ensure your controller handles potential failures gracefully. If you are fetching a single record for deletion, you should explicitly handle the case where it doesn't exist.

For example, if `$review` is null, you might want to redirect the user back with an error message instead of trying to pass `null` data to the view:

```php
public function deletereview(Request $request){
    $review = Doctor_review::where('doctorReviewID', $request->doctorReviewID)->first();

    if (!$review) {
        // Handle the case where the review was not found
        return redirect()->route('docreviews')->with('error', 'Review not found.');
    }

    // If found, proceed with deletion or display logic
    return view('admin.docreviews')->with('review', $review);
}
```

## Conclusion

The "Attempt to read property on bool" error is a powerful reminder that data flow must be rigorously checked at every layer of your application—from the database query all the way up to the presentation layer. By adopting defensive coding techniques, specifically checking for `null` values in Eloquent results before accessing properties, you move from fragile code to robust, production-ready Laravel applications. Always prioritize validation and null checks; it is a cornerstone of scalable development, whether you are building complex systems or implementing simple CRUD operations on platforms like those offered by [laravelcompany.com](https://laravelcompany.com).
