## DeepAuth v2.1.0: AI-Powered News Verifier 🤖📰

DeepAuth is a **real-time fact-checking application** that verifies claims using advanced AI. It analyzes current news sources with **Google's Gemini 2.0 Flash AI** and live **Google Search** integration to provide accurate verdicts on any claim with confidence scores.

Perfect for combating misinformation, verifying news claims, and fact-checking in real-time.

-----

### ⭐ Core Features

  * 🎯 **Instant Verification:** Submit any claim and get a verdict (SUPPORTED, CONTRADICTED, or UNCLEAR) with 0-100% confidence score
  * 🔍 **Real-Time Research:** AI searches the web live for current, credible news sources
  * 📰 **Source Attribution:** Shows the exact articles and quotes used to verify claims
  * 🛡️ **Rate Limited:** Built-in protection with Upstash Redis (5 requests/minute per user)
  * 🎨 **Modern UI:** Clean, responsive design using React + Tailwind CSS 4.1
  * ⚡ **Fast Processing:** Advanced AI analysis with detailed reasoning explained

-----

### 🚀 Quick Start

#### **Prerequisites**
- Node.js 24.x or higher
- Google Gemini API Key ([Get it here](https://aistudio.google.com/apikey))
- Upstash Redis URL & Token ([Get it here](https://console.upstash.com))

#### **Setup & Run**

1. **Clone & Install:**
   ```bash
   git clone https://github.com/adriel-babalola/DeepAuth.git
   cd DeepAuth
   npm install
   ```

2. **Configure Environment Variables:**
   Create `backendv2/.env`:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key
   UPSTASH_REDIS_REST_URL=your_upstash_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_token
   PORT=5000
   NODE_ENV=development
   ```

3. **Start Development Mode:**
   ```bash
   npm run dev
   ```
   - Backend runs on: **http://localhost:5000**
   - Frontend runs on: **http://localhost:5173**

4. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

#### **Example API Request**
```bash
curl -X POST http://localhost:5000/api/verify \
  -H "Content-Type: application/json" \
  -d '{"claim": "The Earth is flat"}'
```

**Response:**
```json
{
  "verdict": "CONTRADICTED",
  "confidence": 99,
  "summary": "Scientific evidence overwhelmingly confirms the Earth is spherical...",
  "reasoning": "Multiple credible sources including NASA, scientific papers, and satellite imagery...",
  "articles": [
    {
      "title": "NASA confirms Earth is spherical",
      "url": "https://...",
      "snippet": "..."
    }
  ]
}
```

-----

### 🧠 Technology Stack

| Component | Technology | Details |
| :--- | :--- | :--- |
| **AI Brain** | Gemini 2.0 Flash Experimental | Real-time search integration with Google Search |
| **Backend Server** | Node.js + Express 4.21 | Lightweight, fast HTTP server |
| **Frontend** | React 19 + Vite 7 | Modern, reactive UI with instant HMR |
| **Styling** | Tailwind CSS 4.1 | Utility-first CSS framework |
| **Rate Limiting** | Upstash Redis | Distributed rate limiting for API protection |
| **API Client** | Axios 1.13 | Promise-based HTTP client |

-----

### 📋 Project Structure

```
DeepAuth/
├── backendv2/              # Backend API Server
│   ├── src/
│   │   ├── server.js      # Express server setup
│   │   ├── config/
│   │   │   └── upstash.js # Redis configuration
│   │   ├── middleware/
│   │   │   └── rateLimiter.js # Rate limiting logic
│   │   ├── routes/
│   │   │   └── verify.js  # POST /api/verify endpoint
│   │   └── services/
│   │       └── geminiService.js # Gemini AI integration
│   └── package.json
│
├── client/                 # Frontend React App
│   ├── src/
│   │   ├── App.jsx        # Main component
│   │   ├── components/    # React components
│   │   │   ├── ClaimInput.jsx
│   │   │   ├── AiResponse.jsx
│   │   │   ├── Article.jsx
│   │   │   ├── SearchQueries.jsx
│   │   │   ├── ProgressIndicator.jsx
│   │   │   └── Navigation.jsx
│   │   └── services/
│   │       └── api.js     # API calls to backend
│   └── package.json
│
├── Dockerfile             # Docker configuration for Cloud Run
├── .gcloudignore         # Files to ignore for GCP deployment
└── package.json          # Root package (build & start scripts)
```

-----

### 🔌 API Endpoint Details

**POST** `/api/verify` - Verify a claim

**Request:**
```json
{
  "claim": "Your claim to verify (10-500 characters)"
}
```

**Response:**
```json
{
  "verdict": "SUPPORTED|CONTRADICTED|UNCLEAR",
  "confidence": 0-100,
  "summary": "Brief explanation (2-3 sentences)",
  "reasoning": "Detailed analysis with sources and quotes",
  "articles": [
    {
      "title": "Article headline",
      "url": "https://source-url.com",
      "snippet": "Relevant excerpt from article"
    }
  ]
}
```

**Rate Limits:**
- `/api/verify`: 5 requests per 60 seconds per IP
- General API: 100 requests per 60 seconds per IP

**Error Responses:**
- `400` - Missing or invalid claim (must be 10-500 characters)
- `429` - Rate limit exceeded
- `503` - Gemini API unavailable

-----

### 🌐 Deploy to Google Cloud

#### **Option 1: Cloud Run (Recommended)**
```bash
# Ensure Dockerfile and .gcloudignore are in place
gcloud run deploy deepauth \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --set-env-vars "GOOGLE_API_KEY=your_key,UPSTASH_REDIS_REST_URL=your_url,UPSTASH_REDIS_REST_TOKEN=your_token"
```

#### **Option 2: Via Google Cloud Console Dashboard**
1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Click **Create Service**
3. Connect your GitHub repository
4. Set environment variables in the service configuration
5. Deploy!

#### **Deploy Steps:**
1. Enable Cloud Run, Cloud Build, and Container Registry APIs
2. Push code to GitHub
3. Create Cloud Build trigger pointing to your repository
4. Set environment variables in Cloud Run service settings
5. Deploy and get your live URL

-----

### 🔐 Environment Variables

### 🔐 Environment Variables

**Required for `backendv2/.env`:**

```env
# Google Gemini API Key (REQUIRED)
# Get from: https://aistudio.google.com/apikey
GOOGLE_API_KEY=AIza...

# Upstash Redis (for rate limiting)
# Get from: https://console.upstash.com
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=ABC123...
```

**Optional:**

```env
# Server port (default: 5000)
PORT=5000

# Environment mode (default: development)
NODE_ENV=development

# Frontend URL for CORS (production only)
FRONTEND_URL=http://localhost:5173
```

**Note:** If Upstash is not configured, the app works but rate limiting is disabled.

-----

### 🏥 Health Check

Test server status:
```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "services": {
    "server": "operational",
    "gemini": "operational"
  },
  "timestamp": "2026-01-12T10:30:00.000Z"
}
```

-----

### 📊 How It Works

1. **User Input**: Submit a claim via the frontend
2. **Rate Limit Check**: Upstash Redis verifies you haven't exceeded rate limits
3. **AI Processing**: Gemini 2.0 Flash AI receives the claim
4. **Live Search**: AI uses Google Search to find recent, credible sources
5. **Analysis**: AI evaluates evidence and assigns verdict + confidence
6. **Response**: Frontend displays verdict, reasoning, and source articles

-----

### 🛠️ Development

**Start in development mode with hot reload:**
```bash
npm run dev
```

**Only backend:**
```bash
cd backendv2
npm run dev
```

**Only frontend:**
```bash
cd client
npm run dev
```

**Lint code:**
```bash
cd client
npm run lint
```

-----

### 🐛 Troubleshooting

| Issue | Solution |
| :--- | :--- |
| `GOOGLE_API_KEY is not set` | Add your API key to `backendv2/.env` |
| Rate limiting disabled | Add Upstash Redis credentials to `.env` |
| CORS errors | Check `FRONTEND_URL` matches your frontend URL |
| Build fails | Ensure Node.js 24.x is installed (`node --version`) |
| Port already in use | Change `PORT` in `.env` or kill process using port 5000 |

-----

### 📈 Performance Notes

- **Response Time**: 5-15 seconds (depends on claim complexity and search results)
- **Memory**: ~512MB required for Cloud Run
- **Costs**: 
  - Gemini API: Pay per request
  - Upstash: Free tier includes 10,000 commands/day
  - Cloud Run: ~$0.40 per million requests

-----

### 📄 License

ISC License - See LICENSE file for details

-----

### 👨‍💻 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

-----

### 📮 Support & Feedback

- **Issues**: Create a GitHub issue for bugs
- **Features**: Submit feature requests via GitHub discussions
- **Email**: Contact the author

-----

**Last Updated:** January 12, 2026  
**Status:** ✅ **Production Ready** | **Version:** 2.1.0
