"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! 👋 I'm the LeadMagnet assistant. Ask me anything about pricing, features, or how it works!" }
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
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Email us at support@leadmagnetinc.com" }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const quickQuestions = [
    "How much does it cost?",
    "How does Gmail work?",
    "Is it safe for LinkedIn?",
  ];

  return (
    <>
      <style>{`
        .chat-bubble{position:fixed;bottom:1.5rem;right:1.5rem;z-index:1000;width:52px;height:52px;background:#22c97a;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 20px rgba(34,201,122,0.35);border:none;transition:all 0.2s;font-size:1.3rem;}
        .chat-bubble:hover{transform:scale(1.08);background:#1db36c;}
        .chat-bubble.open{background:#0f1a11;border:1px solid rgba(34,201,122,0.3);}
        .chat-window{position:fixed;bottom:5rem;right:1.5rem;z-index:999;width:340px;max-width:calc(100vw - 2rem);background:#0f1a11;border:1px solid rgba(255,255,255,0.08);border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,0.5);display:flex;flex-direction:column;overflow:hidden;animation:slideUp 0.2s ease;}
        @keyframes slideUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        .chat-header{background:#080c09;padding:1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.06);}
        .chat-header-left{display:flex;align-items:center;gap:0.625rem;}
        .chat-avatar{width:32px;height:32px;background:rgba(34,201,122,0.1);border:1px solid rgba(34,201,122,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.875rem;}
        .chat-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.875rem;font-weight:700;color:#e2ede7;}
        .chat-status{font-size:0.68rem;color:#22c97a;display:flex;align-items:center;gap:0.3rem;}
        .chat-status-dot{width:5px;height:5px;background:#22c97a;border-radius:50%;}
        .chat-close{background:transparent;border:none;color:#3d5240;cursor:pointer;font-size:1.1rem;padding:0.2rem;transition:color 0.15s;}
        .chat-close:hover{color:#94a3b8;}
        .chat-messages{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:0.75rem;max-height:320px;min-height:200px;}
        .chat-messages::-webkit-scrollbar{width:4px;}
        .chat-messages::-webkit-scrollbar-track{background:transparent;}
        .chat-messages::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px;}
        .msg{max-width:85%;padding:0.625rem 0.875rem;border-radius:12px;font-size:0.845rem;line-height:1.5;}
        .msg.assistant{background:#080c09;border:1px solid rgba(255,255,255,0.06);color:#c4d4c8;align-self:flex-start;border-radius:4px 12px 12px 12px;}
        .msg.user{background:#22c97a;color:#071209;align-self:flex-end;font-weight:500;border-radius:12px 4px 12px 12px;}
        .msg.loading{color:#3d5240;font-style:italic;}
        .quick-questions{padding:0 1rem 0.75rem;display:flex;gap:0.4rem;flex-wrap:wrap;}
        .quick-btn{background:transparent;border:1px solid rgba(34,201,122,0.2);color:#22c97a;font-size:0.72rem;padding:0.3rem 0.625rem;border-radius:100px;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;white-space:nowrap;}
        .quick-btn:hover{background:rgba(34,201,122,0.08);}
        .chat-input-row{padding:0.875rem 1rem;border-top:1px solid rgba(255,255,255,0.06);display:flex;gap:0.5rem;align-items:center;}
        .chat-input{flex:1;background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.6rem 0.875rem;color:#e2ede7;font-size:0.845rem;outline:none;font-family:'Inter',sans-serif;transition:border-color 0.15s;resize:none;}
        .chat-input:focus{border-color:rgba(34,201,122,0.35);}
        .chat-input::placeholder{color:#2a3d2e;}
        .chat-send{width:34px;height:34px;background:#22c97a;border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.875rem;flex-shrink:0;transition:all 0.15s;}
        .chat-send:hover{background:#1db36c;}
        .chat-send:disabled{opacity:0.4;cursor:not-allowed;}
        .chat-footer{padding:0.5rem 1rem;text-align:center;font-size:0.68rem;color:#1e2b20;border-top:1px solid rgba(255,255,255,0.04);}
        .chat-footer a{color:#2d4a33;text-decoration:none;}
      `}</style>

      {/* Floating bubble */}
      <button className={`chat-bubble ${open ? "open" : ""}`} onClick={() => setOpen(!open)} aria-label="Open chat">
        {open ? "✕" : "💬"}
      </button>

      {/* Chat window */}
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-avatar">⚡</div>
              <div>
                <div className="chat-name">LeadMagnet Assistant</div>
                <div className="chat-status"><span className="chat-status-dot" />Online now</div>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>{m.content}</div>
            ))}
            {loading && <div className="msg assistant loading">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="quick-questions">
              {quickQuestions.map(q => (
                <button key={q} className="quick-btn" onClick={() => { setInput(q); }}>
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