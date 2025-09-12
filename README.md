# ⚡️ Elven kWh Calculator

> A simple, lightweight, and versatile energy consumption calculator for WordPress. This plugin provides a shortcode to embed a universal kWh calculator on any page or post. It's designed to be intuitive for users, allowing them to calculate the estimated cost of running virtually any household appliance. The calculator is fully client-side (JavaScript) and does not store any user data.

---

## ✨ Features

* **Dual Calculation Modes:** Seamlessly switch between two modes for maximum flexibility:
    * **Per Use:** Perfect for appliances that run a fixed cycle (dishwasher, washing machine). Users enter the energy consumption in **kWh per use**.
    * **Per Hour:** Ideal for appliances with variable usage (TVs, lamps, computers). Users enter the power rating in **Watts** and specify daily usage.

* **Multiple Appliance Support:** Easily calculate the combined consumption for multiple identical devices, such as several light bulbs or two ovens.

* **Real-time Results:** All calculations are performed instantly in the browser, providing immediate feedback as the user types.

* **Comprehensive Estimates:** Get detailed cost and consumption estimates on a per-unit, daily, weekly, monthly, and yearly basis.

* **Mobile-Friendly Design:** A clean, responsive layout with a modern switch control ensures a great user experience on all devices.

* **Simple Shortcode Integration:** Just add `[elven_kwh_calc]` to any page, post, or widget to display the calculator.

* **Lightweight & Fast:** Built with vanilla JavaScript and minimal CSS, ensuring no performance impact on your site.

---

## 🚀 How to Use

1.  **Install and activate** the plugin in WordPress.
2.  **Add the shortcode** `[elven_kwh_calc]` to the content of any page or post.
3.  **(Optional) Set default values** directly in the shortcode:
    ```shortcode
    [elven_kwh_calc price="2.25" watt="75"]
    ```
