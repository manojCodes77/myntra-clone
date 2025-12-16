import prisma from '../config/database.js';
import { getCache, setCache, invalidateItemsCache, CACHE_KEYS } from '../services/cacheService.js';

async function getStoredItems() {
  try {
    // Check cache first
    const cachedItems = await getCache(CACHE_KEYS.ALL_ITEMS);
    if (cachedItems) {
      return cachedItems;
    }

    // If not in cache, fetch from database
    const items = await prisma.item.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform data to match frontend format
    const transformedItems = items.map((item) => ({
      id: item.id,
      image: item.image,
      company: item.company,
      item_name: item.item_name,
      original_price: item.original_price,
      current_price: item.current_price,
      discount_percentage: item.discount_percentage,
      return_period: item.return_period,
      delivery_date: item.delivery_date,
      rating: {
        stars: item.rating_stars,
        count: item.rating_count,
      },
    }));

    // Cache the results
    await setCache(CACHE_KEYS.ALL_ITEMS, transformedItems);

    return transformedItems;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
}

async function getItemById(id) {
  try {
    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) return null;

    // Transform data to match frontend format
    return {
      id: item.id,
      image: item.image,
      company: item.company,
      item_name: item.item_name,
      original_price: item.original_price,
      current_price: item.current_price,
      discount_percentage: item.discount_percentage,
      return_period: item.return_period,
      delivery_date: item.delivery_date,
      rating: {
        stars: item.rating_stars,
        count: item.rating_count,
      },
    };
  } catch (error) {
    console.error('Error fetching item:', error);
    throw error;
  }
}

async function storeItem(itemData) {
  try {
    const newItem = await prisma.item.create({
      data: {
        image: itemData.image,
        company: itemData.company,
        item_name: itemData.item_name,
        original_price: itemData.original_price,
        current_price: itemData.current_price,
        discount_percentage: itemData.discount_percentage,
        return_period: itemData.return_period || 14,
        delivery_date: itemData.delivery_date,
        rating_stars: itemData.rating?.stars || 0,
        rating_count: itemData.rating?.count || 0,
      },
    });

    // Invalidate items cache
    await invalidateItemsCache();

    // Transform to frontend format
    return {
      id: newItem.id,
      image: newItem.image,
      company: newItem.company,
      item_name: newItem.item_name,
      original_price: newItem.original_price,
      current_price: newItem.current_price,
      discount_percentage: newItem.discount_percentage,
      return_period: newItem.return_period,
      delivery_date: newItem.delivery_date,
      rating: {
        stars: newItem.rating_stars,
        count: newItem.rating_count,
      },
    };
  } catch (error) {
    console.error('Error storing item:', error);
    throw error;
  }
}

async function deleteItem(id) {
  try {
    await prisma.item.delete({
      where: { id },
    });

    // Invalidate items cache
    await invalidateItemsCache();

    return true;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}

async function updateItem(id, itemData) {
  try {
    const updateData = {};
    
    if (itemData.image) updateData.image = itemData.image;
    if (itemData.company) updateData.company = itemData.company;
    if (itemData.item_name) updateData.item_name = itemData.item_name;
    if (itemData.original_price) updateData.original_price = itemData.original_price;
    if (itemData.current_price) updateData.current_price = itemData.current_price;
    if (itemData.discount_percentage !== undefined) updateData.discount_percentage = itemData.discount_percentage;
    if (itemData.return_period) updateData.return_period = itemData.return_period;
    if (itemData.delivery_date) updateData.delivery_date = itemData.delivery_date;
    if (itemData.rating?.stars !== undefined) updateData.rating_stars = itemData.rating.stars;
    if (itemData.rating?.count !== undefined) updateData.rating_count = itemData.rating.count;

    const updatedItem = await prisma.item.update({
      where: { id },
      data: updateData,
    });

    // Invalidate items cache
    await invalidateItemsCache();

    // Transform to frontend format
    return {
      id: updatedItem.id,
      image: updatedItem.image,
      company: updatedItem.company,
      item_name: updatedItem.item_name,
      original_price: updatedItem.original_price,
      current_price: updatedItem.current_price,
      discount_percentage: updatedItem.discount_percentage,
      return_period: updatedItem.return_period,
      delivery_date: updatedItem.delivery_date,
      rating: {
        stars: updatedItem.rating_stars,
        count: updatedItem.rating_count,
      },
    };
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
}

export { getStoredItems, getItemById, storeItem, deleteItem, updateItem };
