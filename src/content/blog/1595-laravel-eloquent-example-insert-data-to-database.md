---
title: "laravel: eloquent example insert data to database"
description: "Title: Mastering Laravel Eloquent Model Insertion with Examples Body: Welcome to this in depth guide on Eloquent model insertion within Laravel framework...."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Mastering Laravel Eloquent Model Insertion with Examples
Body:
<p>Welcome to this in-depth guide on Eloquent model insertion within Laravel framework. Understanding how to work with models using this powerful ORM tool is crucial for efficient data handling. In this blog post, we will walk you through a step-by-step process of creating and connecting products and brands in your database. Let's get started by first defining our tables.</p>

<p>To begin, let's define the relationships between your product and brand tables:</p>

<ul>
  <li>products: id (PK), name, description, brand_id</li>
  <li>brands: id (PK), name</li>
</ul>

<p>Since you want to create a new product and link it to a specific brand automatically, we need to use Eloquent relationships. In this context, an inverse-one relationship is appropriate since only one brand can be related to each product. Let's rewrite your code for creating and saving the new product and brand:</p>

<pre><code>    $product = new Products;
    $product->name = "product1";
    $product->description = "description1";

    $brand = new Brands;
    $brand->name = "brand1";
    $product->brand()->associate($brand);

    $product->save(); // save product first
    $brand->save();   // then save the brand
</code></pre>

<p>The above code snippet creates a new instance of `Products` and associates it with the newly created `Brands` instance. After creating both objects, you save the `Products` object first to ensure that the relationships are established before saving the `Brands` table.</p>

<p>Now let's take a look at your current Products model and make some changes:</p>

<pre><code> class Products extends Eloquent  {

    protected $table = 'products';

    public function brand()
    {
       return $this-&gt;hasOne('brands');
    }
}
</code></pre>

<p>The current code defines the table name, "Products," and establishes a one-to-one relationship with the Brands model. However, it does not set up the relationship at the time of creating a new product or brand instance. To make this change, we can add a mutator within the Products model:</p>

<pre><code>class Products extends Eloquent  {

    protected $table = 'products';

    public function brand()
    {
       return $this-&gt;hasOne('brands');
    }

    public function setBrandAttribute($value)
    {
        $this->brand_id = (int)$value;
    }
}
</code></pre>

<p>Now, when you assign a brand name to your product model in the controller, it will automatically store the brand id inside the `product.brand_id` column during the product save operation.</p>

<p>To summarize, working with Eloquent relationships involves understanding the table structures and identifying the appropriate relationship types between models. The code above demonstrates how to create a product with an associated brand using Eloquent model insertion. By following best practices and incorporating mutators in your models, you can ensure efficient data handling during your Laravel applications.</p>

<p><a href="https://laravelcompany.com/blog/mastering-eloquent-relationships">Learn more about mastering Eloquent relationships</a> and explore the amazing capabilities of this ORM tool in Laravel framework.</p>
