# 🛒 CommerceCore API

A production-ready backend service engineered to handle e-commerce operations, secure user authentication, and financial transactions. This API is built with a focus on data integrity, relational database modeling, and automated webhook processing.



## ⚡ Tech Stack
* **Runtime & Framework:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JSON Web Tokens (JWT), bcryptjs
* **Payment Gateway:** Stripe API, Stripe CLI (Webhooks)
* **Testing:** Postman

## 🚀 System Architecture & Key Features

* **Secure Payment Flow:** Integrates Stripe Checkout. To prevent client-side data tampering, cart totals are calculated strictly on the server by dynamically querying live database pricing before generating payment sessions.
* **Cryptographic Webhooks:** Utilizes Express raw body parsing to intercept and cryptographically verify Stripe event signatures, automating real-time order status updates in the database.
* **Stateless Authentication:** Implements a custom authentication middleware that protects private routes using encrypted JSON Web Tokens. Passwords are salted and hashed via bcrypt before ever touching the database.
* **Relational Data Modeling:** Designed a normalized database schema mapping `Users`, `Products`, and `Orders` using MongoDB ObjectIds and Mongoose `.populate()` for seamless data retrieval.
* **Modular Codebase:** Business logic is decoupled into distinct Express Routers (`userRoutes`, `productRoutes`, `orderRoutes`), ensuring high maintainability and scalable system design.

## 📡 Core API Endpoints

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
