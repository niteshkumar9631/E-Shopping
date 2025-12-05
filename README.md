## E-commerce

A full-stack E-commerce web application built using Node.js, Express, MongoDB, and React. It includes user authentication, product management, cart features, order handling, and an admin dashboard for complete store control.
---
##  Tech Stack

- **Frontend** : React, HTML, CSS, JavaScript
- **Backend** : Node.js, Express.js
- **Database** : MongoDB
- **Authentication** : JSON Web Tokens (JWT)
- **Email Service** : Nodemailer
- **File Storage** : Cloudinary
- **Payments** : Stripe / Razorpay
---
##  Project Structure

- frontend/ – User interface

- backend/ – API and server logic

admin/ – Admin dashboard for managing products and orders
---
##  Features

- User signup and login with JWT

- Product listing and product details pages

- Shopping cart with quantity updates

- Secure order placement and order history

- Admin panel for adding, editing, deleting products

- Admin order management

- Image uploads via Cloudinary

- Fully responsive design

## 🔧 Installation

```bash
# 1. Clone the repository
git clone https://github.com/niteshkumar9631/E-Shopping.git
```
cd E-Shopping

## 2. Backend Setup
```
cd backend
npm install
```

## 3. Frontend Setup
```
cd frontend
npm install
```

## 5. Admin Panel Setup
```
cd admin
npm install
```

## Environment Variables

- Create a .env file inside backend/ and include:
```
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
```

## 📸 Screenshots
# Home Page
<img width="1366" height="615" alt="image" src="https://github.com/user-attachments/assets/caa506a3-cfa2-4b73-80ae-bd8d98fe51e4" />
<img width="1364" height="665" alt="image" src="https://github.com/user-attachments/assets/599dc921-420a-4fe4-a3ca-4d586e73d15a" />
<img width="1366" height="680" alt="image" src="https://github.com/user-attachments/assets/2156d947-6266-4e83-b271-363f5da9ddcc" />
<img width="1366" height="687" alt="image" src="https://github.com/user-attachments/assets/7398f3bf-eb7d-4034-9b50-8c55f970a0a2" />

# collection page
<img width="1362" height="642" alt="image" src="https://github.com/user-attachments/assets/4b8f327e-0c82-4a3a-8738-af9aff8dbda7" />

# About page
<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/3c842e21-d62a-4bea-b7f8-79bd33e38681" />

# Contact page
<img width="1353" height="626" alt="image" src="https://github.com/user-attachments/assets/bd5768f7-eb6c-470f-8455-8ea200b872da" />

# SignUp page
<img width="1353" height="638" alt="image" src="https://github.com/user-attachments/assets/2015282e-fcd3-4968-8d1e-b68c01f7a47b" />

# Login page
<img width="1337" height="636" alt="image" src="https://github.com/user-attachments/assets/55593552-e68f-4554-9c27-dbc9ad06a4fb" />

# Admin Panel page
<img width="1362" height="639" alt="image" src="https://github.com/user-attachments/assets/6fd826d6-1c3c-469e-adc9-be7b0ea8e115" />


##  Running the Application
- Backend
```
cd backend
npm run server
```

- Frontend
```
cd frontend
npm run dev
```

- Admin Panel
```
cd admin
npm run dev
```

## Default Ports:

- Frontend → http://localhost:5173

- Backend → http://localhost:8000

- Admin Panel → http://localhost:5174
 

##  License

- This project is under the MIT License.
