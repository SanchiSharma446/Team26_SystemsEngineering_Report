# Testing

## 1. Testing Strategy

Since the aim of our project was to develop a robust and reliable application for farmers, to ease their workload, we implemented a comprehensive testing strategy to ensure quality and performance.

We conducted extensive unit testing and integration testing to validate the functionality and usability of the application. We split testing into different parts to ensure the entire application was robust:

- **Unit Testing:** We wrote unit tests for all individual components and functions, ensuring that each part of the codebase worked as expected in isolation.
- **Integration Testing:** We performed integration testing to verify that different modules and components interacted correctly. This included testing the communication between the frontend and backend, as well as the integration of third-party APIs.
- **Manual Testing (UAT):** We conducted manual testing sessions to ensure the workflow was smooth and all functionality was clearly signalled to the user, and worked exactly as intended.

Overall our testing strategy was effective in identifying and resolving issues that arose, ensuring a high-quality product for our client and users.

---

## 2. Unit and Integration Testing

### 2.1 Unit Testing Results

Unit tests were conducted for all individual features, and all tests passed successfully. We achieved 85.79% backend coverage and 73.35% frontend coverage, for a combined 77.67%. The CI pipeline enforces a minimum of 80% coverage on the backend.

Our backend tests use pytest for core logic and APIs. These are sectioned by class, using temp databases and mocks to simulate full functionality.

To run backend tests:

``` uv run pytest ```

Frontend tests use Vitest and the React Testing Library to focus on UI behaviour. They test interaction flows and failure handling.

To run frontend tests:

``` npm test  ```

## 3. Manual Testing Results

Manual testing sessions were conducted to evaluate the user experience and overall functionality of the application. We each tested our own use cases and features thoroughly, as well as running through potential workflows to identify any potential issues.

We discovered several UI bugs and validation issues during manual testing, which were subsequently addressed and resolved.

---

### 3.1 Integration Testing Results

Integration tests validate the interaction between components end-to-end, covering four main flows:

- **Auth → protected routes:** Registration creates a user, the returned JWT is accepted by guarded endpoints, and a mismatched or expired token is rejected with 401.
- **Chat with RAG:** A message sent to the `/chat` endpoint invokes the LangGraph agent, which performs a ChromaDB retrieval and returns a response with source citations. All external services (LLM, Tavily) are mocked; the PostgreSQL checkpointer uses a real service container in CI.
- **File upload → indexing → retrieval:** A document uploaded via `POST /upload` is chunked, indexed into ChromaDB with the correct `user_id` metadata, and subsequently surfaced in a chat response.
- **Farm save → weather fetch:** Saving a farm polygon triggers parallel OpenWeatherMap requests (mocked in CI), and the cached weather JSON is returned by the agent's weather tool.

All integration tests passed successfully. They are re-run on every pull request via the CI pipeline against a PostgreSQL 17 service container. We repeated these tests every time a new component was added, or any component link was changed, ensuring the whole project works as expected.


---


## 4. User Acceptance Testing

User Acceptance Testing was conducted with our client and a group of our peers to ensure the application was up to standard. They tested various scenarios and provided feedback, and we watched to see how they interacted with the app. This helped us find areas for improvement.


A few such examples are included below.

| #   | Severity | User      | Problem                                                                                                                          | Solution                                                                                                      |
| --- | -------- | --------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | High     | Classmate | On mobile, the message box could fall off-screen and the sidebars took up too much space.                                        | Made both sidebars collapsible to preserve usable chat space on smaller screens.                              |
| 2   | Medium   | Client    | It was unclear that the small globe icon beside the search bar controlled internet search.                                       | Added a larger and more visible internet-toggle button in the toolbox/sidebar.                                |
| 3   | High     | Classmate | Users could send a message immediately after uploading a document, before indexing completed, which led to uninformed responses. | Enforced a wait state while files are uploading and indexing so responses are based on fully indexed content. |

These issues were promptly fixed.

---

## 5. Conclusion

Overall, we managed to reach over 75% test coverage on our frontend and backend, with comprehensive unit and user acceptance testing ensuring that our final product worked as we wanted. We can proudly say Cresco is robust and reliable, with few known bugs remaining at the time of submission.