# ProcAI Backend

Backend API for ProcAI - Procurement AI Assistant, a comprehensive solution for managing RFPs, bids, and AI-powered analysis.

## Features

- User authentication and role-based access control
- RFP management (create, update, delete, search)
- Bid management (create, update, delete, search)
- Report generation and management
- AI-powered analysis of RFPs and bids
- Settings management for application configuration

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Express Validator for input validation
- Multer for file uploads

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd ProcAI/my-app/backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/procai
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=24h
   ```

### Running the Server

Development mode with auto-reload:
```
npm run dev
```

Production mode:
```
npm start
```

### Seeding the Database

To populate the database with sample data:
```
npm run seed
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/change-password` - Change user password
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/stats` - Get user statistics (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `POST /api/users` - Create a new user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `PUT /api/users/profile` - Update user profile (for current user)

### RFPs

- `GET /api/rfps` - Get all RFPs
- `GET /api/rfps/stats` - Get RFP statistics
- `GET /api/rfps/:id` - Get RFP by ID
- `POST /api/rfps` - Create a new RFP
- `PUT /api/rfps/:id` - Update RFP
- `DELETE /api/rfps/:id` - Delete RFP
- `POST /api/rfps/:id/attachments` - Add attachment to RFP
- `DELETE /api/rfps/:id/attachments/:attachmentId` - Delete attachment from RFP
- `POST /api/rfps/:id/notes` - Add note to RFP

### Bids

- `GET /api/bids` - Get all bids
- `GET /api/bids/stats` - Get bid statistics
- `GET /api/bids/rfp/:rfpId` - Get bids by RFP ID
- `GET /api/bids/:id` - Get bid by ID
- `POST /api/bids` - Create a new bid
- `PUT /api/bids/:id` - Update bid
- `DELETE /api/bids/:id` - Delete bid
- `POST /api/bids/:id/attachments` - Add attachment to bid
- `DELETE /api/bids/:id/attachments/:attachmentId` - Delete attachment from bid
- `POST /api/bids/:id/evaluation` - Add evaluation note to bid
- `POST /api/bids/:id/notes` - Add note to bid

### Reports

- `GET /api/reports` - Get all reports
- `GET /api/reports/stats` - Get report statistics
- `GET /api/reports/:id` - Get report by ID
- `POST /api/reports` - Create a new report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report
- `POST /api/reports/:id/attachments` - Add attachment to report
- `DELETE /api/reports/:id/attachments/:attachmentId` - Delete attachment from report
- `POST /api/reports/:id/share` - Share report with user
- `DELETE /api/reports/:id/share/:userId` - Remove share from report
- `POST /api/reports/:id/chat` - Add chat message to report

### AI

- `POST /api/ai/analyze-rfp` - Analyze RFP for compliance
- `POST /api/ai/evaluate-bid` - Evaluate bid against RFP
- `POST /api/ai/compare-bids` - Compare multiple bids for an RFP
- `POST /api/ai/chat` - Chat with AI about a document
- `GET /api/ai/agents` - Get AI agent settings
- `PUT /api/ai/agents/:agentId` - Update AI agent settings

### Settings

- `GET /api/settings` - Get all settings (Admin only)
- `GET /api/settings/reference-codes` - Get reference code settings
- `POST /api/settings/initialize` - Initialize default settings (Admin only)
- `GET /api/settings/:category` - Get settings by category (Admin only)
- `GET /api/settings/:category/:key` - Get setting by key (Admin only)
- `PUT /api/settings/:category/:key` - Create or update setting (Admin only)
- `DELETE /api/settings/:category/:key` - Delete setting (Admin only)

## License

This project is proprietary and confidential.
