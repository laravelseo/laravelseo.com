---
title: "Laravel sort collection and then by key"
description: "Title: Efficiently Ranking Users Using Laravel Collections Body: Ranking users based on their scores is an essential feature in various applications. In this..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "SEO", "Technical SEO", "Content"]
featured: false
---

Title: Efficiently Ranking Users Using Laravel Collections

Body:
<p>Ranking users based on their scores is an essential feature in various applications. In this blog post, we'll discuss how to efficiently sort a collection of users by points and extract specific positions without losing the sort order. We will also introduce the concept of pagination for better performance when dealing with large data sets.</p>

<h3>Sorting Users By Points</h3>
To begin, let's sort all users based on their individual point sums:

<pre><code>$users = User::all();
$users = $users->sortByDesc(function($item){
    return $item->points()->sum('amount');
});</code></pre>
The above code retrieves all the users from the database and sorts them in descending order using their total point values. The 'sum' method is used to get a sum of points for each user, which will be passed as an argument to the 'sortByDesc' method.

<h3>Finding One's Position</h3>
To find your position in the ranking, we iterate through the sorted collection and search for your ID. Once found, we increment a counter until we reach your position, while making sure not to include any ties:

<pre><code>$position = 0;
foreach($users as $user){
    if(Auth::user()->id == $user->id) break;
    $position++;
}
</code></pre>

In this example, we assume that there is a 'user model' with an 'id' field. We have used 'Auth::user()' to access the authenticated user in Laravel. This method will incrementally find your position until it reaches your actual index, without losing the sorted order.

<h3>Getting Your Position and Surrounding Users</h3>
Now that we know our rank, let's get ourselves and ten users above or under us:

<pre><code>$myRank = new Collection();
if($position > 9){
    $myRank->add($users->get($position-1));
    $myRank->add($users->get($position));
    $myRank->add($users->get($position+1));
    return view('rank.show', ['topTen' => $users->take(15), 'myRank' => $myRank]);
}
</code></pre>

In this example, we assumed that you want to return the top ten positions, and you are at position 11 or higher. However, the code does not maintain the sorted order as it randomly selects users above or below your current ranking.

<h3>Better Approach with Laravel Collections</h3>
To efficiently rank users without losing the sorted order, we'll use Laravel collections and pagination:

First, let's get all the users while maintaining their relative positions in a collection:

<pre><code>$users = User::all();
$users = $users->sortByDesc(function($item){
    return $item-&gt;points()-&gt;sum('amount');
});</code></pre>

Next, we can create a paginator to divide the users into smaller chunks of 10 items:

<pre><code>$users = new LengthAwarePaginator($users);
$topTen = $users-&gt;paginate(10);</code></pre>

Now, you can use an 'if' statement to check your position and return the desired data accordingly:

<pre><code>$position = 0;
foreach ($users as $user) {
    if (Auth::user()->id == $user->id) break;
    $position++;
}

if($position > 9 && $position < $topTen-&gt;total() + 10){
    return view('rank.show', ['users' => $topTen, 'myRank' => $topTen->forPage(round((float) ($position - 1) / 10) + 1)]);
} elseif($position <= 9) {
    return view('rank.show', ['users' => $topTen-&gt;slice(0, $position), 'myRank' => new Collection([$users->get($position-1), $users->get($position), $users->get($position+1)]), 'next' => $topTen-&gt;slice($position)]);
} else {
    return view('rank.show', ['users' => $topTen, 'myRank' => new Collection([$users->get($position-10), $users->get($position-9), $users->get($position-8)]), 'prev' => $topTen-&gt;slice(0, $position - 10)]);
}
</code></pre>

This code provides different sets based on your position. If you are in the top ten positions (position <= 9), we will return your rank (myRank) along with 'users' and 'next'. Otherwise, we handle cases where you are outside the top ten but still inside the paginated results or beyond the current page range.

Conclusion:
This blog post has demonstrated how to efficiently find one's position in a ranking system without losing the sorted order. By using Laravel Collections and pagination, we can ensure that our application supports large data sets while providing accurate results for users in any position.
