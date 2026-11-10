---
title: "Proper Repository Pattern Design in PHP?"
description: "Preface: I'm attempting to use the repository pattern in an MVC architecture with relational databases. I've recently started learning TDD in PHP, and I'm..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

<p><em>Preface: I'm attempting to use the repository pattern in an MVC architecture with relational databases.</em></p>

<p>I've recently started learning TDD in PHP, and I'm realizing that my database is coupled much too closely with the rest of my application. I've read about repositories and using an <a href="http://laravel.com/docs/4.2/ioc" rel="noreferrer">IoC container</a> to "inject" it into my controllers. Very cool stuff. But now have some practical questions about repository design. Consider the follow example.</p>

<pre class="lang-php prettyprint-override"><code>&lt;?php

class DbUserRepository implements UserRepositoryInterface
{
    protected $db;

    public function __construct($db)
    {
        $this-&gt;db = $db;
    }

    // Example custom methods for specific use cases.
    public function findAllByAgeAndGenderOrderByAge()
    {
        return User::select('name', 'email', ...)
            -&gt;byCountry('Canada')-&gt;byAgeAndGender(30, 'male')-&gt;orderBy('age', 'asc')-&gt;rows();
    }

    // Example custom methods for specific use cases.
    public function findAllByStatus()
    {
        return User::select('name', 'email', ...)
            -&gt;byCountry('Canada')-&gt;byAgeAndGender(30, 'male')-&gt;status('active', 'pending')-&gt;rows();
    }

}
</code></pre>

<h2>Issue #1: Too many fields</h2>

<p>All of these find methods use a select all fields (<code>SELECT *</code>) approach. However, in my apps, I'm always trying to limit the number of fields I get, as this often adds overhead and slows things down. For those using this pattern, how do you deal with this?</p>

<h2>Issue #2: Too many methods</h2>

<p>While this class looks nice right now, I know that in a real-world app I need a lot more methods. For example:</p>

<ul>
<li>findAllByNameAndStatus</li>
<li>findAllInCountry</li>
<li>findAllWithEmailAddressSet</li>
<li>findAllByAgeAndGender</li>
<li>findAllByAgeAndGenderOrderByAge</li>
<li>Etc.</li>
</ul>

<p>As you can see, there could be a very, very long list of possible methods. And then if you add in the field selection issue above, the problem worsens. In the past I'd normally just put all this logic right in my controller:</p>

<pre class="lang-php prettyprint-override"><code>&lt;?php

class MyController
{
    public function users()
    {
        $users = User::select('name, email, status')
            -&gt;byCountry('Canada')-&gt;orderBy('name')-&gt;rows();

        return View::make('users', array('users' =&gt; $users));
    }
}
</code></pre>

<p>With my repository approach, I don't want to end up with this:</p>

<pre class="lang-php prettyprint-override"><code>&lt;?php

class MyController
{
    public function users()
    {
        $users = $this-&gt;repo-&gt;get_first_name_last_name_email_username_status_by_country_order_by_name('Canada');

        return View::make('users', array('users' =&gt; $users))
    }

}
</code></pre>

<h2>Issue #3: Impossible to match an interface</h2>

<p>I see the benefit in using interfaces for repositories, so I can swap out my implementation (for testing purposes or other). My understanding of interfaces is that they define a contract that an implementation must follow. This is great until you start adding additional methods to your repositories like <code>findAllInCountry()</code>. Now I need to update my interface to also have this method, otherwise, other implementations may not have it, and that could break my application.</p>

<h3>Specification Pattern?</h3>

<p>This leads me to believe that repository should only have a fixed number of methods (like <code>save()</code>, <code>remove()</code>, <code>find()</code>, <code>findAll()</code>, etc). But then how do I run specific lookups? I've heard of the <a href="http://en.wikipedia.org/wiki/Specification_pattern" rel="noreferrer">Specification Pattern</a>, but it seems to me that this only reduces an entire set of records (via <code>IsSatisfiedBy()</code>), which clearly has major performance issues if you're pulling from a database.</p>

<h2>Help?</h2>

<p>Clearly, I need to rethink things a little when working with repositories. Can anyone enlighten on how this is best handled?</p>

To address these issues:
- Use a custom query builder or Eloquent models for specific use cases. This way, you define your database tables and have better control over fields and relationships between them.
- Implement the repository pattern within each of these custom classes (like a UserRepository) by providing methods for common tasks like find all users in a country, find all users with a certain status, etc. These methods can be chained together to create complex queries.
- Use a single instance of your repository class per request, so you don't have to create and inject it into each controller. This will reduce the number of custom repository instances created.
- When needed, use the Specification Pattern for very specific cases where you need to search a large dataset by multiple conditions or criteria. However, ensure you have good database indexing in place to maintain performance.

By implementing these steps and adjusting your approach, you can effectively manage your repositories and improve your application's efficiency and scalability.
