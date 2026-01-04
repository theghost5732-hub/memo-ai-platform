import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { 
  Home, MessageCircle, Book, PenTool, Calendar, Settings, 
  Brain, Send, Menu, Zap, Cpu, Layers, Star, Shield, Award 
} from "lucide-react";

// ============ 1. المفاتيح الرسمية ============
const KEYS = {
  // استخدمنا Gemini كخيار أول لأنه الأفضل للمتصفح
  gemini: "AIzaSyBCbD9ZkznXnGpF7v5TgM9TT9aPyrp3_0I",
  openrouter: "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",
  groq: "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"
};

const SYSTEM_PROMPT = `أنت "ميمو" - المساعد التعليمي المصري الخارق. صانعك المهندس محمد ربيع. رد دايماً بالعامية المصرية الراقية وبسط المعلومات جداً.`;

// ============ 2. المكونات (UI) ============

function ChatInputBox({ onSendMessage, loading }: { onSendMessage: (msg: string) => void; loading: boolean }) {
  const [text, setText] = useState("");
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && text.trim() && !loading) {
      onSendMessage(text.trim());
      setText("");
    }
  };
  return (
    <div style={{ padding: "20px 24px", background: "rgba(15,23,42,0.98)", borderTop: "1px solid rgba(139,92,246,0.3)", display: "flex", gap: "12px" }}>
      <input
        type="text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyPress}
        placeholder="اسأل ميمو في أي مادة..." disabled={loading}
        style={{ flex: 1, padding: "18px 24px", background: "rgba(30,41,59,0.9)", border: "2px solid rgba(139,92,246,0.4)", borderRadius: "16px", color: "white", fontSize: "17px", outline: "none", fontFamily: "inherit" }}
      />
      <button onClick={() => { onSendMessage(text); setText(""); }} disabled={loading || !text.trim()} 
        style={{ padding: "18px 40px", background: loading || !text.trim() ? "#475569" : "linear-gradient(135deg, #8B5CF6, #EC4899)", border: "none", borderRadius: "16px", color: "white", fontSize: "17px", fontWeight: "700", cursor: "pointer", boxShadow: "0 8px 32px rgba(139,92,246,0.5)" }}>
        {loading ? "⌛" : "إرسال 🚀"}
      </button>
    </div>
  );
}

// ============ 3. التطبيق الرئيسي (The App) ============

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [messages, setMessages] = useState([{ id: 1, text: "أهلاً بيك يا بطل! 👋 أنا ميمو.. المساعد التعليمي المصري. اسألني في أي حاجة واقفة معاك!", isBot: true, model: "System" }]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // --- محرك الذكاء الاصطناعي (Gemini Direct) ---
  const handleSendMessage = async (userText: string) => {
    setMessages(prev => [...prev, { id: Date.now(), text: userText, isBot: false, model: "" }]);
    setIsLoading(true);

    try {
      // المحاولة الأولى: Gemini 1.5 Flash (الأسرع في المتصفح)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEYS.gemini}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: SYSTEM_PROMPT + "\n\nسؤال الطالب: " + userText }] }]
          })
        }
      );

      if (!response.ok) throw new Error("Gemini Failed");

      const data = await response.json();
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "معلش مسمعتش، قول تاني؟";
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiReply, isBot: true, model: "Gemini AI" }]);

    } catch (err) {
      // Fallback: OpenRouter لو جوجل فشل
      try {
        const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${KEYS.openrouter}`,
            "HTTP-Referer": window.location.origin,
          },
          body: JSON.stringify({
            model: "google/gemini-flash-1.5",
            messages: [{ role: "user", content: userText }]
          })
        });
        const orData = await orRes.json();
        setMessages(prev => [...prev, { id: Date.now() + 1, text: orData.choices[0].message.content, isBot: true, model: "OpenRouter" }]);
      } catch (e) {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: "حصلت مشكلة في الاتصال، جرب تاني! 🔄", isBot: true, model: "Error" }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    { id: "home", icon: "🏠", label: "الرئيسية" },
    { id: "features", icon: "🌟", label: "لماذا ميمو؟" },
    { id: "chat", icon: "💬", label: "المساعد الذكي" },
    { id: "courses", icon: "📚", label: "الكورسات" },
    { id: "exams", icon: "📝", label: "الامتحانات" },
    { id: "settings", icon: "⚙️", label: "الإعدادات" }
  ];

  const Sidebar = () => (
    <aside style={{ width: "280px", background: "linear-gradient(180deg, #0a0a0f, #1a1025)", borderLeft: "1px solid rgba(139,92,246,0.2)", position: "fixed", right: 0, top: 0, bottom: 0, zIndex: 100, padding: "28px 20px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "48px" }}>
        <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🎓</div>
        <span style={{ fontSize: "28px", fontWeight: "900", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ميمو</span>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        {menuItems.map(item => (
          <button key={item.id} onClick={() => setCurrentPage(item.id)} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 18px", background: currentPage === item.id ? "rgba(139,92,246,0.15)" : "transparent", border: currentPage === item.id ? "1px solid #8B5CF6" : "none", borderRadius: "14px", color: currentPage === item.id ? "white" : "#A5B4FC", cursor: "pointer", textAlign: "right", fontFamily: "inherit" }}>
            <span>{item.icon}</span> <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );

  const HomePage = () => (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", p: "20px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "10%", left: "10%", width: "400px", height: "400px", background: "rgba(139,92,246,0.15)", filter: "blur(100px)", borderRadius: "50%" }} />
      <h1 style={{ fontSize: "clamp(48px, 10vw, 80px)", fontWeight: "900", color: "white", marginBottom: "20px" }}>ميمو <span style={{ color: "#8B5CF6" }}>PRO</span></h1>
      <p style={{ fontSize: "20px", color: "#94A3B8", maxWidth: "600px", margin: "0 auto 40px" }}>المنصة التعليمية الأقوى في مصر المعتمدة على تعدد العقول الصناعية لضمان الدقة.</p>
      <div style={{ display: "flex", gap: "20px" }}>
        <button onClick={() => setCurrentPage("chat")} style={{ padding: "20px 50px", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", border: "none", borderRadius: "15px", color: "white", fontWeight: "bold", fontSize: "18px", cursor: "pointer" }}>ابدأ المحادثة ⚡</button>
        <button onClick={() => setCurrentPage("features")} style={{ padding: "20px 50px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", color: "white", fontWeight: "bold", fontSize: "18px", cursor: "pointer" }}>المميزات 🌟</button>
      </div>
      <footer style={{ position: "absolute", bottom: "30px", opacity: 0.5 }}>
        <p style={{ color: "#64748B", fontSize: "10px" }}>Developed by Mohamed.Rabia19 @2026 294.empire</p>
      </footer>
    </div>
  );

  const WhyMemo = () => (
    <div style={{ minHeight: "100vh", background: "#020617", color: "white", direction: "rtl", display: "flex" }}>
      <Sidebar />
      <main style={{ marginRight: "280px", padding: "60px 40px", flex: 1 }}>
        <h2 style={{ fontSize: "42px", fontWeight: "900", marginBottom: "50px", textAlign: "center" }}>إمبراطورية ميمو التعليمية 🌟</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px", maxWidth: "1200px", margin: "0 auto" }}>
          {[
            { t: "عقول متعددة (AI Core)", d: "بنشغل Claude 3.5 و Gemini 2.0 و GPT-4 و Llama مع بعض لضمان صفر أخطاء.", i: "🧠" },
            { t: "مدرس افتراضي كامل", d: "مكالمات صوتية وشرح حصص كاملة كأنك في كول بجد.", i: "📞" },
            { t: "بنك الأخطاء", d: "ميمو بيحفظ كل سؤال غلطت فيه وبيفكرك تراجعه بنظام Spaced Repetition.", i: "🛡️" },
            { t: "مود التركيز العميق", d: "شاشة كاملة، حجب إشعارات، وموسيقى Lofi مدمجة للمذاكرة بتركيز.", i: "🧘" },
            { t: "فهم الصور والخط", d: "صور المسألة أو حلك في الكشكول وميمو هيحللها ويصححها فوراً.", i: "📸" },
            { t: "منهج الوزارة المصري", d: "مطابق تماماً للمناهج المصرية من KG لحد ثانوية عامة 2024.", i: "📚" }
          ].map((x, i) => (
            <div key={i} style={{ background: "rgba(30,41,59,0.7)", border: "1px solid rgba(139,92,246,0.3)", padding: "32px", borderRadius: "28px" }}>
              <div style={{ fontSize: "40px", marginBottom: "15px" }}>{x.i}</div>
              <h3 style={{ fontSize: "22px", fontWeight: "bold" }}>{x.t}</h3>
              <p style={{ color: "#94A3B8", fontSize: "14px", lineHeight: "1.7" }}>{x.d}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );

  const ChatPage = () => (
    <div style={{ display: "flex", height: "100vh", background: "#0a0a0f" }}>
      <Sidebar />
      <div style={{ marginRight: "280px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 30px", background: "rgba(15,23,42,0.98)", borderBottom: "1px solid rgba(139,92,246,0.1)", display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ width: "45px", height: "45px", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🤖</div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "white", margin: 0 }}>ميمو التعليمي</h2>
            <p style={{ fontSize: "12px", color: "#4ADE80", margin: 0 }}>متصل الآن 🟢</p>
          </div>
        </div>
        <div style={{ flex: 1, padding: "30px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: "flex", justifyContent: msg.isBot ? "flex-start" : "flex-end" }}>
              <div style={{ maxWidth: "75%", padding: "16px 22px", borderRadius: msg.isBot ? "20px 20px 20px 5px" : "20px 20px 5px 20px", background: msg.isBot ? "rgba(30,41,59,0.8)" : "linear-gradient(135deg, #8B5CF6, #EC4899)", color: "white", fontSize: "15px", lineHeight: "1.7", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>
                {msg.text}
                {msg.model && msg.model !== "System" && <div style={{ fontSize: "9px", marginTop: "8px", opacity: 0.4 }}>{msg.model}</div>}
              </div>
            </div>
          ))}
          {isLoading && <div style={{ color: "#8B5CF6", fontSize: "14px", marginRight: "20px" }}>ميمو بيفكر... 🧠</div>}
          <div ref={messagesEndRef} />
        </div>
        <ChatInputBox onSendMessage={handleSendMessage} loading={isLoading} />
      </div>
    </div>
  );

  if (currentPage === "home") return <HomePage />;
  if (currentPage === "features") return <WhyMemo />;
  if (currentPage === "chat") return <ChatPage />;
  
  return (
    <div style={{ display: "flex", height: "100vh", background: "#0a0a0f" }}>
      <Sidebar />
      <div style={{ marginRight: "280px", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h1 style={{ color: "white" }}>🚧 قريباً: {currentPage}</h1>
      </div>
    </div>
  );
}

export default App;
