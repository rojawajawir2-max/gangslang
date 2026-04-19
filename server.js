const express = require("express");
const OpenAI = require("openai");

const app = express();

// 🔑 Groq API client
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

// 🔥 Health check
app.get("/", (req, res) => {
  res.send("Slang API running");
});

// 🔥 Translate endpoint
app.get("/translate", async (req, res) => {
  try {
    const text = req.query.text;

    if (!text) {
      return res.status(400).send("error: no text provided");
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).send("error: missing API key");
    }

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 1.0,
      max_tokens: 70,
      messages: [
        {
          role: "system",
          content: `
YOU ARE A HARDCORE INDONESIAN TO ENGLISH GANGSTER SLANG TRANSLATOR.

RULES:
- OUTPUT ONLY 1 SENTENCE
- NO SHORT WORDS LIKE u, r, 4 u, 2
- NO FORMAL ENGLISH
- NO EXPLANATION
- NO EMOJIS
- STYLE: STREET / HOOD / AGGRESSIVE BUT NATURAL ENGLISH SLANG
- KEEP MEANING SAME
- NOT TOO LONG, NOT TOO SHORT
`
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    const output = response?.choices?.[0]?.message?.content;

    if (!output) {
      return res.status(500).send("error: empty response");
    }

    res.send(output.trim());

  } catch (err) {
    console.error("API ERROR:", err.message);
    res.status(500).send("error: API failed");
  }
});

// 🔥 Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Slang API running on port " + PORT);
});
