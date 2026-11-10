---
title: "Laravel validation for a number which should be exactly 10 digits"
description: "Title: Laravel Validation for Exactly 10 Digit Phone Numbers Introduction: In today's world, web applications often require validating user inputs to ensure..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Laravel Validation for Exactly 10 Digit Phone Numbers

Introduction:
In today's world, web applications often require validating user inputs to ensure that the data being submitted is accurate and relevant. A common example of this is phone number validation. In this blog post, we will focus on how Laravel can be leveraged to validate a phone number that should have exactly 10 digits.

Body:
1. Create the Phone Number Validation Rule
To start, create your custom validation rule for phone numbers with precisely 10 digits. This rule must return true if the provided phone number has exactly 10 digits and false otherwise. Here's a sample implementation of this rule:

<pre><code>public function validatePhoneWithExactlyTenDigits($attribute, $value, $fail) {
    $numDigits = strlen((string)$value);

    if ($numDigits !== 10) {
        return $fail('The phone number must be exactly 10 digits.');
    } else {
        return true;
    }
}</code></pre>

2. Add the Validation Rule to Your Laravel Project
Next, add your custom validation rule to your Laravel project. You can place it in a folder named "CustomValidators" within the root of your application. Ensure that this directory is included in your autoloading configuration, so Laravel knows how to find and use your custom rules.

3. Implement the Validation Rule in Your Controller Method
To implement the new validation rule, update your controller method as follows:

<pre><code>public function tytraining(Request $request) {
    $this-&gt;validate($request, [
        'txt_name'  =&gt; 'required',
        'txt_email' =&gt; 'required|email',
        'txt_phone' =&gt; 'required|numeric|exactly:10|useCustomValidationRule:myPhoneWithTenDigitsValidator'
    ]);
    ...
}</code></pre>

Here, we are using the "exactly" validation rule with a value of 10 to ensure that your phone number has exactly ten digits. Additionally, we use the "useCustomValidationRule" option and specify the custom validator class to apply our specialized rule for this field.

4. Test Your Validation Rule
To test your new validation rule, you can try submitting a form with various types of input: a 10-digit phone number, an 11-digit one, and a text value that is not a valid phone number format. You should observe the following results (note that error messages may vary depending on your Laravel installation):

When submitting a 10-digit phone number: No errors are displayed as this is the desired scenario. The validation passes successfully.
When submitting an 11-digit phone number: You see an error message saying, "The phone number must be exactly 10 digits."
When submitting a non-phone number value: An appropriate error message related to the specific field will be displayed, but there should not be any errors from your custom validation rule due to it being applied only to the phone number field.

Conclusion:
By following these steps and incorporating our custom validation rule into your Laravel project, you can ensure that users provide the correct phone numbers with exactly 10 digits. This helps maintain data integrity and enhance user experience by avoiding unnecessary errors while validating forms.
