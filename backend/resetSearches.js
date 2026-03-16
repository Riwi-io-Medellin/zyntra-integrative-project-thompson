import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const searchHistorySchema = new mongoose.Schema({}, { collection: 'search_history' });

const SearchHistory = mongoose.models.SearchHistory || mongoose.model('SearchHistory', searchHistorySchema);

const resetTodaySearches = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const deleted = await SearchHistory.deleteMany({
      createdAt: { $gte: today }
    });
    
    console.log(`✅ Reset completado: ${deleted.deletedCount} búsquedas de hoy eliminadas`);
    console.log('Ahora puedes hacer búsquedas sin límite diario');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetTodaySearches();

