---
title: "How do I get ONLY the validated data from a laravel FormRequest?"
description: "Title: Efficiently Accessing Validated Data from Laravel FormRequests Body: Handling form data in your Laravel applications can be done with FormRequests ..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

Title: Efficiently Accessing Validated Data from Laravel FormRequests

Body:
<p>Handling form data in your Laravel applications can be done with FormRequests - which provide an elegant way to validate and sanitize user input. However, accessing the requested data without retrieving additional fields or garbage data can be a bit tricky for developers new to this feature.</p>

To get only validated data while avoiding unnecessary fields, you have various options:

1. Create a custom method in your FormRequest class to return only the required fields after validation and sanitization. This approach is relatively simple but involves writing custom code for each request:

<pre><code>class PlanRequest extends FormRequest
{
    // ...

    public function validatedData()
    {
        $validated = parent::validated();

        return array_only($validated, ['name', 'monthly_fee', 'transaction_fee', 'processing_fee', 'annual_fee', 'setup_fee', 'organization_id']);
    }
}
</code></pre>

2. Modify your current store() method:

<pre><code>public function store(PlanRequest $request)
{
    $validatedData = $request->validate(); // This will fail if the validation fails
    dd($validatedData);
    // This returns
    [
        'name'              =&gt; 'value',
        'monthly_fee'       =&gt; '1.23',
        'transaction_fee'   =&gt; '1.23',
        'processing_fee'    =&gt; '1.23',
        'annual_fee'        =&gt; '1.23',
        'setup_fee'         =&gt; '1.23',
        'organization_id'   =&gt; null,
        'foo'               =&gt; 'bar', // This is not supposed to show up
    ];
}
</code></pre>
- Note that this approach won't validate the request and will return the input data without validating them. This is less secure than using the first option since it skips the validation checks.

3. Make use of Laravel's built-in features:

<ul>
    <li><strong>Accessing Validated Data with getValidatedData():</strong></li>
   <pre><code>public function store(PlanRequest $request)
{
    $validatedData = $request->getValidatedData(); // This will validate the request first and then return it
    dd($validatedData);
    // This returns
    [
        'name'              =&gt; 'value',
        'monthly_fee'       =&gt; '1.23',
        'transaction_fee'   =&gt; '1.23',
        'processing_fee'    =&gt; '1.23',
        'annual_fee'        =&gt; '1.23',
        'setup_fee'         =&gt; '1.23',
        'organization_id'   =&gt; null,
        'foo'               =&gt; 'bar', // This is not supposed to show up
    ];
}
</code></pre>

- This approach works well and ensures your data is validated before you use it. However, it returns all the fields, including unnecessary ones. That being said, you can still use <code>array_only()</code> as shown in option 1 to clean up the extra data.

<li><strong>Accessing Validated Data with Model Bindings:</strong></li>
<pre><code>public function store(Request $request)
{
    $plan = Plan::create([
        'name'              => $request->input('name'),
        'monthly_fee'       => $request->input('monthly_fee'),
        // ... Other fields you need
    ]);
}
</code></pre>
- This approach requires more work as it involves creating and saving the model directly. However, it ensures your data is validated before it's used in your application logic.

In conclusion, to efficiently access only the validated data from a Laravel FormRequest, you can either use method 1 (create a custom validation method) or combine method 2 with array_only() for better data handling security and efficiency. When in doubt, always refer to Laravel's official documentation for more information on these features.
