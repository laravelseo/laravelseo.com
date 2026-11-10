---
title: "how to fix 'Access to XMLHttpRequest has been blocked by CORS policy' Redirect is not allowed for a preflight request only one route"
description: "Fixing 'Access to XMLHttpRequest has been blocked by CORS policy' Errors in Laravel and VueJS Applications The Cross Origin Resource Sharing (CORS) error is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "JavaScript"]
featured: false
---

<h2>Fixing 'Access to XMLHttpRequest has been blocked by CORS policy' Errors in Laravel and VueJS Applications</h2>

The Cross-Origin Resource Sharing (CORS) error is a common issue when dealing with different origins. It occurs when the browser prevents a web application from making cross-origin requests due to security reasons. This problem often arises during API requests made by a frontend client like Vue.js and Laravel's backend server. In this blog post, we will explore the various methods you can use to fix such errors while ensuring your application remains secure.

<h3>Understand CORS</h3>
To understand how to address CORS issues in your project, first grasp its basic concepts. Cross-Origin Resource Sharing (CORS) is a mechanism that utilizes the browser and web server to manage cross-origin requests. It ensures that only authorized origins are allowed to access the data on a website. To do so, both the origin domain making the request and the origin domain receiving the response must be set up correctly.

<h3>Identify the CORS Problem</h3>
Before you start dealing with fixing your specific issue, ensure that you correctly identify the source of the problem. It can arise due to incorrect configuration in Vue.js or Laravel's backend server. To confirm this, inspect your web browser's developer console for any errors related to CORS. You will commonly see an error message similar to "Access to XMLHttpRequest has been blocked by CORS policy: Response to preflight request doesn't pass access control check."

<h3>Solution 1: Configure Laravel Application</h3>
In your Laravel application, follow these steps:
1. Enable CORS middleware in the Kernel file.
2. Add 'Access-Control-Allow-Origin' header with * value for all origins.

<pre><code>&amp;#x3C;?php
namespace App\Http\Middleware;

use Closure;

class AddCorsHeaders{
   public function handle($request, Closure $next){
      // Allow from any origin
      header("Access-Control-Allow-Origin: *");
      return $next($request);
   }
}

&#x3C;?php
namespace App\Http\Middleware;

use Closure;

class AddCorsHeaders{
   public function handle($request, Closure $next){
      // Allow from specific origins only (not recommended)
      header("Access-Control-Allow-Origin: https://example.com");
      return $next($request);
   }
}

&#x3C;?php
namespace App\Http\Middleware;

use Closure;

class Cors{
   /**
    * Handle an incoming request.
    *
    * @param  \Illuminate\Http\Request  $request
    * @param  \Closure  $next
    * @return mixed
    */
   public function handle($request, Closure $next)
   {
      // Add headers to each request
      return $next($request)->header('Access-Control-Allow-Origin', '*')
                            ->header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Origin, Authorization, Accept, Access-Control-Request-Method')
                            ->header('Access-Control-Expose-Headers', 'X-Total-Count, X-Page, Link');
   }
}
</code></pre>

<h3>Solution 2: Configure Axios in Vue.js Application</h3>
In your Vue.js application, add the following code snippet to your main JavaScript file or Vue instance to handle CORS issues:

<pre><code>&amp;#x3C;template>
&amp;#x3C;div id="app">
  &amp;#x3C;div>Hello {{ msg }}!</div>
</template>

<script>
export default {
  name: 'Example',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<script src="../js/axios.min.js"></script>

<script>
  axios.defaults.baseURL = 'http://localhost:8080';
  axios.defaults.headers.get['Accept'] = 'application/json';
  axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
</script>
</code></pre>

These are some of the common methods to address CORS issues in Laravel and Vue.js applications. For more advanced use cases, it's essential to dive deeper into each framework's documentation. By following these steps and understanding how CORS works, you can ensure your projects maintain a high level of security while functioning optimally.

<h3>Conclusion</h3>
CORS issues in Laravel and VueJS applications can be troublesome but are easily addressed with the correct configuration on both sides. Understanding the concept behind CORS is crucial to resolving these errors efficiently. To handle complex situations, consult each framework's documentation for further guidance. By doing so, you ensure your projects remain secure while functioning optimally.
