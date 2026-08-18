# SnapCart — Modern Real-Time Grocery Delivery Platform

SnapCart is a production-ready, full-stack grocery delivery web application. Built using Next.js 16 (App Router), it features real-time driver map tracking via WebSockets, an AI-powered support assistant between user and delivery partner, Stripe payment gateway integration, and comprehensive Role-Based Access Control (RBAC) across Users, Admins, and Delivery Partners.

---

## Distributed Infrastructure and Repositories

To bypass serverless WebSocket limitations on Vercel and ensure low-latency real-time performance, SnapCart uses a decoupled microservice architecture:

1. Frontend and Core API Gateway (This Repository): Deployed on Vercel
2. Dedicated Real-Time Socket Server: Deployed on Render
   - Socket.io Repository: YOUR_SOCKET_SERVER_GITHUB_REPO_URL

---

## Comprehensive Project Breakdown

### 1. Storefront and User Experience
- Animated Category Slider and Grocery Item Cards built using Framer Motion.
- Global state management using Redux Toolkit for seamless cart actions (Add to Cart, Quantity Modifiers, Subtotal calculation).
- Responsive UI fully optimized for mobile, tablet, and desktop viewports.
- Integrated Navigation Bar with user profile details, order history access, and role badges.
- Footer component with site links and customer support details.

### 2. Authentication and Security
- NextAuth.js setup supporting Credentials Login/Register and Google OAuth integration.
- Custom User Schema in MongoDB with roles (User, Admin, Delivery Boy).
- Next.js Middleware protection for role-based route access (protecting Admin routes, Delivery Dashboard, and User Checkouts).
- Edit Role and Mobile Number management page for profile completion.

### 3. Catalog and Media Management
- Cloudinary Integration for direct image upload during product creation.
- Admin Product Management: Add, Edit, Delete, and View Grocery items in real-time.
- Mongoose Grocery Model with fields for name, category, price, unit, stock, and image URLs.

### 4. Checkout, Payments, and Geolocation
- Leaflet Interactive Map integration for selecting delivery address during checkout.
- Reverse Geocoding with Nominatim API and OpenStreetMap Provider for auto-address extraction.
- Cash on Delivery (COD) order placement flow with MongoDB Order Schema creation.
- Stripe Payment Gateway integration using Checkout Sessions and Webhook handling for automated payment verification.

### 5. Real-Time Logistics and Map Tracking
- Standalone Socket.io Engine running on Render for instant event broadcasting.
- Delivery Assignment Model connecting Users, Orders, Admins, and Delivery Partners.
- Delivery Boy Dashboard: Accept assignments, view active deliveries, and update order status in real-time.
- Driver GPS Broadcast: Live geolocation streaming from delivery partner device directly to user tracking screen.
- Real-time Order Status updates (Placed, Assigned, Picked Up, Out for Delivery, Delivered).

### 6. AI Assistant and Communication
- Google Gemini 1.5 API Integration for automated AI Chat functionality.
- AI Chat assistant operating between User and Delivery Partner to assist with order inquiries, delivery instructions, and automated suggestions.

### 7. Earnings and Analytics
- Delivery Partner Earnings Functionality: Calculates earnings per completed order, payout history, and delivery metrics.
- Admin Dashboard: Platform-wide overview of total sales, active orders, assigned drivers, and inventory metrics.

---

## Tech Stack

- Framework: Next.js 16 (App Router) with TypeScript
- State Management: Redux Toolkit
- UI and Styling: Tailwind CSS, Framer Motion, Lucide Icons
- Database and ORM: MongoDB, Mongoose
- Authentication: NextAuth.js (JWT, Credentials, Google OAuth)
- Real-Time Engine: Socket.io (Standalone Client/Server architecture)
- Maps and Geolocation: Leaflet.js, React-Leaflet, OpenStreetMap
- AI Engine: Google Gemini API
- Payment Gateway: Stripe (Checkout & Webhooks)
- Media Management: Cloudinary API

---

## Project Structure

snapcart/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── delivery/
│   │   └── user/
│   ├── components/
│   ├── models/
│   ├── redux/
│   └── lib/
├── public/
└── package.json

---

## Environment Variables Setup

Create a `.env.local` file in the root directory and configure the following:

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

MONGODB_URI=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GEMINI_API_KEY=your_gemini_api_key

NEXT_PUBLIC_SOCKET_SERVER_URL=https://your-socket-server.onrender.com

---

## Local Development Setup

1. Clone the repository:
   git clone https://github.com/mrsheraz33/Snapcart.git
   cd snapcart

2. Install dependencies:
   npm install

3. Run development server:
   npm run dev

4. Access the application at http://localhost:3000

---

## Author

Muhammad Sheraz | Software Engineer