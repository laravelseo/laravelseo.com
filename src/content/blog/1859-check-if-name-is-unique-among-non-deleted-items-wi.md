---
title: "Check if name is unique among non-deleted items with laravel validation"
description: "Title: Checking Uniqueness of Names Among Non Deleted Items with Laravel Validation Body: In your form, you're making sure that a name for an item is unique..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Checking Uniqueness of Names Among Non-Deleted Items with Laravel Validation

Body:

In your form, you're making sure that a name for an item is unique for a specific project by checking for uniqueness using validation rules in Laravel. However, the challenge you face is ensuring this same level of uniqueness for non-deleted items as well. This blog post aims to discuss how to achieve that with Laravel and demonstrate some related code examples.

First, let's understand the current situation: You need to check name uniqueness in your project while soft deleting items rather than hard deleting them. A soft delete means that records are marked as deleted but still remain in the database; this enables you to restore them if needed. However, you want to ensure that names should be unique even when they have been soft-deleted.

To solve this problem, we will work on adding a validation rule which checks for uniqueness among non-deleted items. Here's how you can proceed:

1. Create a new migration to add a 'soft_deleted' column to the table containing the names (e.g., versions). Make sure to set its default value as 0 for new records and update existing ones accordingly:

   ```php
   Schema::table('yourTable', function($table) {
       $table->boolean('soft_deleted')->default(false);
   });
   ```

2. In the 'versions' table, add a virtual column 'is_active' which will tell whether or not an item is active:

   ```php
   Schema::table('yourTable', function($table) {
       $table->boolean('is_active'); // Add this line after the soft_deleted one
   });
   ```

3. Update your model for the table to include 'soft_deleted' and 'is_active':

   ```php
   class Version extends Model
   {
       protected $fillable = [
           'name',
           'project_id',
           '...other columns...'
       ];

       // Add these columns in the model:
       protected $casts = [
           'soft_deleted' => 'boolean',
           'is_active' => 'boolean'
       ];
   }
    ```

4. Modify your validation rule to check for uniqueness among non-deleted and active items only:

   ```php
   'name' => 'required|min:1|unique:versions,name,NULL,id,project_id,'.$project->id.'|active',
   ```

5. Add a new rule 'active' in your validation ruleset to define its logic:

   ```php
   public function getActiveAttribute($value) {
       return !is_null($this->attributes['soft_deleted']) ? false : true;
   }

   Validator::extend('active', function($attribute, $value, $params) {
       // Check if the item is active by its soft-delete state: not soft deleted and not deleted
       return !is_null(request()->input('soft_deleted')) ? false : (request()->input('soft_deleted') == 0);
   });
   ```

6. Finally, update your controller or request class to include the 'active' check in the validation process:

   ```php
   $rules = [
       'name' => 'required|min:1|unique:versions,name,NULL,id,project_id,'.$project->id.'|active',
       '...other rules...'
   ];

   $validator = Validator::make($request->all(), $rules);
   ```

Now, your validation rule will check for the uniqueness of names among non-deleted and active items only. This ensures that your project data remains consistent while maintaining a clear understanding of whether an item is active or not.
