---
title: "How to generate secure one time download link in Laravel?"
description: "How to Generate Secure One Time Download Links in Laravel for Mobile Applications Developing a mobile application, especially one involving digital content..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Developing a mobile application, especially one involving digital content like tutorial videos, requires robust security measures. When dealing with downloadable assets, simply linking to a file is insufficient; you need a system that ensures links are unique, time-bound, and tied to specific user permissions. As a senior developer using the Laravel framework for the backend, we can leverage Laravel's powerful features—Eloquent ORM, routing, and session management—to build an incredibly secure download mechanism.

This guide will walk you through the best practice for generating secure, one-time download links tailored for your API-based video selling application.

## The Challenge: Why Simple Links Aren't Enough

When a user requests a file via a direct URL (e.g., `/videos/video123.mp4`), anyone who knows that URL can access the file repeatedly, which defeats the purpose of a "one-time download" mechanism. Furthermore, since you are tracking device IDs, the link must be tied specifically to the authenticated user session or the specific purchase transaction, not just a static file path.

The solution lies in generating **signed tokens** or **unique identifiers** that act as temporary access keys instead of direct file paths.

## The Laravel Solution: Token-Based Access Control

The most secure and scalable method involves creating a unique token for every valid download request. This token is then stored in your database and used to authorize the actual file delivery.

### Step 1: Database Setup (Eloquent Models)

You will need at least two main models: `Videos` and perhaps a linking table or system to manage downloads. For simplicity, let's focus on securing the download request itself.

```php
// Example of a Video Model
class Video extends Model
{
    protected $fillable = ['title', 'file_path'];
}

// You would also need a way to track access or download attempts if necessary.
```

### Step 2: Generating the Secure Link (The Controller Logic)

When a user initiates a download request, your controller should perform these steps:

1.  **Verification:** Ensure the user is logged in and has purchased the corresponding video.
2.  **Token Generation:** Generate a cryptographically secure, unique token (using Laravel's `Str::uuid()` or a custom hash).
3.  **Storage:** Store this token, linking it to the video ID and setting an expiration time (e.g., 1 hour).
4.  **Link Generation:** Create the public-facing link using this token.

Here is a conceptual example of how you might structure the route and controller:

```php
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Video;
use Illuminate\Support\Str;

Route::get('/download/{video}/generate-link', [DownloadController::class, 'generateLink'])->middleware('auth');
Route::get('/download/stream/{token}', [DownloadController::class, 'streamFile']);
```

In your `DownloadController`:

```php
public function generateLink(Request $request, Video $video)
{
    // 1. Authorization check (ensure user owns the video)
    if (!$request->user()->hasPermissionToDownload($video)) {
        abort(403, 'Unauthorized');
    }

    // 2. Generate a unique, time-bound token
    $token = Str::uuid()->toString();
    $expiresAt = now()->addHour(); // Token expires in 1 hour

    // 3. Store the token and expiry in your database (or cache)
    // In a real application, you would save this to a dedicated 'downloads' table.
    // For simplicity here, we assume you store it somewhere accessible later.

    return response()->json([
        'video_id' => $video->id,
        'download_token' => $token,
        'expires_at' => $expiresAt,
        'message' => 'Link generated successfully.'
    ]);
}
```

### Step 3: Handling the Download (The Stream Endpoint)

The second endpoint (`/download/stream/{token}`) handles the actual file delivery. This is where you validate the token before serving the content.

```php
public function streamFile(string $token)
{
    // 1. Find the corresponding record in your database using the token
    $downloadRecord = Download::where('token', $token)->first();

    if (!$downloadRecord || $downloadRecord->expires_at->lt(now())) {
        return response()->json(['error' => 'Invalid or expired link.'], 403);
    }

    // 2. Security check passed! Now, serve the file.
    $video = Video::findOrFail($downloadRecord->video_id);

    // Use Laravel's file system handling to stream the file securely
    return response()->file(storage_path('app/videos/' . $video->file_path));
}
```

## Best Practices for File Storage and Security

1.  **Use Laravel Storage:** Never store sensitive files directly in your public directory. Utilize Laravel's `Storage` facade (e.g., using Amazon S3 or local disk) for secure, scalable file management. This aligns with modern architectural patterns seen in robust applications like those built on the foundation of **Laravel Company**.
2.  **Token Expiration:** Always implement strict expiration times. A token that never expires is a security risk.
3.  **Device Context:** Since you are tracking device IDs, ensure your access logic checks if the current request context (e.g., IP address or authenticated user session) matches the permissions recorded for that download event.

## Conclusion

By implementing a token-based system in Laravel, you move away from insecure direct links and establish a robust, auditable mechanism for content distribution. This approach guarantees that every download is unique, time-limited, and tied directly to a valid purchase, providing the security and control necessary for a professional mobile application. Focus on keeping your data integrity high when building these features; leveraging Eloquent relationships effectively is key to managing this complexity smoothly.
