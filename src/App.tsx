import { useState } from "react";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [messages, setMessages] = useState([
    { id: 1, text: "أهلاً بيك! أنا ميمو 🎓 اسألني أي سؤال وأنا هساعدك!", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ضفتلك دي عشان الزرار يهنج وهو بيحمل

  // دالة الإرسال (خليناها async عشان النت)
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    // 1. عرض رسالة المستخدم
    const userInput = input; // بنحفظ الكلام قبل ما نمسحه
    const userMsg = { id: Date.now(), text: userInput, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true); // بنشغل وضع التحميل
    
    // 2. إرسال الكلام لـ Gemini (ده الكود الجديد)
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      // لو مفيش مفتاح، رد برسالة تنبيه
      if (!apiKey) {
        throw new Error("المفتاح ناقص");
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `رد باللهجة المصرية العامية كأنك مدرس خصوصي شاطر: ${userInput}` }] }]
          })
        }
      );

      const data = await response.json();
      
      // التأكد من إن الرد وصل سليم
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "معلش مسمعتش كويس.. ممكن تقول تاني؟";
      
      // 3. عرض رد ميمو
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiReply, isBot: true }]);

    } catch (e) {
      console.error(e);
      // رسالة لو حصل خطأ
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "معلش النت معلق أو المفتاح مش مظبوط.. جرب تاني!", 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false); // بنوقف وضع التحميل
    }
  };

  // ============ صفحة الشات ============
  if (currentPage === "chat") {
    return (
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "#0f172a", 
        display: "flex", 
        flexDirection: "column",
        direction: "rtl",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}>
        
        {/* الهيدر */}
        <div style={{ 
          backgroundColor: "#1e293b", 
          padding: "16px", 
          display: "flex", 
          alignItems: "center", 
          gap: "12px",
          borderBottom: "1px solid #334155"
        }}>
          <button 
            onClick={() => setCurrentPage("home")}
            style={{ 
              background: "none", 
              border: "none", 
              color: "#94a3b8", 
              fontSize: "20px",
              cursor: "pointer"
            }}
          >
            ← رجوع
          </button>
          <div style={{ 
            width: "45px", 
            height: "45px", 
            background: "linear-gradient(135deg, #8b5cf6, #ec4899)", 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            fontSize: "24px"
          }}>
            🤖
          </div>
          <div>
            <h1 style={{ color: "white", margin: 0, fontSize: "18px", fontWeight: "bold" }}>ميمو</h1>
            <p style={{ color: "#4ade80", margin: 0, fontSize: "12px" }}>● متصل الآن</p>
          </div>
        </div>

        {/* الرسائل */}
        <div style={{ 
          flex: 1, 
          padding: "20px", 
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          {messages.map(msg => (
            <div 
              key={msg.id} 
              style={{ 
                display: "flex", 
                justifyContent: msg.isBot ? "flex-start" : "flex-end" 
              }}
            >
              {/* صورة الروبوت أو الشخص */}
              <div style={{
                width: "35px", height: "35px", borderRadius: "50%",
                background: msg.isBot ? "#3b82f6" : "#8b5cf6",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginLeft: msg.isBot ? "0" : "10px",
                marginRight: msg.isBot ? "10px" : "0",
                fontSize: "18px"
              }}>
                {msg.isBot ? "🤖" : "👤"}
              </div>

              <div style={{ 
                maxWidth: "75%", 
                padding: "14px 18px", 
                borderRadius: msg.isBot ? "4px 20px 20px 20px" : "20px 20px 20px 4px",
                backgroundColor: msg.isBot ? "#1e293b" : "#8b5cf6",
                color: "white",
                fontSize: "15px",
                lineHeight: "1.6",
                border: msg.isBot ? "1px solid #334155" : "none"
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && <div style={{ color: "#94a3b8", fontSize: "14px", marginRight: "50px" }}>ميمو بيكتب... ✍️</div>}
        </div>

        {/* الإدخال */}
        <div style={{ 
          backgroundColor: "#1e293b", 
          padding: "16px", 
          display: "flex", 
          gap: "12px",
          borderTop: "1px solid #334155"
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="اكتب سؤالك هنا..."
            disabled={isLoading}
            style={{ 
              flex: 1, 
              backgroundColor: "#334155", 
              border: "none",
              borderRadius: "12px",
              padding: "14px 18px",
              color: "white",
              fontSize: "16px",
              outline: "none"
            }}
          />
          <button 
            onClick={sendMessage}
            disabled={isLoading}
            style={{ 
              padding: "14px 28px", 
              background: isLoading ? "#475569" : "linear-gradient(135deg, #8b5cf6, #ec4899)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: isLoading ? "not-allowed" : "pointer"
            }}
          >
            {isLoading ? "..." : "إرسال 🚀"}
          </button>
        </div>
      </div>
    );
  }

  // ============ الصفحة الرئيسية ============
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      color: "white",
      direction: "rtl",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      
      {/* الهيدر */}
      <nav style={{ 
        padding: "20px 40px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center"
      }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#a78bfa" }}>
          🎓 ميمو
        </h1>
        <button 
          onClick={() => setCurrentPage("chat")}
          style={{ 
            padding: "12px 24px", 
            background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
            border: "none",
            borderRadius: "10px",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          ابدأ المذاكرة 🚀
        </button>
      </nav>

      {/* المحتوى */}
      <main style={{ 
        textAlign: "center", 
        padding: "80px 20px" 
      }}>
        <div style={{ 
          display: "inline-block",
          padding: "8px 20px", 
          backgroundColor: "rgba(139, 92, 246, 0.2)", 
          borderRadius: "50px",
          marginBottom: "30px",
          border: "1px solid rgba(139, 92, 246, 0.3)"
        }}>
          <span style={{ fontSize: "14px" }}>✨ أول منصة تعليمية بالذكاء الاصطناعي في مصر</span>
        </div>
        
        <h2 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "20px", lineHeight: "1.3" }}>
          مدرسك الخصوصي
          <br />
          <span style={{ color: "#a78bfa" }}>بالذكاء الاصطناعي</span>
        </h2>
        
        <p style={{ fontSize: "20px", color: "#94a3b8", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px" }}>
          ميمو بيفهمك، بيشرحلك بالمصري، وبيساعدك تجيب أعلى الدرجات!
          <br />
          متاح 24 ساعة، وبيعرف منهجك كويس!
        </p>
        
        <button 
          onClick={() => setCurrentPage("chat")}
          style={{ 
            padding: "18px 40px", 
            background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
            border: "none",
            borderRadius: "14px",
            color: "white",
            fontWeight: "bold",
            fontSize: "20px",
            cursor: "pointer",
            boxShadow: "0 10px 40px rgba(139, 92, 246, 0.4)"
          }}
        >
          ابدأ رحلتك مجاناً 🚀
        </button>

        {/* المميزات */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          maxWidth: "1000px",
          margin: "80px auto 0",
          padding: "0 20px"
        }}>
          <div style={{ 
            backgroundColor: "rgba(30, 41, 59, 0.5)", 
            padding: "30px", 
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🧠</div>
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>ذكاء اصطناعي متقدم</h3>
            <p style={{ color: "#94a3b8", fontSize: "15px" }}>بيفهم سؤالك حتى لو كتبته بالعامية</p>
          </div>
          
          <div style={{ 
            backgroundColor: "rgba(30, 41, 59, 0.5)", 
            padding: "30px", 
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📚</div>
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>المنهج المصري كامل</h3>
            <p style={{ color: "#94a3b8", fontSize: "15px" }}>من KG لحد ثانوية عامة</p>
          </div>
          
          <div style={{ 
            backgroundColor: "rgba(30, 41, 59, 0.5)", 
            padding: "30px", 
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🎯</div>
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>امتحانات ذكية</h3>
            <p style={{ color: "#94a3b8", fontSize: "15px" }}>بيعملك امتحانات ويصححلك فوراً</p>
          </div>
        </div>
      </main>

      {/* الفوتر */}
      <footer style={{ 
        textAlign: "center", 
        padding: "30px", 
        borderTop: "1px solid rgba(255,255,255,0.1)",
        marginTop: "60px"
      }}>
        <p style={{ color: "#64748b" }}>© 2024 ميمو - صنع بـ ❤️ بواسطة المهندس محمد ربيع</p>
      </footer>
    </div>
  );
};

export default App;