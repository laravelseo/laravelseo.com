---
title: "How to get results with where condition in Filament Admin Resource"
description: "Title: Efficiently Filtering Users Based on is admin Field Using Filament Admin Resources Introduction: In this article, we will explain how to effectively..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Efficiently Filtering Users Based on is_admin Field Using Filament Admin Resources

Introduction: In this article, we will explain how to effectively filter users based on the is_admin field in your Laravel application using Filament Admin Resources. We will discuss the importance of proper data management and provide you with guidelines for implementing an efficient solution. As Laravel Company experts, we're well-versed in both the Laravel framework and Filament tools, so rest assured that these tips are tried and tested.

1. Understanding the Model and the Field
Firstly, make sure your User model has a field called 'is_admin'. This attribute is used to distinguish between different types of users within your application. It will be utilized in your Filament Admin Resources to create a more user-friendly experience for managing these models. Remember that this is just an example and the exact model name may differ based on your project requirements.

2. Setting up Filament Admin Resources
In order to work with Filament Admin Resources, you must first install Laravel with both Filament and Spatie/Laravel-Enum packages:
```bash
composer require livewire/filament laravel/filament spatie/laravel-enum
```
Next, run the following command to update your package autoloading files:
```bash
composer dump-autoload
```
Then, add 'Filament\Support\Components\Resources\Form' and 'Livewire\Component' on top of your AdminUser resource file.
```php
namespace App\Admin\Resources;

use Filament\Support\Components\Resources\Form;
use Livewire\Component;
```

3. Defining the is_admin Condition
As a best practice, define a custom search method with a where clause for the is_admin field within your User resource class. This will allow you to easily filter users based on this attribute:

```php
class AdminUser extends Component\Resource\Page
{
    public $search; // Define a search property so we can query filtered results.

    protected static $model = App\Models\User::class;

    /**
     * Get the search value for the resource.
     */
    public function search(): string
    {
        return $this->search ?? ''; // Return an empty string if not set explicitly.
    }

    protected static function getResourceRelations(): array
    {
        return [
            'roles' => \App\Models\Role::class,
        ];
    }

    public function form(Form $form): void
    {
        // Rest of your form code here.
    }

    /**
     * Apply search filters to the resource collection.
     */
    protected static function getSearchQuery($query): ModelBuilder
    {
        if (strlen($searchTerm = trim($query->get('search'))) > 0) {
            $query
                ->where(function ($user) use ($searchTerm) {
                    $user->where('is_admin', 0); // Specify the is_admin condition.
                    if (strlen($searchTerm) > 0) {
                        $user->orWhere(function ($q) use ($searchTerm) {
                            $q->whereHas('roles', function ($role) use ($searchTerm) {
                                $role->where('name', 'like', '%' . $searchTerm . '%'); // Perform a search using the role name.
                            });
                        });
                    }
                })
                ->orWhereHas('roles', function ($q) use ($searchTerm) {
                    $q->where('name', 'like', '%' . $searchTerm . '%'); // Perform a search using the role name.
                });
        }

        return $query;
    }
}
```

4. Final Touches and Considerations
Once you have implemented these changes, you can revisit your Filament Admin Resource to utilize the new search functionality. If desired, you can also customize the layout of the search bar or even add a checkbox for selecting is_admin values in your form. To improve performance further, consider utilizing query scopes based on whether the 'is_admin' attribute is set within your model.

As an added tip, make sure to use natural language processing techniques when designing filters and searches to ensure an intuitive user experience. In our example, instead of using numbers like 0 and 1 for 'is_admin', using terms like 'Admin' and 'Non-Admin' will be more understandable for users.

Conclusion: Implementing proper data management through Filament Admin Resources makes your application easier to use while also improving its performance. As a Laravel Company expert, we hope this tutorial has given you the tools necessary to create a better user experience in your app. Remember that well-structured code and clear communication go hand in hand with achieving these goals. By adhering to best practices, you can ensure a seamless filtering experience for all users interacting with your application's resources.
