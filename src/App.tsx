import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";

// ============ مكون الإدخال منفصل ============
function ChatInputBox({ onSendMessage, loading }: { onSendMessage: (msg: string) => void; loading: boolean }) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && text.trim() && !loading) {
      e.preventDefault();
      onSendMessage(text.trim());
      setText("");
    }
  };

  const handleClick = () => {
    if (text.trim() && !loading) {
      onSendMessage(text.trim());
      setText("");
      inputRef.current?.focus();
    }
  };

  return (
    <div style={{
      padding: "24px 32px",
      background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(15,15,25,0.98) 20%)",
      backdropFilter: "blur(40px)",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      gap: "16px",
      alignItems: "center"
    }}>
      <div style={{
        flex: 1,
        position: "relative"
      }}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder="اكتب رسالتك هنا..."
          disabled={loading}
          autoComplete="off"
          style={{
            width: "100%",
            padding: "20px 28px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            color: "white",
            fontSize: "17px",
            outline: "none",
            fontFamily: "inherit",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)"
          }}
        />
      </div>
      <button
        onClick={handleClick}
        disabled={loading || !text.trim()}
        style={{
          width: "60px",
          height: "60px",
          background: loading || !text.trim() 
            ? "rgba(255,255,255,0.1)" 
            : "linear-gradient(135deg, #6366F1, #8B5CF6, #A855F7)",
          border: "none",
          borderRadius: "20px",
          color: "white",
          fontSize: "24px",
          cursor: loading || !text.trim() ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: loading || !text.trim() 
            ? "none" 
            : "0 10px 40px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: loading || !text.trim() ? "scale(1)" : "scale(1)"
        }}
      >
        {loading ? "◌" : "↑"}
      </button>
    </div>
  );
}

// ============ التطبيق الرئيسي ============
function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [messages, setMessages] = useState([
    { id: 1, text: "أهلاً بيك! 👋\n\nأنا ميمو، مساعدك الذكي للدراسة. اسألني أي سؤال في أي مادة وهساعدك تفهم وتتفوق! 🎯", isBot: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (userText: string) => {
    setMessages(prev => [...prev, { id: Date.now(), text: userText, isBot: false }]);
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA1BNXdW6Wa-RLXG7WtXOzXSR2PtPddE94",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `أنت "ميمو" - مساعد تعليمي مصري ذكي وودود. رد باللهجة المصرية العامية بطريقة مبسطة وشيقة. شجع الطالب واستخدم الإيموجي. لو سألوك مين عملك قول "المهندس محمد ربيع". السؤال: ${userText}`
              }]
            }]
          })
        }
      );

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "معلش مفهمتش السؤال، ممكن توضحه أكتر؟ 🤔";
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiReply, isBot: true }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "عذراً، حدث خطأ في الاتصال. حاول مرة أخرى! 🔄", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    { id: "home", icon: "⌂", label: "الرئيسية", desc: "الصفحة الرئيسية" },
    { id: "chat", icon: "◎", label: "المساعد الذكي", desc: "تحدث مع ميمو" },
    { id: "courses", icon: "▦", label: "المكتبة", desc: "الكورسات والدروس" },
    { id: "exams", icon: "◈", label: "الاختبارات", desc: "امتحانات تفاعلية" },
    { id: "quran", icon: "❋", label: "القرآن", desc: "تحفيظ ومراجعة" },
    { id: "planner", icon: "▤", label: "المخطط", desc: "جدول المذاكرة" },
    { id: "stats", icon: "◐", label: "الإحصائيات", desc: "تتبع تقدمك" },
    { id: "settings", icon: "⚙", label: "الإعدادات", desc: "تخصيص التطبيق" }
  ];

  // ============ الصفحة الرئيسية ============
  const HomePage = () => (
    <div style={{
      minHeight: "100vh",
      background: "#000000",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* الخلفية المتحركة */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120,80,255,0.15), transparent)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        top: "30%",
        left: "10%",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        animation: "float 8s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute",
        bottom: "20%",
        right: "5%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        animation: "float 10s ease-in-out infinite reverse"
      }} />

      {/* الهيدر */}
      <nav style={{
        padding: "24px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        zIndex: 10,
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            boxShadow: "0 8px 32px rgba(99,102,241,0.3)"
          }}>
            M
          </div>
          <div>
            <span style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "white",
              letterSpacing: "-0.5px"
            }}>Memo</span>
            <span style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.4)",
              display: "block",
              marginTop: "-2px"
            }}>AI Learning Platform</span>
          </div>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button style={{
            padding: "12px 24px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "rgba(255,255,255,0.8)",
            fontSize: "15px",
            fontWeight: "500",
            cursor: "pointer",
            backdropFilter: "blur(20px)"
          }}>
            تسجيل الدخول
          </button>
          <button onClick={() => setCurrentPage("chat")} style={{
            padding: "12px 28px",
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            border: "none",
            borderRadius: "12px",
            color: "white",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(99,102,241,0.35)"
          }}>
            ابدأ الآن
          </button>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <main style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "120px 48px",
        position: "relative",
        zIndex: 10
      }}>
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          {/* الشارة */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 20px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "100px",
            marginBottom: "32px",
            backdropFilter: "blur(20px)"
          }}>
            <span style={{ width: "6px", height: "6px", background: "#22C55E", borderRadius: "50%" }} />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: "500" }}>
              منصة التعليم الذكي الأولى في مصر
            </span>
          </div>

          {/* العنوان */}
          <h1 style={{
            fontSize: "clamp(48px, 8vw, 80px)",
            fontWeight: "800",
            lineHeight: "1.05",
            marginBottom: "28px",
            color: "white",
            letterSpacing: "-2px"
          }}>
            تعلّم بذكاء
            <br />
            <span style={{
              background: "linear-gradient(135deg, #818CF8, #C084FC, #E879F9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>مع الذكاء الاصطناعي</span>
          </h1>

          {/* الوصف */}
          <p style={{
            fontSize: "20px",
            color: "rgba(255,255,255,0.5)",
            maxWidth: "560px",
            margin: "0 auto 48px",
            lineHeight: "1.7",
            fontWeight: "400"
          }}>
            مساعدك الشخصي للدراسة متاح على مدار الساعة.
            <br />
            شرح مبسط، امتحانات ذكية، وخطط مذاكرة مخصصة.
          </p>

          {/* الأزرار */}
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <button onClick={() => setCurrentPage("chat")} style={{
              padding: "18px 40px",
              fontSize: "17px",
              fontWeight: "600",
              background: "white",
              border: "none",
              borderRadius: "14px",
              color: "#0F0F0F",
              cursor: "pointer",
              boxShadow: "0 16px 48px rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              transition: "all 0.3s ease"
            }}>
              <span>ابدأ المحادثة</span>
              <span style={{ fontSize: "20px" }}>→</span>
            </button>
            <button onClick={() => setCurrentPage("courses")} style={{
              padding: "18px 40px",
              fontSize: "17px",
              fontWeight: "600",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "14px",
              color: "white",
              cursor: "pointer",
              backdropFilter: "blur(20px)",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span style={{ fontSize: "18px" }}>▶</span>
              <span>استكشف المحتوى</span>
            </button>
          </div>
        </div>

        {/* المميزات */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          marginTop: "100px"
        }}>
          {[
            { 
              icon: "◎", 
              title: "مساعد ذكي 24/7", 
              desc: "اسأل أي سؤال في أي وقت واحصل على شرح مفصل ومبسط باللهجة المصرية",
              gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)"
            },
            { 
              icon: "◈", 
              title: "اختبارات تفاعلية", 
              desc: "امتحانات ذكية تتكيف مع مستواك وتساعدك تحدد نقاط الضعف والقوة",
              gradient: "linear-gradient(135deg, #8B5CF6, #A855F7)"
            },
            { 
              icon: "▤", 
              title: "خطط مخصصة", 
              desc: "جداول مذاكرة مصممة خصيصاً ليك بناءً على وقتك وأهدافك الدراسية",
              gradient: "linear-gradient(135deg, #A855F7, #D946EF)"
            }
          ].map((f, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(40px)",
              padding: "36px",
              borderRadius: "24px",
              border: "1px solid rgba(255,255,255,0.06)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer"
            }}>
              <div style={{
                width: "56px",
                height: "56px",
                background: f.gradient,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                marginBottom: "24px",
                color: "white",
                boxShadow: `0 12px 32px ${f.gradient.includes("6366F1") ? "rgba(99,102,241,0.3)" : "rgba(168,85,247,0.3)"}`
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px", color: "white" }}>
                {f.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", lineHeight: "1.7" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* الإحصائيات */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "80px",
          marginTop: "120px",
          flexWrap: "wrap"
        }}>
          {[
            { number: "50K+", label: "طالب نشط" },
            { number: "98%", label: "نسبة الرضا" },
            { number: "1M+", label: "سؤال تم الإجابة عليه" }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "48px",
                fontWeight: "800",
                background: "linear-gradient(135deg, #818CF8, #C084FC)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-1px"
              }}>
                {stat.number}
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px", marginTop: "8px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* الفوتر */}
      <footer style={{
        padding: "32px 48px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
        zIndex: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
            Developed by Mohamed.Rabia19
          </span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
            @2026 294.empire
          </span>
        </div>
        <div style={{ display: "flex", gap: "32px" }}>
          {["الخصوصية", "الشروط", "الدعم"].map((link, i) => (
            <a key={i} href="#" style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", textDecoration: "none" }}>
              {link}
            </a>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
      `}</style>
    </div>
  );

  // ============ صفحة الشات ============
  const ChatPage = () => (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "#000000"
    }}>
      {/* هيدر الشات */}
      <div style={{
        padding: "20px 32px",
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(40px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            color: "white",
            boxShadow: "0 8px 24px rgba(99,102,241,0.3)"
          }}>
            M
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "white", margin: 0, letterSpacing: "-0.3px" }}>
              Memo AI
            </h2>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "2px"
            }}>
              <span style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: isLoading ? "#FBBF24" : "#22C55E",
                boxShadow: isLoading ? "0 0 12px #FBBF24" : "0 0 12px #22C55E"
              }} />
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                {isLoading ? "يكتب الرد..." : "متصل الآن"}
              </span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setCurrentPage("home")}
          style={{
            padding: "10px 20px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            color: "rgba(255,255,255,0.7)",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>←</span>
          <span>رجوع</span>
        </button>
      </div>

      {/* الرسائل */}
      <div style={{
        flex: 1,
        padding: "32px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "12px",
            justifyContent: msg.isBot ? "flex-start" : "flex-end"
          }}>
            {msg.isBot && (
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                color: "white",
                flexShrink: 0
              }}>M</div>
            )}
            <div style={{
              maxWidth: "70%",
              padding: "18px 24px",
              borderRadius: msg.isBot ? "20px 20px 20px 6px" : "20px 20px 6px 20px",
              background: msg.isBot 
                ? "rgba(255,255,255,0.04)" 
                : "linear-gradient(135deg, #6366F1, #8B5CF6)",
              border: msg.isBot ? "1px solid rgba(255,255,255,0.08)" : "none",
              color: "white",
              fontSize: "16px",
              lineHeight: "1.8",
              whiteSpace: "pre-wrap",
              boxShadow: msg.isBot 
                ? "none" 
                : "0 8px 32px rgba(99,102,241,0.3)"
            }}>
              {msg.text}
            </div>
            {!msg.isBot && (
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #A855F7, #D946EF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                color: "white",
                flexShrink: 0
              }}>أ</div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: "white"
            }}>M</div>
            <div style={{
              padding: "18px 24px",
              borderRadius: "20px 20px 20px 6px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              gap: "6px"
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.4)",
                  animation: `pulse 1.4s infinite ${i * 0.2}s`
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInputBox onSendMessage={handleSendMessage} loading={isLoading} />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );

  // ============ Sidebar ============
  const Sidebar = () => (
    <aside style={{
      width: "280px",
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(40px)",
      borderLeft: "1px solid rgba(255,255,255,0.06)",
      position: "fixed",
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: 100,
      padding: "24px 16px",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* الشعار */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "8px 12px",
        marginBottom: "32px"
      }}>
        <div style={{
          width: "44px",
          height: "44px",
          background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "white"
        }}>M</div>
        <div>
          <span style={{ fontSize: "20px", fontWeight: "700", color: "white" }}>Memo</span>
          <span style={{ display: "block", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>AI Platform</span>
        </div>
      </div>

      {/* القائمة */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "14px 16px",
              background: currentPage === item.id 
                ? "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))" 
                : "transparent",
              border: currentPage === item.id 
                ? "1px solid rgba(99,102,241,0.3)" 
                : "1px solid transparent",
              borderRadius: "14px",
              color: currentPage === item.id ? "white" : "rgba(255,255,255,0.5)",
              fontSize: "15px",
              fontWeight: currentPage === item.id ? "600" : "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "inherit",
              textAlign: "right"
            }}
          >
            <span style={{ 
              fontSize: "18px",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: currentPage === item.id ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)",
              borderRadius: "8px"
            }}>
              {item.icon}
            </span>
            <div style={{ flex: 1 }}>
              <span style={{ display: "block" }}>{item.label}</span>
              <span style={{ 
                display: "block", 
                fontSize: "11px", 
                color: "rgba(255,255,255,0.3)",
                marginTop: "2px"
              }}>
                {item.desc}
              </span>
            </div>
          </button>
        ))}
      </nav>

      {/* البروفايل */}
      <div style={{
        padding: "16px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #A855F7, #D946EF)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            color: "white"
          }}>👤</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "600", color: "white", fontSize: "14px" }}>الحساب</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>إعدادات الملف الشخصي</div>
          </div>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>
        </div>
      </div>
    </aside>
  );

  // ============ صفحات Placeholder ============
  const PlaceholderPage = ({ title, icon, desc }: { title: string; icon: string; desc: string }) => (
    <div style={{
      minHeight: "100vh",
      background: "#000000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px",
      textAlign: "center"
    }}>
      <div style={{
        width: "100px",
        height: "100px",
        background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
        borderRadius: "28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "40px",
        marginBottom: "28px",
        border: "1px solid rgba(99,102,241,0.2)"
      }}>
        {icon}
      </div>
      <h1 style={{ 
        fontSize: "32px", 
        fontWeight: "700", 
        marginBottom: "12px", 
        color: "white",
        letterSpacing: "-0.5px"
      }}>
        {title}
      </h1>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "17px", maxWidth: "400px" }}>
        {desc}
      </p>
      <div style={{
        marginTop: "32px",
        padding: "12px 24px",
        background: "rgba(99,102,241,0.1)",
        borderRadius: "10px",
        border: "1px solid rgba(99,102,241,0.2)",
        color: "rgba(255,255,255,0.6)",
        fontSize: "14px"
      }}>
        قريباً جداً ✨
      </div>
    </div>
  );

  // ============ العرض الرئيسي ============
  if (currentPage === "home") return <HomePage />;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000000",
      color: "white",
      direction: "rtl",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <Sidebar />
      <main style={{ marginRight: "280px" }}>
        {currentPage === "chat" && <ChatPage />}
        {currentPage === "courses" && <PlaceholderPage title="المكتبة الدراسية" icon="▦" desc="كورسات ودروس شاملة لجميع المراحل الدراسية" />}
        {currentPage === "exams" && <PlaceholderPage title="الاختبارات الذكية" icon="◈" desc="امتحانات تفاعلية تتكيف مع مستواك" />}
        {currentPage === "quran" && <PlaceholderPage title="القرآن الكريم" icon="❋" desc="نظام متكامل للحفظ والمراجعة" />}
        {currentPage === "planner" && <PlaceholderPage title="المخطط الدراسي" icon="▤" desc="خطط مذاكرة مخصصة لأهدافك" />}
        {currentPage === "stats" && <PlaceholderPage title="الإحصائيات" icon="◐" desc="تتبع تقدمك ومستوى أدائك" />}
        {currentPage === "settings" && <PlaceholderPage title="الإعدادات" icon="⚙" desc="تخصيص تجربة التطبيق" />}
      </main>
    </div>
  );
}

export default App;