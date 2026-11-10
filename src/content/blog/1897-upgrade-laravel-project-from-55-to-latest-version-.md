---
title: "Upgrade Laravel project from 5.5 to latest version 8"
description: "Title: Upgrade Laravel Project from 5.5 to Latest Version 8 Step by Step Guide Introduction: Upgrading your Laravel project can be a tedious but necessary..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

Title: Upgrade Laravel Project from 5.5 to Latest Version 8 Step by Step Guide

Introduction: Upgrading your Laravel project can be a tedious but necessary task if you want to keep up with the latest features and security updates. In this comprehensive guide, we'll discuss how to upgrade from Laravel 5.5 to the latest version 8 in a step-by-step manner while also providing detailed information on the configuration files involved.

Upgrading Composer Dependencies: To begin the process, update your dependencies by running composer to install all required packages. It is highly recommended that you specify the target Laravel package version. For instance, for Laravel 7, you'll need something like this: `composer require laravel/framework:^7.0`. When working with Laravel 8, it would be `laravel/laravel`.

Configuring Autoloader: After the installation is complete, check your composer.json file to ensure that the correct autoloading settings are maintained for each Laravel version. For example, in 5.5, you'll have:

<pre><code>{
&quot;autoload&quot;: {
    &quot;psr-4&quot;: {
        &quot;App\\&quot;: &quot;app/&quot;
    }
},
&quot;autoload-dev&quot;: {
    &quot;psr-4&quot;: {
        &quot;Tests\\&quot;: &quot;tests/&quot;
    }
}
}</code></pre>

For Laravel 8, you'll have:

<pre><code>{
&quot;autoload&quot;: {
    &quot;psr-4&quot;: {
        &quot;App\\&quot;: &quot;app/&quot;
    },
    &quot;classmap&quot;: [
        &quot;database/seeds&quot;,
        &quot;database/factories&quot;
    ]
},
&quot;autoload-dev&quot;: {
    &quot;psr-4&quot;: {
        &quot;Tests\\&quot;: &quot;tests/&quot;
    }
}
}</code></pre>

Note that Laravel 7 has changed the configuration slightly compared to version 5.5 and added "classmap" for database seeds and factories.

Configure Preferred Installation Type: Another crucial step is configuring your preferred installation type. In the composer.json file, there's a section named 'preferred-install':

<pre><code>{
&quot;config&quot;: {
    &quot;preferred-install&quot;: &quot;dist&quot;,
    ...
}</code></pre>

For Laravel 7 and above, this value is also set to "dist". Make sure it remains consistent throughout your project.

Upgrade Appropriate Packages: As you upgrade from one Laravel version to another, certain packages may need upgrading as well. Check the composer.json file for any required updates or new dependencies. For instance, for Laravel 5.5, you might have:

<pre><code>{
&quot;require&quot;: {
    &quot;fideloper/proxy&quot;: &quot;~3.3&quot;,
    ...
}</code></pre>

For Laravel 7 or above:

<pre><code>{
&quot;require&quot;: {
    &quot;fideloper/proxy&quot;: &quot;^4.2&quot;,
    ...
}</code></pre>

Upgrade Composer Scripts: Finally, update your composer.json file's "scripts" section based on the Laravel version you are upgrading to. For instance, for Laravel 5.5, it would be:

<pre><code>{
&quot;scripts&quot;: {
    &quot;post-root-package-install&quot;: [
        &quot;@php -r \&quot;file_exists('.env') || copy('.env.example', '.env');\&quot;&quot;
    ],
    ...
}
}</code></pre>

For Laravel 7, your scripts section will be updated as:

<pre><code>{
&quot;scripts&quot;: {
    &quot;post-autoload-dump&quot;: [
        &quot;Illuminate\\Foundation\\ComposerScripts::postAutoloadDump&quot;,
        &quot;@php artisan package:discover --ansi&quot;
    ],
    ...
}
}</code></pre>

Conclusion: Upgrading from Laravel 5.5 to the latest version involves several changes in your configuration files. Ensure that you follow each step carefully and maintain consistency, as it will guarantee a smooth transition with no conflicts along the way. For any further assistance, feel free to reach out to our experts at https://laravelcompany.com/ for Laravel development services or support.
