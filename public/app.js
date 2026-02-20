const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");
const specialText = document.getElementById("specialText");
const sendBtn = document.getElementById("sendBtn");

/* --- Fetch Today's Special --- */
async function fetchSpecial() {
  try {
    const res = await fetch("/api/special");
    const data = await res.json();
    specialText.innerText = data.special || "Check out our amazing dishes today!";
  } catch (error) {
    console.error("Error fetching special:", error);
    specialText.innerText = "Our chefs are still deciding on today's special! Ask the bot for recommendations.";
  }
}

// Load special when the page loads
fetchSpecial();

/* --- Chatbot Helper: Append Messages to UI --- */
function addMessage(text, senderType) {
  // Create the message container
  const msgDiv = document.createElement("div");
  
  // Apply the CSS classes we defined in style.css (e.g., "message" and "user" or "bot")
  msgDiv.classList.add("message", senderType);
  msgDiv.innerText = text;
  
  // Add to chat body and scroll to the newest message
  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

/* --- Handle Sending the Message --- */
async function handleSendMessage() {
  const question = chatInput.value.trim();
  
  // Prevent sending empty messages
  if (!question) return; 

  // 1. Display the User's Message
  addMessage(question, "user");
  chatInput.value = ""; // Clear input field

  try {
    // 2. Fetch AI Response from your backend
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    
    // 3. Display the AI's Message
    addMessage(data.reply || "Sorry, I couldn't process that. Could you rephrase?", "bot");

  } catch (error) {
    console.error("Chat API Error:", error);
    addMessage("Oops! I'm having trouble connecting to the kitchen right now. Try again in a moment.", "bot");
  }
}

/* --- Event Listeners --- */

// Trigger when pressing "Enter" in the input field
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSendMessage();
  }
});

// Trigger when clicking the newly designed Send button
sendBtn.addEventListener("click", handleSendMessage);