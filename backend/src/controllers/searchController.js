import { performSearch } from '../services/searchService.js';

export const searchProduct = async (req, res) => {
  console.log('🔍 SEARCH REQUEST:');
  console.log('- Body:', req.body);
  console.log('- User:', req.user);
  console.log('- Headers auth:', req.headers.authorization);
  console.log('- Cookies:', req.cookies);
  
  try {
    const userId = req.user?.id || 1; 
    const { query } = req.body;

    console.log('- Processing query:', query, 'userId:', userId);

    if (!query) {
      console.log('❌ No query');
      return res.status(400).json({ error: 'Query required' });
    }

    const result = await performSearch(userId, query);
    res.json(result);
  } catch (error) {
    console.error('❌ SEARCH ERROR:', error);
    res.status(400).json({ error: error.message });
  }
};

