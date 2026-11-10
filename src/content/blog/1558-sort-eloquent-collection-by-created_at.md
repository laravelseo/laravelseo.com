---
title: "Sort Eloquent Collection by created_at"
description: "Title: Efficiently Sorting Eloquent Collections by Created at Body: Sorting Eloquent collections can be challenging for developers who are new to Laravel or..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Performance", "PHP"]
featured: false
---

Title: Efficiently Sorting Eloquent Collections by Created_at

Body:

Sorting Eloquent collections can be challenging for developers who are new to Laravel or are not familiar with its advanced features. In this blog post, we will discuss a recommended method of sorting a collection and paginating it while maintaining performance and efficiency.

Firstly, we need to create two Arrays: one for friend IDs and another for the Eloquent collection of posts. We can achieve this as follows:

```php
$friendIDs = explode(',', \Friend::where('user_id', Sentry::getUser()->id)->first()->friend_ids); // Assumes there is only one record for a user's friends
$postsCollection = new Illuminate\Database\Eloquent\Collection();
```

Now, we need to iterate over our friend IDs and fetch the posts they are related to. We can use a slightly modified approach:

1. Create an Eloquent query with `Post::where('poster_id', $id)` and order by 'created_at' in descending order. This will get all posts created by the user whose ID is $id, sorted by their creation date.
2. Use the `->get()` method to retrieve all matching posts as a collection object, which we can then add to our main posts collection.

Here's the code:

```php
foreach ($friendIDs as $id) {
    // Create query for posts created by each friend
    $postQuery = \Post::where('poster_id', $id)->orderBy('created_at', 'desc');
    // Get all posts by that user in a collection object
    $postsForFriend = $postQuery->get();
    // Add the posts to our main collection
    foreach ($postsForFriend as $post) {
        $postsCollection->add($post);
    }
}
```

The above code will iterate over all friend IDs, fetching their respective posts and adding them to the primary collection object. This should provide us with a sorted collection of all posts created by our friends.

To paginate this collection, we can use Laravel's built-in Pagination class. Here's how:

```php
// Create a new Paginator instance with the main post collection and the desired number of items per page
$paginatedPosts = new \Illuminate\Pagination\Paginator($postsCollection, 15); // 15 is the number of posts you want per page
```

Now we can iterate over our paginated posts by calling `$paginatedPosts->items()`. We can also access its total number of items with `$paginatedPosts->total()` and the current page number using `$paginatedPosts->currentPage()`, among other useful methods.

In summary, to efficiently sort your Eloquent collection by created_at and paginate it:
- Create two Arrays: one for friend IDs and another for the posts collection.
- Iterate over the friend IDs and retrieve their respective posts sorted by 'created_at'.
- Add these posts to the main collection object.
- Use Laravel's built-in Pagination class to paginate the main collection with your desired settings.

By following these steps, you can ensure a smooth experience while paginating and sorting Eloquent collections effectively. For more information on this topic or other Laravel concepts, don't forget to check out https://laravelcompany.com.
