---
title: "Laravel 5 Class 'Collective\\Html\\HtmlServiceProvider' not found on AWS"
description: "Title: Laravel 5 Class 'Collective\\Html\\HtmlServiceProvider' Not Found on AWS: A Comprehensive Guide Body: I know there are a bunch of other questions..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

Title: Laravel 5 Class 'Collective\Html\HtmlServiceProvider' Not Found on AWS: A Comprehensive Guide

Body:

I know there are a bunch of other questions floating around out there with the same error, such as "Class 'Illuminate\Html\HtmlServiceProvider' not found Laravel 5" on Stackoverflow. My problem is that I've followed all the suggested steps to solve this issue on my local (XAMPP), and they work without a hitch. The issue arises when I go to deploy to my AWS Ubuntu box (nginx). I follow all the usual instructions: <a href="http://laravelcollective.com/docs/5.1/html#installation">Installation of Laravel Collective HTML</a>.

My providers and aliases had been added when I did a git pull from what I had pushed from my local. Perhaps this file should have been gitignored, and the change was made manually on the server:

<pre><code>Next, add your new provider to the providers array of config/app.php:
  'providers' =&gt; [
    // ...
    Collective\Html\HtmlServiceProvider::class,
    // ...
  ],

Finally, add two class aliases to the aliases array of config/app.php:
  'aliases' =&gt; [
    // ...
      'Form' =&gt; Collective\Html\FormFacade::class,
      'Html' =&gt; Collective\Html\HtmlFacade::class,
    // ...
  ],
</code></pre>

I then manually added:
<pre><code>Begin by installing this package through Composer. Edit your project's composer.json file to require laravelcollective/html.

"require": {
    "laravelcollective/html": "5.1.*"
}
</code></pre>

And finally, I ran:
<pre><code>composer.phar update
</code></pre>

It was running this command that throws the error:
<p class="codeblock">Class 'Collective\Html\HtmlServiceProvider' not found in /usr/share/nginx/html/cbt/vendor/compiled.php on line 6716</p>

I then tried running <code>php artisan clear-compiled</code>, to see if that would do anything, and got:
<pre><code>PHP Warning: Module 'mcrypt' already loaded in Unknown on line 0
PHP Fatal error: Class 'Collective\Html\HtmlServiceProvider' not found in /usr/share/nginx/html/cbt/vendor/compiled.php on line 6716

[Symfony\Component\Debug\Exception\FatalErrorException]
Class 'Collective\Html\HtmlServiceProvider' not found</code></pre>

I know my Nginx Ubuntu environment is not the same as a Windows XAMPP env, but I'm still unsure why following the Laravel-provided instructions for adding this doesn't seem to work. Would greatly appreciate some advice on this.

Cheers!

In order to solve your issue, it appears that there are potentially multiple reasons behind this error. Firstly, ensure you have all the required libraries installed on your AWS Ubuntu environment. You should install mcrypt and its dependencies if not already present. Also, check whether Composer is properly configured and working on your system.

Secondly, try to run composer update again while passing --no-scripts option to avoid any third-party scripts being run: <code>composer update --no-scripts</code>. This might help resolve the issue related to the mcrypt module being loaded before Composer has a chance to install needed packages.

If the problem persists, verify that you've indeed added Collective\Html\HtmlServiceProvider::class in your provider array and its aliases in the config/app.php file. Also, check the composer.json file to ensure laravelcollective/html is included as a dependency. Make sure there are no conflicts with other installed packages that might cause any issues with Laravel Collective HTML integration.

Finally, if none of the above steps resolves your problem, contact Laravel or its community for further assistance on this matter. They may provide tailored solutions based on your specific environment and setup.

In conclusion, to overcome this issue, make sure all necessary libraries are installed, properly configure Composer, ensure correct package inclusion in composer.json and config/app.php files, and avoid any conflicting dependencies with other packages. If these steps do not solve the problem, seek help from Laravel's official resources or community for a bespoke solution.
