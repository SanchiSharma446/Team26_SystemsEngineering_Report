# Legal Reference

This page summarises the legal considerations for **Cresco**, a UCL student project. Although it attempts to provide notice on all relevant points, it does not constitute legal advice.

---

## What we store

- **Account data:** username and bcrypt-hashed password
- **Farm context:** location coordinates
- **Documents:** user-uploaded files  and data
- **Drone imagery:** user-supplied images and their computed results
- **Chat history:** conversation logs

**Data is retained only as long as the user chooses.** Users can delete any of the above information at will, or delete their entire account at once, which cascades through all their data.

---

## Privacy

- **No telemetry is in place on Cresco.** The prototype contains no advertising pixels, analytics or cookie storage.
- **No data sharing.** Data is used only to deliver app features.
- **User-controlled deletion.** All data management is clearly exposed to the user via frontend.

---

## Security

- Passwords are hashed with **bcrypt**, never stored in plaintext.
- Authentication uses **JWT** tokens (stored client-side).
- User data is **scoped by ID** - one user cannot access another's data.
- API endpoints require authentication.
- Third-party API keys are stored **server-side**.
- Data is transferred over **TLS/HTTPS**.

---

## Data Protection

Cresco stores personal data (usernames, farm locations, uploaded documents). Under GDPR:

- **The lawful basis:** Processing of the above is necessary to deliver the requested service. Implicit consent is reasonable for our features, as users must explicitly invoke the desired functionality.
- **The data controller:** The student team hosting the demo acts as the data controller while operating this prototype, under the Department of Computer Science. Please email [legal@ucl.ac.uk](mailto:legal@ucl.ac.uk) for contact requests.

---

## Caldicott Principles

Established principles for handling sensitive information align with our approach:

1. We process data only to deliver features you request
2. Information is only processed under explicitly dedicated contexts
3. We store only that which features require
4. User data is isolated by user ID
5. The team have studied and understand their data protection obligations
6. We have identified a legal basis for all our work
7. Standard safety obligations are passed onto our model providers, which can be controlled via deployment configuration
8. This document serves as a reference for our data practice methodology. Please reach out if you have any further queries.

---

## Authentication

For proof-of-concept and demonstration of data management, Cresco uses a **custom username/password system** rather than Microsoft SSO. This explicitly aligns with the client's intentions and allows us to demonstrate end-to-end data management.

For production deployment, enterprise SSO would be recommended.

---

## Licensing

Cresco is freely available as specified under the **[MIT License](https://opensource.org/licenses/MIT)**.

---

## Third-party APIs

If enabled, Cresco may contact external services (weather, geocoding, and LLM providers). Your location and prompts may be shared with these services according to their privacy policies. For production use, please confirm their retention and training policies; at the time of writing, our default configuration does not allow any data to be shared for LLM training.