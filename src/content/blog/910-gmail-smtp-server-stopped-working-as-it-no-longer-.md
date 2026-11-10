---
title: "Gmail SMTP server stopped working as it no longer support \"Less Secure Apps\""
description: "Title: Overcoming Gmail SMTP Issues: Enabling Two Factor Authentication for Secure Email Delivery in Laravel Projects Body: In recent years, email services..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Google"]
featured: false
---

Title: Overcoming Gmail SMTP Issues: Enabling Two-Factor Authentication for Secure Email Delivery in Laravel Projects

Body:
<p>In recent years, email services have become more secure to combat spam and phishing attempts. This has resulted in changes that affect how we interact with our email providers, including Google's decision to stop supporting Less Secure Apps (LSA). This article will guide you through the necessary steps to ensure your Laravel project can continue sending emails via Gmail SMTP by implementing two-factor authentication.</p>
<h2>Understanding Google's Changes</h2>
<p>Google has made changes to their security policies, including removing support for LSA. These changes affect email applications and services that send emails using Gmail accounts without sufficient email authentication. The primary reason behind this shift is to improve the overall security of users' emails by reducing vulnerabilities caused by weak authentication.</p>
<h2>Configuring Two-Factor Authentication</h2>
<p>Two-factor authentication (2FA) is a more secure method of verifying your identity when logging into an account. It combines something you know (your password) with something you possess (either a physical or virtual token). This added layer of security prevents unauthorized access to your email account, ensuring that only authorized users can access and send emails through Gmail.</p>
<h2>Enabling 2FA in Your Google Account</h2>
<p>To enable two-factor authentication for your Google account, follow these steps:</p>
<ol>
<li>Sign into your Google Account on the web using a desktop computer or tablet browser and navigate to <a href="https://myaccount.google.com/security" rel="noreferrer">https://myaccount.google.com/security</a>.</li>
<li>Under "Signing in to Google," click "2-Step Verification."</li>
<li>Follow the on-screen instructions to set up 2FA using either a physical security key, an authentication app like Google Authenticator or Authy, or text messages for verification.</li>
</ol>
<h2>Setting Up Gmail SMTP in Laravel</h2>
<p>Now that your account has two-factor authentication enabled, you can proceed with configuring Laravel to use the SMTP server. Here's a code example showing how to set up email sending using Google's Gmail SMTP using the PHPMailer library:</p>
<pre><code class="language-php">use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Include Composer's autoloader

// Create an instance of the mailer class and define its settings
$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->Host = "smtp.gmail.com";
$mail->Port = 587;
$mail->SMTPAuth = true; // Enable SMTP authentication with your Gmail account
$mail->Username = "your_email@gmail.com"; // Your Gmail username
$mail->Password = "your_app_password"; // The password you generated during the 2FA setup

// Set other email properties as needed (e.g., from name, subject, recipients)

try {
    $mail->send();
} catch (\Exception $e) {
    echo $e->getMessage();
}
</code></pre>
<h3>Conclusion</h3>
<p>By implementing two-factor authentication for your Google account, you can ensure a more secure email sending experience using Gmail SMTP with Laravel. This enhanced security measure protects both your personal and project emails from potential vulnerabilities that may arise due to the removal of Less Secure Apps support.</p>
