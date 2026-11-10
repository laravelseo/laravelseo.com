---
title: "Laravel 5.1 - Checking if the date expired"
description: "Mastering Time Sensitive Logic in Laravel: Checking Coupon Expiration As a senior developer working with e commerce systems, managing dynamic data—especially..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

As a senior developer working with e-commerce systems, managing dynamic data—especially time-sensitive data like coupon validity—is crucial. When dealing with sessions, database entries, and user experience, the logic must be robust, secure, and efficient. In your scenario, you are correctly identifying the need to check an expiration date, and introducing Carbon is the absolute right direction.

This post will walk you through exactly how to implement this date checking logic within your Laravel application, ensuring that only valid coupons grant discounts. We will focus on practical implementation within your `CouponController`.

## The Power of Carbon for Date Management

You mentioned reading about Carbon but feeling unsure. Carbon is not just a date/time library; it’s an expressive, immutable, and highly intuitive way to handle dates in PHP. Instead of dealing with raw Unix timestamps or complex date functions, Carbon makes comparisons readable and safe.

For checking expiration dates, the key is comparing two points in time: the stored `expire_date` from your database and the current moment.

When you use `$coupon->expire_date`, Carbon allows you to easily compare it against the present moment using methods like `isPast()`, `greaterThan()`, or by direct comparison with `Carbon::now()`. This eliminates common pitfalls associated with manual date manipulation, making your code cleaner and less error-prone.

## Step-by-Step Implementation in the Controller

Let's refactor your `postCoupon` method to correctly handle the existence check and the expiration check. We will leverage Eloquent queries for efficiency and Carbon for accurate time comparison.

### 1. Fetching the Coupon and Checking Expiration

The first step is to retrieve the coupon based on the code. If it exists, we immediately check if its expiration date has passed.

```php
use Illuminate\Http\Request;
use dixard\Coupon;
use Carbon\Carbon; // Ensure this is imported

class CouponController extends Controller
{
    public function postCoupon(Request $request)
    {
        $couponCode = $request->get('coupon');

        // 1. Check if the coupon exists in the database
        $coupon = Coupon::where('code', $couponCode)->first();

        if (!$coupon) {
            return response()->json(['error' => 'Coupon invalid or not found'], 404);
        }

        // 2. Check if the coupon has expired using Carbon
        // We compare the stored expire_date with the current time.
        if ($coupon->expire_date && $coupon->expire_date->lessThan(Carbon::now())) {
            // Coupon is expired
            return response()->json(['error' => 'Coupon invalid: This coupon has expired.'], 410);
        }

        // 3. If the coupon exists and is not expired, proceed with applying the discount
        $discount = $coupon->price; // Retrieve the valid price

        // Logic to add the discount to the session cart would go here...
        session()->put('discount_applied', $discount);

        return response()->json(['message' => 'Coupon successfully applied.', 'discount' => $discount], 200);
    }
}
```

### Explanation of Changes and Best Practices

1.  **Early Exit (Guard Clauses):** We use guard clauses (`if (!$coupon)` and the expiration check) at the beginning of the function. This keeps the main logic clean by immediately stopping execution if a condition is not met, preventing further processing on invalid data.
2.  **Eloquent Efficiency:** Using `Coupon::where('code', $couponCode)->first()` is an efficient way to retrieve a single record from the database. For more complex scenarios involving relationships, Laravel's Eloquent features (like eager loading) are invaluable for optimizing database calls—a core principle of building robust applications with Laravel.
3.  **Carbon Comparison:** The critical line is `$coupon->expire_date->lessThan(Carbon::now())`. This cleanly checks if the stored date is strictly before the current time, providing a precise and readable result.
4.  **Handling Results:** Instead of trying to manage session data directly within this controller method (which is generally discouraged for complex transactions), we return a structured JSON response. The calling view or subsequent controller action can then handle updating the session safely.

## Conclusion

By combining the power of Eloquent for database interaction and the expressive capabilities of Carbon for time management, you create a system that is not only functional but also highly reliable. Remember, adhering to these principles—checking existence first, then validity, and finally executing the action—is the hallmark of writing professional Laravel code. Keep building powerful applications by leveraging the framework's tools effectively, just as you would when exploring advanced features on the official site like [laravelcompany.com](https://laravelcompany.com).
