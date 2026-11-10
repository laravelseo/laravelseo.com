---
title: "How to get duration a video - laravel"
description: "How to Get Video Duration in Laravel: Mastering FFmpeg Execution As developers working with media processing in frameworks like Laravel, integrating external..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with media processing in frameworks like Laravel, integrating external tools is a common requirement. You want to upload a file, process it (like transcode or extract metadata), and then retrieve specific information, such as the video duration. The scenario you've presented—using PHP-FFMpeg to query the duration via `ffprobe`—is a solid approach, but it often runs into critical system dependency issues on the server.

This post will walk you through why you encountered the `ExecutableNotFoundException` and provide a robust, developer-focused solution for reliably extracting video durations in your Laravel application.

## The Root Cause: ExecutableNotFoundException

The error `ExecutableNotFoundException` when calling `$ffprobe` indicates that while your PHP code successfully initiated the command via `FFProbe`, the operating system could not find the executable file (`ffprobe`) in the system's PATH. This is a server-level issue, not typically a flaw in your Laravel controller logic itself.

In essence, PHP is just a wrapper; it relies on the underlying operating system to execute external binaries. If FFmpeg/FFprobe is not installed on the machine running your PHP process (e.g., your Laravel server), or if it’s installed but not accessible via the command line path, the execution fails immediately.

This highlights a crucial concept in deploying applications: **the environment must be standardized.** When building robust systems, especially those handling heavy tasks like video processing, you must ensure that all required dependencies are present and correctly configured on the production server. This principle aligns with the best practices emphasized by organizations focused on modern application architecture, such as the principles found at [laravelcompany.com](https://laravelcompany.com).

## Step 1: Ensuring System Dependencies Are Met

Before attempting to execute any command, you must ensure FFmpeg and its tools are installed globally on your server or within the execution environment (like a Docker container).

**For Linux/macOS Servers:**
You typically install these using your distribution's package manager. For Debian/Ubuntu systems, this would involve running:
```bash
sudo apt update
sudo apt install ffmpeg
```

**For Docker Environments:**
If you are deploying via Docker (highly recommended for Laravel services), you must ensure that the base image you are using includes these tools, or you need to build a custom image where these dependencies are installed. This ensures consistency across development and production environments.

## Step 2: Robustly Executing FFprobe in PHP

Once the dependency is confirmed, we need to refine how PHP interacts with the command line. While `FFProbe` attempts to abstract this, sometimes direct execution using standard PHP functions offers more control over error handling, especially when dealing with file paths that might contain special characters.

Instead of relying solely on a wrapper class that might fail due to environment issues, we can execute the command directly using the `exec()` or `shell_exec()` function and explicitly check the return status.

Here is a revised approach focusing on direct execution:

```php
use Illuminate\Support\Facades\Storage;

class VideoProcessor
{
    protected $basePath = '/assets/videos/videos'; // Assuming this path exists

    public function getVideoDuration(string $videoFileName): ?float
    {
        $fullPath = $this->basePath . $videoFileName;

        if (!file_exists($fullPath)) {
            \Log::error("Video file not found at path: " . $fullPath);
            return null;
        }

        // Construct the ffprobe command
        // We use escapeshellarg to safely pass the file path to the shell command.
        $command = "ffprobe -v error -show_entries format=duration -of default=noprint_mode=1:nokey=1 " . escapeshellarg($fullPath);

        // Execute the command and capture the output
        $output = [];
        $returnVar = 0;
        exec($command, $output, $returnVar);

        if ($returnVar === 0 && !empty($output)) {
            // The duration is usually the first (and only) line of the output
            $durationString = trim($output[0]);
            return (float)$durationString;
        } else {
            \Log::error("FFprobe execution failed. Command: " . $command);
            return null;
        }
    }
}

// Example usage in a Laravel context:
// $processor = new VideoProcessor();
// $duration = $processor->getVideoDuration($video);
```

## Conclusion

Extracting metadata from media files is a powerful feature, but it requires careful attention to the environment. The initial error stemmed from an external dependency problem (missing `ffprobe`), which must be resolved at the system level before code execution can succeed. By shifting focus to ensuring your server environment has all necessary tools installed and by implementing robust command execution using functions like `exec()` with proper path escaping, you move from brittle scripting to reliable application development. Always remember that solid architecture, whether in Laravel or any other framework, starts with correctly managed dependencies.
