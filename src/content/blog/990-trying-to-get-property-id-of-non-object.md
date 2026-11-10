---
title: "Trying to get property 'id' of non-object"
description: "Title: Understanding and Resolving \"Trying to get property 'id' of non object\" Error in PHP Code Body: When working on an application that uses Laravel, you..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Understanding and Resolving "Trying to get property 'id' of non-object" Error in PHP Code
Body:
<p>When working on an application that uses Laravel, you may come across a critical issue where the application crashes with the error: "Trying to get property 'id' of non-object". While this seems like a simple issue, it could be due to various factors. In this blog post, we will explore some common reasons for this error and how to resolve them.</p>
<hr />
<p><strong>Reason 1: Missing or incorrect object reference</strong></p>
<pre class="lang-php prettyprint-override"><code>private $client;

public function __construct()
{
    $this->client = Client::find(1); // this line could be a problem
}

...
</code></pre>
To solve this issue, check if the object reference is correct and exists. If it's a model, make sure you have loaded the model before accessing it. For instance, replace "Client::find(1)" with "$this->client = Client::where('id', 1)->first();". This will ensure that the client object is created properly.
<hr />
<p><strong>Reason 2: Incorrect usage of null coalescing operator</strong></p>
In some cases, null coalescing operators can cause this issue if used incorrectly. For instance:
<pre class="lang-php prettyprint-override"><code>$var = $this->client?->id ?? 'default_value'; // using null coalescing operator
if(!is_null($this->client)){
    $id = $this->client->id;
}else{
    $id = 'default_value';
}

public function issueToken(Request $request, $grantType, $scope = '')
{
    if(!is_null($this->client)){
        $params['client_id'] = $this->client-&gt;id;
    }else{
        $params['client_id'] = 'default_value';
    }

...
</code></pre>
The above code shows an example of using null coalescing operators correctly. If the assignment is inside a conditional branch, make sure that the condition is correct before proceeding with further operations on the object or its properties.
<hr />
<p><strong>Reason 3: Incorrect method chaining</strong></p>
Sometimes, this error can occur if you're inadvertently chaining methods or accessing properties that do not exist on the current object:
<pre class="lang-php prettyprint-override"><code>$client = Client::find(1); // find() method returns a model instance
$params['client_id'] = $this->client->id; // this line still needs to find the client id since there's no direct chain from client to its attributes.

public function issueToken(Request $request, $grantType, $scope = '')
{
    if(!is_null($this->client)){
        $params['client_id'] = $this->client->id; // this line is correct as it accesses client's id property directly.
...
</code></pre>
If you notice that your code contains a series of nested method calls, check whether the last call is chaining to an object or just returning a value. If it returns a value, use variable assignment for the required property instead of chaining methods.
<hr />
In conclusion, the "Trying to get property 'id' of non-object" error can result from various factors such as incorrect object references, misuse of null coalescing operators, and inappropriate method chaining. By understanding these issues and following best practices while coding, you can effectively resolve these errors and prevent them from occurring in the future.
