---
title: "how change locale in email being sent from controller - laravel 5.4"
description: "Achieving Locale Specific Emails in Laravel: A Controller Challenge Sending personalized emails with correct localization is a common requirement in modern..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

Sending personalized emails with correct localization is a common requirement in modern applications, especially when dealing with international users. As you’ve discovered, manipulating the global locale using `App::setLocale()` just before sending an email often results in the default application language being used, ignoring the specific recipient's required setting. This happens because setting the locale globally affects the entire request lifecycle, and subsequent mailer operations might not inherit that context correctly, leading to unpredictable results.

This post will dive into why your current approach falls short and provide a robust, developer-centric solution for ensuring Laravel sends emails precisely in the locale of the recipient.

## The Pitfalls of Global Locale Setting

Your attempt to set the locale immediately before `Mail::send()` or via middleware demonstrates an understanding of how Laravel handles localization, but it highlights a crucial architectural point: **global state management.**

When you use `\App::setLocale('pl');`, you are changing the global locale for the entire running request. While this works fine for rendering views (as seen in your "dirty" solution), it doesn't automatically translate into the data being serialized or processed by the Mail system unless that context is explicitly passed. For email generation, we need to ensure two things:

1.  The data being inserted into the email template uses the correct locale.
2.  The mailer itself is aware of the target locale for final formatting (if necessary).

Relying on setting a global application state like this can lead to bugs if other parts of your controller or service inadvertently rely on the default locale later in the request cycle, which is why we must look for context-aware solutions.

## The Developer Solution: Passing Locale Context Explicitly

The most reliable and cleanest way to handle locale-specific emails is to avoid modifying the global application state (`App::setLocale()`) directly within your email sending logic. Instead, you should pass the required locale information *with* the data being sent to the mailer. This keeps your code explicit, testable, and decoupled from the core application configuration.

### Step 1: Ensure Locale is Available in the Model/Data Layer

First, ensure that the locale for the recipient (e.g., `$email_recipee->lang`) is correctly retrieved from your database or Eloquent model when you fetch the data.

### Step 2: Injecting Context into the Mailer

When sending the email, pass this locale information directly to the mailer closure or the data payload. The key is to use the specific object's locale rather than overwriting the application default.

Here is a revised approach demonstrating how you can handle this within your controller context:

```php
use Illuminate\Support\Facades\Mail;
use App\Models\Recipee; // Assuming Recipee model exists

// In your Controller method:
public function sendCustomEmail(Recipee $recipee)
{
    // 1. Retrieve the required locale for this specific recipient
    $recipientLocale = $recipee->lang ?? 'en'; // Default to English if not set

    // 2. Send the email, passing the locale directly into the closure
    Mail::send('emails.new_'.$itemtype, [
        'object' => $object,
        'email' => $recipee,
        'locale' => $recipientLocale // Pass the context here!
    ], function ($m) use ($recipee, $object, $itemtype, $recipientLocale) {
        $m->to($recipee, 'Title')->subject('Subject of email');
        
        // 3. Use the passed locale inside the view context if needed
        // Note: The actual localization must happen in your Blade view files!
    });
}
```

### Step 3: Handling Localization in the View (The Correct Place)

The final, crucial step is handling the translation within your Blade files. You should not rely on setting a global locale inside the mailer; instead, use the data you sent to conditionally render translations based on the context provided by the model.

Inside your email view (`emails/new_*.blade.php`), you would access the recipient's language property:

```blade
{{-- Example in your Blade file --}}
<h2>{{ \App\Models\Recipee::get($email)->name }}</h2>

{{-- Use a helper or translation function based on $locale passed from the mailer context --}}
@php
    $currentLocale = $locale ?? 'en'; // Ensure a default is always present
@endphp

<p>{{ __('messages.welcome', ['locale' => $currentLocale]) }}</p> 
```

This pattern ensures that the locale information travels with the data, remains scoped to the specific email, and is handled explicitly within the view layer, adhering to good separation of concerns. For more advanced context handling in Laravel applications, exploring how scope management works—as discussed in resources from [laravelcompany.com](https://laravelcompany.com)—is always beneficial when dealing with complex data flows.

## Conclusion

To successfully send locale-specific emails in Laravel without resorting to global state manipulation, shift your focus from setting the application's global locale to **passing the required localization context as data** during the mail sending process. By explicitly including the recipient’s language preference within the data payload and handling the final presentation logic within the Blade views, you create a solution that is cleaner, more robust, and easier to maintain, ensuring your emails are always delivered in the correct language for each recipient.
