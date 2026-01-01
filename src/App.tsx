import { useState } from "react"

export default function App() {
  const [page, setPage] = useState("home")
  const [messages, setMessages] = useState([
    { id: 1, text: "أهلاً بيك! أنا ميمو 🎓 اسألني أي سؤال!", isBot: true }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim() || loading) return

    setMessages(m => [...m, { id: Date.now(), text: input, isBot: false }])
    const q = input
    setInput("")
    setLoading(true)

    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBpvU_qU7ocojaPCh3hPY4mLmgnHNezTOs",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `أنت ميمو مدرس مصري ودود وذكي. رد باللهجة المصرية البسيطة: ${q}` }] }]
          })
        }
      )
      const data = await res.json()
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "معلش مفهمتش، قولي تاني؟"
      setMessages(m => [...m, { id: Date.now(), text: reply, isBot: true }])
    } catch {
      setMessages(m => [...m, { id: Date.now(), text: "فيه مشكلة، جرب تاني! 🔄", isBot: true }])
    }
    setLoading(false)
  }

  if (page === "chat") {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", flexDirection: "column", direction: "rtl", fontFamily: "system-ui" }}>
        
        <div style={{ background: "#1e293b", padding: 16, display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #334155" }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 18, cursor: "pointer" }}>→ رجوع</button>
          <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #8b5cf6, #ec4899)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
          <div>
            <div style={{ color: "#fff", fontWeight: "bold" }}>ميمو</div>
            <div style={{ color: loading ? "#fbbf24" : "#4ade80", fontSize: 12 }}>{loading ? "⏳ بيفكر..." : "● متصل"}</div>
          </div>
        </div>

        <div style={{ flex: 1, padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map(m => (
            <div key={m.id} style={{ display: "flex", justifyContent: m.isBot ? "flex-start" : "flex-end" }}>
              <div style={{
                maxWidth: "80%",
                padding: "12px 16px",
                borderRadius: m.isBot ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                background: m.isBot ? "#1e293b" : "#8b5cf6",
                color: "#fff",
                fontSize: 15,
                lineHeight: 1.6,
                border: m.isBot ? "1px solid #334155" : "none",
                whiteSpace: "pre-wrap"
              }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#1e293b", padding: 12, display: "flex", gap: 10, borderTop: "1px solid #334155" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="اكتب سؤالك..."
            disabled={loading}
            style={{ flex: 1, background: "#334155", border: "none", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 16, outline: "none" }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            style={{ padding: "12px 24px", background: loading ? "#475569" : "linear-gradient(135deg, #8b5cf6, #ec4899)", border: "none", borderRadius: 10, color: "#fff", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "⏳" : "إرسال"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a, #1e1b4b, #0f172a)", color: "#fff", direction: "rtl", fontFamily: "system-ui" }}>
      
      <nav style={{ padding: "20px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 26, fontWeight: "bold", color: "#a78bfa" }}>🎓 ميمو</div>
        <button onClick={() => setPage("chat")} style={{ padding: "10px 20px", background: "linear-gradient(135deg, #8b5cf6, #ec4899)", border: "none", borderRadius: 8, color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
          ابدأ المذاكرة 🚀
        </button>
      </nav>

      <main style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ display: "inline-block", padding: "8px 16px", background: "rgba(139,92,246,0.2)", borderRadius: 50, marginBottom: 24, border: "1px solid rgba(139,92,246,0.3)", fontSize: 14 }}>
          ✨ أول منصة تعليمية بالذكاء الاصطناعي في مصر
        </div>
        
        <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: "bold", marginBottom: 16, lineHeight: 1.3 }}>
          مدرسك الخصوصي<br />
          <span style={{ color: "#a78bfa" }}>بالذكاء الاصطناعي</span>
        </h1>
        
        <p style={{ fontSize: 18, color: "#94a3b8", marginBottom: 32, maxWidth: 500, marginInline: "auto" }}>
          ميمو بيفهمك، بيشرحلك بالمصري، وبيساعدك تجيب أعلى الدرجات!
        </p>
        
        <button onClick={() => setPage("chat")} style={{ padding: "16px 32px", background: "linear-gradient(135deg, #8b5cf6, #ec4899)", border: "none", borderRadius: 12, color: "#fff", fontWeight: "bold", fontSize: 18, cursor: "pointer", boxShadow: "0 8px 32px rgba(139,92,246,0.4)" }}>
          ابدأ رحلتك مجاناً 🚀
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, maxWidth: 900, margin: "60px auto 0", padding: "0 20px" }}>
          {[
            { icon: "🧠", title: "ذكاء اصطناعي", desc: "بيفهم العامية المصرية" },
            { icon: "📚", title: "المنهج كامل", desc: "من KG لثانوية عامة" },
            { icon: "🎯", title: "امتحانات ذكية", desc: "بيصحح ويقيّم مستواك" }
          ].map((f, i) => (
            <div key={i} style={{ background: "rgba(30,41,59,0.6)", padding: 24, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 6 }}>{f.title}</div>
              <div style={{ color: "#94a3b8", fontSize: 14 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ textAlign: "center", padding: 24, borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 40, color: "#64748b", fontSize: 14 }}>
        © 2026 ميمو - صنع بـ  بواسطة المهندس محمد ربيع
      </footer>
    </div>
  )
}