# MyFlat - Flat Rental Platform

MyFlat is a role-based flat rental web platform that connects brokers, owners, and tenants. The platform allows users to list, search, and manage flat rentals with a subscription-based model.

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Payments**: Razorpay Integration

## Features

- **User Authentication**: Email & password authentication with role selection
- **Role-based Access**: Different subscription plans for brokers, owners, and tenants
- **Dashboard**: Personalized dashboard for managing flat listings
- **Flat Listings**: Detailed flat information with multiple images
- **Search & Filters**: Advanced search and filtering options
- **Payments**: Razorpay integration for subscription payments

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Razorpay account for payment integration

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/myflat.git
   cd myflat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/myflat
   # or
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myflat

   # JWT
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=30d

   # Razorpay
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/src/app`: Next.js app router pages
- `/src/components`: Reusable React components
- `/src/models`: MongoDB models
- `/src/lib`: Utility functions
- `/src/context`: React context providers
- `/public`: Static assets

## User Roles and Pricing

- **Broker**: ₹1,000/month
  - List unlimited flats
  - Advanced search visibility
  - Priority listing placement

- **Owner**: ₹800/month
  - List up to 5 flats
  - Enhanced search visibility
  - Verified owner badge

- **Tenant**: ₹500/month
  - List up to 2 flats
  - Standard search visibility
  - Verified tenant badge

## Deployment

The application can be deployed on Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

## License

This project is licensed under the MIT License.
