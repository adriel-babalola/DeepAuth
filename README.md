# 📰 DeepAuth - AI-Powered Fact-Checking Platform

DeepAuth is an intelligent, real-time fact-checking application that verifies claims by analyzing current news sources with advanced AI. It combines Google Gemini AI analysis with Brave Search API for comprehensive, up-to-date claim verification with confidence scoring.

**Status**: ✅ Production Ready  
**License**: ISC  
**Author**: Adriel Babalola

---

## 🌟 Features

- **🤖 AI-Powered Analysis**: Google Gemini 2.0 Flash for intelligent claim verification
- **📰 Real-Time News**: Brave Search API for current, relevant articles
- **🎯 Smart Query Generation**: Automatic search query generation from claims
- **📊 Confidence Scoring**: Verdict (SUPPORTED/CONTRADICTED/PARTIALLY_SUPPORTED) with percentage confidence
- **⚡ Rate Limiting**: Built-in DDoS protection with Upstash Redis (10 req/min on verify endpoint)
- **🎨 Beautiful UI**: Modern responsive design with Tailwind CSS and Lucide React icons
- **📱 Mobile Optimized**: Fully responsive for all device sizes
- **🔍 Article Display**: Rich article cards with source attribution, timestamps, and images
- **🏥 Error Handling**: Comprehensive error messages and fallback UI
- **📈 Analytics**: Rate limit analytics via Upstash dashboard

---

## 📋 Project Structure

```
DeepAuth/
├── backend/
│   ├── src/
│   │   ├── server.js                 # Express server entry point
│   │   ├── config/
│   │   │   └── upstash.js           # Redis rate limiting config
│   │   ├── middleware/
│   │   │   └── rateLimiter.js       # Endpoint-specific rate limiters
│   │   ├── routes/
│   │   │   └── verify.js            # Main verification endpoint
│   │   ├── services/
│   │   │   ├── geminiService.js     # AI query generation & analysis
│   │   │   └── newsService.js       # News article fetching
│   │   └── utils/
│   │       └── errorHandler.js      # Error utilities
│   ├── package.json
│   ├── nodemon.json
│   └── .env
│
├── client/
│   ├── src/
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Vite entry point
│   │   ├── services/
│   │   │   └── api.js               # Backend API client
│   │   ├── components/
│   │   │   ├── Navigation.jsx       # Header with social links
│   │   │   ├── ClaimInput.jsx       # Claim input form
│   │   │   ├── AiResponse.jsx       # Verdict with progress circle
│   │   │   ├── SearchQueries.jsx    # Generated search queries display
│   │   │   └── Article.jsx          # Article card component
│   │   ├── App.css
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── package.json                     # Root monorepo config
├── README.md                        # This file
└── DEPLOYMENT.md                    # Deployment guide
```

---

## 🔧 Tech Stack

### Backend
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js 5.1
- **APIs**: 
  - OpenRouter (Google Gemini 2.0 Flash) - AI analysis
  - Brave Search API - News articles
  - Upstash Redis - Rate limiting & caching
- **Development**: Nodemon
- **HTTP Client**: Axios
- **Rate Limiting**: @upstash/ratelimit + @upstash/redis

### Frontend
- **Framework**: React 19.2 with Vite
- **Styling**: Tailwind CSS 4.1
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite 7.2
- **Linting**: ESLint

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- API Keys:
  - [OpenRouter API Key](https://openrouter.ai) (free tier available)
  - [Brave Search API Key](https://api.search.brave.com)
  - [Upstash Redis](https://upstash.com) (free tier includes rate limiting)

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/deepauth.git
   cd DeepAuth
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../client
   npm install
   cd ..
   ```

3. **Setup environment variables**
   
   Create `backend/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   OPENROUTER_API_KEY=sk-or-v1-your_key_here
   BRAVE_SEARCH_API_KEY=your_brave_key_here
   UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your_token_here
   ```

### Running Locally

**Option 1: Run separately (2 terminals)**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Backend: `http://localhost:5000`  
Frontend: `http://localhost:5173`

**Option 2: Run both together (if root package.json exists)**
```bash
npm run dev
```

---

## 📡 API Endpoints

### POST `/api/verify`

Verifies a claim and returns analysis with supporting articles.

**Request:**
```json
{
  "claim": "Electric vehicle sales increased by 40% in 2024"
}
```

**Response:**
```json
{
  "verdict": "SUPPORTED",
  "confidence": 85,
  "summary": "Multiple recent news sources confirm significant growth in EV sales",
  "reasoning": "Based on the articles reviewed, EV sales have indeed shown substantial growth in 2024, with major manufacturers reporting record sales numbers.",
  "articles": [
    {
      "title": "Global EV Sales Hit Record High",
      "description": "Electric vehicle sales surge...",
      "url": "https://...",
      "source": "Reuters",
      "publishedAt": "2024-11-15T10:30:00Z",
      "urlToImage": "https://..."
    }
  ],
  "queries": ["query1", "query2", "query3"]
}
```

**Status Codes:**
- `200`: Successful verification
- `400`: Invalid claim (< 10 characters)
- `429`: Rate limit exceeded (10 requests/minute)
- `500`: Server error

**Rate Limiting Headers:**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1700000000000
```

### GET `/health`

Health check endpoint (100 requests/minute limit).

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## 🧠 How It Works

### Verification Flow

```
User Input (Claim)
      ↓
Generate Search Queries (Gemini AI)
      ↓
Fetch News Articles (Brave Search)
      ↓
Analyze Results (Gemini AI)
      ↓
Return Verdict + Confidence + Articles
```

**Step-by-step:**

1. **User enters claim** - Minimum 10 characters required
2. **Query generation** - Gemini generates 2-3 targeted search queries
3. **News fetching** - Brave Search retrieves up to 30 articles from multiple sources
4. **Deduplication** - Removes duplicate articles by URL
5. **AI analysis** - Gemini analyzes articles against the claim
6. **Verdict generation** - Determines if claim is SUPPORTED/CONTRADICTED/PARTIALLY_SUPPORTED
7. **Response** - Returns verdict with confidence score and supporting articles

---

## 🔐 Rate Limiting

Three-tier rate limiting architecture:

| Endpoint | Limit | Purpose |
|----------|-------|---------|
| `/api/verify` | 10/min | Strict - resource intensive |
| `/api/*` (other) | 30/min | Moderate - general API |
| Global | 100/min | Permissive - health checks |

**Rate limit exceeded response (429):**
```json
{
  "error": "Too many requests",
  "message": "You have exceeded the rate limit. Please try again after [time]",
  "retryAfter": 45
}
```

Powered by [Upstash Redis](https://upstash.com) with sliding window algorithm.

---

## 🧪 Testing

### Test with cURL
```bash
curl -X POST http://localhost:5000/api/verify \
  -H "Content-Type: application/json" \
  -d '{"claim":"The stock market rose 15% in 2024"}'
```

### Test with Node Script
```javascript
import axios from 'axios';

const testClaim = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/verify', {
      claim: 'Test claim about current events'
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data);
  }
};

testClaim();
```

### Example Claims to Test
- "Electric vehicle sales increased by 40% in 2024"
- "Unemployment rate dropped to historic lows"
- "AI technology created 2 million new jobs this year"

---

## 🎨 UI Components

### Navigation
- Header with DeepAuth branding
- Social links (GitHub, LinkedIn, Twitter)
- Responsive design

### ClaimInput
- Textarea for claim entry
- Character counter (minimum 10)
- Example claim buttons
- Loading state with spinner

### AIResponse
- Verdict display with icon (Check/X/AlertTriangle)
- Circular confidence indicator (SVG progress circle)
- Summary and detailed reasoning
- Color-coded by verdict type

### SearchQueries
- Display of AI-generated search queries
- Searchable query pills

### Article
- Thumbnail image
- Title with index
- Description (2-line clamp)
- Source badge and publication date
- External link button with icon

### Layout
- Left: Input + AI Response + Search Queries
- Right: Article list (scrollable)
- Responsive: Stacks on mobile

---

## 🛠️ Configuration

### Environment Variables

**Backend (.env)**
```env
# Server
PORT=5000
NODE_ENV=development|production

# APIs
OPENROUTER_API_KEY=sk-or-v1-...
BRAVE_SEARCH_API_KEY=...

# Redis Rate Limiting
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

### Database/Cache
- **Primary**: Upstash Redis (rate limiting, optional caching)
- **Optional**: Add PostgreSQL for storing verification history

---

## 📦 Dependencies

### Backend
```json
{
  "@upstash/ratelimit": "^2.0.7",
  "@upstash/redis": "^1.35.6",
  "axios": "^1.13.2",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.1.0",
  "nodemon": "^3.1.11"
}
```

### Frontend
```json
{
  "axios": "^1.13.2",
  "lucide-react": "^0.553.0",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "tailwindcss": "^4.1.17"
}
```

---

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

**Quick deploy to Render:**
1. Push code to GitHub
2. Connect repo to Render
3. Set environment variables
4. Deploy!

Live URL will look like: `https://deepauth.onrender.com`

---

## 📊 Performance

- **Verification time**: 2-5 seconds (includes AI analysis)
- **Article fetching**: <1 second
- **Query generation**: 1-2 seconds
- **AI analysis**: 1-3 seconds
- **Rate limits**: 10 req/min on verify endpoint prevents abuse

---

## 🔍 Troubleshooting

### "No auth credentials found"
**Solution**: Check API keys in `.env` file
```bash
# Verify backend loads env vars
grep OPENROUTER_API_KEY backend/.env
```

### "Network error. Make sure backend is running"
**Solution**: Ensure backend is running on port 5000
```bash
curl http://localhost:5000/health
```

### Rate limit errors (429)
**Solution**: Wait 60 seconds before next request, or check Upstash dashboard

### Articles not loading
**Solution**: Verify Brave Search API key and remaining quota

### AI analysis fails
**Solution**: Check OpenRouter credits and API key validity

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit pull request

---

## 📚 Learning Resources

- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Upstash Redis](https://upstash.com)
- [Brave Search API](https://api.search.brave.com/res/v1/documentation)
- [OpenRouter](https://openrouter.ai)

---

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Verification history tracking
- [ ] Claim caching for faster re-verification
- [ ] Multiple language support
- [ ] Advanced filtering and sorting
- [ ] Direct PDF/document upload verification
- [ ] API key management dashboard
- [ ] WebSocket for real-time updates
- [ ] Machine learning confidence calibration
- [ ] Integration with fact-checking databases
- [ ] Email verification result sharing

---

## 📞 Support & Links

- **GitHub**: [adriel-babalola](https://github.com/adriel-babalola)
- **LinkedIn**: [adriel-babalola](https://linkedin.com/in/adriel-babalola)
- **Twitter**: [@AdrielBaba57136](https://x.com/AdrielBaba57136)

---

## 📄 License

ISC License - See LICENSE file for details

---

## 🙏 Acknowledgments

- Built with [OpenRouter](https://openrouter.ai) for AI capabilities
- News from [Brave Search API](https://api.search.brave.com)
- Rate limiting by [Upstash](https://upstash.com)
- UI by [Tailwind CSS](https://tailwindcss.com) + [Lucide Icons](https://lucide.dev)

---

**Last Updated**: November 2025  
**Current Version**: 1.0.0  
**Status**: ✅ Production Ready

