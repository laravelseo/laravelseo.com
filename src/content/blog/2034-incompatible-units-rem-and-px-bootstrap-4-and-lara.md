---
title: "Incompatible units: 'rem' and 'px' - Bootstrap 4 and Laravel Mix"
description: "Title: Incompatible Units: 'rem' and 'px' Handling Bootstrap 4 and Laravel Mix Conflicts Introduction: Incompatibility issues are common while working with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "Errors"]
featured: false
---

Title: Incompatible Units: 'rem' and 'px' - Handling Bootstrap 4 and Laravel Mix Conflicts

Introduction:

Incompatibility issues are common while working with different libraries or frameworks that define their own CSS units, such as pixels (px) and rem. These units can lead to discrepancies while compiling SASS using a tool like Laravel Mix or Webpack. This blog post aims at providing you with a comprehensive understanding of the problem and ways to solve it.

Problem Explanation:

The issue occurs when multiple CSS units are mixed during the compilation process, causing errors like "Incompatible units: 'rem' and 'px'" in the output file. These errors can arise due to inconsistencies between frameworks or libraries that handle their own font-size values, which leads to a problematic combination of relative (rem) and absolute (px) units within the same file.

Solution 1: Using Bootstrap Mix Files with Laravel Mix:

The Laravel Mix team has already considered this issue and provided workarounds for handling different CSS frameworks like Bootstrap 4. In order to compile your app.js and app.scss files with the correct units, use the following steps:

1. Install Bootstrap Mix (bootstrap-mix) from NPM:
   `npm install bootstrap-mix --save-dev`

2. Modify webpack.mix.js:
   Include bootstrap-mix in your mix file and specify to use the 'rem' unit for all font-size properties:
   ```javascript
   const mix = require('laravel-mix');

   mix.webpackConfig((config, { mix }) => {
     config.module.rules.push({
       test: /\.scss$/,
       use: [
         // ...other loaders
         {
           loader: 'sass-loader',
           options: {
             data: `@import "node_modules/bootstrap/scss/bootstrap";\n` + mix.webpackSassLoadData(),
             includePaths: ['resources'],
             outputStyle: 'expanded',
             sassOptions: {
               indentedSyntax: false,
               sourceMap: true,
               precision: 8,
               additionalData: '@import "node_modules/bootstrap-mix/stylesheets/bootstrap-rem.scss";'
             }
           }
         },
         // ...other loaders
       ],
     });
   });
   ```
   3. Import Bootstrap Mix in app.js and app.sass:
      Include @import "node_modules/bootstrap-mix/stylesheets/bootstrap-rem.scss"; at the beginning of each file. This will ensure that all font-size values are converted to rem units automatically, preventing any incompatibility issues.

Solution 2: Using Bootstrap's Mix Files with Webpack without Laravel Mix:

If you prefer working with a more fine-grained control over SASS compilation and don't want to use the Laravel Mix framework, you can still adapt Bootstrap's mix files for your needs. This method requires some extra configuration but provides better flexibility on how you compile your CSS.

1. Install Bootstrap 4 and Bootstrap-Mix:
   `npm install bootstrap@alpha.6.0.0-beta2.3 bootstrap-mix --save-dev`

2. Modify webpack.config.js:
   Adjust the SASS loaders to include and convert rem units as follows:
   ```javascript
   // ...other configurations
   module: {
     rules: [
       {
         test: /\.scss$/,
         use: [
           // ...other loaders
           {
             loader: 'sass-loader',
             options: {
               indentedSyntax: false,
               sourceMap: true,
               precision: 8,
               additionalData: '@import "node_modules/bootstrap/scss/bootstrap";\n' + '@import "node_modules/bootstrap-mix/stylesheets/bootstrap-rem.scss";',
             }
           },
           // ...other loaders
         ],
       },
     ],
   };
   ```
   3. Import Bootstrap's mix files:
      Add the following lines at the top of your app.js and app.scss files:
      `@import "node_modules/bootstrap-mix/stylesheets/bootstrap-rem.scss";`
      This line will automatically convert all font-size values to rem units, ensuring compatibility with SASS compilation.

Conclusion:

This comprehensive guide has demonstrated how to handle incompatibilities between 'rem' and 'px' units by using different methods. By following these steps, you can maintain consistent and error-free CSS unit handling when compiling your app.js and app.scss files with Laravel Mix or Webpack. Remember that backups are essential for complex development projects to ensure smooth problem resolution in such cases.
