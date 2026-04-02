# BazzarNet: Local E-commerce Platform

## Project Overview

BazzarNet is a modern, responsive e-commerce platform designed to connect local stores with customers for fast and reliable delivery. It supports three distinct user roles: customers, vendors, and administrators, each with tailored functionalities. The application emphasizes a clean UI, smooth animations, and a robust architecture built with React for the frontend and a Node.js/Express backend with MongoDB.

## Key Features

### General
*   **Responsive Design:** Optimized for various screen sizes (mobile, tablet, desktop).
*   **Theming:** Toggle between light and dark modes.
*   **Authentication:** Separate login/registration flows for customers, vendors, and admins using JWT.
*   **Image Uploads:** Integrated image upload functionality for products, store logos, and user profiles.
*   **Form Validation:** Robust input validation on both frontend (custom hook) and backend (Joi).
*   **Notifications:** User-friendly toast notifications for important events.
*   **Comprehensive Testing:** Unit and integration tests implemented for both frontend and backend to ensure code quality and prevent regressions.

### Customer Features
*   **Product Browsing:** View all products or filter by store/category.
*   **Store Browsing:** Discover local stores and their product offerings, filtered by user's pincode.
*   **Product Details:** Detailed view of individual products with pricing, descriptions, ratings, and the ability to leave reviews.
*   **Shopping Cart:** Add, update quantities, and remove items from the cart.
*   **Wishlist:** Save products for later.
*   **Checkout Process:** Multi-step checkout with address management, coupon application, and UPI QR payment (mocked).
*   **Order Confirmation:** Displays order summary, OTP, and QR code for delivery.
*   **Order Tracking:** View past orders and their current status with a visual tracker.
*   **Profile Management:** View and edit personal contact, address, and payment information.
*   **Customer Dashboard:** Overview of cart, wishlist, total orders, recommended products, and products awaiting review.

### Vendor Features
*   **Vendor Dashboard:** Overview of total revenue, orders, customers, and products. Includes sales analytics and fast-selling items.
*   **Product Management:** Add, edit, and delete products for their store.
*   **Order Management:** View and update the status of incoming orders, confirm delivery with OTP.
*   **Payments Overview:** Track payment statuses for their sales.
*   **Profile Management:** View and edit business details, legal information (PAN, GST), payment information (bank, UPI), and store logo.

### Admin Features
*   **Admin Dashboard:** Centralized overview of platform metrics (total revenue, active users, vendor/user status, order completion, sales trends).
*   **User Management:** View, activate/deactivate, and delete customer and vendor accounts.
*   **Product Management:** View, edit, and delete all products across all stores.
*   **Order Management:** View all orders, update their status, and initiate refunds.
*   **Store Management:** View, activate/deactivate, edit, and delete all stores.

## Tech Stack

### Frontend
*   **Framework:** React (with Vite for a fast development experience)
*   **Testing:** Vitest, React Testing Library, Jest DOM
*   **Styling:** Tailwind CSS (utility-first for rapid UI development)
*   **Icons:** Font Awesome (`@fortawesome/react-fontawesome`) and Lucide React (`lucide-react`)
*   **Animations:** Framer Motion
*   **State Management:** React Context API (`useContext`), `useState`, `useEffect`, `useMemo`
*   **Routing:** React Router DOM
*   **Notifications:** React Hot Toast
*   **Charting:** Recharts (for vendor and admin analytics)
*   **QR Code Generation:** `react-qr-code`
*   **Language:** JavaScript (ES6+)

### Backend
*   **Framework:** Node.js with Express
*   **Testing:** Jest, Supertest
*   **Database:** MongoDB (using Mongoose ODM)
*   **Authentication:** JWT (JSON Web Tokens)
*   **Validation:** Joi
*   **Email Service:** Nodemailer
*   **File Uploads:** Multer (for local storage, can be extended to cloud storage like Cloudinary)
*   **Security:** `express-mongo-sanitize`, `xss-clean`, `express-rate-limit`
*   **Language:** JavaScript (ES6+ Modules)

## Architecture

The project follows a clear and modular structure for both frontend and backend, promoting maintainability and scalability.

### Frontend (`./src/`) Folder Structure
```
src/
├── assets/
│   └── placeholder.png
├── components/
│   ├── checkout/
│   │   ├── CheckoutSteps.jsx
│   │   ├── CouponSection.jsx
│   │   ├── OrderSummary.jsx
│   │   └── QrPaymentForm.jsx
│   ├── profile/
│   │   ├── CustomerProfileForm.jsx
│   │   └── VendorProfileForm.jsx
│   ├── reviews/
│   │   ├── ProductReviews.jsx
│   │   └── ReviewForm.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── Header.test.jsx
│   ├── Layout.jsx
│   ├── Loader.jsx
│   ├── LoginButton.jsx
│   ├── MobileNav.jsx
│   ├── Modal.jsx
│   ├── Pagination.jsx
│   ├── ProductCard.jsx
│   ├── ProductForm.jsx
│   ├── PublicHeader.jsx
│   ├── PublicLayout.jsx
│   ├── SkeletonCard.jsx
│   ├── SkeletonStoreCard.jsx
│   ├── SkeletonText.jsx
│   ├── StatCard.jsx
│   ├── StoreForm.jsx
│   ├── SupportForm.jsx
│   ├── UserSignupForm.jsx
│   └── VendorRegistrationForm.jsx
├── context/
│   └── AppContext.jsx
├── hooks/
│   ├── useAdminProducts.js
│   ├── useAdminStores.js
│   ├── useAuth.js
│   ├── useCart.js
│   ├── useCoupons.js
│   ├── useFormValidation.js
│   ├── useOrders.js
│   ├── useProducts.js
│   ├── useStores.js
│   ├── useTheme.js
│   ├── useUsers.js
│   ├── useUtils.js
│   ├── useVendorProducts.js
│   └── useWishlist.js
├── pages/
│   ├── About.jsx
│   ├── AdminDashboard.jsx
│   ├── AdminOrderManagement.jsx
│   ├── AdminProductManagement.jsx
│   ├── AdminStoreManagement.jsx
│   ├── AdminUserManagement.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── CustomerDashboard.jsx
│   ├── CustomerOrderDetails.jsx
│   ├── Dashboard.jsx
│   ├── FAQ.jsx
│   ├── ForgotPassword.jsx
│   ├── Help.jsx
│   ├── LandingPage.jsx
│   ├── Login.jsx
│   ├── ManageProducts.jsx
│   ├── OrderConfirmation.jsx
│   ├── OrderDetails.jsx
│   ├── Orders.jsx
│   ├── Payments.jsx
│   ├── Products.jsx
│   ├── Profile.jsx
│   ├── Register.jsx
│   ├── ResetPassword.jsx
│   ├── StorePage.jsx
│   ├── Stores.jsx
│   └── Wishlist.jsx
├── routes/
│   ├── AdminRoutes.jsx
│   ├── CustomerRoutes.jsx
│   ├── PublicRoutes.jsx
│   └── VendorRoutes.jsx
├── services/
│   └── api.js
├── setupTests.js
├── utils/
│   └── imageUtils.js
├── App.jsx
└── main.jsx
```

### Backend (`./backend/`) Folder Structure
```
backend/
├── config/
│   ├── db.js
│   └── env.js
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   ├── cartController.js
│   ├── couponController.js
│   ├── orderController.js
│   ├── passwordResetController.js
│   ├── paymentController.js
│   ├── productController.js
│   ├── storeController.js
│   ├── supportController.js
│   ├── uploadController.js
│   ├── userController.js
│   └── vendorController.js
├── middleware/
│   ├── asyncHandler.js
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── rateLimitMiddleware.js
│   ├── uploadMiddleware.js
│   └── validationMiddleware.js
├── models/
│   ├── Cart.js
│   ├── Coupon.js
│   ├── Order.js
│   ├── Payment.js
│   ├── Product.js
│   ├── Review.js
│   ├── Store.js
│   ├── User.js
│   └── Wishlist.js
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── couponRoutes.js
│   ├── orderRoutes.js
│   ├── passwordResetRoutes.js
│   ├── paymentRoutes.js
│   ├── productRoutes.js
│   ├── storeRoutes.js
│   ├── supportRoutes.js
│   ├── uploadRoutes.js
│   ├── userRoutes.js
│   └── vendorRoutes.js
├── services/
│   └── emailService.js
├── tests/
│   └── auth.test.js
├── uploads/
│   ├── .gitkeep
│   ├── image-1757008714296.jpg
│   └── image-1757008924565.png
├── utils/
│   ├── helpers.js
│   └── jwt.js
├── validators/
│   ├── authValidator.js
│   ├── couponValidator.js
│   ├── orderValidator.js
│   ├── passwordResetValidator.js
│   ├── productValidator.js
│   ├── reviewValidator.js
│   ├── storeValidator.js
│   ├── supportValidator.js
│   └── userValidator.js
├── .env
├── AI_RULES.md
├── ABSTRACT.md
├── package.json
├── seeder.js
└── server.js
```

### Key Workflows

*   **Product Management (Vendor):** Vendors use `ManageProducts` page to `addVendorProduct`, `editVendorProduct`, `deleteVendorProduct` via `api.vendor` calls. Image uploads are handled by `api.upload`.
*   **Order Placement (Customer):**
    1.  Customer adds items to cart (`addToCart`).
    2.  Proceeds to `Checkout` (multi-step form).
    3.  `ShippingAddressForm` collects address, which is saved to user profile.
    4.  `CouponSection` allows applying discounts via `api.coupon.validate`.
    5.  `OrderSummary` displays final details.
    6.  `QrPaymentForm` handles UPI QR payment and transaction ID input.
    7.  `checkout` function (in `useCart`) calls `api.customer.placeOrder`.
    8.  Backend `placeOrder` controller performs:
        *   Stock validation and decrement (within a MongoDB transaction).
        *   Creates `Order` and `Payment` records.
        *   Updates `Coupon` usage.
        *   Generates a `deliveryOtp`.
        *   Sends an order confirmation email.
    9.  Customer is redirected to `OrderConfirmation` with order details, OTP, and QR code.
*   **Order Confirmation (Vendor):** Vendors view orders on `Orders` page. On `OrderDetails` page, they can `confirmDeliveryWithOtp` by entering the customer's OTP, which updates the order status to 'Delivered'.
*   **Profile Management:** Users (customer/vendor) can update their profile via `Profile` page, using `api.userProfile.updateProfile` and `api.userProfile.uploadProfileImage`.
*   **Admin Operations:** Admins use dedicated pages (`AdminUserManagement`, `AdminProductManagement`, `AdminStoreManagement`, `AdminOrderManagement`) to manage platform data, calling `api.admin` methods.

## Running the Project Locally

To get the BazzarNet application up and running on your local machine, follow these steps:

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd bazzarnet
    ```

2.  **Backend Setup:**
    *   Navigate to the `backend/` directory: `cd backend`
    *   Install dependencies: `npm install`
    *   Create a `.env` file in the `backend/` directory and populate it with your MongoDB URI, JWT secret, and email service credentials.
        ```
        NODE_ENV=development
        PORT=5000
        MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/bazzarnet?retryWrites=true&w=majority
        JWT_SECRET=your_jwt_secret_key
        JWT_EXPIRES_IN=1h
        EMAIL_HOST=smtp.ethereal.email # or your SMTP host
        EMAIL_PORT=587 # or your SMTP port (e.g., 465 for SSL)
        EMAIL_USER=your_email@example.com # or ethereal.email user
        EMAIL_PASS=your_email_password # or ethereal.email password
        FRONTEND_URL=http://localhost:5173
        ADMIN_EMAIL=admin@example.com # Email for receiving support requests
        ```
        **Remember to replace placeholders with your actual credentials.** For `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`, you can use [Ethereal Email](https://ethereal.email/) for testing during development.
    *   Start the backend development server: `npm run dev`
    *   This will start the Node.js/Express server, usually at `http://localhost:5000`. If the database is empty, it will automatically seed initial data (customers, vendors, products).
    *   **Run Backend Tests:** While in the `backend/` directory, run: `npm test`

3.  **Frontend Setup:**
    *   Navigate back to the project root directory (where the frontend `package.json` is): `cd ..`
    *   Install dependencies: `npm install`
    *   Create a `.env` file in the project root (same level as `package.json`) and add the frontend API base URL:
        ```
        VITE_API_BASE_URL=http://localhost:5000/api
        ```
    *   Start the frontend development server: `npm run dev`
    *   This will start the Vite development server, usually at `http://localhost:5173`.
    *   **Run Frontend Tests:** While in the project root directory, run: `npm test`

4.  **Access the Application:**
    *   Open your web browser and navigate to `http://localhost:5173`.

## Development Guidelines

*   **Styling:** Always use Tailwind CSS. Avoid custom CSS files or inline styles unless absolutely necessary.
*   **Components:** Keep components small, focused, and reusable. New components should be created in `src/components/`.
*   **Pages:** New views should be created in `src/pages/`.
*   **State:** Prefer React Context for global state.
*   **Dependencies:** Avoid adding new libraries unless there's a clear and strong justification.
*   **Backend Modularity:** Adhere to the established backend file structure (models, controllers, routes, middleware, services, utils, validators).
*   **Code Reviews:** All code changes should go through a peer review process (e.g., via Pull Requests) to ensure quality, consistency, and knowledge sharing.
*   **Documentation:**
    *   **API Documentation:** Maintain up-to-date API documentation (e.g., using Swagger/OpenAPI) detailing endpoints, parameters, and responses.
    *   **Internal Code Comments:** Use JSDoc for functions, components, and hooks, and add inline comments for complex logic or non-obvious decisions.
    *   **Directory READMEs:** Consider adding brief `README.md` files in key sub-directories to explain their purpose and contents.