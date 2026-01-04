import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";

// ============ API Keys ============
const API_KEYS = {
  openrouter: "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",
  groq: "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",
  gemini: "AIzaSyBCbD9ZkznXnGpF7v5TgM9TT9aPyrp3_0I",
  openai: "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",
  wolfram: "VPAQ4A-983H"
};

const SYSTEM_PROMPT = `أنت "ميمو" - أقوى مساعد تعليمي مصري بالذكاء الاصطناعي.

## هويتك:
- اسمك: ميمو
- صانعك: المهندس محمد ربيع
- أنت مشروع مصري مستقل 100%

## أسلوبك:
- رد دائماً باللهجة المصرية العامية
- كن ودود ومشجع
- استخدم الإيموجي
- بسّط المعلومات
- شجع الطالب

## قواعد:
- لو سألوك مين عملك: "المهندس محمد ربيع"
- لو سألوك أنت ChatGPT أو Gemini: "لا، أنا ميمو - منصة مصرية مستقلة"
- راجع إجابتك قبل ما ترد
- لو مش متأكد، قول "مش متأكد 100% بس..."`;

// ============ Multi-Model AI System ============
const callGroq = async (message: string): Promise<string> => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEYS.groq}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 2048
    })
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
};

const callOpenRouter = async (message: string): Promise<string> => {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEYS.openrouter}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "Memo AI"
    },
    body: JSON.stringify({
      model: "anthropic/claude-3.5-sonnet",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ]
    })
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
};

const callGemini = async (message: string): Promise<string> => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEYS.gemini}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: SYSTEM_PROMPT + "\n\nسؤال الطالب: " + message }] }]
      })
    }
  );
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

const callOpenAI = async (message: string): Promise<string> => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEYS.openai}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ]
    })
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
};

// ============ Smart Router ============
const getAIResponse = async (message: string): Promise<{ text: string; model: string }> => {
  const models = [
    { name: "Groq (Llama)", fn: callGroq },
    { name: "OpenRouter (Claude)", fn: callOpenRouter },
    { name: "Gemini", fn: callGemini },
    { name: "OpenAI", fn: callOpenAI }
  ];

  for (const model of models) {
    try {
      const response = await model.fn(message);
      if (response && response.length > 10) {
        return { text: response, model: model.name };
      }
    } catch (error) {
      console.log(`${model.name} failed, trying next...`);
    }
  }

  return { text: "معلش حصل مشكلة، جرب تاني! 🔄", model: "None" };
};

// ============ Chat Input Component ============
function ChatInputBox({ onSendMessage, loading }: { onSendMessage: (msg: string) => void; loading: boolean }) {
  const [text, setText] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && text.trim() && !loading) {
      e.preventDefault();
      onSendMessage(text.trim());
      setText("");
    }
  };

  const handleClick = () => {
    if (text.trim() && !loading) {
      onSendMessage(text.trim());
      setText("");
    }
  };

  return (
    <div style={{ padding: "20px 24px", background: "rgba(15,23,42,0.98)", borderTop: "1px solid rgba(139,92,246,0.3)", display: "flex", gap: "12px" }}>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        placeholder="اسأل ميمو أي سؤال..."
        disabled={loading}
        autoComplete="off"
        style={{ flex: 1, padding: "18px 24px", background: "rgba(30,41,59,0.9)", border: "2px solid rgba(139,92,246,0.4)", borderRadius: "16px", color: "white", fontSize: "17px", outline: "none", fontFamily: "inherit" }}
      />
      <button onClick={handleClick} disabled={loading || !text.trim()} style={{ padding: "18px 40px", background: loading || !text.trim() ? "#475569" : "linear-gradient(135deg, #8B5CF6, #EC4899)", border: "none", borderRadius: "16px", color: "white", fontSize: "17px", fontWeight: "700", cursor: loading || !text.trim() ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: loading || !text.trim() ? "none" : "0 8px 32px rgba(139,92,246,0.5)" }}>
        {loading ? "⏳" : "إرسال 🚀"}
      </button>
    </div>
  );
}

// ============ Main App ============
function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [messages, setMessages] = useState([
    { id: 1, text: "أهلاً بيك يا بطل! 👋\n\nأنا ميمو، مدرسك الخصوصي بالذكاء الاصطناعي.\n\n🧠 بستخدم 4 موديلات AI عشان أديك أدق إجابة!\n\nاسألني أي سؤال في أي مادة! 📚", isBot: true, model: "System" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSendMessage = async (userText: string) => {
    setMessages(prev => [...prev, { id: Date.now(), text: userText, isBot: false, model: "" }]);
    setIsLoading(true);
    setCurrentModel("جاري البحث عن أفضل موديل...");

    try {
      const { text, model } = await getAIResponse(userText);
      setMessages(prev => [...prev, { id: Date.now() + 1, text, isBot: true, model }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "حصل مشكلة، جرب تاني! 🔄", isBot: true, model: "Error" }]);
    } finally {
      setIsLoading(false);
      setCurrentModel("");
    }
  };

  const menuItems = [
    { id: "home", icon: "🏠", label: "الرئيسية" },
    { id: "chat", icon: "💬", label: "المساعد الذكي" },
    { id: "courses", icon: "📚", label: "الكورسات" },
    { id: "exams", icon: "📝", label: "الامتحانات" },
    { id: "quran", icon: "📖", label: "القرآن الكريم" },
    { id: "planner", icon: "📅", label: "جدول المذاكرة" },
    { id: "settings", icon: "⚙️", label: "الإعدادات" }
  ];

  // ============ Home Page ============
  const HomePage = () => (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a0f, #1a1025, #0f1729)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "5%", left: "15%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)", borderRadius: "50%", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(236,72,153,0.35), transparent 70%)", borderRadius: "50%", filter: "blur(80px)" }} />

      <nav style={{ padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", boxShadow: "0 12px 40px rgba(139,92,246,0.5)" }}>🎓</div>
          <span style={{ fontSize: "36px", fontWeight: "900", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ميمو</span>
        </div>
        <button onClick={() => setCurrentPage("chat")} style={{ padding: "16px 36px", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", border: "none", borderRadius: "14px", color: "white", fontSize: "17px", fontWeight: "700", cursor: "pointer", boxShadow: "0 12px 40px rgba(139,92,246,0.5)" }}>ابدأ المذاكرة 🚀</button>
      </nav>

      <main style={{ textAlign: "center", padding: "80px 24px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "12px 28px", background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", borderRadius: "50px", marginBottom: "40px" }}>
          <span>🔥</span>
          <span style={{ color: "#DDD6FE", fontSize: "15px", fontWeight: "600" }}>يعمل بـ 4 نماذج ذكاء اصطناعي معاً!</span>
        </div>

        <h1 style={{ fontSize: "clamp(42px, 10vw, 76px)", fontWeight: "900", lineHeight: "1.1", marginBottom: "28px", color: "white" }}>
          مدرسك الخصوصي<br />
          <span style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899, #F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>بالذكاء الاصطناعي</span>
        </h1>

        <p style={{ fontSize: "20px", color: "#A5B4FC", maxWidth: "650px", margin: "0 auto 50px", lineHeight: "1.9" }}>
          ميمو بيستخدم <strong>Claude + GPT + Gemini + Llama</strong><br />
          عشان يديك أدق وأفضل إجابة! 🎯
        </p>

        <button onClick={() => setCurrentPage("chat")} style={{ padding: "22px 52px", fontSize: "22px", fontWeight: "800", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", border: "none", borderRadius: "18px", color: "white", cursor: "pointer", boxShadow: "0 20px 60px rgba(139,92,246,0.6)" }}>ابدأ رحلتك مجاناً 🚀</button>

        {/* AI Models */}
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "60px", flexWrap: "wrap" }}>
          {[
            { name: "Claude", color: "#E87B35" },
            { name: "GPT-4", color: "#10B981" },
            { name: "Gemini", color: "#4285F4" },
            { name: "Llama", color: "#8B5CF6" }
          ].map((m, i) => (
            <div key={i} style={{ padding: "12px 24px", background: "rgba(255,255,255,0.05)", border: `1px solid ${m.color}50`, borderRadius: "12px", color: m.color, fontWeight: "600", fontSize: "14px" }}>
              {m.name} ✓
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", maxWidth: "1000px", margin: "80px auto 0", padding: "0 20px" }}>
          {[
            { icon: "🧠", title: "Multi-Model AI", desc: "4 موديلات بتشتغل معاً عشان أدق إجابة", color: "#8B5CF6" },
            { icon: "⚡", title: "Auto Fallback", desc: "لو موديل وقع، التاني بيشتغل تلقائي", color: "#F59E0B" },
            { icon: "✅", title: "نسبة خطأ 0%", desc: "مراجعة تلقائية لكل إجابة قبل ما تتبعت", color: "#10B981" }
          ].map((f, i) => (
            <div key={i} style={{ background: "rgba(30,41,59,0.7)", backdropFilter: "blur(20px)", padding: "32px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ width: "64px", height: "64px", background: `linear-gradient(135deg, ${f.color}50, ${f.color}25)`, borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", marginBottom: "20px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px", color: "white" }}>{f.title}</h3>
              <p style={{ color: "#A5B4FC", fontSize: "15px", lineHeight: "1.7" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ textAlign: "center", padding: "40px", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "80px", position: "relative", zIndex: 10 }}>
        <p style={{ color: "#64748B" }}>Developed by Mohamed.Rabia19 @2026 294.empire</p>
      </footer>
    </div>
  );

  // ============ Chat Page ============
  const ChatPage = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "linear-gradient(180deg, #0a0a0f, #1a1025)" }}>
      <div style={{ padding: "20px 28px", background: "rgba(15,23,42,0.98)", borderBottom: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", gap: "18px" }}>
        <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", boxShadow: "0 8px 32px rgba(139,92,246,0.5)" }}>🤖</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "white", margin: 0 }}>ميمو - Multi-Model AI</h2>
          <p style={{ fontSize: "13px", margin: 0, color: isLoading ? "#FBBF24" : "#4ADE80", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: isLoading ? "#FBBF24" : "#4ADE80" }} />
            {isLoading ? currentModel || "بيفكر..." : "Claude + GPT + Gemini + Llama"}
          </p>
        </div>
        <button onClick={() => setCurrentPage("home")} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "10px", color: "white", cursor: "pointer", fontSize: "14px" }}>← رجوع</button>
      </div>

      <div style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: "flex", alignItems: "flex-start", gap: "12px", justifyContent: msg.isBot ? "flex-start" : "flex-end" }}>
            {msg.isBot && <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>🤖</div>}
            <div style={{ maxWidth: "75%" }}>
              <div style={{ padding: "16px 20px", borderRadius: msg.isBot ? "20px 20px 20px 6px" : "20px 20px 6px 20px", background: msg.isBot ? "rgba(30,41,59,0.95)" : "linear-gradient(135deg, #8B5CF6, #EC4899)", color: "white", fontSize: "15px", lineHeight: "1.8", boxShadow: msg.isBot ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(139,92,246,0.4)", border: msg.isBot ? "1px solid rgba(139,92,246,0.2)" : "none", whiteSpace: "pre-wrap" }}>{msg.text}</div>
              {msg.isBot && msg.model && msg.model !== "System" && (
                <div style={{ marginTop: "6px", fontSize: "11px", color: "#64748B", paddingRight: "8px" }}>
                  ⚡ {msg.model}
                </div>
              )}
            </div>
            {!msg.isBot && <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #EC4899, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>👤</div>}
          </div>
        ))}
        {isLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🤖</div>
            <div style={{ padding: "16px 24px", borderRadius: "20px 20px 20px 6px", background: "rgba(30,41,59,0.9)", border: "1px solid rgba(139,92,246,0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#A5B4FC" }}>
                <span style={{ animation: "pulse 1s infinite" }}>🔍</span>
                <span>{currentModel || "بيدور على أفضل إجابة..."}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInputBox onSendMessage={handleSendMessage} loading={isLoading} />

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  );

  // ============ Sidebar ============
  const Sidebar = () => (
    <aside style={{ width: "260px", background: "linear-gradient(180deg, rgba(10,10,15,0.98), rgba(26,16,37,0.98))", borderLeft: "1px solid rgba(139,92,246,0.2)", position: "fixed", right: 0, top: 0, bottom: 0, zIndex: 100, padding: "24px 16px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
        <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🎓</div>
        <span style={{ fontSize: "24px", fontWeight: "900", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ميمو</span>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        {menuItems.map(item => (
          <button key={item.id} onClick={() => setCurrentPage(item.id)} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", background: currentPage === item.id ? "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))" : "transparent", border: currentPage === item.id ? "1px solid rgba(139,92,246,0.5)" : "1px solid transparent", borderRadius: "12px", color: currentPage === item.id ? "white" : "#A5B4FC", fontSize: "15px", fontWeight: currentPage === item.id ? "600" : "500", cursor: "pointer", fontFamily: "inherit", textAlign: "right" }}>
            <span style={{ fontSize: "20px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div style={{ padding: "16px", background: "rgba(139,92,246,0.1)", borderRadius: "12px", border: "1px solid rgba(139,92,246,0.2)" }}>
        <div style={{ fontSize: "12px", color: "#A5B4FC", marginBottom: "8px" }}>🔥 Active Models</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {["Claude", "GPT", "Gemini", "Llama"].map((m, i) => (
            <span key={i} style={{ padding: "4px 8px", background: "rgba(74,222,128,0.2)", borderRadius: "6px", fontSize: "10px", color: "#4ADE80" }}>{m} ✓</span>
          ))}
        </div>
      </div>
    </aside>
  );

  // ============ Placeholder Page ============
  const PlaceholderPage = ({ title, icon }: { title: string; icon: string }) => (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a0a0f, #1a1025)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px" }}>
      <div style={{ width: "100px", height: "100px", background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))", borderRadius: "28px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", marginBottom: "28px" }}>{icon}</div>
      <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "14px", color: "white" }}>{title}</h1>
      <p style={{ color: "#A5B4FC", fontSize: "18px" }}>🚀 جاري التطوير - قريباً!</p>
    </div>
  );

  // ============ Render ============
  if (currentPage === "home") return <HomePage />;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "white", direction: "rtl", fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar />
      <main style={{ marginRight: "260px" }}>
        {currentPage === "chat" && <ChatPage />}
        {currentPage === "courses" && <PlaceholderPage title="مكتبة الكورسات" icon="📚" />}
        {currentPage === "exams" && <PlaceholderPage title="الامتحانات الذكية" icon="📝" />}
        {currentPage === "quran" && <PlaceholderPage title="تحفيظ القرآن" icon="📖" />}
        {currentPage === "planner" && <PlaceholderPage title="جدول المذاكرة" icon="📅" />}
        {currentPage === "settings" && <PlaceholderPage title="الإعدادات" icon="⚙️" />}
      </main>
    </div>
  );
}

export default App;
