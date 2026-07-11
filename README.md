# Friendly Fixers 🛠️ – On-Demand Home Services Marketplace

FriendlyFixers is a premium, fully responsive single-page frontend application inspired by hyper-local service marketplaces like UrbanCompany. It connects users with certified, background-verified professionals for domestic needs like deep cleaning, appliance repairs, and salon services.

## 🚀 Live Demo

👉 **Live Project Link (https://alisha-30.github.io/Friendly-Fixers/)**

---

## 💎 Key Features Implemented

This project showcases clean frontend engineering practices and advanced layout handling implemented purely on the client side:

* **Dynamic UI Rendering Engine:** No hardcoded HTML service cards; the entire marketplace grid reads and renders items dynamically from a centralized JavaScript object state (`servicesData`).
* **Real-Time Advanced Filtering:** Integrated live search bar query handling with category-specific buttons to filter services instantly without page reloads.
* **Strict Coupon Validation:** Features a code-sensitive coupon engine where discount deductions (Flat ₹200) are slashed from the subtotal only when a valid code (`FIXERS200`) is explicitly applied.
* **Streamlined Authentication States:** Supports client-side simulated user profile authentication loops. Dynamically updates headers to display user naming nodes alongside a professionally styled custom logout command button.
* **Dynamic Reviews Dashboard:** An interactive community logs feedback module allowing users to publish fresh reviews natively, complete with an instant "Delete" trace tracking mechanism.
* **Multi-Channel Checkout Gateway:** A clean 3-step structured wizard form collecting destination addresses, calendar date schedules, and precise payment option profiles (Paytm, UPI, Cards, COD).
* **Single-Page Print Subsystem:** Engineered heavy CSS `@media print` overrides to completely isolate and format the tax ledger receipt container, condensing it perfectly into a crisp, single-page physical document layout.
* **Sticky Structural Layout:** Enhanced viewport layout ensuring the footer remains securely anchored at the absolute bottom of the screen (`min-height: 100vh` paradigm) even when dashboard logging data is empty.

---

## 🛠️ Technology Stack
* **Structure:** HTML5 (Semantic Layout Tags)
* **Styling:** CSS3 (Advanced Flexbox, Custom Media Queries for Print, Sticky Layout Controls)
* **Logic Engine:** JavaScript (ES6+, Dynamic DOM Manipulation, Event Listeners, State Filtering Loops)

---

## 📁 Project Structure
```text
📁 FriendlyFixers/
│── 📁 assets/
│   └── 🎬 home_services.mp4       # Local downloaded background loop
│── 📄 index.html             # Central layout matrix and stepped forms
│── 📄 style.css              # Custom layout properties & print media rules
│── 📄 script.js             # Main application flow & validation routines
└── 📄 README.md              # Comprehensive repository documentation
