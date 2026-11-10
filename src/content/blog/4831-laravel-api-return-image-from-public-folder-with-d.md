---
title: "Laravel API return image from public folder with database data"
description: "Serving Images with Database Data in a Laravel API: Best Practices Explained As developers building modern web applications with Laravel, one of the most..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Performance", "PHP"]
featured: false
---

As developers building modern web applications with Laravel, one of the most common tasks is retrieving related data—like fetching an advertisement record along with its associated image. When dealing with media files stored on the server, simply returning a file path is often the easiest solution. However, if the requirement is to return the actual image data *within* the JSON response (e.g., for immediate display or embedding), we need to handle file operations carefully.

This post will dive into the complexities of returning images from your `public` folder alongside database records in a Laravel API, examining both the technically correct and the performance-conscious approaches.

## The Challenge: Mixing Data and Files

The request often boils down to this: how do we take data from the database (like an image path) and combine it with the actual binary content of that file into a single JSON response? While your provided snippet attempts this, directly reading large files into PHP memory and encoding them can lead to significant performance bottlenecks and memory exhaustion, especially at scale.

```php
$ads = DB::table('ads')
    ->whereRaw('category_id=' . $id)
    ->orderBy('id', 'desc')
    ->get();

// Potential issue: Reading the entire file content into memory
$filename = public_path() . '/uploads/images/' . $ads->ad_image;
$file_content = file_get_contents($filename); // Reads potentially huge files

$image_data = base64_encode($file_content);
$image = ['image' => $image_data];

// Attempting to attach data back (requires careful handling of the collection)
$ads->each(function ($ad) use ($image) {
    $ad->image = $image;
});

return $ads;
```

The primary concern here is efficiency. For API responses, we must prioritize speed and memory usage. We need to decide whether to serve the asset via a URL or embed it directly.

## Approach 1: The Laravel Best Practice – Serving Assets via URL

For most applications, especially those dealing with large media files, the best practice is *not* to embed the image data in the API response. Instead, the API should return the path or URL, and the frontend (browser) should handle fetching the image separately. This delegates bandwidth management and caching responsibilities to the client and leverages Laravel’s built-in asset handling.

This approach keeps your API lean, fast, and scalable. When you structure your assets correctly in the `public` directory, Laravel handles serving these files efficiently. For deep dives into structuring your application for optimal performance, understanding concepts like resource management is key, much like the principles discussed on platforms like [laravelcompany.com](https://laravelcompany.com).

**Controller Example (Recommended):**

```php
use App\Models\Ad;
use Illuminate\Http\Request;

class AdController extends Controller
{
    public function showWithImage(Request $request, $adId)
    {
        $ad = Ad::with('image')->findOrFail($adId);

        // The response only contains the necessary data and a URL path.
        return response()->json([
            'id' => $ad->id,
            'title' => $ad->title,
            'image_url' => asset('uploads/images/' . $ad->ad_image), // Laravel helper for public path
            'data' => $ad->toArray(),
        ]);
    }
}
```

## Approach 2: Embedding Images using Base64 (For Small Assets)

If, however, the requirement strictly dictates that the image must be returned as part of a single payload (e.g., embedding small icons or thumbnails), you can use Base64 encoding. This converts the binary file into a text string that can be safely transmitted within JSON.

**Crucial Note:** Only use this method for small files. For large images, this will severely degrade API performance and increase response payload size unnecessarily. To execute this correctly, ensure your file paths are sanitized to prevent directory traversal vulnerabilities.

**Implementation Example (Embedding):**

```php
use Illuminate\Support\Facades\File;

public function getAdWithEmbeddedImage($adId)
{
    $ad = Ad::findOrFail($adId);

    // 1. Define the full path securely
    $imagePath = public_path('uploads/images/' . $ad->ad_image);

    if (!File::exists($imagePath)) {
        return response()->json(['error' => 'Image not found'], 404);
    }

    // 2. Read the file content and encode it
    $fileContent = file_get_contents($imagePath);
    $base64Image = base64_encode($fileContent);

    // 3. Return the combined data
    return response()->json([
        'id' => $ad->id,
        'title' => $ad->title,
        'image_data' => base64_encode($fileContent), // Or use the actual Base64 string if you prefer
    ]);
}
```

## Conclusion

When building APIs in Laravel, always default to the most efficient solution. For media assets, **serving files via a URL (Approach 1)** is superior for performance, scalability, and maintainability. Only resort to embedding data directly using Base64 (Approach 2) when you have a specific, well-justified need, such as returning tiny embedded icons. By understanding these architectural trade-offs, you ensure your Laravel applications remain robust, fast, and professional.
