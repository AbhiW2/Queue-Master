import { useState, useRef, useEffect } from "react";

const ChatBot = () => {
  // ── Role check — only show for USER ──────────────────
  const role = localStorage.getItem("role");
  const isUser = role === "USER" || role === "ROLE_USER";
  if (!isUser) return null;
  // ─────────────────────────────────────────────────────

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm your Queue Master assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply || "Sorry, I could not understand that." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "#4F46E5",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "24px",
            width: "350px",
            height: "480px",
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#4F46E5",
              color: "white",
              padding: "16px",
              fontWeight: "bold",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            🤖 Queue Master Assistant
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              backgroundColor: "#F9FAFB",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "10px 14px",
                    borderRadius:
                      msg.role === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    backgroundColor:
                      msg.role === "user" ? "#4F46E5" : "#ffffff",
                    color: msg.role === "user" ? "white" : "#1F2937",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "10px 14px",
                    borderRadius: "16px 16px 16px 4px",
                    fontSize: "14px",
                    color: "#6B7280",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "12px",
              borderTop: "1px solid #E5E7EB",
              display: "flex",
              gap: "8px",
              backgroundColor: "#fff",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "24px",
                border: "1px solid #D1D5DB",
                outline: "none",
                fontSize: "14px",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                backgroundColor: "#4F46E5",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;