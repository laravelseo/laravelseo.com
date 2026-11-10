---
title: "laravel validate Content-Type: application/json request"
description: "Mastering JSON Validation in Laravel: A Deep Dive into Form Requests As a senior developer, I frequently encounter scenarios where handling complex,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

As a senior developer, I frequently encounter scenarios where handling complex, structured data—especially JSON payloads delivered via APIs—requires robust validation. The process of accepting raw JSON and then validating its internal structure can seem straightforward, but implementing this correctly within the Laravel framework requires understanding how Form Requests interact with the incoming HTTP request.

This post will walk you through exactly how to take your existing setup, which successfully accepts JSON data, and integrate granular validation rules for specific fields, like your `name` field, using a dedicated Request class. We will transform a successful data reception into fully validated input.

## The Foundation: Filtering for JSON Input

You have already taken the crucial first step by creating a custom request class, let's call it `ApiRequest`, and implementing an authorization check:

```php
class ApiRequest extends Request
{
    public function authorize() {
      return $this->isJson(); // Ensures the request body is valid JSON
    }
    // ... rules will go here
}
```

The method `$this->isJson()` is excellent for ensuring that only requests with the `Content-Type: application/json` header are processed. This separation of concerns—checking *what* the input is before validating *what* it contains—is a core principle of clean Laravel development, aligning with best practices promoted by the [laravelcompany.com](https://laravelcompany.com) team.

## The Missing Piece: Applying Validation Rules

The next step is to utilize the `rules()` method within your request class. This is where you define the constraints that the incoming data must satisfy. When Laravel processes a Form Request, it automatically attempts to validate the input against these rules before allowing the request to proceed to your controller logic.

To implement the validation for the `name` field, you simply define the necessary constraints within `rules()`:

```php
class ApiRequest extends Request
{
    public function authorize() {
      return $this->isJson();
    }

    public function rules()
    {
         return [
            'name' => 'required|string|min:6', // Ensures the 'name' field exists, is a string, and is at least 6 characters long.
        ];
    }
}
```

### Why This Approach is Superior

The key advantage of placing validation rules in the Form Request class is that it enforces **separation of concerns**. Your controller should remain focused on business logic, not repetitive data checks. Instead of manually checking `if (empty($name))` and handling errors yourself in the controller, you delegate this responsibility entirely to the request layer.

When a request passes through your `ApiRequest`, Laravel handles:
1. Checking if the input is JSON (`authorize()`).
2. Ensuring all required fields are present and meet their defined constraints (`rules()`).
3. If validation fails, it automatically returns a standardized error response (usually a 422 Unprocessable Entity), saving you significant boilerplate code.

## Integrating with the Controller

With the rules defined, your controller logic becomes much cleaner. You no longer need to manually decode the JSON in the controller if you are using dependency injection correctly. The input data is automatically validated and ready to use.

Here is how your `postDoitApi` method should look when utilizing a Form Request:

```php
use App\Http\Requests\ApiRequest;

class YourController extends Controller
{
    public function postDoitApi(ApiRequest $payload) {
        // If execution reaches this point, the data is GUARANTEED to be valid JSON
        // and the 'name' field must meet the 'required|min:6' rule.

        $name = $payload->input('name'); 
        // Or more simply, if you are sure about array access in Laravel:
        // $name = $payload->name; 

        // Now you can safely proceed with saving or processing the data.
        // Example: Save the validated name to a database model.
    }
}
```

## Conclusion

By leveraging Laravel's Form Request system, you move beyond simple request filtering and establish a powerful, reusable layer for input validation. Starting with basic checks like `isJson()` and expanding into detailed constraints using the `rules()` method allows you to build highly secure, maintainable, and professional APIs. For more advanced data handling and structure management within your application, exploring Laravel’s ecosystem, including Eloquent models, will only enhance this workflow further. Happy coding!
