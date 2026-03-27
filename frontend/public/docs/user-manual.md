# User Manual

Hello, and welcome to Cresco, the smart farming assistant.

This user manual explains how to operate the application and get the most out of Cresco.

## Main

### Sign In Page

![Sign in page](/docs/images/sign_in_page.png)

On the sign-in page, enter your username and password to sign in.

To create an account, enter a unique username and your desired password.

![Filled sign in form](/docs/images/sign_in_fill.png)

### Main Page

![Main page layout](/docs/images/full_page.png)

The main page consists of the central area and two sidebars.

The central area displays the chat interface and the dashboard, selectable by the buttons at the top.

### Toolbar

<div style="display: flex; gap: 1.5rem; align-items: flex-start; flex-wrap: wrap;">
	<img src="/docs/images/sidebar.png" alt="Toolbar sidebar" style="width: min(240px, 38vw);" />
	<div style="flex: 1; min-width: 260px;">
		<p>The toolbar contains buttons for additional features:</p>
		<ul>
			<li>Add Farm: Select the location and boundary of your farm to provide location context.</li>
			<li>Weather Data: View current weather conditions and forecasts for your farm.</li>
			<li>Drone Monitoring: Upload and analyse drone imagery of your farm.</li>
			<li>Satellite Imagery: View satellite image analysis of your farm.</li>
			<li>Web Search Toggle: Enable or disable web search functionality.</li>
		</ul>
	</div>
</div>

### Sources Sidebar

<div style="display: flex; gap: 1.5rem; align-items: flex-start; flex-wrap: wrap;">
	<img src="/docs/images/sources.png" alt="Sources sidebar" style="width: min(260px, 40vw);" />
	<div style="flex: 1; min-width: 260px;">
		<p>This sidebar contains user-added sources. Use Add Field Data to upload any supported file so the chatbot can provide more accurate, context-aware responses.</p>
	</div>
</div>

### Account Actions

![Account actions popup](/docs/images/user_page.png)

In the account popup, you can sign out or delete your account. Deleting your account removes all your data from the system.

## Features

### Select Farm

![Farm selection search](/docs/images/farm_def_2.png)

Use the farm selection interface to choose your farm boundary.

You can search for your farm location or use your current location. After navigating to the correct area, drag selection nodes to draw the boundary. Transparent nodes can be dragged to add additional sides, and double-clicking a node removes it.

![Farm boundary editing](/docs/images/farm_def_1.png)

### Weather

![Weather panel](/docs/images/weather_data.png)

The weather interface lets you view current weather conditions and forecasts for your farm.

### Satellite

![Satellite NDVI view](/docs/images/satellite_image_2.png)

The satellite imagery interface lets you view NDVI satellite analysis of your farm.

### Web Search

![Web search toggle](/docs/images/web_search.png)

The web search toggle enables or disables web search for chatbot responses, allowing you to trade off breadth of external information and response certainty.

### Drone Imagery Analysis

![Drone imagery upload and result](/docs/images/drone_image_result.png)

The drone imagery analysis interface lets you upload and analyse drone-captured farm images.

Choose the analysis type and provide the required image inputs (for example RGB and NIR). Images are sent to the backend for processing and then shown in the results view.

![Drone processing result](/docs/images/drone_image_result.png)

From the interface header, you can open gallery view to browse and date captured images for better organisation.

![Drone image gallery](/docs/images/drone_image_gallery.png)

The analysis results view shows detailed insights from processed drone images. You can also adjust the analysis threshold, which controls vegetation health boundaries.

![Drone analysis details](/docs/images/drone_image_analysis.png)

### Dashboard

![Dashboard overview](/docs/images/dashboard.png)

The dashboard provides an overview of farm status and key metrics, including current tasks, weather information, and drone imagery analysis results.
