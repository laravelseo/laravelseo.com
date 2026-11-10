---
title: "Laravel generate slug before save"
description: "Title: Laravel generate slug before save A Comprehensive Guide Body: Im trying to learn laravel 5 with help of this wonderful website. For my activity model,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Laravel generate slug before save - A Comprehensive Guide

Body: <p>Im trying to learn laravel 5 with help of this wonderful website. For my activity model, I want to generate slugs before I save one to my database so I've created the following model.</p>
<pre><code>&lt;?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model {

    protected $table = 'activitys';

    protected $fillable = [
        'title',
        'text',
        'subtitle'
    ];

    // Here I want to auto generate slug based on the title
    public function setSlugAttribute(){
        $this-&gt;attributes['slug'] = str_slug($this-&gt;title , &quot;-&quot;);
    }
    //    
}
</code></pre>
<p>But when I save an object with help of the Activity model slug is not filled, I tried changing it to $this-&gt;attributes['title'] = &quot;test&quot; for testing but it didn't run. Also I tried adding parameters $title, $slug to setSlugAttribute() but it didn't help.</p>
<p>What am I doing wrong and could someone explain the parameter that is used in some examples for setSomeAttribute($whyParameterHere).</p>
<p><em>Note : there is a slug field in my database.</em></p>
<p>As suggested by user3158900, I've tried:</p>
<pre><code>public function setTitleAttribute($title){
    $this-&gt;title = $title;
    $this-&gt;attributes['slug'] = str_slug($this-&gt;title , &quot;-&quot;);
}
//
</code></pre>
<p>This makes my title field empty but saves the slug the way I want it, why is $this-&gt;title empty then ?
If I remove $this-&gt;title = $title; both title and slug are empty.</p>

In Laravel, we use attributes to represent data for a given model. When using setters and getters in our models (also known as Accessors or Mutators), we can provide custom behavior when setting and retrieving data from these attributes. In the case of your Activity model, you want to generate a slug based on the title before saving it to the database.

You need to modify your setSlugAttribute() function as follows:

<pre><code>public function setTitleAttribute($title){
    $this->attributes['slug'] = str_slug($title, '-');
}
</code></pre>
Here, you are setting the slug based on the input title. Since Laravel uses Eloquent Models, which are objects that represent rows in a database table, it needs to maintain a direct relation between the column and its values. You can modify your model definition as:

<pre><code>protected $fillable = [
    'title',
    'text',
    'subtitle',
    'slug'
];
</code></pre>
This ensures that Laravel is aware of the slug column and its relationship with this model.

If you want to update both attributes (title and slug) when calling $model->save(), you can use mass assignment validation:

<pre><code>protected $fillable = [
    'title',
    'text',
    'subtitle',
    'slug'
];
</code></pre>
Now, while saving the model using:
<pre><code>$model->save();
// Automatically updates title and slug attributes based on their relationship.
</code></pre>
Remember to always keep your code clean, well-structured, and maintainable by following best practices. If you're unsure about something, refer to Laravel resources or seek help from experienced developers. With a thorough understanding of attributes, setters/getters, and database mapping in Laravel, you can efficiently develop powerful applications.
