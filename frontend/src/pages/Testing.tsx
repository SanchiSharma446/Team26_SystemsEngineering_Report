function Testing() {
	return (
		<main>
			<h2>Testing</h2>

			<h3>- Testing Strategy -</h3>
			<p> Since the aim of our project was to develop a robust and reliable application for farmers, to ease their workload, we implemented a comprehensive testing strategy to ensure quality and performance. </p>
			<p> We conducted extensive unit testing, and integration testing to validate the functionality and usability of the application. </p>
			<p> - We split testing into different parts to ensure the entire application was robust: </p>
			<ul>
				<li><strong>Unit Testing:</strong> We used wrote unit tests for all individual components and functions, ensuring that each part of the codebase worked as expected in isolation.</li>
				<li><strong>Integration Testing:</strong> We performed integration testing to verify that different modules and components interacted correctly. This included testing the communication between the frontend and backend, as well as the integration of third-party APIs.</li>
				<li><strong>Manual Testing (UAT):</strong> We then went in and conducted manual testing sessions to ensure the workflow was smooth and all functionality was clearly signaled to the user, and worked exaclty as we wanted.</li>
			</ul>
			<p> Overall our testing strategy was effective in identifying and resolving any issues that arose, ensuring a high-quality product for our client and users.. </p>
			<br></br>
			<br></br>

			<h2>- Unit + Integration Testing -</h2>

			<h3>- Unit Testing Results -</h3>

			<p> Unit tests were conducted for all individual features, and all tests passed successfully. </p>
			<p> we implemented these tests using pytest</p>
			<p> // continue </p>
			<br></br>

			<h3>- Integration Testing Results -</h3>

			<p> Integration tests were performed to validate the interaction between different components and modules. All integration tests passed successfully, confirming that the various parts of the application worked together seamlessly. </p>
			<p> //continue</p>
			<br></br>

			<h3>- Manual Testing Results -</h3>

			<p> Manual testing sessions were conducted to evaluate the user experience and overall functionality of the application. We each tested our own use cases and features thoroughly, as well as running through potential workflows to identify any potential issues. </p>
			<p> We discovered several ui bugs and validation issues during manual testing, which were subsequently addressed and resolved. </p>
			<br></br>
			<br></br>

			<h2>- User Acceptance Testing -</h2>
			<p>User Acceptance Testing was conducted with our client and a group of our peers to ensure the application was up to standard. They tested various scenarios and provided feedback, and we watched to see how they interacted with the app. This helped us find areas for improvement; for example, we found many users were not aware of the internet search toggle, so we added a larger button in the sidebar.</p>
			<br></br>
			<br></br>

			<h2>- Conclusion -</h2>


		</main>
	)
}

export default Testing
