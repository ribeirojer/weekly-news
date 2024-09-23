// Load environment variables from a `.env` file (optional)
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

const env = await load();
const openaiUrl = "https://api.openai.com/v1/chat/completions";

// Retrieve the OpenAI API key from environment variables or Deno.env
const OPENAI_API_KEY = env.OPENAI_API_KEY || Deno.env.get("OPENAI_API_KEY");

// Function to validate the API key
function validateApiKey() {
  if (!OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY not configured.");
    Deno.exit(1);
  }
}

// Helper function to build the OpenAI API request body
function buildOpenAIRequestBody(prompt: string) {
  return {
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "user",
        "content": prompt
      }
    ]
  };
}

// Function to send a request to the OpenAI API
async function callOpenAI(endpoint: string, prompt: string) {
  validateApiKey();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify(buildOpenAIRequestBody(prompt))
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// Function to identify the weekend news from titles
export async function identifiesWeekendNews(allTitles: { id: number, title: string }[]) {
  const prompt = `selecione apenas uma notícia que se refira a eventos no fim de semana dado os seguintes títulos, e retorne apenas o numero do id dela: ${JSON.stringify(allTitles)}`;
  const newsId = await callOpenAI(openaiUrl, prompt);
  return newsId;
}

// Function to generate a summary of a news article
export async function generateNewsSummary(content: string) {
  const prompt = `resuma brevemente a notícia:\n\n ${content}`;
  const summary = await callOpenAI(openaiUrl, prompt); // Replace with actual endpoint
  return summary;
}

// Function to identify relevant news based on a given article
export async function identifiesMostRelevantNews(allTitles: { id: number, title: string }[], idWeekendNews: number) {
  const prompt = `Dado as seguintes notícias: ${JSON.stringify(allTitles)}, identifique quais são as três notícias mais relevantes do momento, excluindo a de número: ${idWeekendNews}, retorne apenas os ids, separados por virgulas`;
  const relevantNews = await callOpenAI(openaiUrl, prompt); // Replace with actual endpoint
  return relevantNews;
}