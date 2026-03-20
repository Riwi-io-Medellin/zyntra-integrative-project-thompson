import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001/search";

export const callAIService = async (query, maxResults = 8) => {
  const response = await axios.post(AI_SERVICE_URL, {
    query,
    max_results_per_store: maxResults
  }, {
    timeout: 120000
  });

  return response.data;
};

