import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";

function ChatInputBox({ onSendMessage, loading }: { onSendMessage: (msg: string) => void; loading: boolean }) {
  const [text, setText] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

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
        placeholder="اكتب سؤالك هنا..."
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

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [messages, setMessages] = useState([{ id: 1, text: "أهلاً بيك يا بطل! 👋 أنا ميمو، مدرسك الخصوصي. اسألني أي سؤال!", isBot: true }]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSendMessage = async (userText: string) => {
    setMessages(prev => [...prev, { id: Date.now(), text: userText, isBot: false }]);
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB5I43bwlrU7sC1jYaL3R4EQhMGourYQrE",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `أنت "ميمو" مدرس مصري ودود. رد باللهجة المصرية. لو سألوك مين عملك قول المهندس محمد ربيع. السؤال: ${userText}` }] }]
          })
        }
      );

      const data = await response.json();
      const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "معلش مفهمتش، قولها تاني؟";
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiReply, isBot: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "حصل مشكلة، جرب تاني! 🔄", isBot: true }]);
    } finally {
      setIsLoading(false);
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

      <main style={{ textAlign: "center", padding: "100px 24px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "12px 28px", background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", borderRadius: "50px", marginBottom: "40px" }}>
          <span>✨</span>
          <span style={{ color: "#DDD6FE", fontSize: "15px", fontWeight: "600" }}>أول منصة تعليمية بالذكاء الاصطناعي في مصر 🇪🇬</span>
        </div>

        <h1 style={{ fontSize: "clamp(48px, 10vw, 80px)", fontWeight: "900", lineHeight: "1.1", marginBottom: "28px", color: "white" }}>
          مدرسك الخصوصي<br />
          <span style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899, #F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>بالذكاء الاصطناعي</span>
        </h1>

        <p style={{ fontSize: "22px", color: "#A5B4FC", maxWidth: "650px", margin: "0 auto 56px", lineHeight: "1.9" }}>
          ميمو بيفهمك، بيشرحلك بالمصري، وبيساعدك تجيب أعلى الدرجات!<br />
          <strong style={{ color: "#C4B5FD" }}>متاح 24 ساعة × 7 أيام مجاناً! 🎉</strong>
        </p>

        <button onClick={() => setCurrentPage("chat")} style={{ padding: "24px 56px", fontSize: "24px", fontWeight: "800", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", border: "none", borderRadius: "20px", color: "white", cursor: "pointer", boxShadow: "0 20px 60px rgba(139,92,246,0.6)" }}>ابدأ رحلتك مجاناً 🚀</button>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px", maxWidth: "1100px", margin: "100px auto 0", padding: "0 20px" }}>
          {[
            { icon: "🧠", title: "ذكاء اصطناعي فائق", desc: "بيفهم العامية ويرد زي المدرس بالظبط!", color: "#8B5CF6" },
            { icon: "📚", title: "المنهج المصري كامل", desc: "من KG لثانوية عامة، كل المواد متاحة.", color: "#3B82F6" },
            { icon: "🎯", title: "امتحانات ذكية", desc: "بيعملك امتحانات ويصححها فوراً!", color: "#10B981" }
          ].map((f, i) => (
            <div key={i} style={{ background: "rgba(30,41,59,0.7)", backdropFilter: "blur(20px)", padding: "36px", borderRadius: "28px", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ width: "72px", height: "72px", background: `linear-gradient(135deg, ${f.color}50, ${f.color}25)`, borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", marginBottom: "24px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "14px", color: "white" }}>{f.title}</h3>
              <p style={{ color: "#A5B4FC", fontSize: "16px", lineHeight: "1.8" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ textAlign: "center", padding: "40px", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "100px", position: "relative", zIndex: 10 }}>
        <p style={{ color: "#64748B" }}>Developed by Mohamed.Rabia19 @2026 294.empire</p>
      </footer>
    </div>
  );

  const ChatPage = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "linear-gradient(180deg, #0a0a0f, #1a1025)" }}>
      <div style={{ padding: "24px 28px", background: "rgba(15,23,42,0.98)", borderBottom: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", gap: "18px" }}>
        <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", boxShadow: "0 8px 32px rgba(139,92,246,0.5)" }}>🤖</div>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "white", margin: 0 }}>ميمو</h2>
          <p style={{ fontSize: "14px", margin: 0, color: isLoading ? "#FBBF24" : "#4ADE80", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: isLoading ? "#FBBF24" : "#4ADE80" }} />
            {isLoading ? "بيفكر... 🤔" : "متصل ومستنيك! 💚"}
          </p>
        </div>
        <button onClick={() => setCurrentPage("home")} style={{ marginRight: "auto", padding: "10px 20px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "10px", color: "white", cursor: "pointer" }}>← رجوع</button>
      </div>

      <div style={{ flex: 1, padding: "28px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: "flex", alignItems: "flex-start", gap: "14px", justifyContent: msg.isBot ? "flex-start" : "flex-end" }}>
            {msg.isBot && <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>🤖</div>}
            <div style={{ maxWidth: "75%", padding: "18px 24px", borderRadius: msg.isBot ? "24px 24px 24px 6px" : "24px 24px 6px 24px", background: msg.isBot ? "rgba(30,41,59,0.95)" : "linear-gradient(135deg, #8B5CF6, #EC4899)", color: "white", fontSize: "16px", lineHeight: "1.9", boxShadow: msg.isBot ? "0 6px 24px rgba(0,0,0,0.3)" : "0 6px 24px rgba(139,92,246,0.4)", border: msg.isBot ? "1px solid rgba(139,92,246,0.2)" : "none", whiteSpace: "pre-wrap" }}>{msg.text}</div>
            {!msg.isBot && <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #EC4899, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>👤</div>}
          </div>
        ))}
        {isLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🤖</div>
            <div style={{ padding: "18px 28px", borderRadius: "24px 24px 24px 6px", background: "rgba(30,41,59,0.9)", border: "1px solid rgba(139,92,246,0.2)", color: "#A5B4FC" }}>ميمو بيفكر... 💭</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInputBox onSendMessage={handleSendMessage} loading={isLoading} />
    </div>
  );

  const Sidebar = () => (
    <aside style={{ width: "280px", background: "linear-gradient(180deg, rgba(10,10,15,0.98), rgba(26,16,37,0.98))", borderLeft: "1px solid rgba(139,92,246,0.2)", position: "fixed", right: 0, top: 0, bottom: 0, zIndex: 100, padding: "28px 20px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "48px" }}>
        <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🎓</div>
        <span style={{ fontSize: "28px", fontWeight: "900", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ميمو</span>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        {menuItems.map(item => (
          <button key={item.id} onClick={() => setCurrentPage(item.id)} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 18px", background: currentPage === item.id ? "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))" : "transparent", border: currentPage === item.id ? "2px solid rgba(139,92,246,0.5)" : "2px solid transparent", borderRadius: "14px", color: currentPage === item.id ? "white" : "#A5B4FC", fontSize: "16px", fontWeight: currentPage === item.id ? "700" : "500", cursor: "pointer", fontFamily: "inherit", textAlign: "right" }}>
            <span style={{ fontSize: "22px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );

  const PlaceholderPage = ({ title, icon }: { title: string; icon: string }) => (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a0a0f, #1a1025)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px" }}>
      <div style={{ width: "120px", height: "120px", background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))", borderRadius: "32px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "56px", marginBottom: "32px" }}>{icon}</div>
      <h1 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "16px", color: "white" }}>{title}</h1>
      <p style={{ color: "#A5B4FC", fontSize: "20px" }}>🚀 جاري التطوير - قريباً!</p>
    </div>
  );

  if (currentPage === "home") return <HomePage />;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "white", direction: "rtl", fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar />
      <main style={{ marginRight: "280px" }}>
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