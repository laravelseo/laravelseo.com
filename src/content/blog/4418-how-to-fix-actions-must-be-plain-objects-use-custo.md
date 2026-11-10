---
title: "How to fix 'Actions must be plain objects. Use custom middleware for async actions.'"
description: "How to Fix 'Actions must be plain objects. Use custom middleware for async actions.' in Redux Thunks As a senior developer working with the Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "Errors"]
featured: false
---

As a senior developer working with the Laravel ecosystem, we frequently bridge the gap between robust backend API design and dynamic frontend state management using tools like React and Redux. When managing asynchronous data fetching—especially when interacting with RESTful endpoints provided by Laravel—errors related to action structure are common hurdles.

The error message you encountered, `'Uncaught Error: Actions must be plain objects. Use custom middleware for async actions.'`, is a direct signal from Redux or the specific middleware you are using (like `redux-thunk`) that the dispatched data does not conform to the expected structure of a standard Redux action object (`{ type: string, payload: any }`).

This issue typically arises when asynchronous operations (like an Axios call) are initiated inside a thunk, and the subsequent dispatching logic is structured in a way that violates Redux's contract for synchronous state updates.

Here is a complete breakdown of why this happens and how to correctly implement asynchronous actions in your React-Redux setup.

## Understanding the Redux/Thunk Contract

Redux relies on the principle that every action dispatched must be a plain JavaScript object with a `type` property and an optional `payload`. This contract ensures predictability across reducers and middleware.

When you use `redux-thunk`, it allows you to write functions instead of plain action objects. The thunk function itself is executed by the middleware, and it is responsible for *dispatching* these standard action objects once the asynchronous operation resolves. If your promise chain or nested callbacks incorrectly handles the dispatching, Redux throws this error because an invalid action object is being fed into the store flow.

## The Problem in Your Implementation

Your concern stems from mixing synchronous logic (the thunk setup) with asynchronous results (the Axios promise resolution). Even though you are using `axios`, the way you manage the timing and dispatching within your `getCurrentPostLikes` action creator seems to be creating a race condition or violating the expected flow for Redux middleware.

Let's refine how we structure the thunk to ensure that every dispatched action is a clean, plain object, regardless of whether it originated from an API call.

## Solution: Structuring Async Logic Correctly with Thunks

The fix involves ensuring that the data fetched from your Laravel backend is processed and then dispatched as discrete, plain actions only *after* the asynchronous operation has successfully completed.

### 1. Refactoring the Action Creator (`actions.js`)

Instead of nesting `setTimeout` calls inside the `.then()` block to simulate delay, let the thunk handle the entire asynchronous flow sequentially. The core promise chain should resolve directly into dispatched actions.

We will rewrite your action creator to look cleaner and more idiomatic for Redux Thunks:

```javascript
// store/actions/actions.js

import axios from 'axios';
import { GET_POST_LIKES } from './types';

export const getCurrentPostLikes = () => {
  return async (dispatch) => { // The thunk function receives dispatch
    try {
      // 1. Perform the asynchronous API call
      const response = await axios.get(`/api/get_post_likes/${2}`); // Assuming post ID is 2

      // 2. Dispatch the success action once data is received and validated
      dispatch({
        type: GET_POST_LIKES,
        payload: response.data.likes
      });
      
    } catch (error) {
      // 3. Handle errors gracefully by dispatching a failure action
      console.error("Error fetching post likes:", error);
      dispatch({
        type: GET_POST_LIKES,
        payload: {} // Dispatch an empty payload or an error state indicator
      });
    }
  };
};
```

### 2. Reviewing the Reducer (`reducer.js`)

Your reducer needs to handle the specific action type correctly. Note that your original reducer logic seemed slightly confused about updating the `post` state versus the general `likes` state. We ensure the payload maps directly to the state update:

```javascript
// store/reducers/reducer.js

import { GET_POST_LIKES } from '../actions/types';

const initialState = {
    likes: null,
    post: null // Added post state for completeness
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_POST_LIKES':
            // Directly update the relevant part of the state based on payload
            return {
                ...state,
                post: action.payload.post_id ? { id: action.payload.post_id, likes: action.payload.likes } : null
            }

        case 'LIKE_UP':
            // Example for other actions
            return {
                ...state,
                likes: state.likes + action.value
            }
        default:
            return state;
    }
};

export default reducer;
```

### Conclusion and Best Practices

The key takeaway is that the error messages you receive are usually not a flaw in Redux itself, but rather a warning about the contract between your asynchronous logic (the thunk) and the synchronous flow of the store. By ensuring that **every call to `dispatch()`** within your async handler passes a perfectly formed, plain action object (`{ type: '...', payload: ... }`), you eliminate this error completely.

When building applications that rely on dynamic data from a backend like Laravel, always treat API responses as potential failures and structure your thunks using modern `async/await` syntax wrapped in `try...catch` blocks to manage the success and error paths cleanly. For more complex state management involving external services or heavy business logic, exploring custom middleware (as suggested by the error) provides a powerful layer for abstracting these side effects away from your action creators, keeping your Redux structure highly predictable, similar to how sophisticated service layers are built in Laravel applications.
