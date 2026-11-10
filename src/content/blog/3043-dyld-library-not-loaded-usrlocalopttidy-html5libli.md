---
title: "dyld: Library not loaded: /usr/local/opt/tidy-html5/lib/libtidy.5.dylib"
description: "Solving the Phantom Dependency: Debugging dyld Errors in Homebrew PHP Installations As senior developers working on complex environments, we often run into..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers working on complex environments, we often run into frustrating errors that seem entirely out of context—errors thrown by the operating system's dynamic linker (`dyld`) rather than simple syntax mistakes. The specific error you are encountering, `dyld: Library not loaded: /usr/local/opt/tidy-html5/lib/libtidy.5.dylib`, is a classic symptom of broken library linking within a macOS environment, particularly when managing PHP installations via Homebrew.

This post will dissect why this happens and provide a comprehensive, developer-focused strategy to resolve this dependency nightmare, ensuring your PHP setup is stable and ready for building robust applications, whether you are working on core services or Laravel projects from [laravelcompany.com](https://laravelcompany.com).

---

## Understanding the `dyld` Error

The error message `dyld: Library not loaded...` means that the dynamic linker (`dyld`), which is responsible for loading shared libraries required by an executable at runtime, cannot find a specific file it expects to load. In this case, the PHP executable (`/usr/local/opt/php@7.2/bin/php`) depends on a library file (`libtidy.5.dylib`) that resides within the `tidy-html5` package structure.

This usually indicates one of three things:
1. **Broken Linkage:** The PHP binary was compiled or linked against a version of `libtidy` that is either missing, corrupted, or installed in an unexpected location.
2. **Incomplete Reinstallation:** Even running `brew upgrade` sometimes misses deep dependency cleanup, leaving behind orphaned or mismatched library files.
3. **Path Issues:** The environment variables or symbolic links pointing to the correct libraries are misconfigured.

Since you have already attempted standard remedies like `brew update brew upgrade php reinstall php@7.2`, we need to move into more aggressive diagnostic steps.

## Step-by-Step Resolution Strategy

When standard maintenance commands fail, we must perform a deeper system check focusing specifically on the dependency chain involved.

### 1. Clean Up and Reinstall Dependencies

Before attempting a full reinstallation, let’s ensure Homebrew is operating in a clean state. We will explicitly force a reinstall of the specific packages implicated.

First, clear any potential stale caches:
```bash
brew cleanup
brew doctor
```
Reviewing the output from `brew doctor` can reveal unrelated system issues that might be compounding the problem.

Next, target the problematic dependency directly and then the main package. We will ensure all related dependencies are freshly installed and linked correctly:

```bash
# Reinstall the specific library component if available
brew reinstall tidy-html5

# Then, reinstall PHP@7.2 to ensure it links against the newly fixed dependency
brew reinstall php@7.2
```

### 2. Investigating Symbolic Links (Advanced Check)

If the issue persists, the problem likely lies in how Homebrew manages the symlinks within `/usr/local/opt`. We can check if the required file actually exists where `dyld` is looking:

```bash
ls -l /usr/local/opt/tidy-html5/lib/libtidy.5.dylib
```

If this command returns a "No such file or directory" error, it confirms that even though Homebrew thinks the package is installed, the actual library file is missing or misnamed. In this scenario, forcing a fresh installation (Step 1) is the most reliable path forward, as Homebrew should correct these internal links during the re-installation process.

## Conclusion

Dealing with dynamic linking errors on macOS requires moving beyond simple command execution and adopting a systematic debugging approach. The failure to resolve the `dyld` error after standard maintenance suggests a deeper corruption in the dependency structure of your PHP installation, specifically concerning the `tidy-html5` library.

By systematically cleaning up the cache, explicitly reinstalling the implicated dependencies (`tidy-html5`), and then reinstalling the main application (`php@7.2`), you force Homebrew to rebuild the entire linkage chain from scratch. This method typically resolves these phantom dependency errors. Remember, maintaining a clean environment is crucial for any serious development workflow, especially when building scalable services that rely on robust environments, much like those built using modern frameworks available on [laravelcompany.com](https://laravelcompany.com).
