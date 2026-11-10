---
title: "How to delete all the rows in a table using Eloquent?"
description: "Title: Efficiently Deleting Entire Tables Using Eloquent in Laravel Introduction Eloquent is the Object Relational Mapping (ORM) library built within Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Efficiently Deleting Entire Tables Using Eloquent in Laravel

Introduction

Eloquent is the Object Relational Mapping (ORM) library built within Laravel that allows developers to work with database tables as objects. It simplifies data management and provides convenient methods for interacting with databases. One common task when working with databases is deleting all the rows from a table. In this comprehensive tutorial, we will explore how to efficiently accomplish this using Eloquent in Laravel.

Prerequisites
1. A basic understanding of Laravel.
2. Familiarity with Laravel Migrations and Seeders for managing database structures.
3. An active Laravel installation.

Getting Started: Creating a Table and Populating it via Seeder

Before deleting all the rows in a table, we need to create a table, populate it with some data using a seeder, and then migrate its structure into our database. For this tutorial, we'll use the following Migration and Seeder:

Migration File: migrations/create_articles_table.php
<pre><code>use Illuminate\Support\Facades\Schema;

public function up()
{
    Schema::create('articles', function (Blueprint $table) {
        $table->increments('id');
        $table->string('title');
        $table->text('content');
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('articles');
}
</code></pre>

Seeder File: database/seeds/ArticleTableSeeder.php
<pre><code>use Illuminate\Database\Seeder;

class ArticleTableSeeder extends Seeder
{
    public function run()
    {
        factory(App\Article::class, 20)->create();
    }
}
</code></pre>

To create the table and populate it with data, execute the following commands:

1. Run PHP artisan migrate to create the table.
2. Run PHP artisan db:seed for the generated seeder to insert data into the table.
3. Alternatively, run PHP artisan migrate:fresh followed by PHP artisan db:seed to drop and seed the table again.

Now that we have a populated table, let's move on to deleting all the rows using Eloquent.

Deleting Rows Using Eloquent

We will use the `delete()` method of Eloquent to delete all the rows in our 'articles' table. The following code snippet demonstrates the syntax for this process:

<pre><code>App\Article::all()->delete();
</code></pre>

This command will retrieve all the records from the 'articles' table and then delete them one by one using their individual model instances. While it can be slow for a large number of rows, this method is suitable for small table sizes or situations in which you want to ensure that each row is deleted individually with its related models.

Efficient Way to Delete All Rows: Batch Processing

For larger tables, using the `delete()` method can be resource-intensive and time-consuming. However, we can use bulk processing to speed up the process by deleting all rows in batches. We will create a helper function to delete the articles efficiently:

<pre><code>use Illuminate\Support\Facades\DB;

function batchDeleteArticles($batchSize = 100)
{
    $articles = App\Article::all();

    while ($articles->count()) {
        DB::beginTransaction();
        $rowsToDelete = array_chunk($articles, $batchSize);
        foreach ($rowsToDelete as $rows) {
            App\Article::whereIn('id', $rows)->delete();
        }
        DB::commit();
    }
}
</code></pre>

Using the above code, we can call `batchDeleteArticles()` to delete all rows in the 'articles' table. This function will chunk the articles into smaller batches and perform deletions on them efficiently using transactions and bulk operations. Note that you should provide a suitable value for the `$batchSize` parameter based on your database capabilities, ensuring you stay within the recommended limits.

Conclusion

With this comprehensive guide, you now have the knowledge to delete all rows in a table using Eloquent efficiently based on your specific needs and database requirements. Remember that maintaining proper backup strategies is essential when dealing with sensitive data. Happy coding!
