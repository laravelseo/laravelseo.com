---
title: "How to create a Eloquent model instance from a raw Object?"
description: "How to Create an Eloquent Model Instance from a Raw Object? Mastering Data Hydration in Laravel As senior developers working with Laravel, we frequently..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

As senior developers working with Laravel, we frequently encounter scenarios where raw database queries yield the necessary data, but we need that data structured within the object-oriented paradigm of Eloquent models. You execute a complex `DB::select()` query, receive a plain PHP `stdClass` object, and now you need to convert this into a fully functional instance of your custom Eloquent model, like `Member`.

This process, known as "data hydration," is fundamental to bridging the gap between raw SQL results and the elegant structure provided by Laravel. Getting this right ensures that your application benefits from Eloquent's magic—mutators, accessors, relationships, and model events—rather than managing plain PHP objects manually.

## The Challenge of Raw Results

When you execute a query like this:

```php
$results = DB::select("SELECT id, name, email FROM members WHERE status = 'active'");
// $results is an array of standard PHP objects (stdClass)
```

The `$results` variable contains raw data. If you simply try to instantiate `new Member($results)`, you run into issues because the Eloquent model expects specific attributes to be set, and manual assignment can easily miss critical setup steps.

## The Best Approach: Hydrating Models Efficiently

The most robust way to convert this raw result set into Eloquent models is by iterating over the results and using the mass assignment capabilities of your models. Since you are dealing with multiple rows, we iterate through each row and create a corresponding model instance for it.

Here is a step-by-step breakdown of the recommended approach:

### Step 1: Define Your Model Structure

Ensure your `Member` model reflects the columns you are selecting. This sets the expectation for how data should be stored and accessed, following Laravel's principles.

```php
// app/Models/Member.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    // Define fillable attributes for mass assignment safety
    protected $fillable = ['id', 'name', 'email'];

    // Optional: Define table name if it deviates from the convention
    // protected $table = 'members';
}
```

### Step 2: Iterate and Create Instances

Use a loop to process each result object. Inside the loop, you can either create new instances or use methods like `firstOrCreate`, depending on your exact requirement. For mapping raw results directly, creating new models is straightforward.

```php
use Illuminate\Support\Facades\DB;
use App\Models\Member;

// Execute the raw query
$results = DB::select("SELECT id, name, email FROM members WHERE status = 'active'");

$memberInstances = [];

foreach ($results as $row) {
    // Create a new Eloquent model instance from the row data
    $member = new Member();

    // Manually assign the attributes from the raw result
    $member->id = $row->id;
    $member->name = $row->name;
    $member->email = $row->email;

    // Save or store the instance
    $memberInstances[] = $member;
}

// $memberInstances now holds an array of fully hydrated Member objects.
```

### Advanced Alternative: Using `hydrate` (When Applicable)

While manual mapping works perfectly, for more complex scenarios involving fetching data that already exists in the database (e.g., using a relationship), Laravel provides methods designed to handle hydration efficiently. For simple raw result mapping from a disconnected query, the loop method above is highly explicit and clear about where the data originates. Remember, understanding how Eloquent interacts with the underlying database is key to mastering Laravel; this connection between the ORM and SQL is central to effective development, just as it is in modern frameworks like **Laravel** itself.

## Conclusion

Converting raw database objects into Eloquent models is a common requirement when performing complex joins or custom queries outside of standard Eloquent methods. The best practice involves iterating through your `DB::select()` results and explicitly mapping the fetched columns to the corresponding attributes of a new model instance. This pattern ensures data integrity, adheres to encapsulation principles, and allows you to leverage all the powerful features that Eloquent provides when working with your application data.
