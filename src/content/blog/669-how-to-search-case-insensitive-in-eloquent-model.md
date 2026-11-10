---
title: "How to search case insensitive in Eloquent model"
description: "Title: Achieving Case Insensitive Searches in Eloquent Models Introduction: When working with Eloquent models, it is often essential to account for different..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords", "Performance"]
featured: false
---

Title: Achieving Case-Insensitive Searches in Eloquent Models

Introduction: <p>When working with Eloquent models, it is often essential to account for different character cases (uppercase vs lowercase) during searches. By default, Eloquent model queries use case sensitivity when matching values through its built-in methods such as 'where'. This blog post aims to explain how you can perform case-insensitive searches using Eloquent models by exploring various techniques and best practices.</p>

Case-Insensitive Searches in Eloquent Models: <p>With Eloquent, it's possible to leverage the power of MySQL or PostgreSQL to perform case-insensitive queries. Although these databases use the IGNORECASE option by default when executing queries, you can still apply your own custom logic through the database connection configuration or using raw SQL statements in Laravel models.</p>

Enhancing Eloquent Model Queries: <p>For more control over Eloquent model searches, you can modify your application's database configuration to set the 'caseSensitiveIndexing' option to 'false'. This would ensure that all queries executed through your Laravel app will have case-insensitive processing. However, this approach may be less optimal since it affects all queries throughout the entire application.</p>

Using Raw SQL Statements: <p>Another approach is to use raw SQL statements within Eloquent models for individual searches that require specific case-insensitivity. This can be done by constructing your query using the 'raw' method and passing in a prepared statement with appropriate case-insensitive syntax. For example:</p>
<pre><code>Model::whereRaw('LOWER(column) LIKE LOWER(:value)', array(':value' => $value));
</code></pre>
<p>This query performs a case-insensitive search on the 'column' field and matches it against the given value, utilizing LOWER() function to ensure equality.</p>

Combining Techniques for Optimal Performance: <p>For more complex queries or scenarios where you need to perform multiple operations while maintaining case-insensitivity, you could combine different approaches. For instance, you can initially use a regular Eloquent model query and then modify the results by applying custom filters on the obtained collection.</p>
<pre><code>$collection = Model::where('column', 'like', '%' . $value . '%');
foreach ($collection as $item) {
    if (strtolower($item->column) === strtolower($value)) {
        // Perform additional operations or filtering on case-insensitive matches.
    }
}
</code></pre>

Conclusion: <p>Searching for case-insensitive values in Eloquent models can be achieved using various techniques and strategies. You can leverage your database configuration options, use raw SQL statements within your eloquent queries, or combine different approaches to build a custom solution that fits your project's requirements. By doing so, you ensure your Eloquent model searches are both effective and efficient, regardless of character case.</p>

Remember to also explore more advanced techniques such as using regular expressions in your search queries for even greater flexibility and precision in handling different data types. With a deeper understanding of how to tailor Eloquent model searches according to your needs, you can create robust and scalable applications with ease.
