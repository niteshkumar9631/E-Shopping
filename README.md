E-commerce

A full-stack E-commerce web application built using Node.js, Express, MongoDB, and React. It includes user authentication, product management, cart features, order handling, and an admin dashboard for complete store control.

🔧 Tech Stack

Frontend: React, HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JSON Web Tokens (JWT)
Email Service: Nodemailer
File Storage: Cloudinary
Payments: Stripe / Razorpay

📁 Project Structure

frontend/ – User interface

backend/ – API and server logic

admin/ – Admin dashboard for managing products and orders

🚀 Features

User signup and login with JWT

Product listing and product details pages

Shopping cart with quantity updates

Secure order placement and order history

Admin panel for adding, editing, deleting products

Admin order management

Image uploads via Cloudinary

Fully responsive design

🧑‍💻 Getting Started
Prerequisites

Node.js and npm

MongoDB (local or cloud)

🔧 Installation
1. Clone the repository
git clone https://github.com/niteshkumar9631/E-Shopping.git
cd E-Shopping

2. Backend Setup
cd backend
npm install

3. Frontend Setup
cd frontend
npm install

4. Admin Panel Setup
cd admin
npm install

🔐 Environment Variables

Create a .env file inside backend/ and include:

MONGODB_URI=
MONGODB_URI=              # MongoDB connection string
CLOUDINARY_CLOUD_NAME=    # Cloudinary cloud name for image storage
CLOUDINARY_API_KEY=       # Cloudinary API key
CLOUDINARY_SECRET_KEY=    # Cloudinary API secret key
JWT_SECRET=               # Secret key for JWT authentication
ADMIN_EMAIL=              # Admin login email
ADMIN_PASSWORD=           # Admin login password
STRIPE_SECRET_KEY=        # Stripe API secret key for payments
RAZORPAY_KEY_ID=          # Razorpay public key for payments
RAZORPAY_KEY_SECRET=      # Razorpay secret key
EMAIL_USER=               # Email address for sending emails
EMAIL_PASS=               # App password or email password

▶️ Running the Application
Backend
cd backend
npm run server

Frontend
cd frontend
npm run dev

Admin Panel
cd admin
npm run dev


Default Ports:

Frontend → http://localhost:5173

Backend → http://localhost:8000

Admin Panel → http://localhost:5174
 (may vary)

📝 License

This project is under the MIT License.
