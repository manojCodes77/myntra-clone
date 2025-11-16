import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import fs from 'node:fs/promises';
import cloudinary from '../config/cloudinary.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function uploadImageToCloudinary(imagePath) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'myntra-clone',
      use_filename: true,
      unique_filename: false,
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

async function migrateData() {
  try {
    console.log('🚀 Starting data migration...');

    // Read items.json
    const rawFileContent = await fs.readFile(
      path.join(__dirname, '../items.json'),
      { encoding: 'utf-8' }
    );
    const data = JSON.parse(rawFileContent);
    const items = data.items || [];

    console.log(`📦 Found ${items.length} items to migrate`);

    // Upload images and create items in database
    for (const item of items) {
      try {
        console.log(`\n📤 Processing: ${item.item_name}`);

        // Upload image to Cloudinary
        const localImagePath = path.join(
          __dirname,
          '../../frontend/public',
          item.image
        );
        
        let cloudinaryUrl;
        try {
          cloudinaryUrl = await uploadImageToCloudinary(localImagePath);
          console.log(`✅ Image uploaded to Cloudinary: ${cloudinaryUrl}`);
        } catch (uploadError) {
          console.warn(`⚠️  Could not upload image, using local path: ${item.image}`);
          cloudinaryUrl = item.image; // Fallback to local path
        }

        // Create item in database
        await prisma.item.create({
          data: {
            id: item.id,
            image: cloudinaryUrl,
            company: item.company,
            item_name: item.item_name,
            original_price: item.original_price,
            current_price: item.current_price,
            discount_percentage: item.discount_percentage,
            return_period: item.return_period || 14,
            delivery_date: item.delivery_date,
            rating_stars: item.rating.stars,
            rating_count: item.rating.count,
          },
        });

        console.log(`✅ Item saved to database: ${item.item_name}`);
      } catch (error) {
        console.error(`❌ Error processing item ${item.id}:`, error.message);
      }
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log(`✅ ${items.length} items migrated to PostgreSQL`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateData()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
