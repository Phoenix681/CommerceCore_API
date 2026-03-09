# 🛒 CommerceCore API

A production-ready backend service engineered to handle e-commerce operations, secure user authentication, and financial transactions. This API is built with a focus on data integrity, relational database modeling, and automated webhook processing.



## ⚡ Tech Stack
* **Runtime & Framework:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication & Security:** JSON Web Tokens (JWT), bcryptjs, express-validator
* **Payment Gateway:** Stripe API, Stripe CLI (Webhooks)
* **Testing:** Jest, Supertest, Postman

## 🚀 System Architecture & Key Features

### 🛡️ Security & Reliability
* **Centralized Error Handling & Validation:** Global error middleware intercepts exceptions to prevent stack trace leaks, while `express-validator` strictly sanitizes incoming payloads at the perimeter.
* **Automated Integration Testing:** Comprehensive test suites built with Jest and Supertest to verify API endpoint reliability and database interactions in an isolated environment.
* **Stateless Authentication:** Implements custom middleware that protects private routes using encrypted JSON Web Tokens (JWT) and bcrypt password hashing.

### ⚙️ Core Infrastructure
* **Secure Payment Flow:** Integrates Stripe Checkout, calculating cart totals strictly on the server by dynamically querying live database pricing to prevent client-side tampering.
* **Cryptographic Webhooks:** Utilizes Express raw body parsing to intercept and cryptographically verify Stripe event signatures for real-time order status updates.
* **Relational Data Modeling:** Designed a normalized database schema mapping `Users`, `Products`, and `Orders` using MongoDB ObjectIds and Mongoose `.populate()` for seamless data retrieval.

| HTTP Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Register a new user account | ❌ |
| `POST` | `/api/users/login` | Authenticate user and return JWT | ❌ |
| `GET` | `/api/users/profile` | Fetch logged-in user's profile data | 🔒 Yes |
| `GET` | `/api/products` | Fetch all available products | ❌ |
| `POST` | `/api/orders` | Create a new pending order | 🔒 Yes |
| `POST` | `/api/orders/create-checkout-session` | Generate a secure Stripe payment URL | 🔒 Yes |
| `POST` | `/api/webhook` | Listen for Stripe transaction events | ❌ (Stripe Only) |

## 🛠️ Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Phoenix681/CommerceCore_API.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file in the root directory and add the following variables:
   ```bash
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_custom_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_test_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```
4. Start the Stripe listener (requires Stripe CLI):
   ```bash
   stripe listen --forward-to localhost:5000/api/webhook
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```  
6. Run the automated test suite:
   ```bash
   npm test
   ```       
