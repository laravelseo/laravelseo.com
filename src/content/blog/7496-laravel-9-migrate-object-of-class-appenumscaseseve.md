---
title: "Laravel 9 migrate: Object of class App\\Enums\\CaseSeverity could not be converted to string"
description: "Solving the Laravel Migration Headache: Handling Enums in Database Defaults As developers working with modern PHP frameworks like Laravel, we often leverage..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

As developers working with modern PHP frameworks like Laravel, we often leverage powerful features such as Enums to improve code readability, type safety, and maintainability. However, when integrating these strong typing features with database schema management—specifically migrations—we sometimes run into unexpected type conversion errors.

Today, we are diving deep into a very common pain point: attempting to use an Enum object directly in a Laravel migration's default value setting. I will walk you through the exact error you are seeing, explain *why* it happens, and provide the robust solution for migrating tables that rely on PHP Enums.

## The Problem: Enum Objects Don't Convert to Strings

You have defined an Enum with string cases, which is excellent for defining allowed states:

```php
enum CaseStatus : string
{
    case Completed = 'completed';
    case Pending = 'pending';
    case Rejected = 'rejected';

    public function color(): string
    {
        return match($this)
        {
            self::Completed => 'badge-light-success',
            self::Pending => 'badge-light-warning',
            self::Rejected => 'badge-light-danger',
        };
    }
}
```

You then try to set a default value in your migration:

```php
$table->string('status')->default(CaseStatus::Pending)->nullable();
```

When you run `php artisan migrate`, Laravel throws the error: **`Object of class App\Enums\CaseStatus could not be converted to string`**.

### Why This Error Occurs

The core issue lies in how the Schema Builder handles default values. Migration files primarily deal with raw SQL types (strings, integers, dates). When you pass a complex PHP object (like an Enum instance) to the `default()` method, the underlying system attempts a direct type conversion. Since the migration system expects a simple scalar value (a string or integer), it fails when presented with an entire class instance, resulting in the error.

This is a classic example of the boundary between application logic (PHP objects) and database structure (SQL types). While Laravel provides fantastic tools for schema management—which is core to how we manage our data structures at **https://laravelcompany.com**—we must ensure our migration statements adhere strictly to what the underlying SQL layer expects.

## The Solution: Explicitly Extracting the String Value

The solution is straightforward: instead of passing the entire Enum object, you must explicitly extract the string value that the Enum represents. Since you defined your cases with explicit string values (e.g., `case Completed = 'completed';`), you can access this value directly.

### Correct Migration Implementation

To fix the error, modify your migration file to use the raw string value of the enum member:

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class CreateCasesTable extends Migration
{
    public function up(): void
    {
        Schema::create('cases', function (Blueprint $table) {
            $table->id();
            // CORRECT WAY: Use the string value directly
            $table->string('status')->default('pending')->nullable(); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cases');
    }
}
```

**Wait, how do I get `'pending'` dynamically?**

If the default value needs to be dynamic (e.g., based on runtime logic), you need to resolve the Enum value *before* writing the migration file. This is often best done in a separate setup script or within a dedicated service layer rather than directly inside the migration itself, as migrations should ideally be idempotent and self-contained.

If you absolutely must generate this dynamically during migration execution (which is generally discouraged for simple defaults), you can access the value:

```php
// Example of dynamic fetching (use with caution in migrations)
$defaultStatus = CaseStatus::Pending->value; // Accessing the defined string value

$table->string('status')->default($defaultStatus)->nullable(); 
```

In most standard Laravel scenarios, defining simple, static defaults directly as strings (`'pending'`) is cleaner and safer for migration files. If you are setting a default based on an application state, it is often better practice to rely on database constraints or Eloquent model casting rather than relying on the migration layer for complex object serialization.

## Conclusion

The error you encountered highlights the critical distinction between PHP object handling in your application code and raw data structure definitions in your database migrations. By ensuring that all values passed to schema methods are simple, scalar types (strings, integers), you ensure compatibility with the underlying SQL engine. Always treat migration files as declarations of database structure, not as execution points for complex application logic.

By explicitly converting your Enum member into its string representation before writing the default value, you successfully bridge the gap between your strong-typed PHP code and your relational database schema, keeping your Laravel projects clean, fast, and robust.
