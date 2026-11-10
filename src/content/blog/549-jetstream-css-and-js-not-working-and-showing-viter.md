---
title: "JetStream CSS and JS not working and showing @vite(['resources/css/app.css', 'resources/js/app.js'])"
description: "Title: Troubleshooting JetStream CSS and JS Issues in Laravel Applications Body: Jetstream is a powerful front end framework that combines Livewire, Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "HTML"]
featured: false
---

Title: Troubleshooting JetStream CSS and JS Issues in Laravel Applications

Body: <p>**Jetstream is a powerful front-end framework that combines Livewire, Laravel Mix, and Tailwind to provide an efficient development environment. However, sometimes developers encounter issues with the CSS and JavaScript integration. In this blog post, we'll walk you through common problems and offer solutions for your JetStream application.**</p>
<p><a href="https://i.sstatic.net/dKv3v.png" rel="noreferrer"><img src="https://i.sstatic.net/dKv3v.png" alt="JetStream Output" /></a></p>
<p><strong>App.blade.php</strong></p>
<pre><code>&lt;html lang=&quot;{{ str_replace('_', '-', app()-&gt;getLocale()) }}&quot;&gt;
    &lt;head&gt;
        &lt;meta charset=&quot;utf-8&quot;&gt;
        &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot;&gt;
        &lt;meta name=&quot;csrf-token&quot; content=&quot;{{ csrf_token() }}&quot;&gt;

        &lt;title&gt;{{ config('app.name', 'Laravel') }}&lt;/title&gt;

        &lt;!-- Fonts --&gt;
        &lt;link rel=&quot;stylesheet&quot; href=&quot;https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&amp;display=swap&quot;&gt;

        &lt;!-- Styles --&gt;
        @livewireStyles

        &lt;!-- Scripts --&gt;
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    &lt;/head&gt;
    &lt;body class=&quot;font-sans antialiased&quot;&gt;
        &lt;x-jet-banner /&gt;

        &lt;div class=&quot;min-h-screen bg-gray-100&quot;&gt;
            @livewire('navigation-menu')

            &lt;!-- Page Heading --&gt;
            @if (isset($header))
                &lt;header class=&quot;bg-white shadow&quot;&gt;
                    &lt;div class=&quot;max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8&quot;&gt;
                        {{ $header }}
                    &lt;/div&gt;
                &lt;/header&gt;
            @endif

            &lt;!-- Page Content --&gt;
            &lt;main&gt;
                {{ $slot }}
            &lt;/main&gt;
        &lt;/div&quot;&gt;

        @stack('modals')

        @livewireScripts
    &lt;/body&gt;
&lt;/html&gt;
</code></pre>

1. Check Your Laravel Version: Make sure you are using the correct Laravel version that supports JetStream (Laravel 8+). If not, update your project to the latest stable release.
2. Clear Cache and Restart Server: Cache issues can sometimes cause problems with JetStream's CSS and JavaScript integration. Run `php artisan cache:clear` and restart your local server to ensure a fresh environment for testing.
3. Check Your Project Structure: Ensure that you have placed the files correctly within your project structure, as instructed by the Laravel documentation. Also, make sure that the specified paths in the code (resources/css/app.css and resources/js/app.js) are correct.
4. Verify Installation of Livewire and Laravel Mix: Confirm that you have installed and configured Livewire and Laravel Mix correctly as per the documentation. If not, refer to the installation guides for both packages.
5. Run NPM Commands: Ensure that your npm (Node Package Manager) is correctly installed and that you have run `npm install` and `npm run dev` in your project root directory. This will install all necessary dependencies and compile the assets.
6. Check Dependencies: Confirm that you are using the latest versions of Livewire, Laravel Mix, and their related packages, such as postcss-import, tailwindcss, autoprefixer, etc. If not, update them to the latest version by running `npm install` and `npm run dev` again.
7. Check Your Tailwind Configuration: Ensure that your tailwind.config.js file is correctly configured with the necessary imports and options relevant to your project. If necessary, refer to the Tailwind documentation for more guidance on customization.
8. Verify Your Jetstream Installation: Make sure you have installed and configured JetStream according to its official documentation, including setting up the correct folder structure and configuring your .env files.
9. Double-Check App.blade.php File: Review your app.blade.php file, particularly the code related to CSS and JavaScript integration (`@livewireStyles` and `@vite(['resources/css/app.css', 'resources/js/app.js'])`) as well as any other HTML or Livewire components.
10. Test Your Project: Run your project locally using `php artisan serve` or `npm run watch`, test your application, and see if the CSS and JavaScript are working correctly. If not, report the issue to the Laravel Company's GitHub repository for further assistance.

By following these troubleshooting steps, you should be able to resolve any issues with the JetStream integration in your Laravel application and ensure a smooth development experience.
