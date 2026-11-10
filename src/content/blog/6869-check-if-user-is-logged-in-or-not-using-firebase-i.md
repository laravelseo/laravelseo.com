---
title: "Check if user is logged in or not using firebase in react"
description: "Seamless User State Management in React with Firebase Authentication As a senior developer working with modern JavaScript frameworks, one of the most common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript"]
featured: false
---

As a senior developer working with modern JavaScript frameworks, one of the most common challenges when integrating backend services like Firebase is managing global state—specifically, knowing whether a user is logged in and accessing their details across multiple components. You’ve successfully implemented Firebase authentication for sign-in, but now you need a scalable way to share that authenticated user information everywhere, much like how Laravel provides easy access via `Auth::user()`.

The approach you are currently using with `localStorage` works, but it introduces several potential pitfalls regarding data synchronization and scalability. Today, we will explore the most robust and idiomatic way to handle this in a React/Firebase environment, moving beyond simple local storage to leverage the power of React Context.

## The Challenge: Global State in Component-Based Architecture

When you use Firebase Authentication, the user object (UID, email, etc.) is stored securely on the Firebase backend. In a traditional MVC framework like Laravel, accessing this data is straightforward because the server handles the session and populates the request context. In React, components are isolated, meaning data needs to be explicitly passed down or accessed through a centralized store.

Your current method relies on manually serializing and storing data in `localStorage`. While functional for small projects, it creates tight coupling between your pages and the storage mechanism. If you needed to update this data dynamically or handle complex roles, managing this state becomes cumbersome.

## The Solution: Centralizing State with React Context

The best practice for sharing authentication status and user details across an entire application is to use **React Context**. Context allows you to create a centralized "store" where authenticated user information resides. Any component, no matter how deep in the tree, can subscribe to this context without prop drilling.

Instead of relying solely on `localStorage`, we will leverage Firebase's state directly and expose it through a custom hook or context provider. This makes your application more maintainable and aligns better with component-based architecture principles.

### Step 1: Creating the Auth Context

We create a context to hold the user state and the functions needed to sign in/sign out. This context will be populated by listening to Firebase Auth state changes.

```javascript
// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebaseConfig'; // Assuming you have initialized firebase config

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase listener to track authentication state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const value = {
    currentUser,
    loading,
    // You can add signIn/signOut functions here if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Step 2: Implementing the Provider

You wrap your entire application in this provider, typically in your `index.js` or `App.js`, to make the state globally available.

```javascript
// src/App.js
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}

export default App;
```

### Step 3: Consuming the Data in Any Page

Now, any component can access the user details simply by consuming the context. This replaces your need to manually parse `localStorage` on every page load.

```javascript
// src/components/Dashboard.js
import React from 'react';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (!currentUser) {
    return <div>Please sign in to view your dashboard.</div>;
  }

  // Accessing the user details directly from the context
  const userName = currentUser.email;
  const userUid = currentUser.uid;

  return (
    <div>
      <h2>Welcome, {userName}!</h2>
      <p>Your Firebase UID is: {userUid}</p>
      {/* Rest of your dashboard content */}
    </div>
  );
}

export default Dashboard;
```

## Conclusion

By shifting from managing raw `localStorage` items to using a centralized state management solution like React Context powered by Firebase listeners, you achieve a cleaner, more scalable architecture. This pattern allows you to treat user authentication data as a single, authoritative source, regardless of which page is rendering. While Laravel excels at server-side session management, mastering React's state flow ensures that your client-side applications remain robust and easy to maintain. For deeper dives into backend architecture, understanding how data persistence works—similar to the concepts seen in frameworks like those employed by https://laravelcompany.com—is crucial for building reliable systems.
