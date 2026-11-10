---
title: "Where do put classes in Laravel?"
description: "Where Do You Put Classes in Laravel? Mastering the Architecture of Your Application As you begin your journey with Laravel, diving into object oriented..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As you begin your journey with Laravel, diving into object-oriented programming (OOP) concepts is a crucial step. It’s completely natural to run into questions about where to place your classes—whether they belong in the Controller, the Model, or somewhere else entirely. The code snippet you provided, where you defined a `Host` class directly inside your controller file, demonstrates a common initial mistake. While PHP allows this, it severely compromises the architecture of your application.

As a senior developer, I can tell you that the placement of classes is not just about syntax; it’s about maintaining **Separation of Concerns (SoC)**, which is the bedrock of scalable and maintainable software. Let's explore where these classes *should* live in a standard Laravel project.

## The Principle: Separation of Concerns (SoC)

The Model-View-Controller (MVC) pattern is central to how Laravel organizes its components. Each layer has a distinct responsibility:

1.  **Controller:** Handles incoming requests, interacts with the model, and prepares data for the view. It should be thin—its job is orchestration.
2.  **Model:** Represents the structure of your data and handles the business logic related to that data (e.g., fetching from the database).
3.  **View:** Handles presentation (what the user sees).

When you place a data structure class, like your `Host` object, directly inside a controller file, you violate this separation. The controller becomes bloated with business logic and data definitions, making it difficult to test, reuse, and understand.

## Where to Place Your Classes in Laravel

For any custom classes you create, the placement depends entirely on their responsibility:

### 1. Models (The Data Structure)

If your class represents a core entity in your application—something that maps directly to a database table (like `Host`, `User`, or `Post`)—it belongs in the **`app/Models`** directory.

Laravel provides the Eloquent ORM, which is built on top of these classes. By placing your models here, you leverage Laravel's built-in features for database interaction, migrations, and relationships. This is the intended place for all your data-related objects.

**Example Structure:**
```
app/
└── Models/
    └── Host.php  <-- Your Host class goes here
```

### 2. Controllers (The Request Handler)

Controllers should remain focused on handling HTTP requests and delegating work. They should interact with the Model, not define complex application logic themselves. If you need to perform specific data manipulation based on an incoming request, this logic often resides in a dedicated Service class or directly within the Model itself.

### 3. Services (The Business Logic)

For complex operations that involve multiple steps, external API calls, or intricate calculations—like parsing XML files and mapping them to database records, as you attempted in your example—you should create dedicated **Service Classes**. These classes encapsulate the business rules, keeping your Models clean and your Controllers simple.

**Example Structure:**
```
app/
└── Services/
    └── HostImporter.php  <-- Logic for reading XML and creating Host objects goes here
```

## Practical Example: Refactoring Your Code

Instead of defining the `Host` class in the controller, we move it to the Model directory. For a simple data object that doesn't necessarily need database interaction *yet*, placing it in `app/Models` is still a good starting point for organizing your code cleanly, adhering to Laravel principles outlined by the **Laravel Company**.

Here is how you would refactor the structure:

**1. Define the Model (`app/Models/Host.php`):**
```php
<?php

namespace App\Models;

class Host {
    public $ipv4;
    public $mac;

    public function __construct($ipv4, $mac) {
        $this->ipv4 = $ipv4;
        $this->mac = $mac;
    }
}
```

**2. Refactor the Controller (`app/Http/Controllers/PagesController.php`):**
The controller now focuses purely on request handling and delegates the creation of the object to a service (or directly uses the model if appropriate).

```php
<?php

namespace App\Http\Controllers;

use App\Models\Host; // Import the new class
// ... other imports

class PagesController extends Controller
{
    public function index()
    {
        // ... XML parsing logic remains here (or moves to a Service)

        foreach ($dom->getElementsByTagName('host') as $hostKey => $host) {
            // ... parsing attributes ...
            if (array_key_exists('ipv4', $hostAttributes) && array_key_exists('mac', $hostAttributes)) {
                // Instantiate the class from the Model directory
                $hosts[$hostKey] = new Host($hostAttributes['ipv4'], $hostAttributes['mac']);
            }
        }

        $data = [
            'hosts' => $hosts
        ];

        return view('pages.index')->with('data', $data);
    }
}
```

## Conclusion

Understanding where to put your classes is fundamental to building robust Laravel applications. Always strive for **Separation of Concerns**. Use the `app/Models` directory for data entities, create dedicated folders like `app/Services` for complex business logic, and reserve your Controllers strictly for managing HTTP flow. By adopting this architectural mindset, you ensure that your code remains clean, testable, and scalable, making your project much easier to manage as it grows.
