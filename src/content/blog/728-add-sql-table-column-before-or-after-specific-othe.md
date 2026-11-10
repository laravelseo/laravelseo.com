---
title: "Add sql table column before or after specific other column - by migrations in Laravel 4.1"
description: "Title: Adding SQL Table Columns before or after Specific Other Columns Using Migrations in Laravel 4.1 Introduction: When working on your application, you..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Adding SQL Table Columns before or after Specific Other Columns - Using Migrations in Laravel 4.1

Introduction:
When working on your application, you may find yourself needing to add a new column to an existing table. In this blog post, we'll discuss how to accomplish this task using migrations in Laravel 4.1. We'll cover two scenarios: adding the new column before or after another specific column.

Scenario 1: Adding Column Before Specific Other Column
Given your current table schema (Users) and desired changes (add 'phone_nr' between 'id' and 'deleted_at'):
<pre><code>|id|name|address|post_code|deleted_at|created_at|phone_nr|
</code></pre>

Step 1: Create a new migration file for the changes.
To add a new column to your table, create a fresh migration using Artisan:
<code>php artisan make:migration add_phone_nr_to_users</code>

Step 2: Open the migration file and modify it as needed.
The generated migration file should look something like this:
<pre><code>class AddPhoneNrToUsers extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        // Your code to add a new column here
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        // Removing the column if needed, here it's not required because you just added it.
    }
}
</code></pre>

Step 3: Update your migration file with the code to add the 'phone_nr' column before the 'deleted_at' column.
<pre><code>public function up() {
    Schema::table('users', function (Blueprint $table) {
        $table->string('phone_nr')->after('post_code'); // Put your column here
        $table->foreignId('deleted_at')->nullable()->after('phone_nr');
    });
}
</code></pre>

Here, we use the 'after' method to add the new column after the post_code. You can also change it to insert the phone_nr column before any other specific column by using the corresponding reference in the table.

Scenario 2: Adding Column After Specific Other Column
Given your current table schema (Users) and desired changes (add 'phone_nr' after the 'address' column):
<pre><code>|id|name|address|post_code|deleted_at|created_at|phone_nr|
</code></pre>

Step 1: Create a new migration file for the changes.
Follow Steps 1 and 2 from Scenario 1 to create a new migration file and open it up.

Step 3: Update your migration file with the code to add the 'phone_nr' column after the 'address' column.
<pre><code>public function up() {
    Schema::table('users', function (Blueprint $table) {
        $table->string('phone_nr')->after('address');
        $table->foreignId('deleted_at')->nullable()->after('phone_nr');
    });
}
</code></pre>

Conclusion:
In this blog post, we have covered how to use migrations in Laravel 4.1 to add a new column to an existing table by specifying its position relative to other columns. By following these steps, you can easily manage and maintain your database schema as your application evolves. Remember that the best practice is to always back up your database before making any changes to it.
