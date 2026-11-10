---
title: "How to install bootstrap in laravel 8"
description: "Title: Installing Bootstrap Efficiently in Laravel 8 A Comprehensive Guide Body: As the developer community continues to evolve, so do their technologies and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "PHP"]
featured: false
---

Title: Installing Bootstrap Efficiently in Laravel 8 - A Comprehensive Guide

Body:
<p>As the developer community continues to evolve, so do their technologies and processes. In the case of Laravel 8, you've noticed that <code>laravel/ui</code> is no longer recommended for installing Bootstrap. While it was a handy solution in earlier versions, things have changed. This comprehensive guide aims to provide a clear path on how to seamlessly integrate Bootstrap into your Laravel 8 applications.</p>

<h2>Step 1: Install Bootstrap's CDN</h2>
To start with, you need to utilize Bootstrap's Content Delivery Network (CDN) instead of installing the framework locally. This will simplify future updates and management, as well as ensure that your application operates smoothly without local dependencies.

<p><code>http://bootstrapcdn.com/</code> or <code>https://cdn.jsdelivr.net/</code> are two popular Bootstrap CDN sources that you can use in Laravel. Add the below code snippet to your application's layout file (usually <code>resources/views/layouts/app.blade.php</code>) or where you want Bootstrap CSS to be loaded.</p>

<pre><code>// Add this line after opening &lt;head&gt; tag
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0v2IP9RqcsEnOC0VXJCNmfOpQS1zjAE MGE/XHQ7P/5KuwkGY/OdDExmpCruweg/XxA4nkEQ" crossorigin="anonymous" />
</code></pre>

<h2>Step 2: Add Custom CSS or JavaScript Files</h2>
If you're planning to add any custom CSS changes or additional JavaScript files, do so within your layout file. This ensures that all assets are loaded correctly and consistently throughout the application.

<p><code>resources/views/layouts/app.blade.php</code></p>
<pre><code>@extend('layouts.master')

@section('stylesheets')
    <link rel="stylesheet" href="{{ asset('css/style.css') }}" />
    <!-- Add any other custom CSS files here -->
@show

@section('scripts')
    <script src="{{ asset('js/app.js') }}"></script>
    <!-- Add any other custom JavaScript files here -->
@show
</code></pre>

<h2>Step 3: Organize Your Assets for Easy Management</h2>
Create a dedicated folder to store your application's assets like CSS, images, and JavaScript. This helps maintain a clear structure and enables efficient development and maintenance.

<p><code>public/assets</code></p>

Now, organize the files under this directory:
- <code>css</code> for your custom stylesheets
- <code>js</code> to store JavaScript plugins or libraries related to Bootstrap, or your custom scripts
- <code>img</code> for images and other media assets

<h2>Step 4: Create a Custom Component for Bootstrap Elements</h2>
To improve code organization, create a dedicated Laravel Blade component for each Bootstrap element you need. This allows for easy customization and maintenance while minimizing repetitive coding tasks.

<p><code>app/Http/Livewire/Components/BootstrapButtonComponent.php</code></p>
<pre><code>namespace App\Http\Livewire\Components;

use Livewire\Component;

class BootstrapButtonComponent extends Component
{
    public $color = 'primary';

    public function render()
    {
        return view('components.bootstrap-button')
            ->with([
                'label' => $this->label,
                'color' => $this->color,
            ]);
    }
}
</code></pre>

<p><code>resources/views/components/bootstrap-button.blade.php</code></p>
<pre><code>&lt;div class="btn btn-{{ $color }}"&gt;&lt;/div&gt;
    <span class="form-label">Label:</span> {{ $label }}
</code></pre>

In your application code, you can then use the component as follows:
<pre><code>@livewireScripts

@component('components.bootstrap-button', ['color' => 'primary', 'label' => 'Click Me'])
    @slot('label')
        This is a nice button
    @endslot
@endcomponent
</code></pre>

<h2>Conclusion</h2>
By following these steps and incorporating the best practices, you can ensure a seamless integration of Bootstrap into your Laravel 8 applications. Always remember to update your CDN source for the latest version of Bootstrap and keep an eye on any new developments in this ever-evolving world of web development.
