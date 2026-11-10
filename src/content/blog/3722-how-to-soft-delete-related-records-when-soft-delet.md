---
title: "How to soft delete related records when soft deleting a parent record in Laravel?"
description: "How to Soft Delete Related Records When Soft Deleting a Parent Record in Laravel As developers working with relational data in Laravel, managing cascading..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers working with relational data in Laravel, managing cascading deletions—especially when utilizing soft deletes—presents a common architectural challenge. You have successfully implemented soft deletion on your `Invoice` model, but you encounter the classic problem: the related `Payment` records remain orphaned, violating the conceptual integrity of the parent record.

This comprehensive guide details the correct, idiomatic Laravel approach to ensure that when an invoice is soft-deleted, all associated payments are also appropriately soft-deleted, maintaining data consistency across your application.

## The Soft Deletes Dilemma

Let's review the structure you provided:

**Invoice:**
```sql
id | name | amount | deleted_at
2    iMac   1500   | NULL
```

**Payments:**
```sql
id | invoice_id | amount | deleted_at
2    2            1000   | NULL
```

When you execute `$record->delete()` on the `Invoice` model, Laravel correctly sets the `deleted_at` timestamp on the invoice. However, since the `Payment` records do not have an explicit instruction to follow this deletion, they remain untouched and visible in the database. This is because soft deletes are primarily an application-level feature managed by Eloquent, not automatically enforced by standard SQL foreign key constraints alone.

The solution lies in explicitly defining how these related models should behave when their parent is deleted. We need to leverage Eloquent relationships to enforce this cascading behavior.

## The Solution: Implementing Cascading Soft Deletes via Relationships

Instead of relying on direct deletion calls, we must integrate the soft delete logic directly into our Eloquent relationships. This ensures that any query involving the parent automatically handles the related records.

### Step 1: Define the Relationship

First, ensure you have a proper relationship defined between `Invoice` and `Payment`.

In your `Invoice` model:
```php
class Invoice extends Model
{
    use SoftDeletes;

    public function payments()
    {
        // This defines the relationship back to the Payments table
        return $this->hasMany(Payment::class);
    }
}
```

And in your `Payment` model:
```php
class Payment extends Model
{
    use SoftDeletes;

    public function invoice()
    {
        // This defines the relationship back to the Invoice table
        return $this->belongsTo(Invoice::class);
    }
}
```

### Step 2: Enforcing Cascading Deletion (The Crucial Step)

While Eloquent doesn't offer a built-in `cascadeSoftDeletes()` method, we can enforce this logic within the deletion method itself. The most robust way to handle this is to use database constraints or, more commonly in Laravel, perform the related deletions explicitly within a transaction.

For soft deletes, performing explicit deletion on the children ensures that the application state remains consistent, aligning with best practices discussed by developers focusing on data integrity in frameworks like Laravel.

Here is how you modify your invoice deletion method:

```php
use Illuminate\Support\Facades\DB;

public function cancel(Request $request, $id)
{
    // 1. Find the parent record
    $invoice = Invoice::with('payments')->findOrFail($id);

    // 2. Start a transaction for atomicity
    DB::beginTransaction();

    try {
        // 3. Soft delete the parent invoice
        $invoice->delete();

        // 4. Soft delete all related payments
        $invoice->payments()->whereNull('deleted_at')->update(['deleted_at' => now()]);

        DB::commit();
        return response()->json(['success' => 'Invoice and related payments soft-deleted successfully.']);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => 'Deletion failed: ' . $e->getMessage()], 500);
    }
}
```

### Explanation of the Approach

By using `DB::beginTransaction()`, we ensure that either both the invoice and all its payments are deleted, or none of them are.

1.  **Eager Loading:** We use `Invoice::with('payments')` to load the related payments efficiently before deletion, although this is primarily for context here.
2.  **Parent Deletion:** `$invoice->delete()` handles the soft delete on the parent.
3.  **Child Deletion:** We explicitly query and update all related payments using the defined relationship (`$invoice->payments()->whereNull('deleted_at')->update(...)`). This targets only those payments that have *not yet* been soft-deleted, ensuring we correctly cascade the operation.

This method provides full control over the data flow, which is often necessary when implementing complex business rules in Laravel. For deeper dives into Eloquent relationships and database interactions, exploring resources on the official Laravel documentation can be extremely helpful.

## Conclusion

Soft deleting related records is not an automatic feature of Eloquent; it requires careful orchestration of application logic. By defining clear Eloquent relationships and manually executing cascading soft deletes within a transaction, you gain complete control over your data integrity. This approach ensures that as you manage data in Laravel, you adhere to the principle of atomic operations, leading to more reliable and maintainable applications.
