---
title: "reCaptcha v3 handle score callback"
description: "Mastering reCAPTCHA v3 Score Handling: A Server Side Security Deep Dive Dealing with reCAPTCHA v3 scores presents a common challenge for developers:..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "Google"]
featured: false
---

Dealing with reCAPTCHA v3 scores presents a common challenge for developers: understanding how to translate a client-side score into reliable, secure server-side enforcement. Many tutorials focus only on displaying the result on the frontend, leaving the crucial backend validation logic ambiguous. As senior developers, we must always prioritize security and ensure that critical decisions—like blocking access or granting permissions—are handled exclusively on the server.

This post will walk through the correct architectural approach for handling reCAPTCHA v3 scores, focusing on robust backend implementation, especially within a framework like Laravel.

## The Anatomy of reCAPTCHA v3 Scoring

reCAPTCHA v3 operates by generating a score (a float between 0.0 and 1.0) based on user behavior. This score is attached to the token sent from the client to your server. The key takeaway here is that **the score itself is not a definitive pass/fail marker; it is a probability.** A high score suggests a human, but malicious bots can still game this system or be bypassed entirely.

The successful flow involves three main steps:
1.  **Client:** User interacts with the reCAPTCHA widget, which generates a token and, optionally, a score.
2.  **Server (Initial Check):** The client sends the token and the score to your backend.
3.  **Server (Final Decision):** Your server must verify the token's validity with Google and use the received score, along with other contextual data, to make the final access decision.

## Handling Scores: Server-Side Authority is Paramount

Your concern about whether to handle the fail/success on the frontend versus the backend is vital. **The answer is always the backend.** Never trust client-side JavaScript for security enforcement. If you allow the user to manipulate the score displayed, your system is compromised.

### The Importance of Backend Verification

When implementing this in a Laravel application, you should treat the reCAPTCHA token as a critical piece of data that must be validated through your server's logic, not just accepted at face value.

If you are using a package that returns JSON (fail or success) based on the score, this distinction is helpful for presentation, but the actual security gate must reside in your controller or middleware.

**Best Practice:** Use the token to verify the user’s identity and use the score as an additional weighting factor for risk assessment. For complex flows, consider storing the reCAPTCHA result (token and score) in your database alongside the relevant record. This makes auditing much simpler, aligning perfectly with the data-centric approach promoted by frameworks like Laravel.

## Implementing Bot Blocking with Laravel Middleware

You mentioned wanting to use this mechanism to block users for a period if they are deemed bots. This is an excellent use case for Laravel's powerful middleware system.

Instead of relying on client-side checks, you can implement a custom middleware that intercepts requests before they hit your application logic.

### Example: Custom Bot Blocking Middleware

You can create a middleware that checks the validity and score associated with an incoming request token stored in the session or database.

```php
// app/Http/Middleware/RecaptchaCheck.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RecaptchaCheck
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Check if the required token exists for this request
        $recaptchaToken = $request->input('g-recaptcha-response');

        if (!$recaptchaToken) {
            return response()->json(['error' => 'reCAPTCHA token missing'], 400);
        }

        // 2. Perform server-side verification (This step would involve calling Google's API or your package logic)
        $verificationResult = $this->verifyToken($recaptchaToken); // Placeholder for actual validation

        if ($verificationResult === 'fail') {
            // Block access immediately if the token is invalid
            return response()->json(['error' => 'reCAPTCHA verification failed'], 403);
        }

        // 3. Check the score and apply bot logic
        $score = $verificationResult['score'];
        if ($score < 0.5) { // Example threshold for blocking suspicious activity
            // Log the attempt and block access
            \Log::warning("Potential bot detected from IP: " . $request->ip());
            return response()->json(['error' => 'Access denied due to low trust score'], 403);
        }

        // If all checks pass, proceed
        return $next($request);
    }

    protected function verifyToken($token)
    {
        // In a real application, this is where you would use your specific reCAPTCHA library or API calls.
        // For demonstration, assume successful verification for now.
        return ['status' => 'success', 'score' => 0.95];
    }
}
```

You would then register this middleware in `app/Http/Kernel.php`. This pattern allows you to centralize security enforcement, making your application more secure and maintainable, which is a core principle when building robust systems with Laravel.

## Conclusion

Handling reCAPTCHA v3 scores effectively requires shifting the focus from client-side display to server-side validation. By treating the token and score as input for a risk assessment engine within your backend logic—leveraging tools like Laravel middleware—you ensure that security decisions are authoritative, immutable, and resistant to client-side manipulation. Always remember: **security is enforced on the server.**
