---
title: "Skip model accessor"
description: "Skip Model Accessor: Mastering Eloquent Readability and Performance As developers working with Laravel, we often leverage Eloquent models to handle complex..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

As developers working with Laravel, we often leverage Eloquent models to handle complex data relationships efficiently. One of the most powerful features of Eloquent is the use of **Accessors** (methods like `getNameAttribute`) to provide a clean, formatted representation of data when it's accessed as an attribute (e.g., `$model->name`).

However, sometimes these accessors become overly complex, embedding intricate business logic that only needs to be executed in specific contexts, leading to performance bottlenecks or unnecessary computation across the application. This post explores how you can "skip" or bypass certain model accessors when you need raw data for specific views, like an administrator panel, without fundamentally breaking your Eloquent setup.

---

## The Pitfall of Complex Accessors

Let's examine the scenario you presented:

```php
public function getNameAttribute($name){
    if($name == 'Eendaags')
        return $this->race_edition->race->name;

    return $this->race_edition->race->name . ' ' . $name;
}
```

This accessor is designed to calculate a combined name based on nested relationships. While elegant for display, if every time you access `$run->name` across the entire application, this logic runs—even when you only need the raw components for administrative sorting or filtering—you are introducing unnecessary overhead. In large applications, this repetitive execution can impact performance.

The core issue isn't that the accessor is *wrong*, but that it forces a specific calculation every time the attribute is read. We need a way to retrieve the necessary data without invoking this complex formatting logic unnecessarily.

## Strategies for Bypassing Accessors

When you need raw data or different formatted data depending on where you are in the application (e.g., frontend display vs. admin backend), there are several superior patterns than trying to modify the accessor itself:

### 1. Use Standard Relation Access Directly

The most straightforward approach is to stop relying solely on the accessor for all data needs. Instead, define methods that retrieve the raw data directly. If you need the basic name and the race name separately in your admin panel, retrieve them explicitly:

```php
// In your controller or service layer
$run = Run::with('race_edition.race')->find($id);

// Accessing related data directly without using the accessor formatting
$baseName = $run->race_edition->race->name; 
$runtimeName = $run->name; // Assuming 'name' is a direct attribute or simpler retrieval
```

This pattern keeps your model focused on defining relationships, and the presentation logic remains in the controller layer where it belongs. This aligns perfectly with clean design principles advocated by modern Laravel development.

### 2. Employ Mutators for Saving vs. Getters for Reading

If the accessor's primary purpose is *formatting* data for display (reading), ensure that your **Mutators** (methods used when saving data) remain separate and handle persistence logic only. If you need to store the raw, unformatted name somewhere in the database for simpler queries, consider adding a dedicated column for it.

### 3. Conditional Logic within Accessors (If Necessary)

If you absolutely must keep the accessor structure, ensure the conditional logic is as lean as possible. For highly complex scenarios where data retrieval complexity is unavoidable, some developers opt to use more advanced tools like **Query Scopes** or **Model Events** rather than overloading accessors with deep relationship chaining. Remember that Eloquent provides powerful tools for building robust applications, and understanding how these components interact is key to maximizing efficiency, much like exploring the extensive documentation available at https://laravelcompany.com.

## Conclusion

Skipping an accessor isn't about deleting code; it’s about optimizing data retrieval strategies. For your use case—needing raw names for an administrator interface while the model provides a formatted name for the public view—the best practice is to avoid running complex formatting logic everywhere. By retrieving the necessary components directly using Eloquent relationships, you maintain separation of concerns, improve query efficiency, and result in code that is easier to maintain and scale. Focus on *what* data you need, and let your controllers handle *how* that data is presented.
