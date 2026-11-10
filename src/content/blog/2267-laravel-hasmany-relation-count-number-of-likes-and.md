---
title: "Laravel hasMany relation count number of likes and comments on post"
description: "Title: Working with Laravel Relationships for Counting Post Likes and Comments Efficiently Body: Laravel has an extensive set of tools to help you manage..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Working with Laravel Relationships for Counting Post Likes and Comments Efficiently

Body:

Laravel has an extensive set of tools to help you manage relationships between models. In your case, you want to display counts of the total comments and likes for each post while fetching posts. This can be done using Laravel's relationship methods and query builders, along with some updates in your model code.

Firstly, let us focus on the updated Model code:

```php
public function number_of_likes() {
    return $this->hasMany('Like', 'pid', 'pid')->count();
}
public function number_of_comments() {
    return $this->hasMany('Comment', 'post_id', 'reply_to')
                ->whereNotNull('user_id') // Exclude guest comments
                ->withTrashed()
                ->count();
}
```

Here, we use the hasMany() method to create a relationship between your Post model and each of the Comment models (for comments) or Like models (for likes), and then count them. For the count values, this is quite efficient as it only requires a single query for each relation.

Next, let us update the API code:

```php
$posts = Jumpsite::find($jid)
            ->posts() // Eloquent relationship to Post model
            ->with('comments') // Eager load comments
            ->with('likes') // Eager load likes for each post
            ->with(['number_of_comments' => function ($query) {
                $query->join('comments', 'posts.id', '=', 'comments.post_id')
                    ->whereNotNull('user_id')  // Exclude guest comments
                    ->withTrashed()
                    ->count('*');
            }])
            ->with(['number_of_likes' => function ($query) {
                $query->join('likes', 'posts.id', '=', 'likes.post_id')
                    ->whereNotNull('user_id') // Exclude guest likes
                    ->count('*');
            }])
            ->whereReplyTo(0) // Set 'reply_to' to 0 for root posts
            ->orderBy('pid', 'DESC')
            ->paginate(10);
```

Here, we include eager loading for the comments, likes, and count of total number of comments (excluding guest comments) and likes (excluding guest likes) in your Post model. The query will be more efficient because it will only perform two additional queries to get these counts instead of creating individual queries for each comment or like. This can help reduce network overhead and improve application performance.

For returning the data in JSON format, you can use something like this:

```php
$posts = $posts->toArray();
$posts = $posts['data'];

return Response::json(array('data' => $posts));
```

And finally, to integrate the total count of comments and likes as attributes in your model, add these methods:

```php
protected $appends = array('total_likes');

public function getTotalLikesAttribute() {
    return $this->hasMany('Like')
            ->whereUserId($this->uid) // Filter by current user's likes
            ->wherePostId($this->id)   // Filter by post ID
            ->count();                 // Count total likes for this post
}
```

This will allow you to get the counts of comments and likes as attributes in addition to your other data, making it easier for you to work with them. Just be sure to optimize these relationships and queries for performance if needed by using query caching or other performance optimization techniques.

In conclusion, by utilizing Laravel's relationship methods and query builders, you can efficiently handle counting the number of likes and comments on each post while fetching related data. This approach will not only make your application more efficient but also provide a better user experience for those who want to view total counts alongside their posts.
