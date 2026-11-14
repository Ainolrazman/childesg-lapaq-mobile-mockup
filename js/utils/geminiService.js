// ==========================================
// LaPaQ ChildESG - Gemini Service Module
// ==========================================

const MODEL_NAME = 'gemini-3.5-flash'; // Updated to active model endpoint

/**
 * Sends a text prompt to the Google Gemini API and returns the generated text.
 * @param {string} promptText - The prompt/query to send to Gemini.
 * @param {string} apiKey - Your Google Gemini API Key.
 * @returns {Promise<string>} - The model's text response.
 */
export async function askGemini(promptText, apiKey) {
  if (!apiKey) {
    throw new Error('Gemini API key is missing. Please configure your API key.');
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(`API error (${response.status}): ${JSON.stringify(errorBody)}`);
    }

    const data = await response.json();
    
    // Safely parse the response structure from the API
    const candidate = data.candidates?.[0];
    if (candidate && candidate.content?.parts?.[0]?.text) {
      return candidate.content.parts[0].text;
    } else {
      throw new Error('Received an empty or unexpected response structure from the Gemini API.');
    }
  } catch (error) {
    console.error('geminiService.js Error:', error);
    throw error;
  }
}

// Expose globally if required by legacy vanilla scripts
window.askGemini = askGemini;
