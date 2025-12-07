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
    if (!process.env.API_KEY) {
      console.error("❌ API_KEY not set in environment variables!");
      return res.json({ reply: "Backend misconfigured: API key missing" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://puff-ai-frontend.onrender.com", // make sure this matches your deployed frontend
        "X-Title": "Puff AI"
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

    // 🔹 Debug logs
    console.log("OpenRouter Status:", response.status);
    console.log("OpenRouter Response:", data);

    const reply = data?.choices?.[0]?.message?.content;
    res.json({
      reply: reply || "Puff is thinking too hard 💭✨"
    });

  } catch (err) {
    console.error("Backend Error:", err);
    res.json({ reply: "Network issue! Puff will try again soon 🌸" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Puff API backend running on port ${PORT}`));



