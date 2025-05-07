# Authenication Module

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- MongoDB 5.0+
- Instagram Business Account
- Meta Developer Account

### Setup

1. **Clone the repository:**
   ```bash
   git clone 
   cd 
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example /server/.env
   ```
   ```bash
   cp .env.example /client/.env
   ```

   Edit the `.env` file with your database credentials, API keys, and other configuration values.

### Running the Application

The project uses npm scripts to simplify running the application:

- **`npm run dev`**: Runs both frontend and backend simultaneously using concurrently. This is the recommended way to start the entire application during development.

- **`npm run dev:client`**: Starts only the Next.js frontend development server.

- **`npm run dev:server`**: Starts only the Express backend API server.

### Accessing the Application

After starting the application with `npm run dev`, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

## 🔧 Tech Stack

| Layer            | Technology                   |
| ---------------- | ---------------------------- |
| Frontend         | React.js                      |
| Backend          | Node.js (Express)            |
| Database         | MongoDB (Mongoose)           |


Made with ❤️ by the Zoya