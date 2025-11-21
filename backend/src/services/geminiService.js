import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// OpenRouter API Configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const MODEL = 'tngtech/deepseek-r1t2-chimera:free'

// const MODEL = 'google/gemini-2.0-flash-exp:free';
// const MODEL = 'meta-llama/llama-3.1-8b-instruct:free';
// const MODEL = 'mistralai/mistral-7b-instruct:free';
// const MODEL = 'nousresearch/hermes-3-llama-3.1-405b:free';

export const generateSearchQueries = async (claim) => {
  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: `You are a fact-checking assistant. Generate 2-3 specific search queries to verify this claim: "${claim}". 
            Return ONLY a JSON array of strings, no other text.
            Example: ["query 1", "query 2", "query 3"]`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'News Verifier',
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data.choices[0].message.content;
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return [claim];
  } catch (error) {
    console.error('OpenRouter query generation error:', error.response?.data || error.message);
    return [claim];
  }
};

export const analyzeResults = async (claim, articles) => {
  try {
    const articlesText = articles.map((a, i) =>
      `[${i + 1}] ${a.title} - ${a.description} (Source: ${a.source.name})`
    ).join('\n\n');

    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: `Analyze if these news articles support or contradict this claim: "${claim}"

             News Articles: ${articlesText}

             Provide your analysis in this exact JSON format:
             {
             "verdict": "SUPPORTED" or "CONTRADICTED" or "UNCLEAR",
             "confidence": 0-100,
             "summary": "brief explanation",
             "reasoning": "detailed reasoning"
          }`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'News Verifier',
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data.choices[0].message.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      verdict: 'UNCLEAR',
      confidence: 0,
      summary: 'Unable to analyze',
      reasoning: text
    };
  } catch (error) {
    console.error('OpenRouter analysis error:', error.response?.data || error.message);
    throw new Error('Failed to analyze results');
  }
};