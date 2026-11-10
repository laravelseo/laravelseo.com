---
title: "Include model relationships in json response using Eloquent and Laravel 5"
description: "Including Model Relationships in JSON Responses: Mastering Eloquent Accessors As developers working with Laravel and Eloquent, one of the most common tasks..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with Laravel and Eloquent, one of the most common tasks is transforming complex database relationships into clean, usable JSON responses. When you have nested models, simply dumping the model usually only returns foreign keys or basic IDs. The challenge arises when you need to transform that relationship data (e.g., turning an ID into a descriptive string) directly within the serialization process.

This post dives into a specific scenario involving Eloquent relationships where you want to replace a simple foreign key reference in your JSON output with the actual related data—effectively enriching your API responses without complex manual query building every time. We will solve the problem of converting an integer ID reference into a descriptive string from a related table.

## The Scenario: Transforming Foreign Keys in JSON

Let’s examine the setup you described. You have an `Upload` model that relates to a `Mime` model (which contains the file type). Your database structure links them via an ID:

*   **`uploads` table:** Contains `filename`, `serverPath`, and an integer column `mime` (which is the foreign key referencing `mimes.id`).
*   **`mimes` table:** Contains `id` and `type` (e.g., `image/jpeg`).

When you serialize the `Upload` model, Eloquent sees the relationship defined:

```php
public function mime() {
    return $this->hasOne('App\Models\Mime', 'mime');
}
```

And if you rely on standard serialization methods, it defaults to including the foreign key value stored in the `mime` column, resulting in output like `"mime": "92"`. Your goal is to have this field return the actual type, `"image/jpeg"`.

## The Eloquent Solution: Using Accessors for Custom Formatting

While `$appends` is excellent for adding static, pre-calculated attributes directly to the model's array representation, it doesn't inherently handle dynamic relationships or complex transformations of related models. For this kind of dynamic data formatting, the most robust and idiomatic Laravel approach is to use **Model Accessors**.

Accessors allow you to define methods on your model that retrieve and format data, which Eloquent automatically includes when the model is cast to an array or JSON.

### Step 1: Define the Accessor in the Model

We will add a method to the `Upload` model to fetch the related `Mime` record and return its `type`.

```php
<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Upload extends Model {

    protected $table = 'uploads';
    protected $hidden = array('id', 'user', 'created_at', 'updated_at');

    public function mime() {
        return $this->hasOne('App\Models\Mime', 'mime');
    }

    /**
     * Get the MIME type as a string instead of the ID.
     *
     * @return string|null
     */
    public function mimeTypeAttribute()
    {
        // Access the relationship and return the '
