import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BRAVE_SEARCH_API_URL = 'https://api.search.brave.com/res/v1/news/search';
const BRAVE_API_KEY = process.env.BRAVE_SEARCH_API_KEY;

export const fetchNews = async (queries) => {
  try {
    const allArticles = [];
    
    for (const query of queries) {
      try {
        const response = await axios.get(BRAVE_SEARCH_API_URL, {
          headers: {
            'Accept': 'application/json',
            'X-Subscription-Token': BRAVE_API_KEY
          },
          params: {
            q: query,
            count: 10,
            freshness: 'pm', // past month
            text_decorations: false
          }
        });

        if (response.data.results) {
          // Transform Brave results to match our format
          const articles = response.data.results.map(article => ({
            title: article.title,
            description: article.description || article.extra_snippets?.[0] || 'No description available',
            url: article.url,
            source: {
              name: article.meta_url?.hostname || new URL(article.url).hostname
            },
            publishedAt: article.age || new Date().toISOString(),
            urlToImage: article.thumbnail?.src || null
          }));
          
          allArticles.push(...articles);
        }
      } catch (error) {
        console.error(`Error fetching for query "${query}":`, error.message);
        // Continue with other queries even if one fails
      }
    }

    // Remove duplicates based on URL
    const uniqueArticles = Array.from(
      new Map(allArticles.map(article => [article.url, article])).values()
    );

    // Filter out articles without descriptions
    return uniqueArticles
      .filter(a => a.description && a.title)
      .slice(0, 15); // Get top 15 most relevant

  } catch (error) {
    console.error('Brave Search API error:', error.response?.data || error.message);
    throw new Error('Failed to fetch news articles');
  }
};