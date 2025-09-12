A simple, lightweight, and versatile energy consumption calculator for WordPress. This plugin provides a shortcode to embed a universal kWh calculator on any page or post. It's designed to be intuitive for users, allowing them to calculate the estimated cost of running virtually any household appliance. The calculator is fully client-side (JavaScript) and does not store any user data.

Live demo: https://elven.dk/kwh-beregner/

**Features**

**Dual Calculation Modes:** Seamlessly switch between two modes for maximum flexibility:

**Per Use:** Perfect for appliances that run a fixed cycle, like a dishwasher or washing machine. Users can enter the energy consumption directly in kWh per use, as specified on modern EU energy labels.

**Per Hour:** Ideal for appliances with variable usage, like TVs, lamps, or computers. Users can enter the appliance's power rating in Watts and specify its daily usage in hours.

**Multiple Appliances:** Easily calculate the combined consumption for multiple identical devices, such as several light bulbs or two identical ovens.

**Real-time Results:** All calculations are performed instantly in the browser, providing immediate feedback as the user types.

**Comprehensive Estimates:** The calculator provides detailed cost and consumption estimates on a per-unit, daily, weekly, monthly, and yearly basis.

**Mobile-Friendly Design:** A clean, responsive layout with a modern switch control ensures a great user experience on all devices, including small touch screens.

**Shortcode Integration:** Simply add the [elven_kwh_calc] shortcode to any page, post, or widget to display the calculator.

**Lightweight:** The plugin is built with vanilla JavaScript and minimal CSS, ensuring it has no performance impact on your site.

**How to Use**
Simply install and activate the plugin.

Add the shortcode [elven_kwh_calc] to the content of any page or post.

(Optional) You can provide default values for the price and watt/kWh fields directly in the shortcode:

[elven_kwh_calc price="2.25" watt="75"]
