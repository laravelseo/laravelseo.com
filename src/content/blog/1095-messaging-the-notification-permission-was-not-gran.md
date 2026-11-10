---
title: "Messaging: The notification permission was not granted and blocked instead"
description: "Title: Understanding Firebase Messaging Errors and Solutions on HTTPS Servers Body: Firebase messaging is an effective way to send notifications across..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Content", "Errors"]
featured: false
---

Title: Understanding Firebase Messaging Errors and Solutions on HTTPS Servers
Body:

Firebase messaging is an effective way to send notifications across devices, but sometimes it may fail due to errors. This blog post aims to provide clarity around a specific error message related to notification permission in the Firebase messaging context. We will also discuss how to get your token and troubleshoot common issues that arise when using Firebase Messaging on HTTPS servers.

Firebase messaging uses the FCM (Firebase Cloud Messaging) service, which enables you to communicate between your server-side code and clients like web apps or mobile apps. While it works well in most cases, certain errors can occur during token retrieval or when dealing with notifications, leading to communication breakdowns.

One such error is: "An error occurred while retrieving token. FirebaseError: Messaging: The notification permission was not granted and blocked instead (messaging/permission-blocked)". This implies that the browser has denied access to the app for sending push notifications, which prevents FCM from functioning correctly.

Here are some possible reasons why this might happen, along with solutions:

1. Browser settings: Ensure that the user has allowed notification permissions in their browser settings. This usually involves clicking on the lock icon in the address bar and choosing 'Allow' or 'Enable' for notifications from your website.

2. Incorrect token retrieval code: If you are using a local server, it may be necessary to configure it to enable CORS (Cross-Origin Resource Sharing) to allow push notifications from FCM servers. Additionally, make sure that the URL in your firebaseConfig object matches the actual URL of your app's origin.

3. Firewall rules: If you are using a VPN or have firewall restrictions, they might be blocking certain ports used by Firebase Messaging. Ensure that access to these ports is allowed and reconfigure your setup accordingly.

4. HTTPS mismatch: Check if the HTTPS certificate for your app domain matches the URL in your `firebaseConfig` object. If it doesn't, update the configuration file.

5. Background processes: Make sure your messaging server runs without any major issues or interruptions. Restarting the server could sometimes resolve connectivity and token generation problems.

To get your token in Firebase Messaging, follow these steps:

1. Create a Firebase project in the Firebase console (https://firebase.google.com/) if you haven't already.
2. Enable FCM notifications by visiting the "Cloud Messaging" tab and clicking on "Create Key".
3. Copy the contents of both the JSON web app key file and the public/private VAPID keys, which are essential for push notification functionality.
4. In your project's `firebaseConfig` object, add the necessary settings, including the private key, to configure FCM messaging.
5. Include the Firebase SDK in your app using `<script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js"></script>` and `<script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-messaging.js"></script>` for the Firebase Messaging SDK.
6. Implement the necessary code to request notification permissions, initialize the instance of Firebase Messaging in your web app's Service Worker, and handle background messages.

To troubleshoot common issues with FCM on HTTPS servers, follow these tips:

1. Always update your Firebase SDK to the latest version.
2. Ensure that your `firebase-messaging-sw.js` file is loaded correctly before using it.
3. Verify that you have set up VAPID keys properly and enabled them in your project settings or added them into your code.
4. Check for any inconsistencies between your app's URLs (in `firebaseConfig`) and those in your browser's address bar.
5. Configure your local server to allow CORS if needed, which might require additional configuration on both the server and client-side code.
6. If you still experience problems, consult Firebase documentation or reach out for support at https://laravelcompany.com/services/firebase-development for specialized assistance with FCM issues.

In conclusion, understanding and addressing Firebase Messaging errors is crucial to ensuring proper communication between your app's server and clients. If you follow the guidelines above, you should be able to solve most common problems related to notification permissions and token retrieval on HTTPS servers.
