# Myntra Clone Backend

Backend server for Myntra Clone built with **Express.js**, **PostgreSQL**, **Prisma ORM**, and **Cloudinary** for image storage.

## 🚀 Features

- RESTful API for e-commerce items
- PostgreSQL database with Prisma ORM
- Image upload and storage with Cloudinary
- CORS enabled for frontend integration
- Full CRUD operations for products

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **PostgreSQL** database (local or cloud)
- **Cloudinary** account ([Sign up here](https://cloudinary.com/))

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
# Database - PostgreSQL Connection String
DATABASE_URL="postgresql://username:password@localhost:5432/myntra_clone?schema=public"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=8080
```

**Where to find Cloudinary credentials:**
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy your Cloud Name, API Key, and API Secret

### 3. Set Up PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL and create database
createdb myntra_clone
```

**Option B: Use Prisma's Local Postgres (Recommended for development)**
```bash
npx prisma dev
```

This will start a local Prisma Postgres server and automatically update your `.env` with the connection string.

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

### 5. Run Database Migrations

```bash
npm run prisma:migrate
```

When prompted, enter a migration name like: `init`

### 6. Migrate Existing Data

Run the migration script to transfer data from `items.json` to PostgreSQL and upload images to Cloudinary:

```bash
npm run migrate
```

This will:
- Read all items from `items.json`
- Upload images from `frontend/public/images/` to Cloudinary
- Store all item data in PostgreSQL

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

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/items` | Get all items |
| GET | `/items/:id` | Get single item |
| POST | `/items` | Create new item (with image upload) |
| PUT | `/items/:id` | Update item |
| DELETE | `/items/:id` | Delete item |
| POST | `/upload` | Upload image only |

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
npm run prisma:studio

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
├── config/
│   ├── cloudinary.js      # Cloudinary configuration
│   └── database.js        # Prisma client instance
├── data/
│   ├── items.js           # Old file-based storage (deprecated)
│   └── itemsDB.js         # New Prisma database operations
├── middleware/
│   └── upload.js          # Multer file upload middleware
├── prisma/
│   └── schema.prisma      # Database schema
├── scripts/
│   └── migrate.js         # Data migration script
├── utils/
│   └── imageUpload.js     # Cloudinary upload utilities
├── app.js                 # Main Express server
├── items.json             # Legacy data file
├── .env                   # Environment variables (git-ignored)
└── package.json           # Dependencies & scripts
```

## 🔄 Migration from File System

The project has been migrated from:
- **Storage:** File system (`items.json`) → PostgreSQL with Prisma
- **Images:** Local files (`public/images/`) → Cloudinary CDN

Old files (`data/items.js`, `items.json`) are kept for reference but no longer used.

## ⚠️ Important Notes

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Cloudinary folder** - All images are uploaded to `myntra-clone` folder
3. **CORS** - Configured to allow frontend requests
4. **Image size limit** - Maximum 5MB per image

## 🐛 Troubleshooting

**Database connection error:**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists

**Cloudinary upload fails:**
- Verify Cloudinary credentials in `.env`
- Check internet connection
- Ensure image file is valid

**Migration script fails:**
- Make sure images exist in `frontend/public/images/`
- Run `npm run prisma:generate` first
- Check Cloudinary credentials

## 📝 License

ISC

## 👤 Author

Your Name

---

**Jai Shree Ram! Happy Coding! 🚀**
