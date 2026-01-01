import { useState } from "react";

const App = () => {
  // حالة التنقل بين الصفحات
  const [currentPage, setCurrentPage] = useState("home");
  
  // ============ لوجيك الشات ============
  const [messages, setMessages] = useState([
    { id: 1, text: "أهلاً بيك يا بطل! 👋 أنا ميمو.. جاهز نذاكر إيه النهاردة؟", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userInput = input;
    
    // عرض رسالة المستخدم
    setMessages(prev => [...prev, { id: Date.now(), text: userInput, isBot: false }]);
    setInput("");
    setIsLoading(true);

    try {
      // ✅ المفتاح بتاعك محطوط هنا أهو مباشرة
      const apiKey = "AIzaSyBpvU_qU7ocojaPCh3hPY4mLmgnHNezTOs";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `رد باللهجة المصرية العامية كأنك مدرس خصوصي ودود: ${userInput}` }] }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "معلش مسمعتش.. قول تاني؟";
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiReply, isBot: true }]);

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "مشكلة في الاتصال.. حاول تاني!", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ============ القائمة الجانبية (Sidebar) ============
  const Sidebar = () => (
    <aside style={{ 
      width: "280px", 
      backgroundColor: "#1e293b", 
      borderLeft: "1px solid #334155", 
      display: "flex", 
      flexDirection: "column",
      padding: "20px",
      position: "fixed",
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: 50,
      fontFamily: "'Cairo', sans-serif"
    }}>
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", background: "linear-gradient(to right, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", color: "transparent" }}>
          ميمو 🎓
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "12px" }}>منصتك التعليمية الشاملة</p>
      </div>
      
      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { id: "home", icon: "🏠", label: "الرئيسية" },
          { id: "chat", icon: "🤖", label: "المساعد الذكي" },
          { id: "courses", icon: "📚", label: "الكورسات" },
          { id: "exams", icon: "📝", label: "الامتحانات" },
          { id: "quran", icon: "📖", label: "تحفيظ القرآن" },
          { id: "planner", icon: "📅", label: "جدول المذاكرة" },
          { id: "settings", icon: "⚙️", label: "الإعدادات" },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              backgroundColor: currentPage === item.id ? "#7c3aed" : "transparent",
              color: currentPage === item.id ? "white" : "#cbd5e1",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "0.2s",
              textAlign: "right",
              fontFamily: "'Cairo', sans-serif"
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );

  // ============ الصفحات الداخلية ============

  const ExamsPage = () => (
    <div style={{ padding: "40px", fontFamily: "'Cairo', sans-serif" }}>
      <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>📝 الامتحانات الذكية</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "16px", border: "1px solid #334155" }}>
            <h3 style={{ marginBottom: "10px" }}>امتحان شامل - لغة عربية</h3>
            <p style={{ color: "#94a3b8", marginBottom: "20px" }}>مدة الامتحان: 60 دقيقة • 20 سؤال</p>
            <button style={{ width: "100%", padding: "10px", backgroundColor: "#7c3aed", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
              ابدأ الامتحان
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const CoursesPage = () => (
    <div style={{ padding: "40px", fontFamily: "'Cairo', sans-serif" }}>
      <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>📚 مكتبة الكورسات</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ backgroundColor: "#1e293b", borderRadius: "16px", overflow: "hidden", border: "1px solid #334155" }}>
            <div style={{ height: "150px", backgroundColor: "#475569" }}></div>
            <div style={{ padding: "20px" }}>
              <h3 style={{ marginBottom: "10px" }}>شرح فيزياء - الصف الثالث الثانوي</h3>
              <p style={{ color: "#94a3b8", marginBottom: "20px" }}>شرح تفصيلي للمنهج مع حل مسائل</p>
              <button style={{ width: "100%", padding: "10px", backgroundColor: "#0f172a", color: "white", border: "1px solid #334155", borderRadius: "8px", cursor: "pointer" }}>
                مشاهدة الدروس
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ChatPage = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#0f172a", fontFamily: "'Cairo', sans-serif" }}>
      <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: "flex", justifyContent: msg.isBot ? "flex-start" : "flex-end" }}>
            <div style={{ 
              maxWidth: "70%", 
              padding: "16px", 
              borderRadius: "16px", 
              backgroundColor: msg.isBot ? "#1e293b" : "#7c3aed",
              color: "white",
              lineHeight: "1.6",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <div style={{ color: "#94a3b8", marginRight: "20px" }}>ميمو بيكتب... ✍️</div>}
      </div>
      <div style={{ padding: "20px", backgroundColor: "#1e293b", borderTop: "1px solid #334155", display: "flex", gap: "10px" }}>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="اسأل ميمو..."
          style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#334155", color: "white", outline: "none", fontFamily: "'Cairo', sans-serif" }}
        />
        <button onClick={sendMessage} disabled={isLoading} style={{ padding: "12px 24px", backgroundColor: "#7c3aed", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: "'Cairo', sans-serif" }}>
          إرسال
        </button>
      </div>
    </div>
  );

  // ============ المحتوى الرئيسي (Layout) ============
  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#0f172a", 
      color: "white", 
      direction: "rtl", 
      fontFamily: "'Cairo', sans-serif" 
    }}>
      
      {currentPage !== 'home' && <Sidebar />}

      <main style={{ 
        marginRight: currentPage !== 'home' ? "280px" : "0", 
        minHeight: "100vh",
        transition: "0.3s"
      }}>
        
        {currentPage === 'home' && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <h1 style={{ fontSize: "48px", marginBottom: "20px", fontWeight: "bold" }}>M e M o 🎓</h1>
            <p style={{ fontSize: "24px", color: "#94a3b8", marginBottom: "40px" }}>منصتك التعليمية المتكاملة بالذكاء  اول منصه مستقله بذاتها في مصر</p>
            <button 
              onClick={() => setCurrentPage('chat')}
              style={{ padding: "16px 40px", fontSize: "20px", backgroundColor: "#7c3aed", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.3)" }}
            >
              ابدأ رحلتك مجاناً 🚀
            </button>

            <div style={{ marginTop: "60px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px", maxWidth: "1000px", margin: "60px auto 0", padding: "0 20px" }}>
                <div style={{ background: "#1e293b", padding: "30px", borderRadius: "16px" }}>
                    <div style={{ fontSize: "40px", marginBottom: "10px" }}>🤖</div>
                    <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>مدرس خصوصي</h3>
                    <p style={{ color: "#94a3b8" }}>بيشرحلك ويفهمك 24 ساعة</p>
                </div>
                <div style={{ background: "#1e293b", padding: "30px", borderRadius: "16px" }}>
                    <div style={{ fontSize: "40px", marginBottom: "10px" }}>📚</div>
                    <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>مكتبة شاملة</h3>
                    <p style={{ color: "#94a3b8" }}>كورسات وامتحانات لكل المواد</p>
                </div>
                <div style={{ background: "#1e293b", padding: "30px", borderRadius: "16px" }}>
                    <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎯</div>
                    <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>خطط مذاكرة</h3>
                    <p style={{ color: "#94a3b8" }}>جداول مخصصة عشان تلم المنهج</p>
                </div>
            </div>
          </div>
        )}

        {currentPage === 'chat' && <ChatPage />}
        {currentPage === 'courses' && <CoursesPage />}
        {currentPage === 'exams' && <ExamsPage />}
        {currentPage === 'quran' && <div style={{ padding: "40px", textAlign: "center" }}><h1>📖 صفحة القرآن (قريباً)</h1></div>}
        {currentPage === 'planner' && <div style={{ padding: "40px", textAlign: "center" }}><h1>📅 المخطط الدراسي (قريباً)</h1></div>}
        {currentPage === 'settings' && <div style={{ padding: "40px", textAlign: "center" }}><h1>⚙️ الإعدادات (قريباً)</h1></div>}

      </main>
    </div>
  );
};

export default App;