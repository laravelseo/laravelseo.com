---
title: "Advanced whereNotNull statement in Laravel"
description: "Title: Advanced whereNotNull Statement in Laravel Filtered Queries with Non Null Columns Is it possible to do the following in Laravel 4? If I have the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

Title: Advanced whereNotNull Statement in Laravel - Filtered Queries with Non-Null Columns

Is it possible to do the following in Laravel 4? If I have the following table:

```sql
table: myTable
id  |   name    |   age     |   weight
======================================
1    Jane        NULL        150
2    NULL        12          80
3    Bob         NULL        NULL
4    John        22          120
5    Cody        NULL        NULL
```

Given that $columns is [age, weight] and $columnNames is 'age, weight', how can we get the desired output for rows with at least one non-null value in those columns?

<p><strong>UPDATE:</strong></p>

The condition is to return all rows where the selected columns are not ALL null. So a <code>whereNotNull</code> clause must be applied to each (selected) column in each row. If all columns are NULL, then whereNotNull will return false and that row shouldn't be part of the results. So only rows which have AT LEAST one non-null value should be returned.

Let's examine how we can achieve this:

1. Assuming you have access to the Eloquent model corresponding to 'myTable', you can use a local scope method for easier querying:

```php
class MyTable extends Model {
    protected $table = 'myTable';

    // Custom Scope Method
    public function scopeWithNotNullColumns($query)
    {
        if (count($this->withNotNullColumns()) > 0) {
            foreach ($this->withNotNullColumns() as $column) {
                $query->whereNotNull($column);
            }
        } else {
            return false;
        }
    }
}
```

2. Here, we define the scope method 'withNotNullColumns' that returns an array of selected columns. We loop through them to check if they are not null before applying the whereNotNull clause on each column in the query:

```php
class MyTableController extends Controller {
    public function indexWithNotNull()
    {
        $columns = ['age', 'weight'];
        $columnNames = ['age, weight'];

        // Fetch Selected Column Names for Querying
        $withNotNullColumns = MyTable::getColumnNamesForQuery($columns);

        $myTablesWithNotNullColumns = MyTable::withNotNullColumns()
            ->whereNotNull(function($query) use ($withNotNullColumns) {
                foreach ($withNotNullColumns as $column) {
                    $query->whereNotNull($column);
                }
            })
            ->get();

        return view('indexWithNotNull', compact('myTablesWithNotNullColumns'));
    }
}
```

3. In this case, we use the same defined scope method 'withNotNullColumns' to fetch the columns for querying and apply it in the same way as before but with a function closure:

```php
MyTable::getColumnNamesForQuery($columns);
```

4. Alternatively, you can simply loop through the array of selected columns and check if they are not null explicitly within your controller:

```php
class MyTableController extends Controller {
    public function indexWithNotNull()
    {
        $columns = ['age', 'weight'];
        $columnNames = ['age, weight'];

        // Fetch Selected Column Names for Querying
        $withNotNullColumns = [];
        foreach ($columns as $index => $column) {
            if (!is_null(MyTable::select($column)->first()->$column)) {
                array_push($withNotNullColumns, $column);
            }
        }

        $myTablesWithNotNullColumns = MyTable::query()
            ->whereIn('table', $withNotNullColumns)
            ->get();

        return view('indexWithNotNull', compact('myTablesWithNotNullColumns'));
    }
}
```

5. Finally, we execute the query and return the results:

```php
$myTablesWithNotNullColumns = MyTable::query()
    ->where(function($query) use ($withNotNullColumns) {
        foreach ($withNotNullColumns as $column) {
            $query->orWhereNotNull($column);
        }
    })
    ->get();
```

By using these methods, we can effectively filter the query results to return only rows which have at least one non-null value in the specified columns. However, different approaches may be more suitable depending on your specific needs and the Laravel version you're using.
