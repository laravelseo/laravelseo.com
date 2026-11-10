---
title: "Is there a way to extend a trait in PHP?"
description: "Title: Extending Traits in PHP: Adding New Functionality to Existing Traits Body: In order to utilize existing functionality of a trait, create additional..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Extending Traits in PHP: Adding New Functionality to Existing Traits

Body: In order to utilize existing functionality of a trait, create additional customizations, and later apply it on classes, you can extend an existing trait to achieve the specific goal that you initially envisioned. This process involves creating your own customized trait by extending another trait, as well as modifying its features for more efficient use in your applications. In this blog post, we'll discuss how to create a new 'SaveWithHistory' trait, which will implement soft deletes with a copy of the record and an added field called 'record_made_by_user_id'.

Firstly, let's examine the Laravel SoftDeletes trait. This trait is built into Laravel 5.2+ and makes it easy to manage records that are deleted from your database. The trait provides a set of utility methods for working with soft-deleted data. It includes:

1. 'boot()' - Called when the trait is used in a model class, which adds a static method called 'withoutGlobalScopes()' to the parent class.
2. 'getTable()' - Returns the name of the table associated with the model.
3. 'restore($model)' - Restores a soft-deleted record.
4. 'forceDelete()' - Permanently deletes a model, including its relations.
5. 'onlyTrashed()' - Filters the query to only return soft-deleted records.
6. 'withTrashed()' - Includes both active and deleted records in the query results.
7. 'trash($model)' - Sets the 'deleted_at' field on a model to the current time, marking it as deleted.
8. 'getModel()' - Returns the Laravel model class that is extending this trait.

Now let's extend the Laravel SoftDeletes trait with the SaveWithHistory functionality and the additional record_made_by_user_id field. Here is an example of how you can do it:

Create a new custom trait called "SaveWithHistory":
```php
<?php
namespace App\Traits;

use Illuminate\Database\Eloquent\Builder as Builder;
use Illuminate\Database\Query\JoinClause;

trait SaveWithHistory {
    //... Existing SoftDeletes trait implementation goes here...

    protected function createCopyOnDelete() {
        // Create a copy of the record before deleting it.
        $this->copyModel();

        return true;
    }

    /**
     * Add a field to indicate who made the record.
     */
    private function saveMadeByUser($user_id) {
        // Set the value of 'record_made_by_user_id' as passed parameter.
        $this->setAttribute('record_made_by_user_id', $user_id);
    }

    /**
     * Copy the model data to a new record.
     */
    private function copyModel() {
        // Create a new instance of the model and set its attributes based on the original record.
        $copy = static::create([
            'name' => $this->name,
            // Set other attributes from the original record as needed...
        ]);

        return $copy;
    }
}
```

Now that you have created your customized trait, follow these steps to make use of it in a model:

1. Instruct the Laravel SoftDeletes trait:
   Add the trait 'SoftDeletes' on your model class.

2. Add your new trait:
   Include the 'SaveWithHistory' trait in your model along with the 'SoftDeletes'.
   
3. Modify the model's 'boot()' method:
   Override the 'boot()' method from Laravel SoftDeletes trait and add your own custom code for creating a copy of the record before deletion (the 'createCopyOnDelete') and saving the made_by_user_id value (the 'saveMadeByUser' function). This ensures that the new functionality will be triggered when the SoftDeletes trait is used in your model class.

With these steps implemented, all you need to do is use the model in your application as usual. Remember, your new trait will now support both standard soft deletions and the 'SaveWithHistory' feature. You can easily test the functionality by creating a new record, soft-deleting it along with the copy created during deletion, and checking that the 'record_made_by_user_id' field has been set appropriately.

Keep in mind that extending traits is an efficient solution when you want to apply a specific functional extension on top of existing traits, as it allows for code reuse and better organization. However, ensure not to create unnecessarily convoluted trait hierarchies, as this might lead to confusion about the intended functionality. For more information on how to effectively extend traits in PHP, check out our Laravel Company blog or contact us at https://laravelcompany.com/ for expert advice and custom software development services.
