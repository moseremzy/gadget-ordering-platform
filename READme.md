# Gadget Ordering Platform

A full-stack gadget ordering web application with client-facing storefront and admin dashboard for managing users, products, orders, and payments.


## Features

### Client
- Browse gadgets by category
- View product details
- Add items to cart and place orders
- Pay with Paystack or Cash on Delivery
- View order history and status

### Admin
- Manage products
- Update stock quantities
- View and manage customer orders
- Update order and payment statuses


## Tech Stack
- Frontend: Vue.js
- Backend: Node.js, Express.js
- Database: MySQL
- Payments: Paystack


## Project Structure

gadget-ordering-platform/
├── admin-app/
│   ├── client/        # Vue.js admin dashboard
│   └── server/        # Express.js admin API
├── client-app/
│   ├── client/        # Vue.js customer storefront
│   └── server/        # Express.js client API
├── database/
│   ├── schema.sql     # Database schema
│   └── sample_data.sql # Fake data for local development



## Setup

1. Clone the repository
2. Create a MySQL database
3. Run `schema.sql` to create tables
4. (Optional) Run `sample_data.sql` for fake data
5. Configure environment variables
6. Start the servers


## Environment Variables

Create a `.env` file using `.env.example` as a reference and fill in your local configuration values.



## Test Login Credentials

### Client

Email: user@gadgetstore.test
Password: password123

### Admin
Email: admin@gadgetstore.test
Password: password123
