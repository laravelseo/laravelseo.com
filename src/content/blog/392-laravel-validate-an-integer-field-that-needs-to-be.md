---
title: "Laravel: validate an integer field that needs to be greater than another"
description: "Title: Laravel: Validate an Integer Field that Needs to be Greater than Another Body: In the realm of web development with Laravel, validation plays a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Laravel: Validate an Integer Field that Needs to be Greater than Another

Body:

In the realm of web development with Laravel, validation plays a crucial role in making sure user input complies with preset conditions before saving or processing data. In this blog post, we will explore how to create a validation rule for an integer field that needs to be greater than another.

Let's first analyze our existing code:
<pre><code>$rules = [
  'initial_page' => 'required_with:end_page|integer|min:1|digits_between: 1,5',
  'end_page' => 'required_with:initial_page|integer|min:2|digits_between:1,5'
];
</code></pre>

From this code, we can see that both fields are essentially optional if the other is present. Additionally, they have validation rules to ensure the input is an integer and follows specific length criteria. However, our new task is to include a rule ensuring that <code>end_page</code> must be greater than <code>initial_page</code>.

To achieve this goal, we can create a custom validation rule which will allow us to perform more complex logic. First, let's define the required attributes and their minimum values:
<pre><code>$rules = [
  'initial_page' => 'required|integer|min:1|digits:between:1,5',
  'end_page'    => 'integer',
];
</code></pre>

Now we need to create a custom validation rule for the condition we want to enforce. To do this, let's first define a custom rule that checks if two values are in the correct order:
<pre><code>public function greaterThan($attribute, $value, $parameters)
{
  // Get the two attributes from the request input
  $initialPage = $this->validator->getData()[$attribute];
  $endPage    = $this->validator->getData()['end_page'];

  // Check if both values are passed and they are both positive integers. If not, return false
  $intInitialPage = intval($initialPage) ?: false;
  $intEndPage    = intval($endPage)    ?: false;

  if (!$intInitialPage || !$intEndPage) {
    return false;
  }

  // Compare the values and return true or false accordingly
  if ($intInitialPage < $intEndPage) {
    return false;
  } else {
    return true;
  }
}
</code></pre>

To use this custom rule, add it to your Laravel project's validator class (e.g., App\Http\Requests\MyRequestValidator):
<pre><code>public function rules()
{
  // ...

  return [
    'initial_page' => 'required|integer|min:1|digits:between:1,5',
    'end_page'    => 'integer|greatThan:initial_page',
  ];
}
</code></pre>

Now, whenever your request fails validation due to issues with either the <code>initial_page</code> or <code>end_page</code>, Laravel will run your custom rule. This approach ensures that both fields are optional only if both are present, and it respects our additional constraint by making sure that <code>end_page</code> is greater than <code>initial_page</code>.

In conclusion, creating a well-structured validation rule in Laravel allows us to enforce complex conditions on user input data. By following this approach, we can ensure the integrity of our application's data and prevent possible inconsistencies that could cause issues down the line.
