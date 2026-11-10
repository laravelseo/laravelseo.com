---
title: "What is the point of X-CSRF-TOKEN or X-XSRF-TOKEN, why not just use a strict same site cookie?"
description: "The Necessity of CSRF Tokens: Why X XSRF TOKEN is More Than Just SameSite Cookies As developers working with modern web frameworks, we constantly navigate..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML"]
featured: false
---

As developers working with modern web frameworks, we constantly navigate the subtle but critical differences between various security mechanisms. One area that frequently sparks debate is the role of Cross-Site Request Forgery (CSRF) tokens. Specifically, the question arises: if we enforce strict `SameSite` cookie policies, do we still need to clutter our HTML forms with explicit CSRF tokens?

This post delves into why frameworks like Laravel, and secure web applications in general, mandate the use of tokens like `X-XSRF-TOKEN`, even when relying on modern cookie settings.

## Understanding SameSite Cookies vs. CSRF Protection

The concept you raise—using `SameSite=Strict` or `Lax` cookies to prevent cross-site requests is fundamentally sound for mitigating many forms of Cross-Site Request Forgery (CSRF). When a browser enforces strict same-site policies, it prevents the browser from automatically attaching session cookies when a request originates from a different domain.

However, SameSite policies primarily govern *where* the cookie is sent; they do not inherently validate the *intent* behind the request. A CSRF attack doesn't rely on tricking the browser into sending a cookie; it relies on tricking the user's session into executing an unwanted action on a trusted site via a form submission or AJAX call.

## The Security Gap Tokens Fill

CSRF protection is about verifying that the request was intentionally and explicitly initiated by the user interacting with the legitimate application interface, not by an external malicious script. This requires a mechanism beyond simple cookie boundary checks.

Here is where CSRF tokens become essential:

### 1. Defense Against Cross-Site POST Requests
Even with strict `SameSite` settings, if an attacker can trick a user into loading a malicious page that contains an HTML form pointing to your application (e.g., an auto-submitting form), the browser *will* attempt to send the session cookie along with that request. While `SameSite` mitigates this significantly, relying solely on it leaves a theoretical gap if the attacker manages to exploit subtle browser behaviors or if the session handling is complex.

The CSRF token acts as an additional secret handshake. The client must possess this token, which is typically embedded in a hidden field within the form, and the server must verify that the token submitted matches the one expected for that user's session. This ensures the request carries not just authentication (the cookie) but also explicit authorization (the token).

### 2. Separating Session State from Request Integrity
Cookies are designed for state management (authenticating the user across requests), while tokens are designed for request integrity (proving the current request is legitimate). By separating these concerns, we create a layered defense. If an attacker steals a session cookie, they still cannot forge a valid CSRF token unless they can also compromise the application's session handling mechanism to read or predict that token.

## The Synergy: Tokens and Cookies Working Together

The most robust security posture involves using both mechanisms in tandem.

*   **Cookies (`SameSite`):** Prevent accidental, passive transmission of session identifiers across different sites. This stops low-effort CSRF attacks based on cross-site navigation.
*   **CSRF Tokens:** Ensure that any state-changing action (POST, PUT, DELETE) is explicitly authorized by the user through a cryptographically verifiable token generated server-side and provided to the client for inclusion in the request body or headers.

This dual approach provides comprehensive protection, aligning with best practices advocated by security experts like those promoting secure development principles found on platforms like https://laravelcompany.com. While you might find it convenient to rely solely on `SameSite=Strict`, adopting the token pattern ensures that your application adheres to the highest standards of defense-in-depth against sophisticated attacks.

## Conclusion

The requirement for CSRF tokens is not arbitrary; it is a deliberate security design choice. It moves the protection mechanism from relying on browser policies (which can be complex and sometimes bypassed) to relying on explicit, server-validated proof of intent. By utilizing both `SameSite` cookies for general session protection and explicit CSRF tokens for state-changing requests, developers build highly resilient applications that remain secure against a wide spectrum of threats.
