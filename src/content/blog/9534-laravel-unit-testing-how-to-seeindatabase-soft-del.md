---
title: "Laravel Unit Testing, how to \"seeInDatabase\" soft deleted row?"
description: "Laravel Unit Testing: How to \"See In Database\" Soft Deleted Rows Correctly As senior developers, we often find ourselves wrestling with the intricacies of..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers, we often find ourselves wrestling with the intricacies of testing database states, especially when dealing with Eloquent features like soft deletes. The scenario you’ve described—trying to assert that a record exists *and* is marked as soft-deleted by checking the `deleted_at` column—is a classic testing challenge.

The difficulty lies not just in the syntax of `seeInDatabase()`, but in how we translate complex SQL conditions (like `WHERE deleted_at IS NOT NULL`) into the expected array format that Laravel's testing helpers understand. Let’s dive into why your attempts failed and reveal the correct, robust way to assert soft-deleted records within your unit tests.

## The Challenge with `seeInDatabase()` and Null Checks

The method `$this->seeInDatabase($table, $values)` is designed to check if a specific set of columns matches provided values in the database. When dealing with nullability, direct comparisons like `'deleted_at' => null` or `'deleted_at' => ['!=' => null]` often break because they don't map cleanly to the underlying SQL structure that `seeInDatabase()` is designed to parse for existence checks.

The core issue is that you are trying to assert a *state* (the record was deleted) rather than just matching static values. We need to instruct the test helper to look for records where the timestamp field has *any* value assigned.

## The Correct Approach: Asserting Existence via Non-Nullity

Instead of trying to explicitly state that `deleted_at` is *not null*, we can leverage how Eloquent and database assertions work. If you are testing a soft-deleted record, you are asserting its existence under the condition that the deletion timestamp exists.

Here is the recommended pattern for checking if a soft-deleted row exists:

```php
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SoftDeleteTest extends TestCase
{
    use RefreshDatabase;

    public function test_soft_deleted_row_is_found()
    {
        // 1. Setup: Create and soft-delete a model instance
        $model = \App\Models\DiaryNoteCategory::factory()->create();
        $model->delete(); // This triggers the soft delete mechanism

        // 2. Assertion: Use seeInDatabase to confirm the presence of the soft-deleted record
        $this->seeInDatabase(
            'diary_note_categories',
            [
                'id' => $model->id,
                // We check for the existence of the deleted_at field itself. 
                // If the record is soft-deleted, this value MUST be set (i.e., NOT NULL).
                'deleted_at' => $model->deleted_at // Eloquent ensures this value exists if delete() was called
            ]
        );

        // Optional: Add a check to ensure it's actually marked deleted
        $this->assertNotNull($model->deleted_at);
    }
}
```

### Why This Works Better

In the example above, we are passing the actual `$model->deleted_at` value into the assertion. When Eloquent handles soft deletes (often via global scopes), calling `$model->delete()` sets this timestamp in the database. By asserting that the record exists with its specific ID and the corresponding `deleted_at` field populated, you are directly verifying the state defined by your application's logic.

This method is more reliable because it relies on the actual data state put into the database, rather than trying to force a complex SQL comparison (`IS NOT NULL`) into a simple array structure for `$this->seeInDatabase()`. This aligns with best practices for testing data integrity within Laravel applications, as promoted by resources like the official [Laravel documentation](https://laravelcompany.com).

## Alternative: Testing Model States (The Eloquent Way)

While `seeInDatabase()` is excellent for direct database checks, remember that the most idiomatic way to test model states in Laravel is often by working directly with the model instance and its relationships. If you are testing application logic surrounding a soft delete—such as ensuring a scope or observer fires correctly—testing the model itself is superior:

```php
public function test_model_is_soft_deleted()
{
    $model = DiaryNoteCategory::factory()->create();
    $model->delete(); // Soft delete action

    // Asserting the state directly on the model instance
    $this->assertTrue($model->trashed()); 
    $this->assertNotNull($model->deleted_at);
}
```

This approach keeps your tests focused on the business logic and Eloquent relationships, which is a powerful pattern when building robust applications.

## Conclusion

Testing soft deletes requires shifting focus from purely database-level existence checks to asserting the actual state of the model object. While `seeInDatabase()` can be useful for raw data verification, using it correctly involves understanding how your application logic populates the `deleted_at` column during a soft delete operation. By combining precise database assertions with idiomatic Eloquent testing practices, you ensure your unit tests are accurate, readable, and maintainable.
