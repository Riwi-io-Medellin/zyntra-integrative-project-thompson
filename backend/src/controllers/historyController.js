import { SearchHistory } from '../config/mongo.js';

export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await SearchHistory.find({ userId }).sort({ createdAt: -1 }).limit(50);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

