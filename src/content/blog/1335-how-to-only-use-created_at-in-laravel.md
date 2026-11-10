---
title: "How to only use created_at in Laravel"
description: "Title: Streamlining Laravel Timestamps: Customizing Field Names and Disabling Timestamps In today's world where data is the new gold, managing it efficiently..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords", "PHP"]
featured: false
---

Title: Streamlining Laravel Timestamps: Customizing Field Names and Disabling Timestamps

<p>In today's world where data is the new gold, managing it efficiently becomes crucial for every developer. The Laravel framework is a great tool that helps us to streamline this process by providing some built-in tools like timestamps. In this comprehensive blog post, we will explore how to manipulate these timestamps to your advantage. With just a few well-placed commands or configuration tweaks, you can customize the field names for created_at and updated_at or even disable timestamps altogether—all while ensuring data integrity.</p>

<h2>Customizing Timestamp Field Names</h2>

<pre><code>const CREATED_AT = 'created';
const UPDATED_AT = 'updated';
</code></pre>

If you need to customize the timestamp field names for your database tables, use constants as shown above. This will ensure consistency across your codebase and make it easier for others to understand your choices. These constants can be defined in either a config file or the model class itself.

<p>In the Model:</p>
<pre><code>class MyModel extends Model
{
    const CREATED_AT = 'created';
    const UPDATED_AT = 'updated';
}
</code></pre>

<p>Another alternative is to define them within the config/database.php file:</p>
<pre><code>'default' => [
    // ... your other configuration values
    'timestamps' => true,
    'date_formats' => [
        'dateFormat' => 'Y-m-d',
        'datetypecasts' => true,
        'datetimeFormat' => 'Y-m-d H:i:s',
        'datetimeutcFormat' => 'U',
        'timeFormat' => 'H:i:s',
    ],
    // ... your other configuration values

    'custom_timestamps' => [
        'created_at' => 'created',
        'updated_at' => 'updated',
    ]
]
</code></pre>

<p>Note that it is essential to use the correct case for the constants since Laravel will capitalize them during execution. After defining these constants, you can use them in your model class or queries.</p>

<h2>Disabling Timestamps</h2>

If you don't need timestamps at all, disable them by setting the <code>$timestamps</code> property to false:

<pre><code>class MyModel extends Model
{
    public $timestamps = false;
}
</code></pre>

You can also achieve this within the config/database.php file. Set the following configuration value to false:

<pre><code>
'default' => [
    // ... your other configuration values

    'timestamps' => true,
    'custom_timestamps' => [
        'created_at' => 'created',
        'updated_at' => 'updated',
    ]
]
</code></pre>

<p>This will prevent Laravel from automatically creating or updating timestamps when saving or updating your model instances. This could be useful if you already have some external system managing these timestamps, and you don't want to duplicate the effort.</p>

<h2>Conclusion</h2>

In summary, by customizing timestamp field names or disabling timestamps altogether, you can tailor your Laravel project to fit specific data management needs. These tweaks improve your project's efficiency and help make your code more readable for future developers. Remember to use constants for name customization and keep your configuration files organized, as these practices simplify version control and collaboration among team members. For in-depth guidance on this topic and more, head over to https://laravelcompany.com/blog/.
