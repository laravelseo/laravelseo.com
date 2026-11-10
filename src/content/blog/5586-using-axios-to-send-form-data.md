---
title: "Using Axios to send form data"
description: "Using Axios to Send Form Data: The Developer's Guide Just wondering if it's possible to serialize data from an HTML form element and then post the data using..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "HTML"]
featured: false
---

Just wondering if it's possible to serialize data from an HTML form element and then post the data using a POST request with Axios. This is a very common requirement when building Single Page Applications (SPAs) or handling user input dynamically without full page reloads. While submitting a standard HTML form works, interacting with an API via Axios requires a specific serialization step.

As a senior developer, I can tell you that there are several ways to achieve this, but the most robust and modern approach involves moving away from traditional form submissions and embracing JSON data transfer.

## The Difference Between Form Submission and API Calls

When a user clicks a submit button on an HTML `<form>`, the browser handles sending the data using standard HTTP methods (usually `POST` or `GET`) with specific content types (`application/x-www-form-urlencoded`). This is excellent for traditional server-side rendering.

However, when you use Axios to interact with a modern backend API (like a Laravel application), the expectation is usually to send data in the **JSON** format (`application/json`). To achieve this, you must manually collect the values from your HTML elements and structure them into a JavaScript object before sending the request.

## Method 1: The Recommended Approach – Manual Serialization with Axios

The best practice for sending complex form data via AJAX is to read the input values directly from the DOM and construct a JavaScript object. This gives you complete control over what data is sent, regardless of how the HTML form was structured.

If your HTML looks like this:
```html
<form id="venueForm">
    <input type="text" name="name" id="nameField">
    <input type="number" name="capacity" id="capacityField">
    <button type="submit">Submit</button>
</form>
```

You would use JavaScript to capture these values:

```javascript
function form_submission(e) {
    e.preventDefault(); // Stop the default form submission behavior
    
    var form = document.getElementById('venueForm');
    
    // 1. Collect data from input fields
    const name = document.getElementById('nameField').value;
    const capacity = document.getElementById('capacityField').value;

    // 2. Create the payload object
    const dataToSend = {
        name: name,
        venue_capacity: parseInt(capacity) // Ensure numbers are sent as numbers
    };

    // 3. Send the JSON payload using Axios
    axios.post('/venue/', dataToSend)
        .then(function (response) {
            console.log('Success:', response.data);
            alert('Venue submitted successfully!');
        })
        .catch(function (error) {
            console.error('Error during submission:', error);
        });
}

// Attach the function to the form submission event
document.getElementById('venueForm').addEventListener('submit', form_submission);
```

### Why Manual Serialization Wins

This method is superior because it explicitly defines the structure of your API request. When you are working with frameworks like Laravel, which heavily rely on Eloquent models and Request objects to handle incoming data, sending a clean JSON object (as demonstrated above) makes validation, database mapping, and error handling significantly cleaner. This aligns perfectly with modern RESTful API design principles that underpin robust frameworks like [Laravel](https://laravelcompany.com).

## Method 2: Using `FormData` for Traditional Form Encoding

An alternative, often simpler approach when dealing strictly with standard form fields (and not complex nested objects), is using the built-in `FormData` object. This object handles the serialization process automatically into the `application/x-www-form-urlencoded` format that traditional HTML forms use.

```javascript
function form_submission_formData(e) {
    e.preventDefault();
    
    const form = document.getElementById('venueForm');
    
    // FormData object collects all form fields into a key/value map
    const formData = new FormData(form); 

    // Axios can automatically serialize this object correctly for POST requests
    axios.post('/venue/', formData)
        .then(function (response) {
            console.log('Success:', response.data);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}

document.getElementById('venueForm').addEventListener('submit', form_submission_formData);
```

### When to Choose Which Method?

*   **Choose Manual Serialization (Method 1):** When you are building a pure REST API where the client and server agree on sending JSON data, and you need fine-grained control over data types (e.g., ensuring an input is treated as an integer).
*   **Choose `FormData` (Method 2):** When you are mimicking traditional HTML form submission behavior or when dealing with simple, flat data structures that map directly to URL-encoded parameters.

## Conclusion

To summarize, yes, it is absolutely possible and highly recommended to serialize form data and send it via Axios. While the native HTML `<form>` method works for simple submissions, interacting with a modern backend API demands sending structured data, preferably in JSON format. By manually reading DOM elements and using `JSON.stringify()`, you ensure your data payload is clean, predictable, and ready for seamless processing by frameworks like Laravel. Always prioritize clarity and structure when building your API interactions!
