import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY

if (!API_KEY) {
  console.error('❌ ERROR: GOOGLE_API_KEY is not set in .env file');
  console.error('Get your API key from: https://aistudio.google.com/apikey');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(`${API_KEY}`);


export const verifyClaimWithRealNews = async (claim) => {
  const logs = [];

  // Helper to log and collect
  const log = (message) => {
    console.log(message);
    logs.push(message);
  };

  try {
    log('🤖 Initializing Gemini with Google Search...');

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
      tools: [{
        googleSearch: {}
      }]
    });

    const prompt = `You are a professional fact-checker for a news verification service. Your job is to verify claims using ONLY the most recent, credible news sources from the past month.

  **CLAIM TO VERIFY:** "${claim}"

**INSTRUCTIONS:**
1. Use the Google Search tool to find recent news articles (prioritize last 30 days)
2. Only cite reputable news sources (major newspapers, wire services, official government sites)
3. Analyze whether the claim is SUPPORTED, CONTRADICTED, or UNCLEAR based on evidence
4. Provide specific quotes and dates from your sources

**OUTPUT FORMAT (strict JSON, no markdown):**
{
  "verdict": "SUPPORTED" | "CONTRADICTED" | "UNCLEAR",
  "confidence": 0-100,
  "summary": "2-3 sentence explanation of your verdict with key facts",
  "reasoning": "Detailed analysis citing specific sources, quotes, and dates. Explain why you reached this verdict.",
  "sources": [
    {
      "title": "Exact article headline",
      "url": "https://full-article-url.com",
      "publisher": "News outlet name",
      "date": "Publication date if available",
      "snippet": "Key quote or fact from this source that supports your analysis"
    }
  ]
}

**CRITICAL RULES:**
- If you cannot find recent news about this claim, set verdict to "UNCLEAR"
- Confidence should reflect the quality and quantity of sources found
- Include at least 3 sources if available
- Every source MUST have a real, working URL from your search results
- Focus on NEWS articles, not opinion pieces or social media`;

    log('🔍 Searching web and analyzing...');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    log('📝 Raw AI response received');

    const cleanText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      log('❌ Failed to extract JSON from response');
      throw new Error('AI response was not in valid JSON format');
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      log('❌ JSON parsing failed: ' + parseError.message);
      throw new Error('Failed to parse AI response as JSON');
    }

    if (!parsed.verdict || !parsed.summary || !parsed.reasoning) {
      log('❌ Response missing required fields');
      throw new Error('AI response incomplete - missing required fields');
    }

    if (!Array.isArray(parsed.sources)) {
      parsed.sources = [];
    }

    log(`📰 Found ${parsed.sources.length} AI-provided sources`);

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    if (groundingMetadata?.groundingChunks?.length > 0) {
      log(`✅ Found ${groundingMetadata.groundingChunks.length} grounding sources`);

      const groundingSources = groundingMetadata.groundingChunks
        .filter(chunk => {
          if (chunk.web?.uri?.includes('vertexaisearch.cloud.google.com')) {
            return false;
          }
          return chunk.web?.uri;
        })
        .map(chunk => {
          try {
            const hostname = new URL(chunk.web.uri).hostname.replace('www.', '');
            return {
              title: chunk.web.title || 'Web Source',
              url: chunk.web.uri,
              publisher: hostname,
              snippet: chunk.web.snippet || chunk.web.title || 'No description available'
            };
          } catch (e) {
            return null;
          }
        })
        .filter(Boolean); 
      parsed.sources = [...groundingSources, ...parsed.sources];
    }

    const uniqueSources = Array.from(
      new Map(parsed.sources.map(s => [s.url, s])).values()
    );

    parsed.sources = uniqueSources.slice(0, 10);

    log(`✅ Verification complete: ${parsed.verdict} (${parsed.confidence}% confidence)`);
    log(`📰 Found ${parsed.sources.length} unique sources`);

    parsed.logs = logs;
    return parsed;

  } catch (error) {
    console.error('❌ Gemini verification error:', error.message);

    if (error.message?.includes('API key')) {
      throw new Error('Invalid Google API key. Please check your .env file.');
    }

    if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    }

    throw new Error(`Failed to verify claim: ${error.message}`);
  }
};


export const checkGeminiHealth = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent("Say 'OK'");
    const response = await result.response;
    return response.text().includes('OK');
  } catch (error) {
    console.error('Gemini health check failed:', error.message);
    return false;
  }
};