---
title: "How can show error message in failed login?"
description: "Title: Customizing Error Messages for Failed Login Attempts in Laravel Body: Customizing error messages is often an essential aspect of any application. When..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "PHP"]
featured: false
---

Title: Customizing Error Messages for Failed Login Attempts in Laravel

Body:
<p>Customizing error messages is often an essential aspect of any application. When it comes to authentication systems, it's critical that users receive clear and informative feedback upon failed login attempts. The Laravel framework makes this process relatively easy thanks to its robust architecture. In this blog post, we'll cover how you can customize the error message for a failed login attempt in Laravel and provide helpful examples.</p>
<h2>The Authentication Controller</h2>
<p>To display custom error messages, you will need to modify the relevant controller. The authentication system comes with several controllers located under '/app/Http/Controllers/Auth' directory. To handle login, Laravel uses the 'LoginController'. You can find this file in the mentioned path. Include your custom logic to return an appropriate error message if the credentials are incorrect.</p>
<h2>Handling Failed Login Attempts</h2>
<p>If you want to show a specific error message for failed login attempts, add a property called 'failedLoginMessage' in your controller. This will store the custom error message, which is later rendered on the view. The following code snippet shows how you can define this property:</p>
<pre><code class="lang-php">public function authenticate(Request $request) {
    if (Auth::attempt($credentials = $this->getCredentials($request), $remember = $request->has('remember'))) {
        return redirect()->intended(route('home'));
    } else {
        // Handle failed login attempt
        $this->failedLoginMessage = 'Invalid Username/Password';
        return back()
            ->withErrors([$credentials])
            ->withInput($request->only('email', 'remember'))
            ->redirect()->with([
                'status' => 'error',
            ]);
    }
}</code></pre>
<p>In the above code, we only set the error message if the login attempt fails. The 'back()' function returns the user back to the previous page while also providing a friendly redirect and passing additional data through 'withErrors' and 'withInput'. Additionally, you can provide extra information via the query string with 'redirect()->with([...])'.</p>
<h2>Displaying Error Messages in Views</h2>
<p>To show the error message returned from our controller, find the corresponding HTML element in your login view. The default view is located at '/resources/views/auth/login.blade.php'. You can modify this view to render your custom error message:</p>
<pre><code class="lang-html">@extends('layouts.login')

@section('content')
    @if(Session::has('status'))
        <div class="alert alert-danger" role="alert">
            {{ Session::get('failedLoginMessage') }}
        </div>
    @endif
    <!-- Login form code -->
@endsection</code></pre>
<p>The above HTML fragment checks if the 'status' session variable is set. If it exists, it renders the error message from our controller by accessing the 'failedLoginMessage'. Replace 'CUSTOM_ERROR_MESSAGE_IF_LOGIN_FAILED' with your desired custom message text.</p>
<h2>Conclusion</h2>
<p>Customizing the error messages for failed login attempts is a simple process in Laravel. By modifying your controller and updating the corresponding view, you can provide clear feedback to users about their unsuccessful login attempts. This improves user experience and helps them understand how they should proceed.</p>
