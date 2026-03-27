# Event Management System - Backend

This is the backend REST API for the Event Management System, built with Express.js and MongoDB.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Package Manager:** pnpm

## Key Features
- **User API:** Endpoints to manage user profiles.
- **Event API:** CRUD operations for events and an event log system.
- **Rate Limiting:** Global rate limiting using `express-rate-limit` to prevent abuse.
- **Security:** Enhanced API security with `helmet` and configurable `cors`.
- **Logging:** Development logging using `morgan`.
- **Caching:** In-memory caching with `node-cache` for performance optimization.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- pnpm
- MongoDB instance (local or MongoDB Atlas)

### Installation
1. Clone the repository and navigate to the backend directory.
2. Install dependencies using pnpm:
   ```sh
   pnpm install
   ```
3. Create a `.env` file in the root directory and configure the necessary environment variables, including your MongoDB connection string (`MONGO_URI`) and server port (`PORT`).

### Running the Server

**Development Mode:**
```sh
pnpm run dev
```
Runs the server with Nodemon, automatically restarting upon file changes.

**Production Mode:**
```sh
pnpm run start
```
Runs the server using Node directly.

## Environment Variables
- `PORT` - The port on which the server runs (default: 3000)
- `MONGO_URI` - MongoDB connection string
- `CORS_ORIGIN` - Allowed origins for CORS (default: `*`)

## Project Structure
- `/controllers` - Request handlers and core business logic
- `/routes` - API route definitions
- `/models` - Mongoose database schemas
- `/middleware` - Custom middleware (e.g., error handling, rate limiting)
- `/utils` - Helper functions and utilities
