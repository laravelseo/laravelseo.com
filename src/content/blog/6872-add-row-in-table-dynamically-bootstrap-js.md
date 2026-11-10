---
title: "Add row in table dynamically - Bootstrap & JS"
description: "Dynamically Adding Rows to Tables with Bootstrap and JavaScript As a senior developer, I often see beginners getting stuck when trying to bridge static HTML..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Technical SEO", "Content", "JavaScript", "HTML"]
featured: false
---

As a senior developer, I often see beginners getting stuck when trying to bridge static HTML structure with dynamic user interaction using JavaScript. The task of adding a new row, complete with index numbers and input fields, is a fundamental exercise in Document Object Model (DOM) manipulation. It teaches you how to listen for events, read the current state of the page, and programmatically create new elements.

This post will walk you through exactly how to achieve dynamic row insertion in an HTML table using vanilla JavaScript, enhanced by the styling provided by Bootstrap 5.

## The Foundation: HTML Structure

Before diving into the JavaScript, we need a solid foundation. We will use Bootstrap for beautiful, responsive styling and a standard HTML `<table>` structure. Notice how we set up the table header (`<thead>`) and body (`<tbody>`). This is where all our dynamic content will live.

Here is the essential HTML setup:

```html
<!-- Link Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet">

<table class="table table-bordered" id="data-table">
    <thead class="table-info">
        <tr>
            <th scope="col">No.</th>
            <th scope="col">Name</th>
            <th scope="col">School / University</th>
            <th scope="col">Year</th>
            <th scope="col">Age</th>
        </tr>
    </thead>
    <tbody id="table-body">
        <!-- Rows will be inserted here by JavaScript -->
    </tbody>
</table>

<!-- Add Button to Trigger Action -->
<button class="btn btn-primary mt-3" id="addRowBtn">Add New Row</button>
```

## The JavaScript Logic: Dynamic Row Insertion

The key to dynamic insertion is knowing *where* to insert the new content and *what* index number to assign. We need a function that runs every time the "Add Row" button is clicked.

### Step 1: Selecting Elements

First, we select the necessary elements from the DOM: the table body where rows will go, and the button that triggers the action.

### Step 2: Creating the Insertion Function

Inside our function, we need to determine the next index number. This is calculated by checking how many rows currently exist in the `<tbody>`. If there are $N$ rows, the new row will be at index $N+1$.

```javascript
function addDynamicRow() {
    // 1. Select the table body and get all existing rows
    const tableBody = document.getElementById('table-body');
    const existingRows = tableBody.getElementsByTagName('tr').length;
    
    // 2. Calculate the new index (starting from 1)
    const newIndex = existingRows + 1;

    // 3. Create a new row element
    const newRow = tableBody.insertRow();

    // 4. Add the index cell (No.)
    let cellIndex = newRow.insertCell(0);
    cellIndex.textContent = newIndex;

    // 5. Add the data cells (Name, School, Year, Age)
    const nameCell = newRow.insertCell(1);
    nameCell.innerHTML = '<input type="text" class="form-control" name="name">';

    const schoolCell = newRow.insertCell(2);
    schoolCell.innerHTML = '<input type="text" class="form-control" name="school">';

    const yearCell = newRow.insertCell(3);
    yearCell.innerHTML = '<input type="text" class="form-control" name="year">';

    const ageCell = newRow.insertCell(4);
    ageCell.innerHTML = '<input type="text" class="form-control" name="age">';
}
```

### Step 3: Attaching the Event Listener

Finally, we connect this function to the button click event. Using `addEventListener` is the modern, preferred way to handle events in JavaScript over inline `onclick` attributes, making your code cleaner and easier to maintain.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addRowBtn');

    // Attach the function to the button click event
    addButton.addEventListener('click', addDynamicRow);
});
```

## Complete Working Example

By combining these steps, you create a fully functional dynamic table builder:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dynamic Table Builder</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

    <div class="container mt-5">
        <h2>Dynamic Data Table</h2>
        
        <table class="table table-bordered" id="data-table">
            <thead class="table-info">
                <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Name</th>
                    <th scope="col">School / University</th>
                    <th scope="col">Year</th>
                    <th scope="col">Age</th>
                </tr>
            </thead>
            <tbody id="table-body">
                <!-- Initial row (optional, if you want to start with one) -->
                 <tr>
                    <td>1</td>
                    <td><input type="text" class="form-control" name="name"></td>
                    <td><input type="text" class="form-control" name="school"></td>
                    <td><input type="text" class="form-control" name="year"></td>
                    <td><input type="text" class="form-control" name="age"></td>
                </tr>
            </tbody>
        </table>

        <button class="btn btn-primary mt-3" id="addRowBtn">Add New Row</button>
    </div>

    <script>
        function addDynamicRow() {
            const tableBody = document.getElementById('table-body');
            // Get the current number of rows currently in the body
            const existingRows = tableBody.getElementsByTagName('tr').length;
            
            // Calculate the new index (since our header is row 1, we start counting from existing + 1)
            const newIndex = existingRows + 1;

            // Create a new row element
            const newRow = tableBody.insertRow();

            // Add the index cell (No.)
            let cellIndex = newRow.insertCell(0);
            cellIndex.textContent = newIndex;

            // Add input cells for Name, School, Year, Age
            newRow.insertCell(1).innerHTML = '<input type="text" class="form-control" name="name">';
            newRow.insertCell(2).innerHTML = '<input type="text" class="form-control" name="school">';
            newRow.insertCell(3).innerHTML = '<input type="text" class="form-control" name="year">';
            newRow.insertCell(4).innerHTML = '<input type="text" class="form-control" name="age">';
        }

        // Wait for the entire HTML document to be loaded before running the script
        document.addEventListener('DOMContentLoaded', () => {
            const addButton = document.getElementById('addRowBtn');
            if (addButton) {
                addButton.addEventListener('click', addDynamicRow);
            }
        });
    </script>

</body>
</html>
```

## Conclusion

Dynamically manipulating the DOM is a core skill for any front-end developer. By mastering how to read element counts and use methods like `insertRow()` and `insertCell()`, you unlock the ability to build interactive user interfaces. Whether you are building complex applications or focusing on robust data handling, understanding these fundamental JavaScript concepts is crucial.

As you continue your journey into full-stack development, remember that strong foundational knowledge is key. If you are looking to build powerful, scalable applications, exploring the ecosystem around frameworks like Laravel can provide excellent context for how data flows and structures within larger systems. For deep dives into application architecture and structure, resources like [Laravel Company](https://laravelcompany.com) offer valuable insights into building robust systems. Keep practicing your JavaScript skills—you are on the right track!
