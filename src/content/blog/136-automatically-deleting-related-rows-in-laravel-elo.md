---
title: "Automatically deleting related rows in Laravel (Eloquent ORM)"
description: "Title: Effortlessly Managing Related Rows Deletion with Laravel Eloquent ORM Introduction: In Laravel, the Eloquent Object Relational Mapper (ORM) provides a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Effortlessly Managing Related Rows Deletion with Laravel Eloquent ORM

Introduction:
In Laravel, the Eloquent Object Relational Mapper (ORM) provides a convenient and efficient way to interact with your database models. Its powerful features allow you to perform complex operations seamlessly. In this comprehensive blog post, we will discuss how to automatically delete related rows when deleting a parent row using Laravel's Eloqueut ORM.

1. Understanding the Problem:
The problem arises when we need to manage a relationship between two or more tables in our database. For example, you may have a "User" table and a "Photo" table with a one-to-many relationship - each user can have multiple photos associated with them. The problem occurs when we delete a particular user's row from the database and need to remove all related photo rows as well.

2. Approaching the Solution:
To solve this issue, we will utilize the Eloquent ORM's event listeners. Listeners enable us to handle events before, during, or after model operations. In our case, we want to execute additional code when a specific row is deleted, which includes deleting all related rows. Here are the steps involved:

3. Create Custom Event Listeners for Deleting Related Rows:
Firstly, create a dedicated directory for your custom events listeners within your Laravel project's root folder. In this case, you can use "App/Listeners" as the directory name. Now, inside this directory, we will create two separate event listeners to handle user and photo deletions respectively. Create these files:
- App\Listeners\UserDeletionListener.php
- App\Listeners\PhotoDeletionListener.php

4. Implementing User Deletion Event Listener:
In your "UserDeletionListener.php" file, implement the desired behavior of deleting all related photos when a user is deleted. You can achieve this using an event listener that will listen for the 'deleting' event and execute custom methods inside the listener. Here's an example code snippet:
```php
<?php
namespace App\Listeners;

use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class UserDeletionListener extends Model implements ShouldQueue
{
    /**
     * Handle the event.
     *
     * @param  Registered $event
     * @return void
     */
    public function handle(Registered $event)
    {
        // Retrieve related photos of the user being deleted
        $photos = $this->user->photos()->get();

        // Iterate through photos and delete each individually
        foreach ($photos as $photo) {
            $photo->delete();
        }
    }
}
```
This code listens to the "deleting" event and executes a handle method when it occurs. Within this handler, we retrieve all related photos of the user being deleted using the relationship with Eloquent ORM and delete the individual photos one by one.

5. Implementing Photo Deletion Event Listener:
In your "PhotoDeletionListener.php" file, implement behavior to make sure that when a photo is deleted, its related user is also checked if it doesn't have any other associated photos. If not, then delete the user as well. You can achieve this by implementing another event listener that listens for the 'deleting' event and includes custom code inside the listener:
```php
<?php
namespace App\Listeners;

use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PhotoDeletionListener extends Model implements ShouldQueue
{
    /**
     * Handle the event.
     *
     * @param  Registered $event
     * @return void
     */
    public function handle(Registered $event)
    {
        // Retrieve related user of the photo being deleted
        $user = $this->photo->user()->first();

        if ($user && !$user->photos()->count()) {
            $user->delete();
        }
    }
}
```
This code listens to the 'deleting' event for photos and performs a check on the related user. If there are no other associated photos, this listener will delete the user too.

6. Connecting Events with Models:
To utilize these event listeners, you need to update your model classes to trigger them automatically when necessary:
- In the "User" model class, add a static method 'booted' which triggers the 'deleting' listener.
- In the "Photo" model class, add a similar static method 'booted' that triggers the 'deleting' listener.

```php
// App\Models\User.php
use Illuminate\Support\Facades\Event;

class User extends Authenticatable
{
    // ...

    protected static function booted()
    {
        // Listen for deletion event and execute the UserDeletionListener
        static::deleting(function ($user) {
            Event::dispatch(new Registered($user));
        });
    }
}
```

```php
// App\Models\Photo.php
use Illuminate\Support\Facades\Event;

class Photo extends Model
{
    // ...

    protected static function booted()
    {
        // Listen for deletion event and execute the PhotoDeletionListener
        static::deleting(function ($photo) {
            Event::dispatch(new Registered($photo));
        });
    }
}
```

7. Conclusion:
Now your Laravel application can automatically delete related rows when deleting a parent row, ensuring that all unnecessary data is removed from the database. This approach makes your code more efficient and scalable, as it saves time in managing relationships and maintaining database integrity. Always remember to test your changes thoroughly before deploying them to production. For further information, refer to Laravel's official documentation on event listeners or get in touch with us at https://laravelcompany.com for any expert advice.
