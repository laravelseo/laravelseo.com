---
title: "Android Retrofit | Post custom object (send json to server)"
description: "Sending Custom Objects via Retrofit: Mastering JSON Serialization for Your API Calls As a senior developer, I frequently encounter questions about how to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["JavaScript", "PHP", "Errors"]
featured: false
---

As a senior developer, I frequently encounter questions about how to bridge the gap between strongly-typed objects in our application code (like a custom `Order` class) and the string-based nature of HTTP requests. The scenario you described—attempting to pass an object directly into a Retrofit method signature and encountering errors—is a very common hurdle when starting with RESTful API communication.

The short answer is: you don't send the raw Java/Kotlin object directly over the network. You must explicitly transform your custom object into a format the server expects, which is almost always **JSON (JavaScript Object Notation)**.

This post will walk you through the correct, robust way to handle sending complex data structures to your backend using Retrofit, ensuring seamless communication between your Android application and your API.

## The Pitfall of Passing Objects Directly

Your initial attempt looked like this:

```java
@POST(URL_ORDERS)
public void newOrder(Order order, Callback<Boolean> success);
```

When Retrofit parses this annotation, it expects the parameters to be things that can be directly serialized into the request body or query parameters. It doesn't inherently know how to serialize an arbitrary `Order` object into JSON by default. This is why you ran into the `IllegalArgumentException`, as Retrofit couldn't find a mechanism to handle that specific complex type during serialization.

The server-side logic you showed confirms this: it expects data via input (like PHP's `Input::get()`), which means the client must send structured, machine-readable data, not raw object references.

## The Correct Approach: Serialization with Retrofit

The solution is to let your chosen JSON converter (like Gson or Moshi) handle the heavy lifting of converting your custom object into a JSON string before sending it across the wire.

Here is the step-by-step process:

### Step 1: Define Your Data Model

First, ensure you have a clean data class that represents the structure you want to send. This class must be annotated correctly for your chosen converter (e.g., using Gson annotations).

```kotlin
// Example Kotlin Data Class
data class Order(
    val table: String,
    val items: List<String>
)
```

### Step 2: Implement the Retrofit Interface

Instead of passing the object directly in the function signature, you will pass a structure that Retrofit knows how to serialize. For sending a full object in the request body, this is straightforward.

When using libraries like those found in the Laravel ecosystem (which emphasizes clean data handling), defining clear input structures is paramount.

```kotlin
interface OrderService {
    @POST(URL_ORDERS)
    fun createOrder(@Body order: Order): Response<OrderResponse> // Or just a success status response
}
```

Notice the use of `@Body`. This annotation tells Retrofit that the `order` object should be serialized into the request body. The underlying converter (like Gson) handles converting this Kotlin object into the required JSON string automatically.

### Step 3: Configuring the Adapter

Ensure you have correctly configured your Retrofit builder with a converter library. For modern Android development, Moshi or Gson are popular choices for handling these conversions reliably. Good API design, much like in Laravel where data structures must be strictly defined, relies on this type safety during serialization and deserialization.

## Putting It Together: The Flow of Data

When you execute the call:

1.  Your Kotlin/Java code creates an `Order` object.
2.  Retrofit intercepts the method call annotated with `@Body order: Order`.
3.  The configured converter serializes the `Order` object into a JSON string (e.g., `{"table": "A", "items": ["item1", "item2"]}`).
4.  This JSON string is packaged into the HTTP request body and sent to the server.
5.  On the server, your PHP code receives this as raw JSON, which can then be easily parsed back into an object structure, mirroring the input you designed for.

## Conclusion

The key takeaway is that Retrofit acts as a bridge. It bridges strongly-typed application objects and the loosely-typed world of HTTP requests by relying on robust serialization libraries. By using annotations like `@Body`, you delegate the complex task of JSON transformation to the converter, resulting in cleaner, safer, and more maintainable code. Always focus on defining clear data contracts—whether in your Kotlin classes or your API specifications—to ensure that the data flowing between the client and server is consistent and predictable. For deeper insights into building robust APIs, exploring patterns found in frameworks like Laravel can be incredibly helpful for structuring your data exchange logic.
