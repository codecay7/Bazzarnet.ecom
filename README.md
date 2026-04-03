# BazzarNet Frontend

Live App: https://bazzarnet-ecom.vercel.app/

## Overview

This is the frontend of **BazzarNet**, a modern local e-commerce platform built with React. It connects customers, vendors, and admins through a clean, responsive UI and smooth user experience.

The frontend is fully deployed on Vercel and communicates with a Node.js/Express backend via REST APIs.

---

## Tech Stack

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Routing:** React Router DOM
* **State Management:** Context API + Hooks
* **Animations:** Framer Motion
* **Charts:** Recharts
* **Icons:** Lucide React + Font Awesome
* **Notifications:** React Hot Toast
* **Testing:** Vitest + React Testing Library

---

## Features

### General

* Responsive design (mobile + desktop)
* Light/Dark mode support
* JWT-based authentication
* Toast notifications for actions
* Clean UI with smooth animations

### Customer

* Browse products & stores
* Add to cart / wishlist
* Multi-step checkout (with coupon support)
* Order tracking with status updates
* Profile management

### Vendor

* Dashboard with analytics
* Add/edit/delete products
* Manage incoming orders
* Track payments

### Admin

* Manage users, stores, and products
* View platform analytics
* Control orders and refunds

---

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route-based pages
├── hooks/          # Custom hooks
├── context/        # Global state
├── services/       # API calls
├── routes/         # Role-based routing
├── utils/          # Helpers
├── App.jsx
└── main.jsx
```

---

## Environment Variables

Create a `.env` file in the root:

```
VITE_API_BASE_URL=https://your-backend-api.com/api
```

---

## Running Locally

```bash
# install dependencies
npm install

# start dev server
npm run dev
```

App runs on:

```
http://localhost:5173
```

---

## Build & Deployment

### Build

```bash
npm run build
```

### Deployment (Vercel)

* Connected GitHub repo
* Auto-deploy on push to `main`
* No custom `vercel.json` required

---

## API Integration

All API calls are handled via:

```
src/services/api.js
```

Make sure your backend is running and accessible.

---



