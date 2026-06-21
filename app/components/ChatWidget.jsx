"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the LeadMagnet assistant. Ask me anything about pricing, features, or how it works!",
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

    const userMessage = { role: "user", content: input.trim() };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong. Email us at support@leadmagnetinc.com",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How much does it cost?",
    "How does Gmail work?",
    "Is it safe for LinkedIn?",
  ];

  return (
    <>
      <style>{`
        .chat-bubble {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 1000;
          width: 58px;
          height: 58px;
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 18px 44px rgba(23,56,56,0.16);
          transition: all 0.2s ease;
          color: #ff7f67;
        }

        .chat-bubble:hover {
          transform: translateY(-2px) scale(1.04);
          border-color: rgba(255,127,103,0.28);
          box-shadow: 0 22px 56px rgba(255,127,103,0.18);
        }

        .chat-bubble.open {
          background: #ff7f67;
          color: #173838;
          border-color: #ff7f67;
        }

        .chat-bubble svg {
          width: 24px;
          height: 24px;
        }

        .chat-window {
          position: fixed;
          bottom: 5.5rem;
          right: 1.5rem;
          z-index: 999;
          width: 390px;
          max-width: calc(100vw - 2rem);
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          border-radius: 24px;
          box-shadow: 0 30px 90px rgba(23,56,56,0.20);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.2s ease;
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chat-header {
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          padding: 1rem 1.15rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(23,56,56,0.08);
        }

        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .chat-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: conic-gradient(from -12deg,#ff7f67 0 44%,transparent 44% 51%,#8fc8c1 51% 86%,transparent 86% 100%);
          position: relative;
          flex: 0 0 auto;
        }

        .chat-avatar:after {
          content: "";
          position: absolute;
          inset: 10px;
          border-radius: 50%;
          background: #ffffff;
        }

        .chat-name {
          font-size: 0.94rem;
          font-weight: 900;
          color: #173838;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .chat-status {
          font-size: 0.74rem;
          color: #2f625d;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 0.2rem;
          font-weight: 800;
        }

        .chat-status-dot {
          width: 7px;
          height: 7px;
          background: #8fc8c1;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(143,200,193,0.18);
        }

        .chat-close {
          width: 34px;
          height: 34px;
          background: #FBF3E3;
          border: 1px solid rgba(23,56,56,0.08);
          color: #5f7774;
          cursor: pointer;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .chat-close:hover {
          color: #ff7f67;
          border-color: rgba(255,127,103,0.24);
          background: rgba(255,127,103,0.08);
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 340px;
          min-height: 240px;
          background: #FBF3E3;
        }

        .chat-messages::-webkit-scrollbar {
          width: 4px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(23,56,56,0.14);
          border-radius: 2px;
        }

        .msg {
          max-width: 86%;
          padding: 0.72rem 0.9rem;
          border-radius: 16px;
          font-size: 0.86rem;
          line-height: 1.55;
          white-space: pre-wrap;
        }

        .msg.assistant {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          color: #173838;
          align-self: flex-start;
          border-radius: 6px 16px 16px 16px;
          box-shadow: 0 10px 24px rgba(23,56,56,0.05);
        }

        .msg.user {
          background: #ff7f67;
          color: #173838;
          align-self: flex-end;
          font-weight: 800;
          border-radius: 16px 6px 16px 16px;
          box-shadow: 0 10px 24px rgba(255,127,103,0.18);
        }

        .msg.loading {
          color: #819693;
          font-style: italic;
        }

        .quick-questions {
          padding: 0.85rem 1rem 0.7rem;
          display: flex;
          gap: 0.45rem;
          flex-wrap: wrap;
          background: #FBF3E3;
          border-top: 1px solid rgba(23,56,56,0.06);
        }

        .quick-btn {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          color: #2f625d;
          font-size: 0.74rem;
          padding: 0.38rem 0.72rem;
          border-radius: 100px;
          cursor: pointer;
          font-family: 'Inter', system-ui, sans-serif;
          transition: all 0.15s ease;
          white-space: nowrap;
          font-weight: 800;
        }

        .quick-btn:hover {
          background: rgba(255,127,103,0.08);
          border-color: rgba(255,127,103,0.24);
          color: #ff7f67;
        }

        .chat-input-row {
          padding: 0.95rem 1rem;
          border-top: 1px solid rgba(23,56,56,0.08);
          display: flex;
          gap: 0.55rem;
          align-items: center;
          background: #ffffff;
        }

        .chat-input {
          flex: 1;
          background: #FBF3E3;
          border: 1px solid rgba(23,56,56,0.10);
          border-radius: 13px;
          padding: 0.72rem 0.9rem;
          color: #173838;
          font-size: 0.86rem;
          outline: none;
          font-family: 'Inter', system-ui, sans-serif;
          transition: all 0.15s ease;
        }

        .chat-input:focus {
          border-color: rgba(255,127,103,0.38);
          box-shadow: 0 0 0 4px rgba(255,127,103,0.08);
        }

        .chat-input::placeholder {
          color: #819693;
        }

        .chat-send {
          width: 42px;
          height: 42px;
          background: #ff7f67;
          color: #173838;
          border: none;
          border-radius: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s ease;
          font-weight: 900;
        }

        .chat-send:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 22px rgba(255,127,103,0.22);
        }

        .chat-send:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .chat-footer {
          padding: 0.65rem 1rem;
          text-align: center;
          font-size: 0.7rem;
          color: #819693;
          border-top: 1px solid rgba(23,56,56,0.08);
          background: #ffffff;
          font-weight: 700;
        }

        .chat-footer a {
          color: #ff7f67;
          text-decoration: none;
          font-weight: 900;
        }

        @media(max-width: 520px) {
          .chat-window {
            right: 1rem;
            bottom: 5rem;
            width: calc(100vw - 2rem);
            border-radius: 20px;
          }

          .chat-bubble {
            right: 1rem;
            bottom: 1rem;
          }
        }
      `}</style>

      <button
        className={`chat-bubble ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Open chat"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
            <path d="M8 10h8" />
            <path d="M8 14h5" />
          </svg>
        )}
      </button>

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-avatar" />

              <div>
                <div className="chat-name">LeadMagnet Assistant</div>
                <div className="chat-status">
                  <span className="chat-status-dot" />
                  Online now
                </div>
              </div>
            </div>

            <button className="chat-close" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                {m.content}
              </div>
            ))}

            {loading && <div className="msg assistant loading">Typing...</div>}

            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="quick-questions">
              {quickQuestions.map(q => (
                <button
                  key={q}
                  className="quick-btn"
                  onClick={() => {
                    setInput(q);
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
            />

            <button className="chat-send" onClick={sendMessage} disabled={loading || !input.trim()}>
              →
            </button>
          </div>

          <div className="chat-footer">
            Powered by LeadMagnet · <a href="/signup">Start free trial →</a>
          </div>
        </div>
      )}
    </>
  );
}