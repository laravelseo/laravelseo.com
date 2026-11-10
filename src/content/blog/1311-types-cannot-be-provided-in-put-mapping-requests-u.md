---
title: "Types cannot be provided in put mapping requests, unless the include_type_name parameter is set to true"
description: "Title: Understanding Mapping Types and Best Practices for Elasticsearch Integration with Laravel Scout Body: Elasticsearch is an open source, distributed..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "SEO", "Technical SEO", "Links"]
featured: false
---

Title: Understanding Mapping Types and Best Practices for Elasticsearch Integration with Laravel Scout

Body:
<p>Elasticsearch is an open source, distributed search and analytics engine, used to store, index, and query complex data types like JSON structures. It's a powerful tool that helps you manage large amounts of data in near real-time. Laravel Scout is an official package for Laravel that enables seamless integration with Elasticsearch. However, recent changes in Elasticsearch have brought new challenges while using mapping types.</p>

<p><strong>The Issue:</strong> In previous versions of Elasticsearch (< 6.0), indices could have multiple mapping types to support different data structures and document types. However, these types will be removed completely in Elasticsearch 7.x. This change affects how Laravel Scout's Elasticsearch driver interacts with the search engine.</p>

<p><strong>The Solution:</strong> If you're using the <a href="https://github.com/babenkoivan/scout-elasticsearch-driver" rel="nofollow noreferrer">Scout-Elasticsearch driver</a>, Ivan Babenko provides two suggested methods to work around this issue. First, you can explicitly include the type_name parameter when creating indices using PUT requests:</p>
<pre><code>PUT index?include_type_name=true // This is method 1
{
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0
    },
    "mappings": {
        "properties": {
            "foo": "text"
        }
    }
}
</code></pre>
<p><strong>An Alternative Approach:</strong> Secondly, you can create the _doc index template by simply placing a document with desired mapping in your Elasticsearch index. Using this method will have the downside of having to manually assign IDs for each new document. Here's an example:</p>
<pre><code>PUT index/_doc/1
{
  "foo": "baz"
}
</code></pre>
<p><strong>How to Use Laravel Scout with Mapping Types:</strong> To use the new mapping types in your Elasticsearch indices, you can extend <a href="https://laravel.com/docs/8.x/scout#index-configuration" rel="nofollow noreferrer">IndexConfigurator</a>. An example configuration is shown below:</p>
<pre><code>class TestIndexConfigurator extends IndexConfigurator
{
    use Migratable;
    /**
     * @var array
     */
    protected $settings = [
        "number_of_shards" => 3,
        "number_of_replicas" => 0
    ];
    protected $name = 'test';
}
</code></pre>
<p><strong>Conclusion:</strong> To work with indices without mapping types, you can choose either one of the above methods depending on your preference. If you're using Laravel Scout, you should extend the IndexConfigurator class and define the desired settings according to your Elasticsearch indices.</p>
<p><strong>Note:</strong> When using Laravel 8+ and updating the driver from scout-elasticsearch-driver, ensure you use the <a href="https://laravel.com/docs/8.x/scout#index-configuration" rel="nofollow noreferrer">newly provided methods</a>. They make it easier to work with Elasticsearch indices and mapping types.</p>
<p><strong>Additional Resources:</strong> For additional help, check out the <a href="https://laravelcompany.com/blog/integrating-laravel-and-elasticsearch" rel="nofollow noreferrer">Laravel Company Blog</a> on Elasticsearch and Laravel integration or refer to the <a href="https://docs.elastic.co/guide/en/elasticsearch/reference/7.x/mapping-types.html" rel="nofollow noreferrer">Elasticsearch documentation</a> for further information on mapping types.</p>
<p><strong>Summary:</strong> In summary, to use the driver for Laravel Scout with Elasticsearch in a way that supports the removal of mapping types, you can either set the <code>include_type_name</code> parameter or create the _doc index template. Alternatively, you can extend the IndexConfigurator class in your project, where you define the settings for your indices. The most important aspect is to stay updated with Laravel and Elasticsearch best practices.</p>
