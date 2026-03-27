# Testing

## 1. Testing Strategy

Since the aim of our project was to develop a robust and reliable application for farmers to ease their workload, we implemented a comprehensive testing strategy to ensure quality and performance.

We conducted extensive unit testing and integration testing to validate the functionality and usability of the application. We split testing into different parts to ensure the entire application was robust:

- **Unit Testing:** We wrote unit tests for all individual components and functions, ensuring that each part of the codebase worked as expected in isolation.
- **Integration Testing:** We performed integration testing to verify that different modules and components interacted correctly. This included testing the communication between the frontend and backend, as well as the integration of third-party APIs.
- **Manual Testing (UAT):** We conducted manual testing sessions to ensure the workflow was smooth and that all functionality was clearly signalled to the user and worked exactly as intended.

Overall, our testing strategy was effective in identifying and resolving issues that arose, ensuring a high-quality product for our client and users.

---

## 2. Unit and Integration Testing

### 2.1 Unit Testing Results

Unit tests were conducted for all individual features, and all tests passed successfully. We implemented these tests using pytest.

> *This section is being expanded with detailed test results and coverage reports.*

### 2.2 Integration Testing Results

Integration tests were performed to validate the interaction between different components and modules. All integration tests passed successfully, confirming that the various parts of the application worked together seamlessly.

> *This section is being expanded with detailed integration test results.*

---

## 3. Manual Testing Results

Manual testing sessions were conducted to evaluate the user experience and overall functionality of the application. We each tested our own use cases and features thoroughly, as well as running through potential workflows to identify any potential issues.

We discovered several UI bugs and validation issues during manual testing, which were subsequently addressed and resolved.

A few examples are included below.

| # | Severity | User | Problem | Solution |
|---|---|---|---|---|
| 1 | High | Classmate | On mobile, the message box could fall off-screen and the sidebars took up too much space. | Made both sidebars collapsible to preserve usable chat space on smaller screens. |
| 2 | Medium | Client | It was unclear that the small globe icon beside the search bar controlled internet search. | Added a larger and more visible internet-toggle button in the toolbox/sidebar. |
| 3 | High | Classmate | Users could send a message immediately after uploading a document, before indexing completed, which led to uninformed responses. | Enforced a wait state while files are uploading and indexing so responses are based on fully indexed content. |

---

## 4. User Acceptance Testing

User Acceptance Testing was conducted with our client and a group of our peers to ensure the application was up to standard. They tested various scenarios and provided feedback, and we watched to see how they interacted with the app. This helped us find areas for improvement; for example, we found many users were not aware of the internet search toggle, so we added a larger button in the sidebar.


---

## 5. Conclusion

> *This section is being completed.*
