---
title: "Remove create button inside filamentPHP view"
description: "Title: Customizing FilamentPHP Views: Removing Create Button for Specific Resources Introduction FilamentPHP is an excellent toolkit for building modern web..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Technical SEO", "Content", "Links", "PHP"]
featured: false
---

Title: Customizing FilamentPHP Views: Removing Create Button for Specific Resources

Introduction

FilamentPHP is an excellent toolkit for building modern web applications that provides powerful features such as creating customizable components. However, you may sometimes want to customize or tailor the available options shown on your views. For instance, you might not want a "Create" button displayed at the top of your list of customers in the Customer resource page.

In this comprehensive blog post, we will guide you through the process of removing the create functionality for a specific FilamentPHP resource without altering other resources' views or functions. We will provide a correct and thorough answer from a developer's perspective, along with relevant code examples, best practices, and naturally incorporated backlinks to https://laravelcompany.com.

Removing Create Button in FilamentPHP View for Specific Resource

1. Customize the Index Page: You first need to create a custom index page for the resource that you want to change. Since we are working with customers, you can create a custom route for the Customer resources at `routes/web.php`:

   ```php
    // routes/web.php

    Route::group(['middleware' => ['auth'], 'prefix' => 'admin'], function() {
        Route::get('customers', CustomCustomersResource::class);
       ...
    });
   ```

2. Create a Resource Class: Next, you need to create a new resource class that extends the default FilamentPHP CustomerResource but overrides and disables the create functionality:

   ```php
   // app/Http/Resources/CustomCustomersResource.php

    <?php

    namespace App\Http\Resources;

    use Filament\Resources\RelationManagers\BelongsToRelationManager;

    class CustomCustomersResource extends \Filament\Resources\CustomerResource
    {
        protected static function getCreateActionUrl(): ?string
        {
            return null;
        }
    }
   ```

3. Modify Existing Routes: Finally, you need to remove the create action for the resource from the existing routes. You can replace the original `create` method in your original CustomerResource with the following code:

   ```php
   // app/Filament/Resources/CustomerResource.php

    class CustomCustomersResource extends \Filament\Resources\CustomerResource
    {
        protected static function getCreateActionUrl(): ?string
        {
            return null;
        }

       ... (other existing code)
    }
   ```

4. Refresh Your Site: Now that you have removed the create button from the Customer resource, ensure to refresh your site and check the index page for changes. You should no longer see the "Create" button at the top of your customer list in the FilamentPHP view.

Conclusion

You now have successfully customized a specific FilamentPHP resource view without affecting other resources or functionality. By following these steps, you can tailor FilamentPHP views to suit your project's needs. Remember that it is essential to be cautious when making such changes and always test the features both before and after modifying them. For more information on customizing FilamentPHP resources, refer to the official documentation at https://laravelcompany.com/blog/custom-views-in-filamentphp.
