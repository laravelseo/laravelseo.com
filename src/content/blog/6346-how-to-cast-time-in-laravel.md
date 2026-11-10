---
title: "How to cast time in Laravel?"
description: "How to Cast Time in Laravel: Mastering Database Time Formats As a senior developer working with Eloquent and Laravel, you frequently encounter scenarios..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with Eloquent and Laravel, you frequently encounter scenarios where you need to manage how time data is stored, retrieved, and displayed. A common challenge arises when dealing with database `TIME` columns—specifically, casting a full timestamp format (like `08:00:00`) into a simplified string format (like `H:i`).

This post will dive deep into how to handle time casting in Laravel effectively, focusing on practical solutions without relying solely on complex mutators.

## The Challenge: Casting Database TIME Fields

You are trying to achieve a specific transformation: taking a database time value and representing it as just the hour and minute (e.g., casting `08:00:00` to `08:00`). You want this logic handled within your Eloquent model's `$casts` property, avoiding the verbose setup of custom accessor or mutator methods.

The core issue is that standard Eloquent casting primarily handles type conversion (e.g., string to integer, or string to Carbon date objects). While Laravel seamlessly integrates with Carbon for date/time management, directly forcing a specific string format upon retrieval often requires post-processing.

Your migration setup using the `time` type is correct:

```php
$table->time('opens')->nullable();
$table->time('closes')->nullable();
```

When Eloquent retrieves this data, it fetches a Carbon instance or a standard string representation depending on the underlying database driver and configuration.

## Solution 1: Leveraging Carbon for Formatting (The Recommended Approach)

Since the goal is often presentation-focused—displaying the time in a specific format—the most robust Laravel pattern involves letting Eloquent fetch the raw time information and then formatting it using Carbon's powerful methods *after* retrieval, rather than trying to force a complex cast on the database column itself.

If you define your model attributes as standard `time` or `datetime`, Laravel handles the initial conversion to a Carbon object automatically. You can then apply custom formatting in your controller or view layer.

### Example Implementation

In your Eloquent Model:

```php
// app/Models/YourModel.php
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class YourModel extends Model
{
    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        // Casting the time fields as Carbon objects ensures they are manipulable.
        'opens' => 'datetime', // Or 'time' if your setup supports it directly
        'closes' => 'datetime',
    ];

    // ... other model code
}
```

When you retrieve the data:

```php
$record = YourModel::find(1);

// The $casts ensures these are Carbon objects, ready for formatting.
$opensTime = $record->opens; 

// Now, format it exactly how you need it in your presentation layer
$formattedTime = $opensTime ? $opensTime->format('H:i') : null; 
// Result: "08:00" (if the database stored time correctly)
```

This approach keeps your model clean and adheres to Laravel's conventions. For deeper integration with date/time operations, understanding how Eloquent interacts with Carbon is crucial, as detailed in resources from [laravelcompany.com](https://laravelcompany.com).

## Solution 2: Using Accessors for Specific Formatting (The Control Method)

If you absolutely require the time to be cast into a specific string format *directly* onto the model object upon retrieval—without manual formatting in every view—the most idiomatic Eloquent way is to use an **Accessor**. While you asked to avoid mutators, accessors are fundamentally different: they read data from the model and return a computed value, rather than modifying the attribute itself.

This gives you granular control over the output format while keeping the core database storage untouched.

```php
// app/Models/YourModel.php
use Illuminate\Database\Eloquent\Casts\Attribute;

class YourModel extends Model
{
    /**
     * Get the opens time formatted as H:i.
     */
    public function opens(): Attribute
    {
        return Attribute::get(function () {
            // Ensure the attribute is treated as a Carbon object first
            if ($this->attributes['opens'] instanceof \Carbon\Carbon) {
                return $this->attributes['opens']->format('H:i');
            }
            return null;
        });
    }

    /**
     * Get the closes time formatted as H:i.
     */
    public function closes(): Attribute
    {
        return Attribute::get(function () {
            if ($this->attributes['closes'] instanceof \Carbon\Carbon) {
                return $this->attributes['closes']->format('H:i');
            }
            return null;
        });
    }
}
```

By using the `Attribute` class (available since Laravel 9), you define a computed property that runs every time the model is accessed, fulfilling your requirement for custom casting logic directly within the model structure. This keeps presentation logic close to the data it describes, which aligns perfectly with good object-oriented design principles advocated by [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Casting a database `TIME` field into a specific string format in Laravel is less about a single `$casts` declaration and more about choosing the right tool for the job:

1.  **For data manipulation:** Use standard Eloquent casting (`datetime`) to ensure you are working with proper Carbon objects.
2.  **For presentation formatting:** Post-process the resulting Carbon object in your controllers or views using methods like `format('H:i')`.
3.  **For required custom string output:** Utilize **Accessors** (using Laravel 9+ `Attribute` classes) to compute the desired string format directly on the model, keeping your presentation logic encapsulated within the model itself.

By combining these techniques, you achieve clean, maintainable, and highly flexible time management in your Laravel application.
