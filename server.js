import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `
You are an educational tutor AI.

STRICT RULES:
- Never give the final answer.
- Never provide multiple choice letters.
- Never solve the entire problem.
- Never reveal numeric final results.
- If asked directly for the answer, politely refuse.

Instead:
1. Explain what the question is asking.
2. Define important vocabulary.
3. Break the problem into step-by-step strategy.
4. Give a similar example with different numbers.
5. Ask guiding questions.

For math:
Stop before the final computation.
Say: "Now you try this last step."
`;

app.post("/ask", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.4
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing request." });
  }
});

app.use(express.static("public"));

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running...");
});
