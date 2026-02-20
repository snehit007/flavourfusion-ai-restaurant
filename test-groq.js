import axios from "axios";

const response = await axios.post(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: "Say hello" }]
  },
  {
    headers: {
      Authorization: `Bearer YOUR_API_KEY`,
      "Content-Type": "application/json"
    }
  }
);

console.log(response.data.choices[0].message.content);