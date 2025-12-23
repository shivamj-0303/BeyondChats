const axios = require('axios');

async function rewriteArticle(original, references) {
  const prompt = `
Rewrite the article below to match the tone, structure, and depth
of the reference articles. Keep the output concise and under 3000 words.

ORIGINAL:
${original}

REFERENCES:
${references.join("\n\n")}

Return ONLY clean markdown content. Do NOT wrap it in code blocks or HTML tags.
Use markdown formatting (headings, lists, links, bold, italic).
Start directly with the content, no preamble.
`;

  console.log(`Prompt size: ${prompt.length} characters`);

  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "groq/compound-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 4000
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  let generatedContent = res.data.choices[0].message.content;
  
  // Strip markdown code block wrapper if present
  generatedContent = generatedContent
    .replace(/^```(?:html|markdown|md)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  console.log(`Generated content size: ${generatedContent.length} characters`);

  return generatedContent;
}

module.exports = { rewriteArticle };
