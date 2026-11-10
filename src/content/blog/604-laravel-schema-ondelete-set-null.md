---
title: "Laravel Schema onDelete set null"
description: "Title: Mastering Laravel Schema onDelete Constraints with SQLite Can't figure out how to set the proper onDelete constraint on a table in Laravel? (I'm..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

Title: Mastering Laravel Schema onDelete Constraints with SQLite

Can't figure out how to set the proper onDelete constraint on a table in Laravel? (I'm working with SQLite)

You may have encountered issues while trying to set the 'onDelete' option for your Laravel migrations, especially when using SQLite. In this comprehensive guide, we will cover different options and provide practical examples to help you master Laravel Schema onDelete constraints in SQLite environments.

1. Using Cascade Deletions:
To start with, let's focus on the most common 'onDelete' option, 'cascade'. The following code snippet demonstrates how it should be used within your migration files.

```php
Schema::create('galleries', function($table) {
    // ...
    $table->foreign('picture_id')
        ->references('id')
        ->on('pictures')
        ->onDelete('cascade');
});
```

In this case, when a gallery is deleted, all associated pictures will also be removed. However, you might encounter issues if your database is based on SQLite. The 'cascade' option may not work consistently across different versions of SQLite or between various Laravel versions. As a solution, you could try to use an alternative constraint type such as 'set null'.

2. Using SetNull Deletions:
With 'set null', the operation would set its foreign key column value to null when the referenced row is deleted. To implement this in your migration files:

```php
Schema::create('galleries', function($table) {
    // ...
    $table->foreign('picture_id')
        ->references('id')
        ->on('pictures')
        ->onDelete('set null');
});
```

However, if you've already tried this approach and find that it doesn't work, ensure that the foreign key column type allows for null values. For example, in SQLite, the default primary key is an 'INTEGER PRIMARY KEY' constraint, which does not support null values by default. In such cases, you should add a 'NULL' parameter within your migration file:

```php
Schema::create('galleries', function($table) {
    // ...
    $table->foreign('picture_id')
        ->references('id')
        ->on('pictures')
        ->onDelete('set null');
});
```

This solution assumes that you want to remove the gallery when all associated pictures are deleted and that your database settings support nullable foreign keys. If this is not the desired outcome, using the 'cascade' option might be more appropriate for your specific use case.

3. Using Circular References:
As a workaround, you could consider implementing circular references in your schema to prevent issues with deleting rows related to each other. To implement circular references for pictures and galleries, make the following changes in your migrations:

```php
Schema::create('galleries', function($table) {
    $table->integer('picture_id') // Remove this line
});

Schema::create('pictures', function($table) {
    $table->integer('is_cover') ->after('path');
    $table->foreign('gallery_id')
        ->references('id')
        ->on('galleries')
        ->constrained();
});
```

Now, within your application code, you can define the cover picture for each gallery by updating the 'is_cover' column in the pictures table. However, this approach might not be suitable if your database has existing data and requires backward compatibility since it involves modifying all existing records.

Conclusion:
In conclusion, mastering Laravel Schema onDelete constraints with SQLite can be challenging due to its underlying limitations. The best solution depends on your specific use case and the nature of your application's data. To ensure consistency across different environments and avoid unexpected behavior, always thoroughly test alternative options before implementing them in production. Remember that using circular references should only be considered as a workaround for complex situations when other approaches may not fit.
