---
layout: ../../layouts/post.astro
title: Google Sign In Flutter with Supabase
description: This is a post about how implementation Google Sign In authentication in Flutter with Supabase.
dateFormatted: Juni 9th, 2024
---

![Coffee and Code](/assets/images/posts/flutter_supabase.jpg)

# Introduction

In the ever-evolving landscape of mobile app development, **authentication** is a **critical aspect** that directly influences user experience and security. This article will guide you through the process of integrating **Google Sign-In authentication** into a **Flutter** app, leveraging the power of **Supabase** as a backend service


# Background

Before we dive into the implementation, let’s briefly discuss the technologies involved :

1.  **Flutter** ([https://flutter.dev/](http://flutter.dev/)) : A popular open-source UI software development toolkit by Google for building natively compiled applications for mobile, web, and desktop from a single codebase.
2.  **Supabase** ([https://supabase.com/](http://supabase.com/)) : An open-source Firebase alternative, Supabase provides a scalable and secure backend-as-a-service (BaaS) infrastructure for applications.

##  Prerequisites

Before getting started, make sure you have the following prerequisites :

1.  Flutter SDK installed, we used v3.16.0
2.  Supabase account and project set up
3.  Basic understanding of Flutter and Dart programming language

## What we're building

Our minimalist Flutter app will consist of **two pages**:

1.  **Login Page** : The entry point to our application, the login page, will leverage Google Sign-In to provide users with a convenient and secure authentication process. Users will be able to sign in using their Google credentials, ensuring a smooth onboarding experience.
2.  **Profile Page** : Once authenticated, users will land on the profile page. Here, we’ll explore how to store essential user data in Supabase — *a powerful backend service.* The profile page serves not only as a display of user information but also as a testament to the robust integration between our Flutter app and Supabase.

Now, let’s dive into the step-by-step guide and bring these pages to life, combining the efficiency of Flutter’s UI toolkit, the simplicity of Google Sign-In, and the robustness of Supabase

## Step By Step Guide

 1. Create a flutter app
	 Begin by creating a new Flutter project using  the following command :

	`flutter create your_project_name`


 2. Add dependency of supabase_flutter and google_sign_in
	 You can do it by using command : 

	 `flutter pub add supabase_flutter google_sign_in`

 3. Setting Supabase. Sign in or Sign up in [supabase.com](https://supabase.com/), and then create a project.
 
