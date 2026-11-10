---
title: "Collection Where LIKE Laravel 5.4"
description: "Title: Achieving Collection Where LIKE Equivalence in Laravel 5.4 Introduction: Collection doesn't natively support \"where LIKE\" queries. However, you can..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords"]
featured: false
---

Title: Achieving Collection Where LIKE Equivalence in Laravel 5.4

Introduction: Collection doesn't natively support "where LIKE" queries. However, you can still achieve this functionality by leveraging some innovative techniques that involve using regular expressions or other methods to mimic the desired outcome. This blog post aims to provide a comprehensive and thorough answer for those seeking an alternative approach to handling collection queries with LIKE-like conditions in Laravel 5.4.

Body:

In the given code example, you use `collect($products)->where('name', 'LIKE', '%'. $productName . '%')` to filter products by their name like a specific string. Unfortunately, this syntax isn't supported by collections in Laravel 5.4. To achieve a similar result without native support, you can use other techniques that involve looping through the collection or utilizing regular expressions.

One method involves filtering the collection with a closure:

<pre><code>collect($products)-&gt;filter( function () use ($productName) {
    return preg_match(pattern, subject);
});
</code></pre>

Here, `preg_match` is used to verify if the product name matches a particular pattern. However, this method requires you to convert the query string into a regular expression. You can achieve this by wrapping your query with additional '%' characters:

<pre><code>$pattern = '/^%'. $productName . '%/' . $query; // Construct the query pattern using % as wildcards
collect($products)-&gt;filter( function () use ($pattern) {
    return preg_match($pattern, $subject);
});
</code></pre>

This approach may not be 100% accurate for strict LIKE queries but can still fulfill the desired functionality. By combining the placeholder '%' with the actual query string in the regex pattern, you provide a wildcard-like effect when searching through the collection.

Another possible technique is to use Laravel's database connection methods, such as `whereRaw` or `whereJsonPath`, which allow for customized queries. You can execute custom SQL statements by using the `->get()` method and then filter your results within PHP:

<pre><code>$products = DB::table('products')->whereRaw("name like '%". $productName . "%'")->get();
// Filter the products that match the query string
collect($products)-&gt;filter( function () { return true; })-&gt;values()
</code></pre>

This method executes a custom SQL statement, specifying the 'LIKE' condition with wildcard characters. The result of this query is then retrieved and passed to the collection for filtering based on your desired criteria. Please note that running raw queries can introduce security risks if not executed carefully.

Conclusion: In summary, while Laravel doesn't natively support 'where LIKE' in collections, you can achieve a similar functionality by utilizing regular expressions, custom SQL statements, or other techniques within the framework to work around this limitation. Always ensure your queries are well-secured and tested before executing them for production use. For more specific guidance on handling collection queries with LIKE conditions, visit our Laravel Company blog posts or reach out to us for further assistance.
