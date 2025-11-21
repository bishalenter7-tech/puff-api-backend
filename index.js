import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/ask", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "x-ai/grok-4.1-fast:free",
        messages: [
          { role: "system", content: "You are Puff AI — a soft, friendly assistant." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data?.choices?.[0]?.message?.content || "Puff is thinking too hard 💭✨" });
  } catch (err) {
    res.json({ reply: "Network issue! Puff will try again soon 🌸" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Puff API backend running on port ${PORT}`));
