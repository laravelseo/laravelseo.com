---
title: "Call to undefined method League\\Flysystem\\Filesystem::put()"
description: "Resolving the Flysystem Conflict: Why put() Fails After Laravel/Flysystem Upgrades As senior developers, we often encounter these kinds of frustrating..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

As senior developers, we often encounter these kinds of frustrating version mismatch errors after major framework updates. The scenario you've described—upgrading Laravel to v9.x and Flysystem to v3.x, resulting in an error like `Call to undefined method League\Flysystem\Filesystem::put()`—is a classic example of abstraction layer conflicts.

This post will dive deep into why this happens, examine the conflict between the underlying Flysystem implementation and the Laravel Storage facade, and provide the definitive solution for writing files correctly in modern Laravel applications.

## The Core Conflict: `put()` vs. `write()`

The issue stems from a deliberate change in the upstream Flysystem library. When moving to Flysystem v3, the method used for writing content was renamed from `put()` to `write()`. This change is reflected in the core Flysystem source code, as you observed:

```php
// vendor/league/flysystem/src/Filesystem.php
public function write(string $location, string $contents, array $config = []): void
```

However, the Laravel `Storage` facade acts as an abstraction layer over various storage drivers (like local disk, S3, etc.). While the documentation and older examples might still reference the legacy `put()` method, the underlying conflict arises because the specific adapter implementation being used by your setup expects the newer Flysystem standard.

The error occurs because the Laravel wrapper is attempting to call a method (`put()`) that no longer exists on the concrete Flysystem class it is interacting with in the context of the new versioning. This discrepancy highlights the importance of keeping your framework and package versions perfectly aligned, a principle strongly emphasized by modern architecture design, much like the principles detailed at [https://laravelcompany.com](https://laravelcompany.com).

## Diagnosing the Laravel Storage Facade Issue

Why does the facade still expose `put()`? This is usually due to backward compatibility layers or specific internal implementations within the Laravel framework that haven't been fully synchronized with the latest Flysystem changes immediately upon the package update.

When you use the `Storage` facade, you are relying on the contract defined by the underlying disk driver. If the driver itself has updated its API (like Flysystem v3), the facade *should* reflect those changes. The fact that it doesn't suggests one of two things: either your specific Laravel/Flysystem combination requires a manual adjustment, or we need to bypass the facade slightly to ensure compatibility.

## The Solution: Adopting the Correct Method

The most robust solution is to align your code directly with the updated Flysystem standard. Instead of relying on potentially outdated facade methods, we should access the underlying filesystem instance or use alternative methods if available.

For operations that involve writing raw contents, you should explicitly use the `write()` method provided by the underlying Filesystem object if direct interaction is necessary, or ensure your environment resolves the correct contract via the facade.

Here is how you can safely refactor your code to eliminate the error:

### Refactored Code Example

Instead of:
```php
Storage::disk('disk-name')->put($concept->id . '.docx', file_get_contents($tmpPath));
```

You should attempt to use the method that Flysystem expects, which is `write()`:

```php
use Illuminate\Support\Facades\Storage;

try {
    // Use the write() method, aligning with Flysystem v3 standards
    Storage::disk('disk-name')->write($concept->id . '.docx', file_get_contents($tmpPath));
} catch (\Exception $e) {
    // Handle potential exceptions during the write operation
    // This ensures robust error handling which is key in large applications.
    throw new \Exception("Failed to write file using Storage facade: " . $e->getMessage());
}
```

If you find that even using `write()` results in an issue (which is highly unlikely if Flysystem v3 is installed correctly), it indicates a deeper issue with how your specific storage driver adapter is implemented. In such rare cases, accessing the instance directly can bypass facade ambiguities:

```php
use Illuminate\Support\Facades\Storage;

$filesystem = Storage::disk('disk-name');

// Directly call the method on the obtained Filesystem instance
$filesystem->write($concept->id . '.docx', file_get_contents($tmpPath));
```

## Conclusion

The error `Call to undefined method League\Flysystem\Filesystem::put()` is a symptom of evolving API standards between framework components. While Laravel's facade aims for convenience, true stability comes from respecting the underlying library versions. By switching from the deprecated `put()` to the modern `write()` method and understanding the contract of Flysystem v3, you ensure your application remains compatible, robust, and adheres to best practices. Always prioritize checking documentation and aligning your code with current library specifications, just as we advocate for in platform development at [https://laravelcompany.com](https://laravelcompany.com).
