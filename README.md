# MERN Stack Blog Application

A full-stack blog application built with MongoDB, Express.js, React.js, and Node.js (MERN stack).

## Features

- User authentication (registration, login)
- Create, read, update, and delete blog posts
- Category management
- Image upload for blog posts
- Comments on blog posts
- Responsive design using Material-UI
- Pagination for blog posts
- Protected routes for authenticated users

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the server directory and add your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mern-blog
   JWT_SECRET=your-secret-key-here
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user profile

### Post Endpoints

- GET /api/posts - Get all posts (with pagination)
- GET /api/posts/:id - Get a specific post
- POST /api/posts - Create a new post (requires authentication)
- PUT /api/posts/:id - Update a post (requires authentication)
- DELETE /api/posts/:id - Delete a post (requires authentication)
- POST /api/posts/:id/comments - Add a comment to a post (requires authentication)

### Category Endpoints

- GET /api/categories - Get all categories
- POST /api/categories - Create a new category (requires authentication)

## Project Structure

```
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── App.jsx       # Main app component
├── server/                # Node.js backend
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── server.js        # Server entry point
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- multer for file uploads

### Frontend
- React.js
- React Router
- Material-UI
- React Query
- Axios
- React Hook Form

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.