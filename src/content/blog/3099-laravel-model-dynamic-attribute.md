---
title: "Laravel Model Dynamic Attribute"
description: "Mastering Dynamic Attributes in Laravel Models: Accessing Data from JSON Columns As developers working with flexible data structures, the need to handle..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML"]
featured: false
---

As developers working with flexible data structures, the need to handle dynamic attributes—data that changes frequently or is defined at runtime—is constant. When you store complex, variable information in a single database column, like a JSON field, the challenge shifts from simple CRUD operations to efficiently mapping that raw data back into clean, object-oriented properties within your Eloquent Model.

This post dives deep into how you can achieve dynamic attribute access on a Laravel Model when the actual field definitions are stored as a JSON array in the database.

## The Scenario: Dynamic Data in a Single Column

Let's start with the specific scenario you presented. We have a `materials` table where the details of each material (like color, description, reference number) are stored within a single `dynamic_fields` column as a JSON string.

```sql
Schema::create('materials', function (Blueprint $table) {
    $table->increments('id');
    $table->string('sp_number');
    $table->string('factory');
    $table->text('dynamic_fields')->comment('All description of the material will saved as json');
    $table->timestamps();
});
```

The JSON structure looks like this for a specific record:

```json
[
  { "name": "COLOR WAY", "value": "ASDFF12" },
  { "name": "DESCRIPTION", "value": "agg2sd12" },
  { "name": "REF NUM", "value": "121312" }
]
```

The goal is to be able to access these values directly on the model instance, for example, `$material->color_way`, without writing complex manual JSON parsing logic every single time.

## The Solution: Using Eloquent Accessors

Since standard Eloquent casting doesn't automatically transform an array of objects into direct properties, the most robust and clean solution is to implement custom **Accessors** within your Model. Accessors allow you to define methods that Eloquent calls whenever you try to read a specific attribute from the model, allowing us to handle the complex JSON parsing internally.

This approach keeps the data access logic encapsulated within the Model, adhering to the principles of clean separation of concerns advocated by frameworks like Laravel and the principles discussed on [laravelcompany.com](https://laravelcompany.com).

### Step 1: Define the Model Structure

In your `Material` model, you will define methods that inspect the `dynamic_fields` JSON column and extract the desired value based on the field name.

```php
// app/Models/Material.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    /**
     * The path to the dynamic fields JSON column.
     */
    protected $dynamicFieldsKey = 'dynamic_fields';

    /**
     * Custom accessor to retrieve a specific dynamic field value.
     *
     * @param string $attribute The name of the field to retrieve (e.g., 'color_way').
     * @return mixed The extracted value or null if not found.
     */
    public function get
