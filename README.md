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
- 🧠 Multiple AI Models Support
- 🔄 Configurable AI Agents

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
  - POST `/api/ai/compare-bids`
  - POST `/api/ai/chat`
  - GET `/api/ai/agents`
  - PUT `/api/ai/agents/:agentId`

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
- Multiple AI API Integrations (OpenAI, DeepSeek, Llama)

## AI Integration Guide

### Configuring AI APIs

ProcAI supports multiple AI providers to power its intelligent analysis features. The system now includes support for DeepSeek R1 and Llama 3.3 70B models in addition to OpenAI's models. Follow these steps to configure AI APIs:

1. **Access the Admin Settings**:
   - Log in with an admin account
   - Navigate to the Settings page
   - Select the "API Settings" tab

2. **Configure OpenAI API**:
   - Enter your OpenAI API key in the designated field
   - Optionally set your Organization ID if you're using an organization account
   - OpenAI models available: GPT-4, GPT-3.5 Turbo
   - Save changes

3. **Configure DeepSeek API**:
   - Enter your DeepSeek API key
   - Set the API endpoint (default is `https://api.deepseek.com/v1`)
   - DeepSeek models available: DeepSeek R1
   - Save changes

4. **Configure Llama API**:
   - Enter your Llama API key or connection details
   - Set the API endpoint (default is `https://api.llama.com/v1`)
   - Llama models available: Llama 3.3 70B
   - Configure any additional parameters required by your Llama API provider
   - Save changes

5. **Set Default AI Provider**:
   - Choose which AI provider to use as the system default (OpenAI, DeepSeek, or Llama)
   - This default can be overridden per agent or per analysis
   - Consider factors like cost, performance, and specific capabilities when selecting your default

6. **API Key Security**:
   - All API keys are stored in encrypted format for security
   - Keys are never exposed in client-side code
   - Regular rotation of API keys is recommended for security best practices

### Managing AI Agents

ProcAI uses specialized AI agents for different types of analysis. Each agent can now be configured to use any of the supported AI models (OpenAI, DeepSeek R1, or Llama 3.3 70B). You can customize existing agents or create new ones:

1. **Access Agent Settings**:
   - Log in with an admin account
   - Navigate to the Settings page
   - Select the "AI Agents" tab

2. **View Existing Agents**:
   - See a list of all configured agents
   - View their descriptions, assigned models, and status
   - The system comes with three pre-configured agents:
     * **Compliance Agent**: Analyzes RFPs for compliance with regulations and requirements
     * **Evaluation Agent**: Evaluates bids against RFP requirements and scoring criteria
     * **Comparative Agent**: Compares multiple bids to identify strengths, weaknesses, and best value

3. **Edit an Existing Agent**:
   - Click the "Edit" button next to an agent
   - Modify the agent name, description, or assigned AI model
   - Switch between different AI providers (OpenAI, DeepSeek, Llama)
   - Customize the system prompt to specialize the agent for specific tasks
   - Adjust temperature and token settings for optimal performance
   - Toggle the agent's active status
   - Save changes

4. **Create a New Agent**:
   - Click "Add New Agent"
   - Provide a unique ID (e.g., "technical-review-agent")
   - Enter a descriptive name (e.g., "Technical Review Agent")
   - Write a detailed description of the agent's purpose
   - Select the AI model to power this agent (GPT-4, DeepSeek R1, Llama 3.3 70B, etc.)
   - Configure the system prompt that defines the agent's behavior and expertise
   - Set temperature (0.0-1.0) - lower for more deterministic responses, higher for more creative ones
   - Set max tokens for response length
   - Set the agent's active status
   - Save the new agent

5. **Agent Configuration Options**:
   - **Name**: Human-readable name for the agent
   - **Description**: Purpose and capabilities of the agent
   - **AI Model**: Which model powers this agent (GPT-4, DeepSeek R1, Llama 3.3 70B, etc.)
   - **Provider**: The AI provider (OpenAI, DeepSeek, Llama)
   - **System Prompt**: The base instructions that define the agent's behavior and expertise
   - **Temperature**: Controls randomness in responses (0.0-1.0)
   - **Max Tokens**: Maximum response length
   - **Active Status**: Whether the agent is available for use

6. **Specialized Agent Examples**:
   - **Technical Compliance Agent**: Focus on technical specifications and standards
   - **Legal Review Agent**: Specialized in legal terms and conditions
   - **Financial Analysis Agent**: Focus on cost analysis and financial terms
   - **Sustainability Agent**: Specialized in environmental and sustainability requirements

### Using AI Agents in the Application

Once configured, AI agents can be used throughout the application. The system now clearly indicates which AI model and provider is being used for each analysis:

1. **RFP Analysis**:
   - Select an RFP from the RFPs page
   - Click the "Analyze with AI" button
   - In the analysis options, select which agent to use (e.g., Compliance Agent)
   - Choose the AI model if you want to override the agent's default
   - Click "Generate Analysis"
   - View the generated analysis report with clear indication of which AI agent and model was used

2. **Bid Evaluation**:
   - Select a bid from the Bids page
   - Click the "Evaluate with AI" button
   - Select which agent to use (e.g., Evaluation Agent)
   - Choose the AI model if you want to override the agent's default
   - Click "Generate Evaluation"
   - View the evaluation report with AI agent and model attribution

3. **Bid Comparison**:
   - From the RFP detail page, select multiple bids
   - Click "Compare with AI"
   - Select which agent to use (e.g., Comparative Agent)
   - Choose the AI model if you want to override the agent's default
   - Click "Generate Comparison"
   - View the comparison report with details on which AI was used

4. **AI Chat Interface**:
   - Open a report from the Reports page
   - Use the chat interface in the right panel to ask questions about the document
   - The interface clearly shows which agent is currently active
   - You can switch between different agents using the dropdown menu
   - Each response displays which AI model and provider generated it
   - Chat history is saved and can be referenced later

5. **AI Analysis Page**:
   - Navigate to the AI Analysis page
   - In the document selection section, search and select RFPs, bids, or reports
   - In the Analysis Options section, choose the appropriate agent
   - You can override the default model for the selected agent
   - The analysis interface clearly indicates when a response is being generated
   - Each response shows which AI agent and LLM was used
   - Analysis results can be saved as new reports

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

Admin login credentials:
Email: admin@procai.com
Password: password123
Backend server:
Running on port 5000
Successfully connected to MongoDB
All routes and controllers are active
Frontend structure:
Properly organized routes
Authentication flow implemented
All UI components in place
To access the application:

Backend is already running on port 5000
Start the frontend development server:
npm run dev
Access the application at http://localhost:3000
Login with the admin credentials
The application is now ready for use with all features available:

Authentication
RFP management
Bid tracking
AI analysis
Reporting
