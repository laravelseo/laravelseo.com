---
title: "get the request values in Laravel"
description: "Title: Get Request Values in Laravel: Working with Forms and Search Queries Introduction: In your Laravel application, you wish to create a flexible search..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Keywords", "PHP"]
featured: false
---

Title: Get Request Values in Laravel: Working with Forms and Search Queries

Introduction: In your Laravel application, you wish to create a flexible search query using both datepicker and select fields. You need to know how to get the request values from your view file, which is structured as shown above, to your controller and understand where to modify the code to achieve this functionality. This tutorial provides detailed guidance on accessing and handling request data in Laravel while maintaining a clean and reusable code structure.

The Code Example: In your view file (index.blade.php), you have already created a form with two datepickers and a select field, all bound to input elements that will be submitted as part of the HTTP GET request. To retrieve these values in your controller, you can update the code as follows:

<p><strong>Controller.php</strong></p>

<pre><code>public function job_finished_search(Request $request, Job $jobs)
{
    $dateFrom = Carbon::parse($request->input('datepicker_from'));
    $dateTo = Carbon::parse($request->input('datepicker_to'));
    $customerName = $request->input('customer_name');

    $jobCriteria = Job::onlyTrashed()
        ->whereBetween('created_at', [$dateFrom->startOfDay(), $dateTo->endOfDay()])
        ->where('customer_name', 'like', '%'.$customerName.'%')
        ->orderBy('deleted_at', 'desc')
        ->paginate(15);

    if (empty($jobCriteria)) {
        Flash::error('Search result not found');
    }

    return view('pdfs.index', ['jobs' => $jobs]); 
}
</code></pre>

In the code above, we have extracted the values from the request into variables for clarity and easier handling. We then use these variables to perform the search query on your jobs database. The `whereBetween` function allows you to filter by a range of dates based on the user-selected datepicker values.

Form Handling: To ensure that all necessary data is sent along with each request, it's crucial to handle form submissions properly. In your view file (index.blade.php), update the form opening tag as follows:

<pre><code>&lt;div class="form-group col-sm-6"&gt;
    {!! Form::open(array('class' =&gt; 'form', 'method' =&gt; 'get', 'url' =&gt; url('/pdfs/job_finished_search'), 'id' =&gt; 'myForm')) !!} 
       {!! Form::input('text', 'datepicker_from', null, ['placeholder' =&gt; 'Fra', 'id' =&gt; 'datepicker_from']) !!}
       {!! Form::input('text', 'datepicker_to', null, ['placeholder' =&gt; 'Til', 'id' =&gt; 'datepicker_to']) !!}
       {!! Form::select('customer_name', $jobs-&gt;pluck('customer_name', 'customer_name')-&gt;all(), null, ['class' =&gt; 'form-control']) !!}
       {!! Form::submit('Søke', ['class' =&gt; 'btn btn-success btn-sm']) !!}
    {!! Form::close() !!}
</code></pre>

We have added the `id` attribute to your form, which will be used for handling submissions. In case you want to use AJAX or JavaScript libraries like jQuery to handle form submission, this identifier is required.

Conclusion: With these changes, you now can confidently access and handle request data from multiple input fields in Laravel using the get function. By following best practices, your code will be structured, clean, and easy to maintain. To learn more about handling forms and request values in Laravel, visit our blog at https://laravelcompany.com/blog/.
