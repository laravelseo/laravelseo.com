---
title: "Laravel Eloquent groupBy() AND also return count of each group"
description: "Title: Efficiently Counting and Grouping Records by Browser Using Laravel Eloquent's groupBy() Method Introduction: In web development, it's common to deal..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "HTML"]
featured: false
---

Title: Efficiently Counting and Grouping Records by Browser Using Laravel Eloquent's groupBy() Method

Introduction:
In web development, it's common to deal with a large number of records stored in various databases, and sometimes you need to count the number of records for each category or type. This blog post will guide you through using Laravel's Eloquent ORM with groupBy() and how to retrieve not only the groups but also their respective counts.

Prerequisites:
- Knowledge of Laravel 5+ framework.
- Understanding of basic SQL commands, such as SELECT, GROUP BY, and COUNT.
- A working Laravel application or a test environment where you can work on this.

Step 1: Define the Models and Routes
Firstly, create two models - Usermeta for storing user meta information (with 'browser' column) and BrowserType for listing all browser types. Relate these two models with a one-to-many relationship where Usermeta belongs to a single BrowserType and can have multiple instances of itself. Also, define a route to access this data:

<pre><code class="language-php">// Create the Usermeta model
class Usermeta extends Model {
    protected $fillable = ['user_id', 'key', 'value'];

    // Define relation with BrowserType
    public function browser_type() {
        return $this->belongsTo(BrowserType::class, 'browser');
    }
}

// Create the Usermeta migration
Schema::create('usermetas', function (Blueprint $table) {
    $table->increments('id');
    $table->integer('user_id');
    $table->string('key', 255);
    $table->text('value');
    $table->index(["browser"]); // Indexing the 'browser' column for faster searching
});

// Define the BrowserType model and its migration
class BrowserType extends Model {
    protected $fillable = ['name'];
}
</code></pre>

Step 2: Create Records to Test with Different Browsers
To help demonstrate the functionality, add some records with different browser types in both models. Here is an example:

<pre><code class="language-php">// Add records by seeding database
Usermeta::insert([['user_id' => 1, 'key' => 'browser', 'value' => 'Internet Explorer 8'], ['user_id' => 1, 'key' => 'browser', 'value' => 'Chrome 25'], ['user_id' => 2, 'key' => 'browser', 'value' => 'Firefox 20']]);
BrowserType::insert([['name' => 'Internet Explorer'], ['name' => 'Chrome'], ['name' => 'Firefox']]);
</code></pre>

Step 3: Retrieve the Browser Types and Their Counts Using Eloquent's groupBy() Method
Now, we'll use Laravel Eloquent's groupBy() method to achieve our goal. It returns a collection where each element is an array representing a unique value of the given column (the 'browser' column in this case).

<pre><code class="language-php">$user_info = Usermeta::groupBy('browser')-&gt;get();
</code></pre>

This gives you all the different browser types with their corresponding values. To add a count for each group, we can use Laravel's Collection's map() and count() methods. We need to group by 'browser' again to create a new collection that associates each unique browser type with its count:

<pre><code class="language-php">$user_info = Usermeta::groupBy('browser')-&gt;get();
$user_counts = $user_info->map(function ($record) {
    return [
        'browser' => $record['browser'],
        'count'   => Usermeta::where('browser', $record['browser'])->count()
    ];
});
</code></pre>

Now, you have a collection with browser type as the key and its count as the value. To display this information in a readable format, you can use a view or create a simple HTML table:

<pre><code class="language-html">@foreach ($user_counts as $browser => $count)
    <tr>
        <td>{{$browser}}</td>
        <td>{{$count}}</td>
    </tr>
@endforeach
</code></pre>

Conclusion:
In this blog post, we covered the process of counting and grouping records by browser type using Laravel's Eloquent ORM with the groupBy() method. We demonstrated how to efficiently retrieve all required data from your database by combining multiple Laravel techniques and using simple logic to count each browser type. Remember that a well-organized code structure is always crucial for maintaining a clean and scalable project, so make sure to use proper variable naming conventions and organize your code in meaningful chunks. For more information on working with Laravel's Eloquent ORM, visit https://laravelcompany.com/blog/tag/eloquent-orm/.
