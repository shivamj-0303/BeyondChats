const axios = require('axios');

async function rewriteArticle(original, references) {
  const prompt = `
Rewrite the article below to match the tone, structure, and depth
of the reference articles.

ORIGINAL:
${original}

REFERENCES:
${references.join("\n\n")}

Return clean HTML content including a "References" section at the end.
`;

  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "groq/compound-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.choices[0].message.content;
}

module.exports = { rewriteArticle };
