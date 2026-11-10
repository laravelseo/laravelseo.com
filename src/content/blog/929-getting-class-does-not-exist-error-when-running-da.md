---
title: "Getting class does not exist error when running database seeder"
description: "Title: Troubleshooting \"Class Does Not Exist\" Error While Running Laravel Database Seeders Introduction: When creating database seeders in your Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Errors"]
featured: false
---

Title: Troubleshooting "Class Does Not Exist" Error While Running Laravel Database Seeders

Introduction: When creating database seeders in your Laravel applications, it's quite common to encounter errors related to class not found issues. In this blog post, we will explore the possible reasons behind such errors and provide effective solutions for fixing them. Let us first understand why these errors occur and how you can overcome them.

1. Missing namespace or incorrect path to seeder class: One of the most common causes for "class does not exist" error is an incorrect path to your seeders in the DatabaseSeeder constructor. To ensure this issue doesn't arise, make sure that you provide the correct namespace and file location within the array passed to the run method of yourDatabaseSeeder extension class:

<pre><code>public function run()
{
   $this-&gt;call([
       'AdminsTableSeeder' =&gt; \App\Database\Seeders\AdminsTableSeeder::class,
   ]);
}
</code></pre>
2. Invalid or missing use statement: If you have correctly specified the namespace and file path in your DatabaseSeeder constructor but still receive the error, double-check the use statement at the top of your seeders. Make sure all required classes are included for the code to function properly.

<pre><code>use App\Models\Admin;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
</code></pre>
3. Composer autoloader issues: If your composer dump-autoload command doesn't resolve the class not found issue, it might be due to incorrect configuration of your project's autoloader. In Laravel 6.1 and later versions, you can use the following command to generate new autoload files for your application:

<pre><code>composer dump-autoload</code></pre>

If none of these solutions work, update your composer dependencies by running the following command:

<pre><code>composer update</code></pre>
4. Incorrect seeder implementation: Sometimes, the issue might not be related to the seeders themselves but rather, how they are called within your application. To ensure everything is working correctly, run a checklist of basic tasks:
- Ensure that you have extended your custom seeders from the base class Seeder:
<pre><code>class AdminsTableSeeder extends Seeder</code></pre>
- Provide an appropriate run method within each seeder and implement its logic. In our example, we can create a single admin record in the database.
- Run your seeders from the DatabaseSeeder extension class by calling them within the run() method:
<pre><code>public function run()
{
   $this-&gt;call([
       'AdminsTableSeeder' =&gt; \App\Database\Seeders\AdminsTableSeeder::class,
   ]);
}
</code></pre>

Conclusion: By following these steps and best practices, you should be able to overcome the issue of class does not exist errors when running your database seeders in Laravel 6.1 or later versions. Always make sure that your code is well structured, with proper namespaces, use statements, and implementation for a clean execution. If you're still facing issues, don't hesitate to explore the Laravel documentation for more information or seek help from experienced developers at reputable tech companies like https://laravelcompany.com/.
