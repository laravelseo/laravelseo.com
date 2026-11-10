---
title: "datatable pagination in laravel"
description: "Title: Implementing Dynamic Datatable Pagination in Laravel Applications Body: In this blog post, we'll explore how to create dynamic pagination for data..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "JavaScript"]
featured: false
---

Title: Implementing Dynamic Datatable Pagination in Laravel Applications

Body:
<p>In this blog post, we'll explore how to create dynamic pagination for data tables using the popular jQuery plugin, DataTables. We will also discuss Laravel 5.0 integration and the importance of proper page navigation. Our goal is to display a maximum of 500 records per page.</p>
<h2>Controller Method</h2>
<pre><code>public function index() {
    $jobs = \App\Job::orderBy('created_at', 'DESC');

    // Paginate the jobs collection with a limit of 500 records per page
    $jobs = $jobs->paginate(500);

    return View::make('jobs.index', ['jobs' => $jobs]);
}
</code></pre>
<h2>Datatable Configuration</h2>
<p>In the view (blade) template, we need to configure our datatable and include a link to load new rows when the user reaches the end of the current page. We can add an HTML button or link to handle pagination:</p>
<pre><code>&lt;a href="javascript:void(0)" data-dt-ajax="{url:'/loadMoreJobs',type:'GET'}" class="btn btn-success load-more-data"&gt;Load More Data&lt;/a&gt;</code></pre>
<p>We can also create a dedicated route to handle the AJAX request for fetching additional data:</p>
<pre><code>Route::get('/loadMoreJobs', function() {
    $jobs = \App\Job::orderBy('created_at', 'DESC');

    // Retrieve the next 500 records and return them as a collection
    $next_page_jobs = $jobs->offset(500)->limit(500)->get();

    return response()->json($next_page_jobs);
});
</code></pre>
<h2>Client-Side JavaScript Code</h2>
<p>On the client side, we need to handle the AJAX call and update our DataTables instance. We will use jQuery for this purpose:</p>
<pre><code>&lt;script&gt;
    // On document ready, initialize DataTable with pagination enabled
    $(function() {
        var table = $('#jobs-table').DataTable({
            ajax: {
                url: '/loadMoreJobs',
                method: 'GET'
            },
            deferRender: true,
            serverSide: false,
            pagingType: 'full_numbers',
            columnDefs: [
                // Add custom formatting for the table columns
            ]
        });

        // Handle loading new data when clicking the load more button
        $(document).on('click', '.load-more-data', function(e) {
            e.preventDefault();

            // Append a row with spinner to display while loading
            $('#jobs-table').DataTable().row.add([
                '<div class="text-center"><i class="fa fa-spin fa-spinner"></i></div>'
            ]);
            table.draw();

            // Make AJAX call to load new records
            $.ajax({
                type: $(this).data('dt-ajax').type,
                url: $(this).data('dt-ajax').url,
                success: function(data) {
                    var jobs = $.map(data, function(job) {
                        // Format the job data as necessary for display in table rows
                        return [
                            '<div class="text-center"><i class="fa fa-spin fa-spinner"></i></div>'
                        ];
                    });

                    $('#jobs-table').DataTable().rows().remove(); // Clear existing data
                    $('#jobs-table').DataTable().row(0).nodes().remove(); // Remove additional row with spinner
                    table.rows.add(jobs);
                    table.draw();
                }
            });
        });
    });
</script&gt;</code></pre>
<h2>Conclusion</h2>
Using Laravel's built-in pagination and the Datatables plugin, we have developed a dynamic grid that can display up to 500 records per page. The user can then load additional pages by clicking on the load more button, which will trigger an AJAX call to fetch the next set of jobs and update the grid accordingly. With this implementation, our Laravel application now offers efficient data management with customizable pagination for a seamless user experience.
