import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer - Image file buffer
 * @param {string} filename - Original filename
 * @returns {Promise<string>} - Cloudinary URL
 */
async function uploadToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'myntra-clone',
        public_id: `item_${Date.now()}_${filename.split('.')[0]}`,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    // Convert buffer to stream and pipe to cloudinary
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
}

/**
 * Delete image from Cloudinary
 * @param {string} imageUrl - Cloudinary URL
 * @returns {Promise<boolean>}
 */
async function deleteFromCloudinary(imageUrl) {
  try {
    // Extract public_id from URL
    const parts = imageUrl.split('/');
    const filename = parts[parts.length - 1];
    const publicId = `myntra-clone/${filename.split('.')[0]}`;
    
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}

export { uploadToCloudinary, deleteFromCloudinary };
