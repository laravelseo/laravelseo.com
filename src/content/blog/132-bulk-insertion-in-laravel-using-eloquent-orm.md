---
title: "Bulk Insertion in Laravel using eloquent ORM"
description: "Title: Optimizing Bulk Insertion using Eloquent ORM in Laravel Applications Introduction Bulk insertions can be an effective way to speed up data importation..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords"]
featured: false
---

Title: Optimizing Bulk Insertion using Eloquent ORM in Laravel Applications

Introduction
Bulk insertions can be an effective way to speed up data importation processes, saving time and effort. In Laravel, the Eloquent ORM provides a simple way to perform bulk database insertions. This blog post will guide you through the process of optimizing bulk insertions using Eloquent ORM while avoiding common pitfalls.

Bulk Insertion and Eloquent ORM
Eloquent is an object-relational mapping (ORM) library that provides a convenient way for developers to interact with their application's database. Using Eloquent allows you to define models, which represent tables in the database, and easily manipulate data without dealing directly with SQL queries.

Bulk Insertion Using Models and Collections
To perform bulk insertions in Laravel, we first need to create a model class for our table. In this example, let's assume the table is 'tbl_item'. We can define the model as follows:

<pre><code>class Item extends Model {
    protected $table = 'tbl_items'; // Set the table name
    protected $fillable = ['first_name', 'last_name', 'date_added']; // Define the required fields
}</code></pre>

Now, let's assume we have a list of items in an array:

<pre><code>$items = [
  ["first_name" => "John", "last_name" => "Doe", "date_added" => date('Y-m-d H:i:s')],
  ["first_name" => "Mary", "last_name" => "Jane", "date_added" => date('Y-m-d H:i:s')]
];</code></pre>

We can iterate through the array and create new model instances for each item:

<pre><code>$itemsModel = [];
foreach ($items as $item) {
    $itemModel = Item::create($item);
    $itemsModel[] = $itemModel;
}
</code></pre>

Now, we can bulk insert all the created model instances:

<pre><code>Item::insert($itemsModel);
</code></pre>

This method will automatically handle any validation and duplicate checks that Eloquent provides. The above code snippet ensures data integrity and efficiency during the bulk insertion process.

Optimizing Bulk Insertions with Transactions
In some cases, we may want to guarantee atomicity in our bulk insert operations. To do so, we can use transactions. A transaction is a set of statements that either all succeed or fail together. In Laravel, transactions are managed by the DB facade:

<pre><code>DB::transaction(function () {
    // Perform bulk insertion logic here
});
</code></pre>

If any exception occurs within the transaction block, the DB facade will roll back all the changes made to the database. This ensures that no data is lost in case of an error.

Using Bulk Updates for Existing Records
Sometimes, we may need to update existing records instead of inserting new ones. In this case, we can use the bulk updater method:

<pre><code>$items = [
    ["id" => 1, "first_name" => "John", "last_name" => "Doe"],
    ["id" => 2, "first_name" => "Mary", "last_name" => "Jane"]
];

$itemsModel = [];
foreach ($items as $item) {
    $itemModel = Item::find($item['id']);
    if ($itemModel) {
        $itemModel->update([
            'first_name' => $item['first_name'],
            'last_name' => $item['last_name']
        ]);
        $itemsModel[] = $itemModel;
    } else {
        $itemModel = Item::create($item);
        $itemsModel[] = $itemModel;
    }
}

// Bulk update using the Eloquent builder:
Item::whereIn('id', array_map('current', array_filter(array_column($items, 'id'))))->update([
    'first_name' => Item::query()->select(DB::raw("CASE WHEN first_name IS NOT NULL THEN first_name ELSE '' END AS current_first_name"))->get()->pluck('current_first_name'),
    'last_name' => Item::query()->select(DB::raw("CASE WHEN last_name IS NOT NULL THEN last_name ELSE '' END AS current_last_name"))->get()->pluck('current_last_name')
]);
</code></pre>

In this example, we perform a bulk update on existing records by first finding the relevant models and updating them accordingly. If the model does not exist, we create a new one using the initial data. The second part of the code demonstrates an alternative approach for performing a bulk update by utilizing Eloquent's query builder and CASE statements. This method is more efficient if you have a large dataset as it involves fewer DB queries.

Conclusion
Bulk insertions in Laravel are a powerful tool to speed up data imports, saving time and effort. In this blog post, we discussed how Eloquent ORM can be used for bulk inserts and updates. We also provided examples of efficient coding techniques such as using transactions and bulk update operations. By understanding these concepts, you can now confidently optimize your bulk insertion processes to improve the performance of your Laravel applications.
