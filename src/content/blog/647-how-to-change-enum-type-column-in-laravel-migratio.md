---
title: "How to change enum type column in laravel migration?"
description: "Title: Efficiently Changing Enum Type Columns in Laravel Migrations Body: Changing the data structure of your database is an essential part of web..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Efficiently Changing Enum Type Columns in Laravel Migrations

Body:
<p>Changing the data structure of your database is an essential part of web application development, and knowing how to modify enum type columns in Laravel migrations is crucial for a smooth workflow. In this blog post, we'll discuss the steps required to change the enum values in a table named packages from 'Kg.', 'Gm.' to 'Grams', 'Kgs.', 'Pounds'.</p>

<p>Before making any changes, ensure you have a backup of your database. You can create one by running the following command:</p>

<pre><code>$ php artisan migrate:rollback --step=1
$ php artisan migrate:refresh --seed
$ php artisan db:seed --force
</code></pre>

<p>Now, let's create a new migration for the enum change. We can start by generating a new migration file using:</p>

<pre><code>$ php artisan make:migration change_enum_weight_unit_table --create=packages
</code></pre>

<p>Open the newly created <code>"migrate/2019_07_15_183452_change_enum_weight_unit_table.php"</code> file and replace its content with:</p>

<pre><code><?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class ChangeEnumWeightUnitTable extends Migration {
    public function up() {
        Schema::table('packages', function (Blueprint $table) {
            $table->enum('weight_unit', array('Grams', 'Kgs.', 'Pounds'))-&gt;nullable()-&gt;change();
        });
    }

    public function down() {
        Schema::table('packages', function (Blueprint $table) {
            $table->enum('weight_unit', array('Kg.', 'Gm.'))-&gt;nullable();
        });
    }
}
</code></pre>

<p>The migration file consists of two methods: <code>up()</code> and <code>down()</code>. The <code>up()</code> method is responsible for handling the changes we want to perform, while the <code>down()</code> method reverts all those changes in case something goes wrong. We have included a nullable() call to make sure that the enum column can still hold NULL values.</p>

<p>To run the migration, execute:</p>

<pre><code>$ php artisan migrate
</code></pre>

<p>If the migration runs successfully without any errors, you are now able to change enum type columns in your Laravel migrations. But what if you encounter an error like "Unknown database type enum requested, Doctrine\DBAL\Platforms\MySqlPlatform may not support it"?</p>

<p>This issue occurs due to the differences between MySQL and other databases' handling of enum data types. In some cases, you may need to use a different approach:</p>

<pre><code>public function up() {
    Schema::table('packages', function (Blueprint $table) {
        $table->string('weight_unit')->nullable();
    });

    DB::connection()->getSchemaBuilder()->disableForeignKeyConstraints();
    DB::statement("ALTER TABLE packages MODIFY COLUMN weight_unit ENUM ('Kgs.', 'Grams', 'Pounds') NULL DEFAULT NULL;");
    DB::connection()->getSchemaBuilder()->enableForeignKeyConstraints();
}
</code></pre>

<p>In this example, we first change the enum column to a string data type and migrate it. Then, using raw SQL queries, we modify the original enum structure within the database.</p>

<p>To summarize, changing enum type columns in Laravel migrations involves generating a new migration file, updating its content based on your desired changes, running the migration, and handling any potential errors that might occur. By closely following these steps, you can ensure smooth data transitions while maintaining your application's integrity.</p>

<p><strong>Note:</strong> It is always recommended to make a backup of your database before making any significant changes to prevent catastrophic data loss in case of failures or unexpected scenarios.</p>
