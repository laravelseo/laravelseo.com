---
title: "Laravel eloquent api resource remove `data` key (no collection)"
description: "Title: Laravel Eloquent API Resource: Removing the \"data\" Key (No Collection) Body: Laravel provides a powerful set of tools to develop efficient and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

Title: Laravel Eloquent API Resource: Removing the "data" Key (No Collection)
Body:

Laravel provides a powerful set of tools to develop efficient and scalable web applications. One of these features is Eloquent, which offers an elegant and simplified way to work with database tables using objects known as models. In addition, Laravel supports API resources to return responses in a structured format that can be easily consumed by clients. However, sometimes the default response structure may not suit your requirements, especially when you want to eliminate the `data` key or remove the collection aspect from it.

To achieve this goal, you need to understand how API resources work and implement customizations based on your needs. Let's break down the process step by step:

1. Define an Eloquent Model: Firstly, create a model for your required information. In our example, let's assume we have a User model that stores user details such as name, email, and verified date:

   <pre><code>class User extends Model {
       public $timestamps = false;

       protected $fillable = [
           'name',
           'email',
           'verified_at'
       ];

       public function setEmailAttribute($value) {
           $this->attributes['email'] = strtolower($value);
       }
   }
</code></pre>

2. Register Eloquent Resource: To take advantage of Eloquent API resources, you need to register the model with Laravel's resource system. This will enable you to create a custom response for your Eloquent data:

   <pre><code>$this->app->register(\Laravel\Eloquent\ResourceServiceProvider::class);
</code></pre>

3. Include Resource Class: Create or add the necessary resource class to handle the transformation of Eloquent data into a structured response that can be fed back to the client. Here's an example for our User model:

   <pre><code>class UserResource extends JsonResource {
       /**
        * Transform the given resource into an array.
        * @param \Laravel\Eloquent\Model $resource
        * @return array
       */
      public function toArray($request) {
          return [
              'name' => $this->user->name,
              'email' => $this->user->email,
              'verified_at' => date('Y-m-d\TH:i:s\.000P', strtotime($this->user->verified_at)),
          ];
      }
   }
</code></pre>

4. Use Resource in API Controller: Finally, modify your existing API controller to use the custom Eloquent resource instead of the default `data` keyed response. Here's an example for our User model:

   <pre><code>class ApiController extends Controller {
       public function index() {
           $user = auth()->user();

           // Using custom UserResource
           return new UserResource($user);
       }
}
</code></pre>

With these steps, your API response structure will change to eliminate the `data` key and remove the collection aspect. The final response will look like this:

<pre><code>{
    "name": "Margarete Daniel",
    "email": "goldner.berniece@example.net",
    "verified_at": "2020-03-20T07:15:56+00:00"
}
</code></pre>

By following these steps, you can customize the API response structure to suit your specific needs and provide efficient data handling in Laravel applications.
