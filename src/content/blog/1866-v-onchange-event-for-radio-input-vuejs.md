---
title: "v-on:change event for radio input VueJS"
description: "Title: Efficiently Handling v on:change Event for Radio Inputs in VueJS Applications Body: In modern web development, using a frontend framework like VueJS..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["JavaScript", "HTML"]
featured: false
---

Title: Efficiently Handling v-on:change Event for Radio Inputs in VueJS Applications

Body: In modern web development, using a frontend framework like VueJS helps developers build more robust and interactive web applications. One of the crucial aspects of handling user input is to efficiently respond to changes made in form fields like radio inputs. Let's dive into optimizing this process for VueJS applications.

<p>HTML:</p>
<pre><code>&lt;input
  type="radio"
  id="flat"
  name="property_type"
  class="switch-input"
  v-model="registerData.propertyType"
  value="flat"
  checked
/&gt;
</code></pre>

<p>Here, you have a radio input with the specified attributes, including <code>v-model</code> which helps in updating the model when the radio button is selected. The problem, as mentioned, occurs upon adding the <code>v-on:change="foo"</code> attribute to the radio input element. This might lead to a crash on page load.</p>

<p>Code:</p>

<pre><code>var companyList = new Vue({
    el: '#companyList',
    cache: false,
    data: {
        disabledTime: {
            to: new Date()
        },
        registerData: {
            serviceCategoryId: '{{ $serviceCategoryId }}'
        }
    },
    methods: {
        foo: function() {
            console.log('aaa');
        }
    }
})
</code></pre>

<p>In this code, you have defined a Vue instance and specified event handlers for your application. The main issue appears to be the way you are attaching the change event listener to the radio input field. This seems to cause an unexpected behavior and crashes the page.</p>

To solve this problem, it's essential to understand how VueJS handles form events and its data binding process. Instead of directly using the <code>v-on:change="foo"</code> attribute on the radio input, you might want to consider binding the change event separately in your app. Let's revise the code block:

<pre><code>var companyList = new Vue({
    el: '#companyList',
    cache: false,
    data: {
        disabledTime: {
            to: new Date()
        },
        registerData: {
            serviceCategoryId: '{{ $serviceCategoryId }}'
        }
    },
    methods: {
        foo: function() {
            console.log('aaa');
        },
        handleRadioChange(event) {
            this.registerData.propertyType = event.target.value;
            // Perform any other necessary actions on the change of radio input value
        }
    }
})
</code></pre>

In this code, you create a separate method to handle the radio change event and bind it to your Vue application. This approach ensures that your code runs smoothly without causing any issues when handling form events in VueJS applications.

In summary, to efficiently call functions upon a change event for radio inputs using VueJS, follow these best practices:

1. Use the <code>v-model</code> attribute for data binding and updating model values when the radio button is selected.
2. Separately define an appropriate handler method for the change event.
3. Connect your event handling code to the Vue instance using the correct syntax, ensuring a smooth transition between form events and application behavior.

By following these recommendations, you can create robust, stable, and efficient web applications with VueJS efficiently handling user input changes such as radio button selection.
