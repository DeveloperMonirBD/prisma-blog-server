# 📝 Prisma Blog API

A robust, production-grade RESTful API built for a modern Blog Application using **Node.js,
Express.js, TypeScript, Prisma ORM, and PostgreSQL**. Designed with **Clean Architecture**,
comprehensive **Zod Validations**, and a **Centralized Global Error Handler**.

---

## 🚀 Features

- 🏗️ **Clean & Modular Architecture:** Strict separation of concerns using Controllers, Services,
  Routes, and Middlewares.
- 🐘 **Prisma ORM & PostgreSQL:** Type-safe database queries with UUID primary keys and relational
  data handling.
- 🛡️ **Strict Request Validation:** Complete request validation (`body`, `params`, `query`) using
  **Zod**.
- 🛑 **Centralized Error Handling:** Global error handler catching Prisma errors (`P2002`, `P2025`),
  Zod validation issues, and HTTP exceptions with clear JSON responses.
- 🔄 **Async Error Wrapper:** Custom `catchAsync` utility eliminating repetitive `try-catch` blocks
  across controllers.
- 🔍 **Filtering, Search & Pagination:** Advanced query handling for post filtering, search terms,
  and paginated responses.

---

## 🛠️ Tech Stack

| Technology               | Purpose                         |
| :----------------------- | :------------------------------ |
| **Node.js & Express.js** | Backend Framework               |
| **TypeScript**           | Type-safe JavaScript            |
| **Prisma ORM**           | Database Toolkit & Query Engine |
| **PostgreSQL**           | Relational Database             |
| **Zod**                  | Schema Validation               |
| **CORS & Express JSON**  | Middleware Parsers              |

---

## 📁 Project Structure

```bash
src/
├── config/
│   └── index.ts                 # Environment variables configuration (dotenv)
├── lib/
│   └── prisma.ts                # Single Prisma Client instance initialization
├── middlewares/
│   ├── globalErrorHandler.ts    # Centralized error handling middleware
│   └── validateRequest.ts       # Generic Zod validation middleware
├── modules/
│   └── post/
│       ├── post.controller.ts   # HTTP Request & Response handler logic
│       ├── post.interface.ts    # TypeScript types & interfaces
│       ├── post.route.ts        # Express route definitions with validation
│       ├── post.service.ts      # Business logic & Prisma database operations
│       └── post.validation.ts   # Zod schema definitions for request validation
├── utils/
│   └── catchAsync.ts            # High-order function for async error wrapping
├── app.ts                       # Express app configuration & middleware setups
└── server.ts                    # Server startup script & database listener

```
---

## ⚡ Getting Started

### Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18 or higher)
- **PostgreSQL** database instance running locally or hosted (e.g., Supabase, Neon, Render)

---

### Installation Steps

### **Clone the repository:**

```bash
git clone [https://github.com/DeveloperMonirBD/prisma-blog-server.git](https://github.com/DeveloperMonirBD/prisma-blog-server.git)
cd prisma-blog-server
```

### Install dependencies:

```bash
npm install

```

### Configure Environment Variables:

Create a .env file in the root directory and add the following configuration:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/prisma_blog_db?schema=public"
PORT=5000
NODE_ENV="development"

```

### Run Prisma Migrations:

```bash
npx prisma migrate dev --name init

```

### Start the Development Server:

```bash
npm run dev

```
The application will be running live at http://localhost:5000.

---

## 📡 API Endpoints Summary

### Health Check

-   GET / — Check if the server is running properly.

### Posts Module (/posts)

| Method | Endpoint | Description | Validation |
| :--- | :--- | :--- | :--- |
| **POST** | `/posts` | Create a new blog post | Zod Body Schema |
| **GET** | `/posts` | Fetch all posts (Supports Search, Filtering, Pagination) | Zod Query Schema |
| **GET** | `/posts/:id` | Get single post details (Increments view count) | Zod UUID Params Schema |
| **PATCH** | `/posts/:id` | Update existing post details | Zod UUID & Body Schema |
| **DELETE** | `/posts/:id` | Delete a post by ID | Zod UUID Params Schema |

---

## ⚠️ Standardized Error Response Structure

### All API errors return a consistent, uniform JSON payload:

```json
{
  "success": false,
  "message": "Validation Error",
  "errorSources": [
    {
      "path": "title",
      "message": "Title is required"
    }
  ],
  "stack": null
}

```

---

### 📜 Useful Prisma Commands

```Bash
# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (Database GUI)
npx prisma studio

# Apply pending migrations
npx prisma migrate dev

```

