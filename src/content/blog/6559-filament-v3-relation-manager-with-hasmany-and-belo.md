---
title: "Filament v3 : relation Manager with hasMany and BelongsTo"
description: "Filament v3: Mastering Relations Managers with hasMany and BelongsTo Welcome to the world of Filament! As you dive into building complex administrative..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Welcome to the world of Filament! As you dive into building complex administrative interfaces, managing Eloquent relationships—especially when they involve `hasMany` and `belongsTo` setups—can often feel like hitting a wall. Many developers get stuck when trying to translate database structure directly into interactive forms within Filament. This post will walk you through the exact scenario you described, diagnose why your form is creating new records instead of linking existing ones, and provide the correct, robust solution.

## The Foundation: Eloquent Relationships Matter Most

Before diving into Filament, let's ensure our foundation—the Eloquent models—is perfectly sound. Your setup between `Etablissement` and `User` is a classic one-to-many relationship: an establishment can have many users, and each user belongs to exactly one establishment.

Here is the correct way to define these relationships in your models:

**Model Etablissement:**
```php
class Etablissements extends Model
{
    use HasFactory;

    protected $table = 'etablissements';

    protected $fillable = [
        'nom',
    ];

    /**
     * An establishment has many users. (One-to-Many)
     */
    public function users()
    {
        return $this->hasMany(User::class); // Correctly defined as hasMany
    }
}
```

**Model User:**
```php
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * A user belongs to one establishment. (Belongs To)
     */
    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class); // Correctly defined as belongsTo
    }
}
```
These definitions are crucial. They tell Laravel how the data connects, which forms the basis for everything Filament will interact with. Understanding these relationships is key to leveraging the power of the framework, much like understanding database design principles discussed on the [Laravel Company website](https://laravelcompany.com).

## The Filament Challenge: Linking Records Correctly

Your core problem arises when trying to use a `RelationManager` or form fields to link existing records. When you select related records, you must pass the ID of an existing record, not attempt to create a new one from scratch within the context of that specific action. If your system is creating a new user instead of linking an existing one, it usually means the form input is expecting a full model creation rather than a foreign key assignment.

The confusion often stems from conflating *creating* a record with *associating* existing records. For a many-to-one link like this (where you are creating an `Etablissement` and linking to existing `Users`), you should use standard Filament form fields, not necessarily a complex custom `RelationManager`, unless you are building a dedicated screen *only* for managing the users of that establishment.

### The Practical Solution: Using Select Fields

For linking records during creation or editing, the most straightforward and reliable method in Filament is using the `Select` field to populate options from the related model.

If you are creating an `Etablissement`, and you want to select which existing users belong to it, your Relation Manager setup should focus on populating those dropdown options correctly:

```php
// Example of setting up a form field inside your RelationManager
public function form(Form $form): Form
{
    return $form
        ->schema([
            Select::make('associated_users') // The field we want to populate
                ->label('Associated Users')
                ->multiple() // Allows selecting multiple users
                ->relationship('users', 'name') // Links directly to the 'users' relationship on Etablissement
                ->searchable(),
        ]);
}
```

Notice how the `relationship()` method is used. By pointing it to `'users'`, Filament automatically knows to look at the `Etablissement` model's defined `hasMany` relationship and populate the dropdown with all relevant related data (in this case, the names of existing users). This prevents the creation of new records because you are only selecting IDs already present in the database.

## Conclusion: Focus on Data Flow

The difficulty you encountered is less about the complexity of `hasMany` versus `belongsTo` and more about correctly directing Filament's form logic to use foreign keys for association rather than triggering full model creation. When working with relations in Filament, always remember that the framework relies entirely on the integrity of your Eloquent setup. Ensure your relationships are clean, and then leverage built-in methods like `relationship()` within your forms to ensure you are managing data associations correctly, following best practices outlined by the community on [Laravel Company](https://laravelcompany.com). By focusing on how Filament reads those established links, you will unlock powerful administration features smoothly.
