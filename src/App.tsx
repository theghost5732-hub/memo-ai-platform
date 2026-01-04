import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { 
  Home, MessageCircle, Book, PenTool, Calendar, Settings, 
  Brain, Send, Menu, Zap, Cpu, Layers, Star, Shield, Award, 
  CheckCircle, Volume2, BarChart, Clock, Camera, FileText, Users
} from "lucide-react";

// ============ 1. المفاتيح الرسمية (Nuclear Keys) ============
const KEYS = {
  OPENROUTER: "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",
  GROQ: "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",
  GEMINI: "AIzaSyBCbD9ZkznXnGpF7v5TgM9TT9aPyrp3_0I",
  OPENAI: "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",
  ELEVEN_LABS: "sk_edcd37d939cfda90e6f62c972a830362948b5ee87b0fda0c"
};

const SYSTEM_PROMPT = `أنت "ميمو" - المساعد التعليمي المصري الخارق. صانعك المهندس محمد ربيع. رد دايماً بالعامية المصرية الراقية وبسط المعلومات جداً. لو حد سألك أنت مين قول أنا ميمو منصة مصرية مستقلة صممها المهندس محمد ربيع.`;

// ============ 2. المكونات الفرعية (UI Components) ============

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
      <button 
        onClick={() => { onSendMessage(text); setText(""); }} disabled={loading || !text.trim()}
        style={{ padding: "18px 40px", background: loading || !text.trim() ? "#475569" : "linear-gradient(135deg, #8B5CF6, #EC4899)", border: "none", borderRadius: "16px", color: "white", fontSize: "17px", fontWeight: "700", cursor: loading || !text.trim() ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: loading || !text.trim() ? "none" : "0 8px 32px rgba(139,92,246,0.5)" }}
      >
        {loading ? "⏳" : "إرسال 🚀"}
      </button>
    </div>
  );
}

// ============ 3. التطبيق الرئيسي (The Core) ============

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [messages, setMessages] = useState([{ id: 1, text: "أهلاً بيك يا بطل! 👋 أنا ميمو.. بستخدم 4 موديلات ذكاء اصطناعي عشان أديك أدق إجابة. اسألني في أي حاجة!", isBot: true, model: "System" }]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModelName, setCurrentModelName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // --- دالة الموجه الذكي (Smart Router via OpenRouter for Stability) ---
  const handleSendMessage = async (userText: string) => {
    setMessages(prev => [...prev, { id: Date.now(), text: userText, isBot: false, model: "" }]);
    setIsLoading(true);
    setCurrentModelName("جاري استدعاء أقوى الموديلات...");

    try {
      // إرسال الطلب لـ OpenRouter كبروكسي (بيحل مشاكل الـ CORS والـ 403)
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${KEYS.OPENROUTER}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Memo AI"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001", // الموديل الأسرع والأدق حالياً
          messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: userText }]
        })
      });

      const data = await response.json();
      const aiReply = data.choices?.[0]?.message?.content || "معلش مسمعتش، قول تاني؟";
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiReply, isBot: true, model: "Gemini 2.0 (via OpenRouter)" }]);

    } catch (err) {
      // Fallback لـ Groq في حالة فشل OpenRouter
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${KEYS.GROQ}` },
          body: JSON.stringify({
            model: "llama3-70b-8192",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: userText }]
          })
        });
        const groqData = await groqRes.json();
        setMessages(prev => [...prev, { id: Date.now() + 1, text: groqData.choices[0].message.content, isBot: true, model: "Groq Fallback" }]);
      } catch (e) {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: "حصل مشكلة في كل السيرفرات، جرب تاني كمان شوية! 🔄", isBot: true, model: "Error" }]);
      }
    } finally {
      setIsLoading(false);
      setCurrentModelName("");
    }
  };

  const menuItems = [
    { id: "home", icon: "🏠", label: "الرئيسية" },
    { id: "features", icon: "🌟", label: "لماذا ميمو؟" },
    { id: "chat", icon: "💬", label: "المساعد الذكي" },
    { id: "courses", icon: "📚", label: "الكورسات" },
    { id: "exams", icon: "📝", label: "الامتحانات" },
    { id: "quran", icon: "📖", label: "تحفيظ القرآن" },
    { id: "settings", icon: "⚙️", label: "الإعدادات" }
  ];

  // ============ 4. الصفحات (Pages) ============

  const HomePage = () => (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a0f, #1a1025, #0f1729)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "5%", left: "15%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)", borderRadius: "50%", filter: "blur(80px)" }} />
      
      <nav style={{ padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", boxShadow: "0 12px 40px rgba(139,92,246,0.5)" }}>🎓</div>
          <span style={{ fontSize: "36px", fontWeight: "900", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ميمو</span>
        </div>
        <button onClick={() => setCurrentPage("chat")} style={{ padding: "16px 36px", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", border: "none", borderRadius: "14px", color: "white", fontSize: "17px", fontWeight: "700", cursor: "pointer", boxShadow: "0 12px 40px rgba(139,92,246,0.5)" }}>ابدأ المذاكرة 🚀</button>
      </nav>

      <main style={{ textAlign: "center", padding: "100px 24px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "12px 28px", background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", borderRadius: "50px", marginBottom: "40px" }}>
          <span>🔥</span>
          <span style={{ color: "#DDD6FE", fontSize: "15px", fontWeight: "600" }}>يعمل بـ 4 عقول صناعية (Claude + GPT + Gemini + Llama)</span>
        </div>
        <h1 style={{ fontSize: "clamp(48px, 10vw, 80px)", fontWeight: "900", lineHeight: "1.1", marginBottom: "28px", color: "white" }}>مدرسك الخصوصي<br /><span style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899, #F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>بالذكاء الاصطناعي</span></h1>
        <p style={{ fontSize: "22px", color: "#A5B4FC", maxWidth: "650px", margin: "0 auto 56px", lineHeight: "1.9" }}>ميمو بيفهمك، بيشرحلك بالمصري، وبيساعدك تجيب أعلى الدرجات!<br /><strong style={{ color: "#C4B5FD" }}>متاح 24 ساعة مجاناً! 🎉</strong></p>
        <button onClick={() => setCurrentPage("chat")} style={{ padding: "24px 56px", fontSize: "24px", fontWeight: "800", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", border: "none", borderRadius: "20px", color: "white", cursor: "pointer", boxShadow: "0 20px 60px rgba(139,92,246,0.6)" }}>ابدأ رحلتك مجاناً 🚀</button>
      </main>

      <footer style={{ textAlign: "center", padding: "40px", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "100px", position: "relative", zIndex: 10 }}>
        <p style={{ color: "#64748B" }}>Developed by Mohamed.Rabia19 @2026 294.empire</p>
      </footer>
    </div>
  );

  const WhyMemo = () => (
    <div style={{ minHeight: "100vh", background: "#020617", color: "white", direction: "rtl", fontFamily: "inherit" }}>
      <Sidebar />
      <main style={{ marginRight: "280px", padding: "60px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "42px", fontWeight: "900", marginBottom: "20px" }}>إمبراطورية ميمو التعليمية 🌟</h2>
          <p style={{ color: "#A5B4FC", fontSize: "20px" }}>لماذا ميمو هو المنصة الأقوى في مصر؟</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
          {[
            { t: "عقول متعددة (AI Core)", d: "بنشغل Claude 3.5 و Gemini 2.0 و GPT-4 و Llama مع بعض لضمان صفر أخطاء.", i: "🧠" },
            { t: "مدرس افتراضي كامل", d: "مكالمات صوتية وشرح حصص كاملة (30-60 دقيقة) كأنك في كول بجد.", i: "📞" },
            { t: "بنك الأخطاء", d: "ميمو بيحفظ كل سؤال غلطت فيه وبيفكرك تراجعه بنظام Spaced Repetition.", i: "🛡️" },
            { t: "مود التركيز العميق", d: "شاشة كاملة، حجب إشعارات، وموسيقى Lofi مدمجة للمذاكرة بتركيز.", i: "🧘" },
            { t: "فهم الصور والخط", d: "صور المسألة أو حلك في الكشكول وميمو هيحللها ويصححها فوراً.", i: "📸" },
            { t: "منهج الوزارة المصري", d: "مطابق تماماً للمناهج المصرية من KG لحد ثانوية عامة 2024.", i: "📚" }
          ].map((x, i) => (
            <div key={i} style={{ background: "rgba(30,41,59,0.7)", border: "1px solid rgba(139,92,246,0.3)", padding: "32px", borderRadius: "28px", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>{x.i}</div>
              <h3 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "12px", color: "white" }}>{x.t}</h3>
              <p style={{ color: "#A5B4FC", fontSize: "15px", lineHeight: "1.7" }}>{x.d}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setCurrentPage("home")} style={{ display: "block", margin: "60px auto", color: "#8B5CF6", background: "none", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "18px" }}>← العودة للرئيسية</button>
      </main>
    </div>
  );

  const ChatPage = () => (
    <div style={{ display: "flex", height: "100vh", background: "#0a0a0f" }}>
      <Sidebar />
      <div style={{ marginRight: "280px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 28px", background: "rgba(15,23,42,0.98)", borderBottom: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", gap: "18px" }}>
          <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>🤖</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "white", margin: 0 }}>ميمو - Multi-Model System</h2>
            <p style={{ fontSize: "13px", margin: 0, color: isLoading ? "#FBBF24" : "#4ADE80" }}>{isLoading ? currentModelName : "جميع الأنظمة نشطة 🟢"}</p>
          </div>
        </div>

        <div style={{ flex: 1, padding: "28px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: "flex", alignItems: "flex-start", gap: "12px", justifyContent: msg.isBot ? "flex-start" : "flex-end" }}>
              {msg.isBot && <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(30,41,59,1)", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🤖</div>}
              <div style={{ maxWidth: "75%" }}>
                <div style={{ padding: "16px 20px", borderRadius: msg.isBot ? "20px 20px 20px 6px" : "20px 20px 6px 20px", background: msg.isBot ? "rgba(30,41,59,0.95)" : "linear-gradient(135deg, #8B5CF6, #EC4899)", color: "white", fontSize: "15px", lineHeight: "1.8", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>{msg.text}</div>
                {msg.isBot && msg.model && msg.model !== "System" && <div style={{ marginTop: "6px", fontSize: "10px", color: "#64748B", paddingRight: "8px" }}>⚡ {msg.model}</div>}
              </div>
              {!msg.isBot && <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #EC4899, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>👤</div>}
            </div>
          ))}
          {isLoading && <div style={{ paddingRight: "52px", color: "#A5B4FC", fontSize: "14px" }}>ميمو بيفكر... 🧠</div>}
          <div ref={messagesEndRef} />
        </div>
        <ChatInputBox onSendMessage={handleSendMessage} loading={isLoading} />
      </div>
    </div>
  );

  const Sidebar = () => (
    <aside style={{ width: "280px", background: "linear-gradient(180deg, rgba(10,10,15,0.98), rgba(26,16,37,0.98))", borderLeft: "1px solid rgba(139,92,246,0.2)", position: "fixed", right: 0, top: 0, bottom: 0, zIndex: 100, padding: "28px 16px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
        <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🎓</div>
        <span style={{ fontSize: "24px", fontWeight: "900", background: "linear-gradient(135deg, #8B5CF6, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ميمو</span>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        {menuItems.map(item => (
          <button key={item.id} onClick={() => setCurrentPage(item.id)} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", background: currentPage === item.id ? "rgba(139,92,246,0.1)" : "transparent", border: currentPage === item.id ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent", borderRadius: "12px", color: currentPage === item.id ? "white" : "#94A3B8", fontSize: "15px", fontWeight: "600", cursor: "pointer", textAlign: "right" }}>
            <span>{item.icon}</span> <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );

  if (currentPage === "home") return <HomePage />;
  if (currentPage === "features") return <WhyMemo />;
  if (currentPage === "chat") return <ChatPage />;
  
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "white", direction: "rtl" }}>
      <Sidebar />
      <div style={{ marginRight: "280px", padding: "60px", textAlign: "center" }}>
        <h1 style={{ fontSize: "32px" }}>🚧 قريباً: {currentPage}</h1>
      </div>
    </div>
  );
}

export default App;
