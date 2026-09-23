# Aurelia Grand Café

A complete, modern, premium, and visually stunning full-stack café website built with Vanilla HTML/CSS/JS for the frontend and Node.js/Express/MongoDB for the backend.

## Project Structure

- `frontend/`: Premium user-facing café website
- `backend/`: REST API using Node, Express, MongoDB
- `admin/`: Admin dashboard to manage menus, orders, and reservations

## Prerequisites
- Node.js installed
- MongoDB installed locally (or a MongoDB Atlas connection string)

## Setup Instructions

### 1. Configure Environment Variables
Rename the `.env.example` file to `.env` in the root directory and update it with your actual MongoDB URI and a secure JWT secret:
```
MONGO_URI=mongodb://localhost:27017/aurelia_cafe
JWT_SECRET=your_super_secret_jwt_key_2026
PORT=5000
```

### 2. Install Backend Dependencies & Start Server
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
node server.js
```
The backend should now be running on `http://localhost:5000`.

### 3. Start the Frontend
Since the frontend uses basic Vanilla HTML/CSS/JS, you can serve it using any local static file server. 
For example, using Python or Live Server (VS Code):
```bash
cd frontend
# using python:
python -m http.server 8000
```
Open `http://localhost:8000` in your browser.

### 4. Admin Dashboard
Similarly, serve the `admin` directory or open `admin/index.html` in your browser.
Before you can log in, you must register a user in the main website, manually go to the MongoDB database (`aurelia_cafe`), and change that user's role from `"user"` to `"admin"`. Then you can log into the admin dashboard using that user's email and password.

## Features
- **Frontend**: Smooth scrolling, glassmorphism, gold gradients, animations.
- **Menu System**: Dynamic category filtering, add to cart functionality.
- **Auth**: JWT based authentication (register, login, user context).
- **Checkout**: Cart calculation with tax, checkout modal, saving orders to DB.
- **Reservations**: Form to book a table directly.
- **Admin Panel**: Manage inventory, view total revenue, update order statuses, and confirm reservations.

## Technologies Used
- HTML5, CSS3, JavaScript
- Node.js, Express.js
- MongoDB, Mongoose
- JSON Web Tokens (JWT), bcrypt
