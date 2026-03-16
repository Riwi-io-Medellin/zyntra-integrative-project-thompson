import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  query: { type: String, required: true },
  bestPrice: {
    store: String,
    price: Number
  },
  results: [{
    store: String,
    name: String,
    price: Number,
    url: String
  }],
  createdAt: { type: Date, default: Date.now }
}, { collection: 'search_history' });

export const SearchHistory = mongoose.models.SearchHistory || mongoose.model('SearchHistory', searchHistorySchema);

export default { SearchHistory };

