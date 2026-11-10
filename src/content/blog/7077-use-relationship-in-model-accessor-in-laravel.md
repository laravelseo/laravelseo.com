---
title: "use relationship in model accessor in laravel"
description: "Mastering Nested Accessors: Solving the \"Trying to get property of non object\" Error in Laravel Models As senior developers working with the Eloquent ORM, we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers working with the Eloquent ORM, we frequently deal with complex data structures where relationships are nested. Creating custom accessors that pull data from related models is a powerful way to present clean, aggregated information to the view layer. However, this complexity often introduces subtle bugs, such as the `ErrorException: Trying to get property of non-object` error you encountered when trying to build a `teacher_name` accessor on your `Course` model.

This post will dissect the exact cause of this common issue and provide a robust, idiomatic Laravel solution for correctly chaining relationships within model accessors.

## The Setup: Understanding the Relationship Chain

You have set up a classic one-to-many relationship between `User` (teacher) and `Course`.

**The Models:**

*   **`User` Model:** Provides a `getFullNameAttribute()` accessor.
*   **`Course` Model:** Has a `belongsTo('App\User', 'teacher', 'user_id')` relationship defined, and attempts to create a `getTeacherNameAttribute()`.

The goal is for the `Course` model to fetch the teacher's full name by navigating through the relationship: `Course -> teacher (User) -> full_name`.

## The Problem: Why the Error Occurs

The error `Trying to get property of non-object` occurs because of how you are attempting to chain the relationship calls inside your accessor method:

```php
// Faulty code snippet from Course model:
public function getTeacherNameAttribute ()
{
    $this->attributes['teacher_name'] = $this->teacher()->first()->full_name;
}
```

When you call `$this->teacher()`, Eloquent attempts to fetch the related `User` model. If that relationship is not loaded (i.e., if it's a lazy load and hasn't been resolved yet, or if the foreign key is missing), the result might be `null`. Attempting to call methods like `->first()` or accessing properties on a `null` result throws the fatal error because you are trying to treat `null` as an object.

The use of `->first()` was also incorrect here; since `belongsTo` returns a single related model, it should be accessed directly.

## The Solution: Correctly Navigating Eloquent Relationships

The key to solving this lies in ensuring safe navigation and correctly chaining the relationship calls. We must add null checks to prevent runtime errors when a course might not have an assigned teacher.

Here is the corrected implementation for your `Course` model:

```php
class Course extends Model
{    
    public $primaryKey = 'course_id';
    protected $appends  = ['teacher_name'];

    /**
     * Accessor to retrieve the teacher's full name.
     */
    public function getTeacherNameAttribute ()
    {
        // 1. Safely retrieve the related User model via the 'teacher' relationship.
        $teacher = $this->teacher;

        // 2. Check if the teacher exists before attempting to access their properties.
        if ($teacher) {
            // 3. Access the full_name accessor on the retrieved User object.
            $this->attributes['teacher_name'] = $teacher->full_name;
        } else {
            // Handle the case where there is no teacher assigned.
            $this->attributes['teacher_name'] = 'N/A';
        }
    }

    /**
     * Relationship definition.
     */
    public function teacher ()
    {
        return $this->belongsTo('App\User', 'teacher', 'user_id');
    }
}
```

### Best Practice: Leveraging Eager Loading

While the above solution fixes the immediate error, it's crucial to remember that performance is just as important as correctness. If you are fetching many courses and need their teacher names, calculating these accessors repeatedly can lead to N+1 query issues.

The best practice in Laravel, as promoted by the team at [Laravel Company](https://laravelcompany.com), is **eager loading**. When fetching your courses, load the `teacher` relationship immediately:

```php
// In your controller or service layer:
$courses = Course::with('teacher')->get();
```

By eager loading, you fetch all necessary teacher data in one or two optimized queries, ensuring that when your accessors run, the related model is already present in memory, making the accessor logic cleaner and significantly boosting performance.

## Conclusion

Dealing with nested relationships and custom accessors requires a developer mindset focused on object state and null safety. The error stemmed from assuming a relationship would always yield an object, which is rarely true in database operations. By explicitly checking if the related model exists before attempting to chain further property access, you transform a runtime error into robust, predictable application logic. Always prioritize safe navigation when working with Eloquent relationships to build resilient applications.
