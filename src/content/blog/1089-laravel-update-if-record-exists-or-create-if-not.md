---
title: "Laravel Update if record exists or Create if not"
description: "Title: Efficiently Handling Record Updates and Creation in Laravel Using Eloquent Models Body: Laravel's powerful eloquent models make managing database..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Efficiently Handling Record Updates and Creation in Laravel Using Eloquent Models

Body:

Laravel's powerful eloquent models make managing database interactions incredibly efficient. If you find yourself repeatedly writing a similar pattern of code to update records when they exist, or create new ones if they don't, this can quickly become tedious and error-prone. In this blog post, we will explore how to use Laravel's eloquent models effectively, with the goal of making your code shorter while maintaining its functionality.

First off, let's establish the relationship between MerchantBranch and MerchantBranchToken using Eloquent model definitions:

1. Create a MerchantBranch.php file in your project's app/MerchantBranch.php directory with the following definition:
   ```php
   public function token() {
       return $this->hasOne('App\MerchantBranchToken');
   }
   ```
   2. Next, create a MerchantBranchToken.php file in your project's app/MerchantBranchToken.php directory with the following definition:
   ```php
   public function merchant_branch() {
       return $this->belongsTo('App\MerchantBranch');
   }
   ```

This setup allows you to easily manage the relationship between the two models. You can get the related MerchantBranchToken object by calling a MerchantBranch model instance's token() method or access it directly using its id through the belongsTo() function on the MerchantBranchToken model instance.

Now let's write some code that automatically updates an existing record if it exists, or creates a new one if not. We will use the code you already have as a base:

```php
$find = MerchantBranchToken::find($id);

if (!$find) {
    $branch = new MerchantBranchToken(['token' => $token]);
    MerchantBranch::find($id)->token()->save($branch);
} else {
    $find->token = $token;
    $find->save();
}
```

Although your code works perfectly, it can be shortened slightly and improved with the use of Laravel's updateOrCreate() method. This method will attempt to find an existing MerchantBranchToken record with the given id and, if it exists, it will perform an update on that specific row. If no matching record is found, it will create a new one using the provided array of attributes.

To implement this, your code would look like this:
```php
MerchantBranchToken::updateOrCreate(
    ['id' => $id], // Specify conditions for updating an existing record
    ['token' => $token] // Attributes to update or create if not found
);
```

By utilizing the updateOrCreate() method, you can save a few lines of code while maintaining the functionality. However, keep in mind that the foreign key 'merchant_branch_id' will need to be specified as fillable in your MerchantBranchToken model if it was not already. You can do this by adding 'merchant_branch_id' to the $fillable array on your MerchantBranchToken model class:
```php
protected $fillable = ['token', 'merchant_branch_id'];
```

Remember, always consider using eloquent models when working with database interactions. They will save you time and effort in the long run by reducing code duplication and helping to keep your application organized and concise.
