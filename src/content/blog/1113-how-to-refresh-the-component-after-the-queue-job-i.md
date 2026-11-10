---
title: "How to refresh the component after the queue job is finished?"
description: "Title: Efficiently Refreshing Components After Queue Jobs are Finished Introduction: Laravel is an amazing framework that provides numerous tools to help..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "PHP"]
featured: false
---

Title: Efficiently Refreshing Components After Queue Jobs are Finished

Introduction:
Laravel is an amazing framework that provides numerous tools to help build efficient and scalable web applications. One such tool is the Queue system, which allows developers to process heavy tasks asynchronously without interfering with user interactions. However, sometimes we need real-time updates after a queue job is finished, especially when working with data. In this blog post, we will discuss a practical approach using Laravel and Livewire to achieve this goal.

Prelude:
To follow the steps mentioned in this article, you must have a basic understanding of Laravel framework, Queue system, and Livewire (a modern Laravel-based framework for building interactive and real-time web applications). You also need to have a working project that requires updating component data or views once a queue job is finished.

Step 1: Update Component Data Model:
First, let's update our product model to include the relationship between jobs and statuses. Create a new column in your 'products' table called 'job_status_id'. This column will hold the job_status id corresponding to the current job processing for each product. Now, update the Product model (assuming it is named App\Product) with this code:

<pre><code>class Product extends Model
{
    public function jobStatus()
    {
        return $this->belongsTo(JobStatus::class);
    }
}
</code></pre>

Step 2: Creating a Livewire Component:
Next, we will create a component to display the product's status. Create a new file named 'ProductIndex.php' under your application's 'livewire' folder and use Livewire to build the view for each product in the index. This will help the user see the product's job status.

<pre><code>class ProductIndex extends Component
{
    public $product;

    public function mount($product)
    {
        $this->product = $product;
    }

    public function render()
    {
        return view('livewire.merchant.product.index');
    }
}
</code></pre>

Step 3: Showing Product Images Based on the Job Status:
Inside your 'product-index' component, we will check if the product's job_status has a 'finished' status and show either the real image or loader accordingly.

<pre><code>@if ($product->jobStatus()->first()?->status == 'finished')
  // show real image 
@else
  // show loader
@endif
</code></pre>

Step 4: Updating View to Display Products with Jobs in Progress:
Finally, update your view (assuming it's named 'product-index.blade.php') to display products with jobs in progress and their statuses using the Livewire component we just created.

<pre><code>@foreach ($products as $product)
  &lt;livewire:merchant.product.product-index :product=&quot;$product&quot; :key=&quot;$product->id&quot;&gt;
@endforeach
</code></pre>

Conclusion:
With the above steps, you can now refresh the product component after a queue job is finished. This provides real-time updates and a more interactive user interface in your Laravel application. Remember to always implement best practices for coding and design while handling asynchronous tasks using Queue jobs.
