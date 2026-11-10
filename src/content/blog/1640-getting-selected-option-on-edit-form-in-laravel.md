---
title: "Getting selected option on edit form in laravel"
description: "Getting Selected Option on Edit Form in Laravel One of the most common issues when creating forms in Laravel is how to show the selected values for dropdowns..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP"]
featured: false
---

Getting Selected Option on Edit Form in Laravel

One of the most common issues when creating forms in Laravel is how to show the selected values for dropdowns or select boxes. This problem usually arises because by default, your form will display all options from the available data set instead of showing only the items that have been previously chosen by the users on the edit page.

To achieve this, you need first to understand how Laravel forms work with select elements and the concept of selecting values. In the given example above, you're using the built-in Blade syntax for handling forms in Laravel where you can define a dropdown as:

<select class="form-control" id="type" name="quantity">
  <option value="" selected>Select Quantity</option>
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
  <option value="5">5</option>
</select>

Here, the first option is selected by default, but this is not always what you want. You may need to show the actual previously chosen value for that field. Let's dive deeper into how you can achieve this:

1. Fetch the form data from your model or database: Since Laravel uses Eloquent models, you must first query the existing record based on its id before showing it in the edit view. This will give you access to all the data needed for the form, including the selected values of other fields.

```php
$order = Order::find($order_id);
```

2. Use the Laravel Form Helpers: In your view template, use Laravel's built-in Form helpers to generate HTML forms and input elements. These can be used to create select boxes based on your model data.

3. Dynamically Populate the Select Options: To display the selected option in your dropdown, you can dynamically populate the list of options by iterating over your product records and checking if their quantity matches the current order's quantity. This way, you ensure that only relevant options are shown in the select element.

```php
<?php foreach($products as $product): ?>
  <?php if ($order->quantity == $product->quantity): ?>
    <option value="{{ $product->id }}" selected>{{ $product->name }}</option>
  <?php else: ?>
    <option value="{{ $product->id }}">{{ $product->name }}</option>
  <?php endif; ?>
<?php endforeach; ?>
```

4. Conclusion: By following these steps, you can effortlessly display the selected option for a select element on your edit form in Laravel. Remember to always test and debug your code to ensure that everything works as intended. If your select box is based on an Eloquent model relationship, it's recommended to use eager loading to reduce database queries. Overall, this approach guarantees a better user experience by showing the previously selected values for each field in your form.
