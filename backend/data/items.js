// const fs = require('node:fs/promises');
import fs from 'node:fs/promises';

async function getStoredItems() {
  const rawFileContent = await fs.readFile('items.json', { encoding: 'utf-8' });
  const data = JSON.parse(rawFileContent);
  const storedItems = data.items ?? [];
  return storedItems;
}

function storeItems(items) {
  return fs.writeFile('items.json', JSON.stringify({ items: items || [] }));
}

export {getStoredItems,storeItems};