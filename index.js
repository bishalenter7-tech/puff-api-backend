import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- API ROUTE --------------------
app.post("/api/ask", async (req, res) => {
  const { message } = req.body;

  // Check API key
  if (!process.env.API_KEY) {
    console.error("❌ API_KEY is missing!");
    return res.status(500).json({ reply: "Server misconfigured: API_KEY missing!" });
  }

  console.log("✅ Using API key of length:", process.env.API_KEY.length);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://puff-ai-frontend.onrender.com",
        "X-Title": "Puff AI"
      },
      body: JSON.stringify({
        // ✅ Use a valid free-tier OpenRouter model
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Puff AI — a soft, friendly assistant." },
          { role: "user", content: message }
        ]
      })
    });

    if (!response.ok) {
      console.error("❌ OpenRouter response not OK:", response.status, response.statusText);
      const errData = await response.json().catch(() => ({}));
      console.log("🔹 OpenRouter error response:", errData);
      return res.status(response.status).json({ reply: "Error from AI service." });
    }

    const data = await response.json();
    console.log("🔹 OpenRouter response:", JSON.stringify(data, null, 2));

    const reply = data?.choices?.[0]?.message?.content || "Puff is thinking too hard 💭✨";
    res.json({ reply });

  } catch (err) {
    console.error("❌ Backend Error:", err);
    res.status(500).json({ reply: "Network issue! Puff will try again soon 🌸" });
  }
});

// -------------------- SERVER --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Puff API backend running on port ${PORT}`));






