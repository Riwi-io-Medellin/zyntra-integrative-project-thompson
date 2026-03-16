import pool from '../config/mysql.js';
import { SearchHistory } from '../config/mongo.js';
import { callAIService } from './aiService.js';
import { canSearch, getUserPlan } from './planService.js';

export const performSearch = async (userId, query) => {
  // Check search limit
  if (!(await canSearch(userId))) {
    throw new Error('Daily search limit exceeded');
  }

  // Call AI
  const aiResult = await callAIService(query);

  // Save to Mongo
  const searchDoc = new SearchHistory({
    userId: parseInt(userId),
    query,
    bestPrice: aiResult.bestDeal || aiResult.bestPrice,
    results: aiResult.products || []
  });
  await searchDoc.save();

  // Save to MySQL busquedas/productos
  const [busquedaRes] = await pool.execute(
    'INSERT INTO busquedas (query, search_term, intent, total) VALUES (?, ?, ?, ?)',
    [query, aiResult.search_term || query, aiResult.intent || '', aiResult.total || 0]
  );
  const busqueda_id = busquedaRes.insertId;

  for (const p of aiResult.products || []) {
    await pool.execute(
      'INSERT INTO productos (busqueda_id, store, name, price, original_price, currency, url, image_url, brand, category, in_stock, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        busqueda_id,
        p.store,
        p.name,
        p.price,
        p.original_price || null,
        p.currency || 'COP',
        p.url,
        p.image_url,
        p.brand || null,
        p.category || null,
        p.in_stock !== false,
        p.rating || null
      ]
    );
  }

  return aiResult;
};


