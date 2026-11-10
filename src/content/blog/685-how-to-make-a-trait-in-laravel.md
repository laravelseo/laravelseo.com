---
title: "How to make a Trait in Laravel"
description: "Title: Efficiently Managing Dates Using Traits in Laravel Models Introduction As you might already know, Laravel is an elegant framework built on the Symfony..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Efficiently Managing Dates Using Traits in Laravel Models

Introduction

As you might already know, Laravel is an elegant framework built on the Symfony library that simplifies development and encourages best practices. One of its most powerful features is the use of traits to group common functionality that can be shared among classes. In this blog post, we'll learn how to create a trait for formatting dates in your application. We'll cover where to place the file, how to utilize it within your Laravel models, and implement the actual trait with examples.

Creating the Trait File

First things first: let's create a new PHP file named "DatesFormatter.php" inside your app/Traits directory. This will house all our date formatting functionality that can be incorporated into various applications. Note that you may have specific naming conventions for files and directories in your project, so adjust accordingly.

Implementing the Trait

The trait we're building will provide functionality for transforming dates to a custom format as required by our application. This example will handle creating and updating timestamps, along with deleted-at date fields. Here is the content of the "DatesFormatter.php" file:

<pre><code>trait DatesFormatter
{
    protected $newDateFormat = 'd.m.Y H:i';


    // save the date in UTC format in DB table
    public function setCreatedAtAttribute($date){

        $this->attributes['created_at'] = Carbon::parse($date);

    }

    // convert the UTC format to my format
    public function getCreatedAtAttribute($date){

        return Carbon::parse($date)->format($this->newDateFormat);

    }

    // save the date in UTC format in DB table
    public function setUpdatedAtAttribute($date){

        $this->attributes['updated_at'] = Carbon::parse($date);

    }

    // convert the UTC format to my format
    public function getUpdatedAtAttribute($date){

        return Carbon::parse($date)->format($this->newDateFormat);

    }

    // save the date in UTC format in DB table
    public function setDeletedAtAttribute($date){

        $this->attributes['deleted_at'] = Carbon::parse($date);

    }

    // convert the UTC format to my format
    public function getDeletedAtAttribute($date){

        return Carbon::parse($date)->format($this->newDateFormat);

    }
}
</code></pre>

Applying it on a Model Class

Now that you have your trait, let's make use of it in a Laravel model class. For this example, we'll utilize the User model, as it usually contains timestamps and deleted-at fields:

<pre><code>namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DatesFormatter;

class User extends Model
{
    use DatesFormatter;

    protected $table = 'users';

    // other custom model functionality can be added here...
}
</code></pre>

This example demonstrates how to apply the trait to a User model by importing it and adding "use DatesFormatter;" within your class. The Laravel trait system is flexible enough to allow you to include multiple traits, so you can combine them for maximum functionality.

Conclusion

In this blog post, we have learned how to create a trait for formatting dates in your Laravel application. We covered where to store the trait file and how to utilize it within model classes. By following these guidelines, you can improve your codebase's maintainability and efficiency while streamlining date management across multiple applications. For more information on this topic or other advanced Laravel development issues, please visit our website at https://laravelcompany.com.
