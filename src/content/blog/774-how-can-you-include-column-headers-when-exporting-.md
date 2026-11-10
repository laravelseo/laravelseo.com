---
title: "How can you include column headers when exporting Eloquent to Excel in Laravel?"
description: "Title: Incorporating Column Headers in Laravel Eloquent Excel Exports Body: We've recently been asked how to include column headers when exporting Eloquent..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content"]
featured: false
---

Title: Incorporating Column Headers in Laravel Eloquent Excel Exports

Body: We've recently been asked how to include column headers when exporting Eloquent models as an Excel file using Laravel Excel in Laravel applications. Currently, the output shows only data rows without any relevant information about their fields. This blog post will guide you through adding column headers to your generated files.

Let's first review our current code:

1. Web Route:
   <pre><code>Route::get('/excel/release', 'ExcelController@create')-&gt;name('Create Excel');</code></pre>
   
2. Eloquent Model and Query:
   <pre><code>class ProductExport implements FromQuery
    {
        use Exportable;

        public function __construct(int $id)
        {
            $this-&gt;id = $id;
        }

        public function query()
        {
            return ProductList::query()-&gt;where('id', $this-&gt;id);
        }
    }</code></pre>
   
3. Controller:
   <pre><code>public function create(Request $request) {

    # Only alowed tables
    $alias = [
        'product_list' =&gt; ProductExport::class
    ];

    # Ensure request has properties
    if(!$request-&gt;has('alias') || !$request-&gt;has('id'))
        return Redirect::back()-&gt;withErrors(['Please fill in the required fields.'])-&gt;withInput();

    # Ensure they can use this
    if(!in_array($request-&gt;alias, array_keys($alias)))
        return Redirect::back()-&gt;withErrors(['Alias ' . $request-&gt;alias . ' is not supported'])-&gt;withInput();

    # Download
    return (new ProductExport((int) $request-&gt;id))-&gt;download('iezon_solutions_' . $request-&gt;alias . '_' . $request-&gt;id . '.xlsx');
}
</code></pre>

Now, to add column headers:

1. Import the appropriate libraries:
   <pre><code>use Maatwebsite\Excel\Facades\Excel;
    use Illuminate\Support\Collection;</code></pre>
   
2. Create a `View` class for your Eloquent model and add `use Exportable;` at the beginning:
   <pre><code>class ProductExport implements FromQuery, WithHeadings
{
    use Exportable;

    public function __construct(int $id)
    {
        $this-&gt;id = $id;
    }

    public function query()
    {
        return ProductList::query()-&gt;where('id', $this-&gt;id);
    }
}
</code></pre>
   Here, we've added the `WithHeadings` trait to our `ProductExport` class. This trait allows us to add column headers when exporting data as an Excel file.

3. Change your controller:
   <pre><code>public function create(Request $request) {

    # Only alowed tables
    $alias = [
        'product_list' =&gt; ProductExport::class
    ];

    # Ensure request has properties
    if(!$request-&gt;has('alias') || !$request-&gt;has('id'))
        return Redirect::back()-&gt;withErrors(['Please fill in the required fields.'])-&gt;withInput();

    # Ensure they can use this
    if(!in_array($request-&gt;alias, array_keys($alias)))
        return Redirect::back()-&gt;withErrors(['Alias ' . $request-&gt;alias . ' is not supported'])-&gt;withInput();

    # Download
    return (new ProductExport((int) $request-&gt;id))-&gt;download('iezon_solutions_' . $request-&gt;alias . '_' . $request-&gt;id . '.xlsx');
}
</code></pre>
   After adding the `WithHeadings` trait, you can use the `collection()` method to add column headers to your Excel file. The collection method takes an array of column titles as its first parameter and a callback function with the data as the second one. It then returns a new instance of `Collection`, which is used to create the Excel file.

Here's a simplified example for adding column headers:
   <pre><code>return (new ProductExport((int) $request-&gt;id))-&gt;download('iezon_solutions_' . $request-&gt;alias . '_' . $request-&gt;id . '.xlsx'), function($query, Collection $collection) {
    $collection-&gt;map(function($product) use ($columns) {
        return array_combine($columns, $product); // create an associative array with column names as keys and respective data as values
    });

    $headers = ['ID', 'Cost', 'Created At'];

    $collection-&gt;prependRow(0, $headers); // add the headers to our collection
});</code></pre>

This implementation uses `map()` to create an associative array with column names and their respective data. Afterwards, it prepends a new row with the desired headers at index 0 using `prependRow()`. Finally, pass the updated collection back to the `download()` method along with your original query object.

By following these steps and making use of Laravel's powerful Eloquent capabilities, you can easily generate Excel files containing column headers for your data exports.
