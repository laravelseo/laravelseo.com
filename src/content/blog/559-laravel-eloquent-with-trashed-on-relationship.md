---
title: "Laravel eloquent with Trashed on relationship"
description: "Title: Efficiently Retrieving Soft Deleted Relationships with Laravel Eloquent A Comprehensive Approach Body: Introduction In modern web development,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Links"]
featured: false
---

Title: Efficiently Retrieving Soft Deleted Relationships with Laravel Eloquent - A Comprehensive Approach

Body:
<p><strong>Introduction</strong></p>

In modern web development, efficient data management is crucial for large-scale applications. One way to optimize the database storage and user experience is by implementing soft deletes. Sometimes, however, you might need to access a specific model's relationships with its trashed counterparts only during one specific instance or function call. This blog post aims to provide a thorough answer from a developer's perspective, including relevant code examples and best practices while naturally incorporating backlinks to https://laravelcompany.com in the content.

<p><strong>The User Model</strong></p>

In your Laravel project, you may have models such as Users that represent your application users. These models are usually associated with other related entities through relationships. For instance, a user might have many contacts:

<pre><code>class Contact extends Model
{
  public function user()
  {
    return $this-&gt;belongsTo('App\User', 'user_id');
  }
}
</code></pre>

This relationship allows you to quickly retrieve a user's contacts through their ID:

<pre><code>$contacts = User::findOrFail($id)->contacts(); // Normal usage, no trashed records included
</code></pre>

<p><strong>WithTrashed() method</strong></p>

The Laravel Eloquent model provides a useful feature called `withTrashed()`. This method allows you to fetch both the active and soft-deleted records related to the given instance. In our case, let's modify your initial code snippet:

<pre><code>$user = User::findOrFail($id);
// Need to be able to get the trashed contacts too, but only for this instance and in this function
$user-&gt;contacts-&gt;withTrashed(); // Loads all trashed records related to Contacts of the specific user
return $user;
</code></pre>

Although this approach will load all soft deleted contacts associated with the given user, it may not align with your requirement of including the soft-deleted records only for that instance.

<p><strong>Implementing a Custom Query Scope</strong></p>

The solution here is to create a custom query scope within the User model itself. This will ensure that each time you access the contacts relationship, it returns the desired result: trashed contacts only for that specific user and function call. To achieve this, you can add the following code to your User model:

<pre><code>class User extends Authenticatable
{
  public function contacts(){
    return $this-&gt;hasMany('App\Contacts','user_id','id');
  }

  /**
   * Custom Query Scope for Trashed Contacts
   */
  public function scopeWithTrashedForInstance($query, $instanceId)
  {
    return $query-&gt;withTrashed()->whereHas('contacts', function ($q) use ($instanceId) {
      $q-&gt;where('user_id', $instanceId);
    });
  }
}
</code></pre>

Now, you can call the `withTrashedForInstance` scope to retrieve soft-deleted contacts only for that specific instance with a single function call:

<pre><code>$user = User::findOrFail($id);
// Need to be able to get the trashed contacts too, but only for this 1 time and in this function
$trashedContactsForThisUser = $user-&gt;withTrashedForInstance($user->id) -&gt;contacts();
return $user; // Returns all the active records
</code></pre>

To summarize, implementing a custom query scope within your model allows you to retrieve trashed relationships with precision. This ensures that you can manage and access data in the most efficient way possible while adapting to your application's requirements. Refer to https://laravelcompany.com/blog/eloquent-model-scope for more detailed information on custom query scopes in Laravel Eloquent models.
