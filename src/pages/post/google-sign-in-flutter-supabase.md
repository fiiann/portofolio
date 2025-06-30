---
layout: ../../layouts/post.astro
title: Google Sign In Flutter with Supabase
description: This is a post about how implementation Google Sign In authentication in Flutter with Supabase.
dateFormatted: Juni 9th, 2024
---

![Coffee and Code](/assets/images/posts/flutter_supabase.jpg)

# Implementing Google Sign-In Authentication in Flutter with Supabase

## Introduction

In the ever-evolving landscape of mobile app development, authentication is a critical aspect that directly influences user experience and security. This article will guide you through the process of integrating Google Sign-In authentication into a Flutter app, leveraging the power of Supabase as a backend service.

## Background

Before we dive into the implementation, let's briefly discuss the technologies involved:

- **[Flutter](https://flutter.dev/)**: A popular open-source UI software development toolkit by Google for building natively compiled applications for mobile, web, and desktop from a single codebase.
- **[Supabase](https://supabase.com/)**: An open-source Firebase alternative. Supabase provides a scalable and secure backend-as-a-service (BaaS) infrastructure for applications.

## Prerequisites

Before getting started, make sure you have the following prerequisites:

- Flutter SDK installed (we used v3.16.0)
- Supabase account and project set up
- Basic understanding of Flutter and Dart programming language

## What We're Building

Our minimalist Flutter app will consist of two pages:

- **Login Page**: This entry point to our application will leverage Google Sign-In to provide users with a convenient and secure authentication process.
- **Profile Page**: Once authenticated, users will land on the profile page where we’ll display user info stored in Supabase.

Now, let's dive into the step-by-step guide and bring these pages to life, combining the efficiency of Flutter's UI toolkit, the simplicity of Google Sign-In, and the robustness of Supabase.

---

## Step-by-Step Guide

### 1. Setting Up a Flutter Project

```bash
flutter create your_project_name
cd your_project_name
flutter pub add supabase_flutter google_sign_in
```

### 2. Setting Up Supabase

1. Sign in or sign up at [supabase.com](https://supabase.com), and create a project.
2. Choose a region close to you or your users.
3. In your project, go to **Authentication → Providers**, select **Google**, enable sign-in, check *Skip nonce checks for iOS clients*.
4. Leave the "Authorized Client IDs" blank for now — we’ll fill it in after setting up GCP.
5. Click **Save**.

### 3. Setup Google Cloud Platform (GCP)

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create a new project.
2. Fill in the project name and organization (if required).
3. Search for **OAuth Consent Screen**, choose **External**, then click **Create**.
4. Fill out the required fields: App name, support email, authorized domains (use the callback URL from Supabase).
5. Save and continue.

### 4. Create OAuth Client IDs

You’ll need 3 OAuth client IDs:

#### 4.1 Web Client ID

- Add authorized redirect URIs from Supabase Google provider section.

#### 4.2 Android Client ID

- Fill in package name and SHA-1 certificate.
- Note: You must generate a keystore to get the SHA-1 and configure it in `app/build.gradle`.

#### 4.3 iOS Client ID

- Fill in the bundle identifier and configure properly for iOS support.

### 5. Publish the App

Follow GCP’s process to publish the OAuth consent screen.

---

### 6. Integrate Flutter with Supabase

#### Initialize Supabase

Inside `main.dart`, initialize Supabase:

```dart
await Supabase.initialize(
  url: 'your supabase url',
  anonKey: 'your anon key',
);
```

> Get your Supabase URL and anon key from **Settings → API** in the Supabase dashboard.

---

### 7. Create Login Page

Add a button to trigger Google Sign-In.

---

### 8. Login Logic with Google

```dart
import 'package:google_sign_in/google_sign_in.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

Future<AuthResponse> _googleSignIn() async {
  const webClientId = 'my-web.apps.googleusercontent.com';
  const androidClientId = 'my-android.apps.googleusercontent.com';
  const iosClientId = 'my-ios.apps.googleusercontent.com';

  final GoogleSignIn googleSignIn = GoogleSignIn(
    clientId: iosClientId,
    serverClientId: webClientId,
  );

  final googleUser = await googleSignIn.signIn();
  final googleAuth = await googleUser!.authentication;
  final accessToken = googleAuth.accessToken;
  final idToken = googleAuth.idToken;

  if (accessToken == null) {
    throw 'No Access Token found.';
  }
  if (idToken == null) {
    throw 'No ID Token found.';
  }

  return supabase.auth.signInWithIdToken(
    provider: Provider.google,
    idToken: idToken,
    accessToken: accessToken,
  );
}
```

---

### 9. Create Home / Profile Page

After successful login, navigate to a new page (e.g., `HomePage`) and retrieve user data:

```dart
final user = supabase.auth.currentUser;
final profileImageUrl = user?.userMetadata?['avatar_url'];
final fullName = user?.userMetadata?['full_name'];
```

---

### 10. Logout

To log out, use:

```dart
await supabase.auth.signOut();
```

---

## Conclusion

In conclusion, this article has covered the process of incorporating authentication into a Flutter application by utilizing Google Sign-In and the Supabase SDK for Flutter. We kept it simple and minimal, but you can explore further enhancements like state management, routing, and advanced error handling.
