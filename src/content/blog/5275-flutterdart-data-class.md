---
title: "Flutter/Dart Data Class"
description: "Mastering Data Classes in Flutter: Solving Complex API Mapping Issues with Dart As developers building complex applications—especially those bridging..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As developers building complex applications—especially those bridging frontend frameworks like Flutter with robust backends like Laravel—the process of mapping raw JSON data into strongly-typed Dart objects is often where the real friction occurs. You’ve hit a very common roadblock: dealing with dynamic types and list casting errors during deserialization.

This post dives deep into why you encountered the `type 'List<dynamic>' is not a subtype of type 'List<num>'` error, analyzes your model structure, and provides a robust, production-ready solution for handling complex API responses in Flutter using Dart Data Classes.

## The Pitfall of Dynamic Casting in JSON Deserialization

When you receive data from an API (typically as a `Map<String, dynamic>` in Dart), the values are inherently untyped. When you try to force these dynamic types into specific concrete types, such as `List<int>` or `List<num>`, Dart throws an error if the underlying structure doesn't match expectations exactly.

Your specific error stems from this line within your `Orders.fromMap` factory:
```dart
List<OrderItem>.from(
  (map['orders'] as List<int>).map<OrderItem>(
    (x) => OrderItem.fromMap(x as Map<String, dynamic>),
  ),
),
```
The error occurs because the API response for `pid` seems inconsistent—sometimes it’s a JSON array of numbers, and sometimes it's a string representation of an array (e.g., `"\[2,3\]"`). When Dart attempts to treat this heterogeneous input as a direct `List<int>`, the type mismatch causes the crash.

## The Solution: Defensive Mapping with Safe Type Checks

The key to solving this is moving away from direct, unchecked casting (`as List<int>`) and implementing defensive parsing logic within your data class constructors or factory methods. We need to inspect the incoming data before attempting to cast it.

Here is how we refine your `OrderItem` and `Orders` classes to safely handle potentially messy JSON data sent from a backend, much like ensuring type safety on the Laravel side as well.

### Refactoring OrderItem for Robust Parsing

We will focus on making the `fromMap` methods resilient by explicitly handling string-to-list conversions if necessary. For numeric lists, we must ensure that every element is indeed a number before inclusion.

```dart
class OrderItem {
  final num id;
  final List<num> pid; // Use 'num' for flexibility in JSON parsing

  OrderItem({required this.id, required this.pid});

  // ... copyWith implementation remains the same ...

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'pid': pid.toList(), // Ensure we serialize the list correctly
    };
  }

  factory OrderItem.fromMap(Map<String, dynamic> map) {
    // 1. Safely extract 'id' and ensure it's a number
    final id = map['id'] as num;

    // 2. Handle the potentially complex 'pid' field
    final pidData = map['pid'];
    List<num> pids;

    if (pidData is List) {
      // Case 1: Input is already a list of numbers (ideal case)
      pids = List<num>.from(pidData);
    } else if (pidData is String) {
      // Case 2: Input is a string that needs parsing (e.g., "[2,3]")
      // We use jsonDecode to safely parse the string representation of the list.
      try {
        pids = List<num>.from(jsonDecode(pidData));
      } catch (e) {
        // Handle error if string format is invalid
        throwFormatException('Invalid list format for pid: $pidData');
      }
    } else {
      // Case 3: Input is null or unexpected type
      pids = [];
    }

    return OrderItem(
      id: id,
      pid: pids,
    );
  }

  String toJson() => json.encode(toMap());

  // ... other methods (fromJson, hashCode)
}
```

### Refactoring Orders for Cohesive Mapping

By implementing the robust logic in `OrderItem`, the parent class becomes much simpler and safer. The main fix here is to rely on this safe factory method:

```dart
class Orders {
  final List<OrderItem> orders;

  Orders(this.orders);

  Map<String, dynamic> toMap() {
    return {
      'orders': orders.map((x) => x.toMap()).toList(),
    };
  }

  factory Orders.fromMap(Map<String, dynamic> map) {
    // Safely cast the 'orders' list, trusting that OrderItem.fromMap handles the internal complexity.
    final List<dynamic> orderList = map['orders'] as List<dynamic>? ?? [];

    final List<OrderItem> items = orderList
        .map((x) => OrderItem.fromMap(x as Map<String, dynamic>))
        .toList();

    return Orders(items);
  }

  String toJson() => json.encode(toMap());
  // ... other methods
}
```

## Conclusion: The Power of Defensive Data Handling

Dealing with data from external sources is an exercise in defensive programming. When working with APIs, especially those built on robust frameworks like Laravel where data structures can occasionally be slightly inconsistent across different endpoints or versions, relying on strict type casting is a recipe for runtime errors.

By implementing factory methods like `fromMap` that explicitly check the *type* of incoming data (list vs. string) and use safe parsing techniques (`jsonDecode`), you transform brittle code into resilient, production-ready models. This approach ensures that your Flutter application remains stable, regardless of minor inconsistencies in the API response structure, giving you a solid foundation for building scalable e-commerce features. Remember, clean data contracts between your Laravel backend and your Flutter frontend are just as important as the code doing the mapping itself—always build robust parsing logic!
