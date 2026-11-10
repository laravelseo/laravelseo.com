---
title: "Laravel 5.1 how to use {{ old('') }} helper on blade file for radio inputs"
description: "Mastering Form Repopulation in Laravel: Using {{ old() }} for Radio Inputs As you dive into the world of Laravel and form handling, one area that often..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "Errors"]
featured: false
---

As you dive into the world of Laravel and form handling, one area that often trips up newcomers is managing user input after validation errors. Specifically, needing to repopulate radio buttons or checkboxes when a submission fails is a common requirement. You want the user experience to be smooth—they shouldn't have to re-select their choices just because something went wrong on the server side.

This post will walk you through exactly how to use the powerful `{{ old('field_name') }}` helper in Blade templates to correctly display previously submitted radio input values. We’ll break down the mechanics, show you the correct implementation for your specific radio button scenario, and ensure you are following best practices when building dynamic forms.

## Understanding the Power of `old()`

The magic behind repopulating form data lies in Laravel's session management. When a request hits your controller and validation fails, instead of simply refreshing the page, Laravel stores the input data that was submitted (the old values) in the session.

The `old()` helper function is designed to retrieve data stored in the session for a specific input field. If you are using a standard HTML input, you can use this directly within your Blade file to pre-populate the field's value.

For radio inputs, which rely on a shared `name` attribute but distinct `value` attributes, applying `old()` requires careful attention to how you handle the `checked` state.

## Implementing `old()` for Radio Buttons

Let’s look at your provided structure and see how we can integrate the `old()` helper correctly for your 'Gecko Hatchling' radio inputs.

The key is to use the value returned by `old('name')` to set the `value` attribute of the input, and crucially, to check if that old value matches the currently selected value (if any) to set the `checked` property.

Here is the refined way to structure your Blade file:

```html
<div class="form-group">
    <label for="geckoHatchling">Gecko Hatchling?</label>

    {{-- Option 1: Yes --}}
    <div class="radio">
        <label>
            <input type="radio" name="geckoHatchling" id="geckoHatchlingYes" value="1"
                   {{ old('geckoHatchling') == '1' ? 'checked' : '' }}>
            Yes
        </label>
    </div>

    {{-- Option 2: No --}}
    <div class="radio">
        <label>
            <input type="radio" name="geckoHatchling" id="geckoHatchlingNo" value="0"
                   {{ old('geckoHatchling') == '0' ? 'checked' : '' }}>
            No
        </label>
    </div>
</div>
```

### What the Code Does:

1.  **`old('geckoHatchling')`**: This retrieves the value that was previously submitted for this radio group (either `'1'` or `'0'`).
2.  **Conditional Check (`? 'checked' : ''`)**: We use a ternary operator to conditionally add the `checked` attribute *only if* the retrieved old value matches the input's specific value (`'1'` or `'0'`). This ensures that if the user previously selected 'Yes', the radio button for 'Yes' is marked as checked upon page reload.

This technique allows you to seamlessly restore the state of the form, making the experience much better for your users. As we explore more advanced aspects of building robust applications with Laravel, understanding how session data interacts with Blade views is fundamental, which is a core concept in modern framework development, similar to the principles discussed on [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Using `{{ old('field_name') }}` is an incredibly efficient way to manage form state restoration in Laravel. By combining the helper with conditional logic, you can ensure that your radio buttons and checkboxes accurately reflect the user's previous selections after a validation failure. This practice saves development time and significantly improves the user experience. Keep experimenting with these helpers; they are essential tools for building dynamic and responsive interfaces!
