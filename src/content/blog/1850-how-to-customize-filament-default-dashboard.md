---
title: "how to customize filament default dashboard?"
description: "Title: Customizing Filament's Default Dashboard: A Comprehensive Guide Introduction The default dashboard of the Laravel Filament Admin is a vital component..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Customizing Filament's Default Dashboard: A Comprehensive Guide

Introduction
The default dashboard of the Laravel Filament Admin is a vital component for managing your application. However, it may not always align with your requirements or desired design. Fortunately, customizing it to suit your needs is possible by modifying its appearance and functionality. In this blog post, we will explore how to change the default dashboard while maintaining compatibility with Filament's core features.

Customizing Dashboard Appearance
1. Create a new file named `Dashboard.php` under the `app/Filament/Pages` directory.
2. Add the following code inside the new file:
```php
<?php

namespace App\Filament;

use Livewire\Component;

class Dashboard extends Component
{
    /**
     * Get the view component name for the "create" operation.
     *
     * @return string
     */
    public function createView()
    {
        return 'dashboard-create';
    }

    /**
     * Get the view component name for the "view" operation.
     *
     * @param mixed $recordId
     * @return string
     */
    public function viewView($recordId)
    {
        return 'dashboard-view';
    }

    /**
     * Get the view component name for the "edit" operation.
     *
     * @param mixed $recordId
     * @return string
     */
    public function editView($recordId)
    {
        return 'dashboard-edit';
    }

    /**
     * Get the view component name for the "delete" operation.
     *
     * @param mixed $recordId
     * @return string
     */
    public function deleteView($recordId)
    {
        return 'dashboard-delete';
    }
}
```
3. Remove the original `Dashboard.php` class from `filament.php`.

Customizing Dashboard Functionality
In this section, we will explore how to add custom functionality to your dashboard by implementing a new class and updating `filament.php`.

1. Create a file named `DashboardController.php` under the `app/Filament/Pages/Controllers` directory. Add the following code:
```php
<?php

namespace App\Filament;

use Filament\Resources\Frontend\Pages\ManageResource as ResourceManager;

class DashboardController extends ResourceManager
{
    /**
     * Get the resource model's table name.
     *
     * @return string
     */
    protected function getTable()
    {
        return 'dashboard';
    }
}
```
This class will allow you to manage your newly created dashboard through the Filament interface.

2. In `filament.php`, add the following code:
```php
'pages' => [
    'namespace' => 'App\\Filament\\Pages',
    'path' => app_path('Filament/Pages'),
    'register' => [
        \App\Filament\DashboardController::class,
    ],
],
```
This configuration will register the new controller class and associate it with the newly created `Dashboard.php` file.

Handling Multiple Dashboard Options in the Sidebar
If you encounter multiple instances of the dashboard option in the sidebar, consider modifying your `sidebar.blade.php` file to include only the desired option:
```html
<li class="{{ $activePage === 'dashboard' ? 'active' : '' }}" data-filament-page="Dashboard">
    <a href="{{ route('filament.pages.dashboard') }}">
        {{ __('Dashboard') }}
    </a>
</li>
```
Replace the `Dashboard` class with your custom dashboard's controller name, if required:
```html
<li class="{{ $activePage === 'dashboard-custom' ? 'active' : '' }}" data-filament-page="CustomDashboardController">
    <a href="{{ route('filament.pages.custom-dashboard') }}">
        {{ __('My Custom Dashboard') }}
    </a>
</li>
```

Conclusion
By following the steps outlined in this blog post, you can successfully customize Filament's default dashboard to align with your application needs and maintain Filament's core functionality. With a well-structured approach, you can create unique dashboards that cater to different user-level requirements without compromising ease of use or performance.
