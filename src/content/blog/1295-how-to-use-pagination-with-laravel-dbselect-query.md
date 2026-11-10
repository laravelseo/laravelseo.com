---
title: "How to use pagination with laravel DB::select query"
description: "Title: Implementing Pagination with Laravel's DB::select Queries Body: Using Laravel in your projects provides an easy way to manage complex data structures..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

Title: Implementing Pagination with Laravel's DB::select Queries

Body:
Using Laravel in your projects provides an easy way to manage complex data structures and interactions between them. However, at times you may find yourself working with raw SQL queries using the DB facade through DB::select(). In such cases, integrating pagination could be a challenge since pagination methods are not readily available for these types of queries. Here's how you can tackle this issue and make your Laravel application with DB::select queries more user-friendly:

1. Understand the Problem: You might have been getting an error call to a member function 'paginate() on array.' This is because, by default, Laravel supports pagination for Collection but not arrays. The error occurs as you are attempting to use paginate() with the result returned from DB::select().

2. Creating Custom Paginator Class: To resolve this issue, you can create a custom Paginator class that extends Illuminate\Pagination\LengthAwarePaginator. This ensures your data is an array but can still be used for pagination purposes through the custom class.

3. Implementation of the Solution: Follow these steps to achieve proper pagination implementation with DB::select queries in Laravel.
   a) Create a new file 'CustomPaginator.php' inside your project's 'app/Http/Helpers' folder.
   b) Add the following code to the newly created file.

   <pre><code>&lt;?php

namespace App\Http\Helpers;

use Illuminate\Pagination\LengthAwarePaginator;

class CustomPaginator extends LengthAwarePaginator
{
    public $items;
    public $total;
    public $perPage;
    public $pageName;
    public $url;

    public function __construct($items, $total, $perPage = 15, $pageName = 'page', $url = null)
    {
        parent::__construct($items, $total, $perPage, ['path' => $url, 'query' => ['page' => $pageName]]);

        $this->items = $items;
        $this->total = $total;
        $this->perPage = $perPage;
        $this->pageName = $pageName;
        $this->url = $url;
    }
}
</code></pre>

4. Using the Custom Paginator Class: In your controller, modify the code to use the custom pagination implementation. Replace the previous DB query with this new structure and make sure you import the necessary namespaces for your code to run smoothly. You can refer to the given Controller code example below:

   <pre><code>&lt;?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Notice;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\Paginator;
use CustomPaginator as Paginator;
use Illuminate\Pagination\LengthAwarePaginator;

class NoticeController extends Controller
{
    public function index() {

        $notices = DB::select('select
            notices.id,notices.title,notices.body,notices.created_at,notices.updated_at,
            users.name,departments.department_name
            FROM notices
            INNER JOIN users ON notices.user_id = users.id
            INNER JOIN departments on users.dpt_id = departments.id
            ORDER BY users.id DESC')-&gt;paginate(20);

        $result = new Paginator($notices,2,1,[]); // Custom Paginator Class Usage

        return view('welcome')->with('allNotices', $notices);
    }
}
</code></pre>

By following these steps and using a custom pagination class in conjunction with DB::select queries, you can now implement proper pagination for your Laravel application. This approach ensures that the correct data is being handled while maintaining a smooth user experience.
