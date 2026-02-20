# Cruise Ship Management System

## Overview
A comprehensive web application for managing cruise ship operations, including voyager bookings, catering orders, stationery requests, and inventory management. This project utilizes HTML, CSS, JavaScript, and Firebase for real-time data handling.

## Features
* **Voyager Module:** Book tickets (Resort, Movies, Salon), order food, order stationery.
* **Admin Module:** Manage inventory and view system logs.
* **Staff Module:**
    * **Head Cook:** View incoming catering orders.
    * **Supervisor:** View stationery requests.
    * **Manager:** Monitor all facility bookings.
* **Security:** Role-based authentication using Firebase Auth.
* **Logging:** Automated system logging for all critical actions.

## Technology Stack
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules).
* **Backend:** Firebase Firestore (NoSQL Database).
* **Auth:** Firebase Authentication.
* **Deployment:** GitHub Pages / Netlify / Firebase Hosting.

## Installation & Setup
1.  Clone the repository: `git clone [REPO_LINK]`
2.  Navigate to the project folder.
3.  Open `js/config.js` and replace the `firebaseConfig` object with your own credentials from the Firebase Console.
4.  Open `index.html` in a browser (Must use a local server like Live Server due to ES6 module CORS policy).

## Testing
* **Test Case 1 (Auth):** Register as a Voyager -> Login -> Verify redirection to `voyager.html`.
* **Test Case 2 (Ordering):** Place a catering order as Voyager -> Login as Head Cook -> Verify order appears instantly.
* **Test Case 3 (Logging):** Perform any action -> Login as Admin -> Verify log entry in dashboard.

## Code Structure
* `/js`: Contains modular logic for each role.
* `/style.css`: Centralized styling.
* `*.html`: Separate views for distinct roles to ensure separation of concerns.