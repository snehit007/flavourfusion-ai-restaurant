
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const headers = {
  Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
  "Content-Type": "application/json"
};

/* ---------- CHATBOT API ---------- */
app.post("/api/chat", async (req, res) => {
  const userQuestion = req.body.question;

  try {
    const response = await axios.post(
      GROQ_URL,
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant for FlavourFusion restaurant. Answer politely about menu, timings, offers, vegetarian and vegan options."
          },
          { role: "user", content: userQuestion }
        ]
      },
      { headers }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ reply: "AI service unavailable." });
  }
});

/* ---------- TODAY'S SPECIAL API ---------- */
app.get("/api/special", async (req, res) => {
  try {
    const response = await axios.post(
      GROQ_URL,
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "Suggest one creative restaurant dish as Today's Special with a short description."
          }
        ]
      },
      { headers }
    );

    res.json({ special: response.data.choices[0].message.content });
  } catch {
    res.json({ special: "Chef’s Special Pasta 🍝" });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);