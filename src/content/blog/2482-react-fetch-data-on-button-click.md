---
title: "react fetch data on button click"
description: "Mastering Asynchronous Data Fetching in React: Solving the Double Click Mystery As developers working with modern JavaScript frameworks like React,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["JavaScript", "Errors"]
featured: false
---

As developers working with modern JavaScript frameworks like React, asynchronous operations—like fetching data from an API—are a daily reality. When you combine this with event handling and state management, subtle bugs related to timing and rendering often appear, leading to frustrating experiences like the one described: data only appearing correctly after multiple interactions.

This post will dive into why this happens in React, how to correctly handle asynchronous data fetching on button clicks, and shed light on the confusion surrounding state updates. We will move beyond simple fixes to establish robust patterns for managing data flow.

## The Root of the Problem: Asynchronous State Updates

The issue you are encountering—where data doesn't appear immediately upon the first click but does on the second—is almost always related to the timing between when an asynchronous operation completes and when React re-renders the component based on the updated state.

When you use `await axios.get(...)` inside an event handler, the execution pauses until the network request is complete. While this seems straightforward, if you are not careful about how you structure your state updates (`setStudents`), React might batch updates or misinterpret the flow, especially when dealing with complex objects returned from APIs.

The confusion surrounding `JSON.stringify(students.data)` highlights a deeper issue: it suggests that the data being stored in the state might not be immediately accessible or in the expected format during the initial render cycle, which is typical when dealing with promises resolving asynchronously.

## Best Practice: Implementing Clean Data Fetching

The most robust way to handle this in React is to manage the fetching process explicitly using `useState` for the data, loading status, and potential errors. This approach provides clear feedback to the user and ensures that rendering logic only executes once the data is confirmed to be ready.

Here is a refined example demonstrating how to fetch data correctly upon a button click:

```jsx
import React, { useState } from 'react';
import axios from 'axios';

function StudentFetcher() {
    const [students, setStudents] = useState(null); // Initialize as null or an empty array
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStudents = async () => {
        setLoading(true); // Start loading state
        setError(null);   // Clear previous errors
        try {
            // Simulate fetching data from an API endpoint
            const response = await axios.get('https://jsonplaceholder.typicode.com/users'); 
            setStudents(response.data); // Update state with the fetched data
        } catch (err) {
            setError("Failed to fetch data. Please try again.");
            setStudents(null);
        } finally {
            setLoading(false); // Stop loading state when done
        }
    };

    return (
        <div>
            <h2>Student Data Fetcher</h2>
            <button onClick={fetchStudents} disabled={loading}>
                {loading ? 'Fetching...' : 'Get Students'}
            </button>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {students && (
                <div>
                    <h3>Fetched Data:</h3>
                    {/* Displaying the data directly is cleaner than stringifying */}
                    <pre>{JSON.stringify(students, null,
