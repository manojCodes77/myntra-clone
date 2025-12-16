# Myntra Clone Backend

Backend server for Myntra Clone built with **Express.js**, **PostgreSQL**, **Prisma ORM**, **Cloudinary**, and **Redis** for image storage.

## 🚀 Features

- RESTful API for e-commerce items
- PostgreSQL database with Prisma ORM
- Image upload and storage with Cloudinary and Redis
- CORS enabled for frontend integration
- Full CRUD operations for products

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **PostgreSQL** database (local or cloud)
- **Cloudinary** account ([Sign up here](https://cloudinary.com/))
- **Redis** server (local or cloud)

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/myntra_clone?schema=public"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=8080
CLIENT_URL="http://localhost:5173"
```

**Where to find Cloudinary credentials:**

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy your Cloud Name, API Key, and API Secret

### 3. Set Up PostgreSQL Database

```bash
npx prisma init --db
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

## 🏃 Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server will start at: `http://localhost:8080`

## 📡 API Endpoints

| Method | Endpoint     | Description                         |
| ------ | ------------ | ----------------------------------- |
| GET    | `/`          | Health check                        |
| GET    | `/items`     | Get all items                       |
| GET    | `/items/:id` | Get single item                     |
| POST   | `/items`     | Create new item (with image upload) |
| PUT    | `/items/:id` | Update item                         |
| DELETE | `/items/:id` | Delete item                         |
| POST   | `/upload`    | Upload image only                   |

### Example API Usage

**Create Item with Image:**

```bash
# Using form-data
curl -X POST http://localhost:8080/items \
  -F "image=@path/to/image.jpg" \
  -F "company=Nike" \
  -F "item_name=Running Shoes" \
  -F "original_price=5000" \
  -F "current_price=3500" \
  -F "discount_percentage=30" \
  -F "return_period=14" \
  -F "delivery_date=10 Dec 2024" \
  -F "rating_stars=4.5" \
  -F "rating_count=150"
```

**Get All Items:**

```bash
curl http://localhost:8080/items
```

## 🗃️ Database Schema

```prisma
model Item {
  id                   String   @id @default(cuid())
  image                String
  company              String
  item_name            String
  original_price       Int
  current_price        Int
  discount_percentage  Int
  return_period        Int      @default(14)
  delivery_date        String
  rating_stars         Float
  rating_count         Int
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}
```

## 🧰 Useful Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Generate new migration after schema changes
npx prisma migrate dev --name your_migration_name

# Format Prisma schema
npx prisma format
```

## 📁 Project Structure

```
backend/
├── controllers/items-controller.js   # Item CRUD logic
├── middleware/upload.js               # Image upload middleware
├── utils/imageUpload.js               # Cloudinary image upload/delete
├── config/redis.js                    # Redis configuration
├── prisma/                           # Prisma schema and migrations
├── services/cacheService.js          # Redis caching service
├── app.js                             # Main Express app
├── .env                               # Environment variables
└── README.md                          # Project documentation
```
---

**Jai Shree Ram! Happy Coding! 🚀**
