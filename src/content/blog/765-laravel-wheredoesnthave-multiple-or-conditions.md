---
title: "Laravel whereDoesntHave() - multiple OR conditions"
description: "Title: Achieving Multiple OR Conditions with Laravel's whereDoesntHave() Method Body: In Laravel 4.2, you have a model called Product with many to many..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

Title: Achieving Multiple OR Conditions with Laravel's whereDoesntHave() Method

Body:

In Laravel 4.2, you have a model called Product with many-to-many relationships to other models like Country or Category. You want to filter out products that are incomplete, which means they have no connected countries or no connected categories. One approach is using the whereDoesntHave() method provided by Laravel, but since it operates on an AND condition when you employ it multiple times simultaneously, you face a challenge.

Firstly, there's no orWhereDoesntHave() method defined in Laravel's API documentation, and attempting to use multiple relations as arguments will not work either. The first argument is expected to be a string instead of an array containing multiple relations. So, to achieve the desired functionality, we can take advantage of the whereNotIn() method.

The idea behind this approach is that you will invert the given relationships and then filter out products with those connections using the whereNotIn() method. Here's how it could work for countries:

1. First, add a hidden country_id column to your Product model migration file. This will allow you to map product and country connection:

   ```php
    Schema::table('products', function($table) {
       $table->integer('country_id')->nullable();
       ...
    });
   ```

2. In the Product model, define a new virtual getter for countries to access all connected countries. This is needed because we can't pass an array of relations in whereDoesntHave() but a string.

   ```php
   public function countries() {
       return $this->belongsToMany(Country::class)->withTimestamps();
   }

   public function getCountriesAttribute() {
      return $this->countries()->pluck('id') ?? [];
   }
   ```

3. Reverse the connection between Product and Country models by adding a hidden product_id column in your Country model migration file:

   ```php
    Schema::table('countries', function($table) {
       $table->integer('product_id')->nullable();
       ...
    });
   ```

4. In your Country model, define the inverse relationship and a virtual getter for products. The product_id is automatically set when establishing the connection between Product and Country models:

   ```php
   public function inversedProducts() {
     return $this->belongsToMany(Product::class)->withTimestamps();
   }

   public function getInversedProductsAttribute() {
      return $this->inversedProducts()->pluck('id') ?? [];
   }
   ```

5. Now that you have inverse relationships, you can filter out incomplete products with whereNotIn(). The country_ids list should contain all existing country ids:

   ```php
   // Assuming $countryIds is an array of existing country IDs
   $products = Product::where('country_id', '!=', $countryIds)
      ->orWhere('categories', 'whereDoesntHave', 'countries')
      ->get();
   ```

In this manner, you can create a similar approach for categories by adding an inverse relationship and a virtual getter for products in your Category model. By connecting the hidden columns between models, you can use the whereNotIn() method to filter out products with connected countries or categories while preserving the original many-to-many relationships.

To summarize, Laravel's whereDoesntHave() does not natively support OR conditions for multiple relations but can be addressed by utilizing inverse relationships and the whereNotIn() method along with clever coding techniques. With this approach, it is possible to filter out products that lack connections without affecting the existing database schema.
