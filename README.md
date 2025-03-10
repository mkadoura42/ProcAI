# ProcAI - Procurement AI Assistant

ProcAI is a comprehensive procurement management system that leverages AI to streamline RFP (Request for Proposal) processes, bid evaluations, and procurement analytics.

## Features

- 📄 RFP Management
- 💼 Bid Tracking and Evaluation
- 📊 Procurement Analytics
- 🤖 AI-Powered Analysis
- 📈 Reporting Dashboard
- 👥 User Management
- ⚙️ Customizable Settings

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- OpenAI API Key (for AI features)

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd my-app
```

2. Run the installation script:
```bash
chmod +x install.sh
./install.sh
```

3. Configure environment variables:
- Copy `.env.example` to `.env` in the backend directory
- Update the variables with your configuration:
  - Set your MongoDB URI
  - Add your OpenAI API key
  - Configure JWT secret
  - Set up email settings (optional)

4. Start the development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend (in a new terminal):
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
my-app/
├── app/                   # Next.js pages and components
├── backend/              # Express.js backend
│   ├── controllers/      # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── middleware/      # Custom middleware
├── components/          # Reusable React components
├── lib/                 # Utility functions and hooks
└── public/             # Static assets
```

## API Documentation

The backend provides the following API endpoints:

- Auth:
  - POST `/api/auth/login`
  - POST `/api/auth/register`
  - GET `/api/auth/me`

- RFPs:
  - GET `/api/rfps`
  - POST `/api/rfps`
  - GET `/api/rfps/:id`
  - PUT `/api/rfps/:id`
  - DELETE `/api/rfps/:id`

- Bids:
  - GET `/api/bids`
  - POST `/api/bids`
  - GET `/api/bids/:id`
  - PUT `/api/bids/:id`
  - DELETE `/api/bids/:id`

- Reports:
  - GET `/api/reports`
  - POST `/api/reports/generate`
  - GET `/api/reports/:id`

- AI Analysis:
  - POST `/api/ai/analyze-rfp`
  - POST `/api/ai/evaluate-bid`
  - POST `/api/ai/generate-report`

## Development

### Frontend Development

The frontend is built with:
- Next.js 13+ (App Router)
- React 18
- Tailwind CSS
- Shadcn UI Components

### Backend Development

The backend uses:
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- OpenAI API Integration

## Testing

Run the test suites:

```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
