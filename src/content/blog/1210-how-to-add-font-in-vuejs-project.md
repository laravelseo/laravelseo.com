---
title: "How to add font in Vue.js project"
description: "Title: Effortlessly Add Fonts to Your Vue.js Project Using Laravel Mix and SCSS Introduction Incorporating new fonts into your Vue.js project is an essential..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript"]
featured: false
---

Title: Effortlessly Add Fonts to Your Vue.js Project Using Laravel Mix and SCSS

Introduction

Incorporating new fonts into your Vue.js project is an essential part of creating a visually appealing interface for your users. By understanding the proper process, you can seamlessly integrate custom fonts into your existing development workflow using Laravel Mix along with Sass and CSS preprocessors. This comprehensive guide will walk you through the steps required to successfully add fonts to your Vue.js project.

Step 1: Prepare Font Files

Begin by gathering all the necessary font files that you wish to use in your project. For this example, we'll assume you have a 'Proxima-Nova-Bold.otf' file containing the desired font. Make sure the fonts are accessible and properly organized within your project directory.

Step 2: Create Font Variables in SCSS

The Laravel Mix setup requires you to create a font-related variable inside your SCSS files. First, create an Sass file named 'fonts.scss' and place it in your project root. In this file, define a new font variable containing the details of your newly added font:

<pre><code>@font-face {
  font-family: "Proxima Nova Bold";
  src: url(/Proxima-Nova-Bold.otf);
}

$proxima-nova-bold: 'Proxima Nova Bold', sans-serif;
</code></pre>

Step 3: Include Fonts in Your Vue Components

In your Vue components, you'll need to import and use the imported scss file containing your font variables. This is done by adding @import directives into your component files, specifying the path to your fonts.scss folder:

<pre><code>@import '../../../fonts/fonts.scss';
</code></pre>

Step 4: Update Laravel Mix Configuration

Laravel Mix is responsible for compiling and processing assets during development. To facilitate the addition of fonts to your project, ensure that you've included them in the appropriate task with your other assets. This can be achieved by updating your 'mix.js' file accordingly:

<pre><code>let mix = require('laravel-mix');

mix.copy('resources/assets/images', 'public/images', false)
    .js('resources/assets/js/app.js', 'public/js')
    .sass('resources/assets/sass/app.scss', 'public/css')
</code></pre>

Step 5: Verify the Result

Now, run your Laravel Mix development server and test your project to ensure that the new font is properly incorporated into your application (this might require a browser refresh or reload if the CSS cache is enabled). If all goes well, you can confidently use your newly added fonts throughout your Vue.js project.

Conclusion:

Adding custom fonts to your Vue.js project is an important aspect of creating visually appealing interfaces for your users. By following the steps outlined in this blog post and understanding the importance of proper organization, you can ensure that your application remains user-friendly and aesthetically pleasing.
