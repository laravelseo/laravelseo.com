---
title: "Confirmation alert box with Laravel contact form"
description: "Confirming Success: Displaying Alert Boxes After Laravel Form Submissions Welcome to the world of Laravel! It’s completely normal to hit a small roadblock,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Errors"]
featured: false
---

Welcome to the world of Laravel! It’s completely normal to hit a small roadblock, especially when moving from functional code to polished user experiences. You've successfully implemented validation and mail sending—that’s half the battle won! Now, let's tackle the next step: how to provide clear feedback to the user after a successful submission.

The scenario you are describing—displaying a "Message Sent" alert box after a successful form submission—is a classic requirement in web development. In Laravel, this is handled elegantly using **Session Flashing**. This technique allows you to pass temporary data (like success messages or error details) between the controller and the view without needing to rely on complex state management.

This guide will walk you through the best practice for achieving this in a clean, robust manner.

## The Power of Session Flashing

When a user submits a form, the process flows like this:
1. **Request Received:** The browser sends data (POST request) to your server.
2. **Validation:** You check if the input data is valid.
3. **Action:** If valid, you perform the main action (e.g., sending an email).
4. **Feedback:** Instead of immediately redirecting, you store a success message in the session.
5. **Redirection:** You redirect the user back to the form page.
6. **Display:** The view checks the session for a message and displays it as an alert box.

This method ensures that the success message is only displayed once, preventing issues related to stale data or repeated notifications. This principle of structured interaction is central to how modern frameworks like Laravel manage request-response cycles, much like the architectural principles discussed on sites such as [laravelcompany.com](https://laravelcompany.com).

## Implementing Success Feedback in Your Controller

Let's refactor your provided code snippet to incorporate session flashing for success messages. We will focus on ensuring that if the mail is sent successfully, we store a message and redirect correctly.

Assume you are using a standard controller method:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session; // Import Session facade

class ContactController extends Controller
{
    public function postContact(Request $request)
    {
        // 1. Input validator with its rules
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|min:3',
                'email' => 'required|email',
                'subject' => 'required|min:6',
                'message' => 'required|min:5'
            ]
        );

        if ($validator->fails()) {
            // Data is invalid: Redirect back with errors
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // 2. Data is valid: Proceed with sending the mail
        try {
            Mail::send('emails.message', $request->only(['name', 'email', 'subject', 'message']), function ($message) use ($request) {
                $message->from($request->email, $request->name);
                $message->to('info@company.com', 'John Doe')->subject($request->subject);
            });

            // 3. SUCCESS! Flash the message and redirect
            Session::flash('success', 'Thank you! Your message has been successfully sent.');
            return redirect()->route('contact.show'); // Redirect to a success route or back to the form page

        } catch (\Exception $e) {
            // Handle potential mail sending errors gracefully
            Session::flash('error', 'There was an issue sending your message. Please try again.');
            return redirect()->back()->withErrors(['message' => 'Error: ' . $e->getMessage()]);
        }
    }
}
```

Notice how we used `Session::flash('success', '...')` before the redirection. This action stores the success string in the session, making it available only for the next request (the view rendering).

## Displaying the Alert in Your View

Finally, you need to instruct your Blade template to check if a 'success' message exists in the session and display it using Bootstrap classes. This ensures that the alert only appears on the successful submission.

In your `contact.blade.php` file:

```html
<form method="POST" action="{{ route('contact.submit') }}">
    {{-- ... form fields here ... --}}
    <button type="submit">Send Message</button>
</form>

{{-- Display Success or Error Alerts --}}
@if (session('success'))
    <div class="alert alert-success" role="alert">
        {{ session('success') }}
    </div>
@endif

@if (session('error'))
    <div class="alert alert-danger" role="alert">
        {{ session('error') }}
    </div>
@endif
```

By implementing this pattern, you achieve a clean separation of concerns. Your controller handles the business logic and data persistence, while the view is solely responsible for presenting that data to the user in an aesthetically pleasing manner using Bootstrap styling. Mastering these patterns is key to building scalable applications on platforms like Laravel!
