---
title: "How to properly add conditional class to Alpine JS x-for template?"
description: "Title: Adding Conditional Classes in Alpine JS Templates with Loops Introduction AlpineJS is an efficient and easy to use JavaScript framework for building..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Technical SEO", "Content", "JavaScript", "HTML"]
featured: false
---

Title: Adding Conditional Classes in Alpine JS Templates with Loops

Introduction
AlpineJS is an efficient and easy-to-use JavaScript framework for building responsive web applications. It allows developers to interact with HTML elements easily, making creating interactive and dynamic user interfaces a breeze. One of the powerful features it offers is the ability to iterate through loops using the x-for directive. However, you might need to add conditional logic based on certain conditions, such as checking if an item from the loop has a specific index that requires special styling. This blog post will walk you through how to properly add conditional classes to AlpineJS's x-for templates with tailwindcss.

Conditional Classes in TailwindCSS
TailwindCSS is a highly popular CSS framework, which consists of utility classes for rapidly building robust and dynamic user interfaces. With its class-based architecture, you can easily apply styles to your HTML elements based on specific conditions. To achieve this, you need to use the following syntax:

<code>{ 'class-name': statement }</code>

In this context, the "statement" is a condition that defines whether or not the specified class should be applied to the element. For example:

<code>::class({'bg-red-500': !isMobile})</code>

The above code will apply the 'bg-red-500' class if the isMobile variable evaluates to false, giving it a red background color when the viewport is not a mobile device.

Conditional Classes in AlpineJS Templates
Now let us discuss how to use this syntax in an AlpineJS template with a loop. Consider the following code:

<pre><code>&lt;template x-for=&quot;(card, index ) in cards&quot; :key=&quot;index&quot;&gt;
    &lt;div class=&quot;w-40 h-64&quot;
         x-modal=&quot;card&quot;
         :class=&quot;[card.someOtherClass,
             {'bg-green-500':  index > 3 },
          ]&quot;
        &gt;
        &lt;div class=&quot;card-content&quot; :id=&quot;'card-' + card.id&quot;&gt;
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/template&gt;
</code></pre>

Here, you are iterating through a loop of cards and applying the following classes: 'w-40 h-64' to have a fixed width and height, 'x-modal=card' for modals, and 'someOtherClass' from TailwindCSS. You also want to add the class '.bg-green-500' if the index of the current card is greater than 3 (i.e., above the fourth item in the list).

The Issue with Existing Code
However, this code doesn't work as expected. Instead of the 'bg-green-500' class being applied to the div elements with an index greater than 3, you get a class attribute containing the string '[object Object]'. This is because AlpineJS does not evaluate JavaScript expressions in the :class statement and treats the entire expression as plain text.

A Working Solution
To fix this issue, you need to apply the conditional logic outside of the template by using the x-ref directive. You can then refer to the index value from the data attribute provided by the x-ref. Here's a revised code snippet:

<pre><code>&lt;template x-for=&quot;(card, index ) in cards&quot; :key=&quot;index&quot;&gt;
    &lt;div class=&quot;w-40 h-64&quot;
         x-modal=&quot;card&quot;
         ref=&quot;el&quot;
         :class=&quot;[card.someOtherClass, {'bg-green-500': isConditional(index) }]&quot;
        &gt;
        &lt;div class=&quot;card-content&quot; :id=&quot;'card-' + card.id&quot;&gt;
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/template&gt;

<script>
    document.querySelectorAll('[ref]').forEach(el => {
      let index = el.getAttribute('index');
      if (!isNaN(parseInt(index))) {
        // Assuming isConditional() returns a boolean value based on your desired conditional logic
        el.setAttribute('class', `${card.someOtherClass} ${(isConditional(index) ? 'bg-green-500' : '')}`);
      }
    });
</script>
</code></pre>

In this revised code, we added a ref attribute to the div elements and an index attribute to store their indices. We then applied our conditional logic outside of the template using JavaScript, allowing us to properly evaluate the condition for each element without any syntax issues.

Conclusion
While adding conditional classes in AlpineJS templates with loops might seem tricky at first, the correct usage of TailwindCSS utility classes and proper integration with AlpineJS can lead to robust and efficient web applications. By following the best practices such as using x-ref directive and splitting your logic across different sections, you'll be able to implement your desired behavior easily.
