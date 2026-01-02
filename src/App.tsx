import { useState, useRef, useEffect } from "react";

// ============ مكون الشات منفصل (ده اللي بيحل المشكلة) ============
const ChatInput = ({ onSend, isLoading }: { onSend: (text: string) => void; isLoading: boolean }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim() && !isLoading) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div style={{
      padding: "20px 24px",
      background: "rgba(15, 23, 42, 0.95)",
      backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(139, 92, 246, 0.2)",
      display: "flex",
      gap: "12px"
    }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="اكتب سؤالك هنا... 💬"
        disabled={isLoading}
        style={{
          flex: 1,
          padding: "18px 24px",
          background: "rgba(30, 41, 59, 0.8)",
          border: "2px solid rgba(139, 92, 246, 0.3)",
          borderRadius: "16px",
          color: "white",
          fontSize: "16px",
          outline: "none",
          fontFamily: "inherit",
          transition: "all 0.3s ease"
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={isLoading || !text.trim()}
        style={{
          padding: "18px 36px",
          background: isLoading || !text.trim()
            ? "rgba(107, 114, 128, 0.5)"
            : "linear-gradient(135deg, #8B5CF6, #EC4899)",
          border: "none",
          borderRadius: "16px",
          color: "white",
          fontSize: "16px",
          fontWeight: "700",
          cursor: isLoading || !text.trim() ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          boxShadow: isLoading || !text.trim() ? "none" : "0 8px 32px rgba(139, 92, 246, 0.4)",
          transition: "all 0.3s ease"
        }}
      >
        {isLoading ? "⏳" : "إرسال 🚀"}
      </button>
    </div>
  );
};

// ============ التطبيق الرئيسي ============
const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [messages, setMessages] = useState<{id: number; text: string; isBot: boolean}[]>([
    { id: 1, text: "أهلاً بيك يا بطل! 👋 أنا ميمو، مدرسك الخصوصي بالذكاء الاصطناعي. اسألني أي سؤال في أي مادة وأنا جاهز أساعدك! 🎓", isBot: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (userText: string) => {
    const newUserMessage = { id: Date.now(), text: userText, isBot: false };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBpvU_qU7ocojaPCh3hPY4mLmgnHNezTOs",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `أنت "ميمو" - مدرس مصري ودود وذكي ومرح. رد دايماً باللهجة المصرية العامية بطريقة بسيطة ومفهومة وشجع الطالب. لو حد سألك مين عملك قول "المهندس محمد ربيع". السؤال: ${userText}`
              }]
            }]
          })
        }
      );

      const data = await response.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "معلش مفهمتش السؤال، ممكن تقوله تاني بطريقة تانية؟ 🤔";
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiText, isBot: true }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "في مشكلة في الاتصال، جرب تاني كمان شوية! 🔄", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    { id: "home", icon: "🏠", label: "الرئيسية", color: "#8B5CF6" },
    { id: "chat", icon: "💬", label: "المساعد الذكي", color: "#EC4899" },
    { id: "courses", icon: "📚", label: "الكورسات", color: "#3B82F6" },
    { id: "exams", icon: "📝", label: "الامتحانات", color: "#10B981" },
    { id: "quran", icon: "📖", label: "القرآن الكريم", color: "#059669" },
    { id: "planner", icon: "📅", label: "جدول المذاكرة", color: "#F59E0B" },
    { id: "settings", icon: "⚙️", label: "الإعدادات", color: "#6B7280" },
  ];

  // ============ الصفحة الرئيسية ============
  const HomePage = () => (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0f 0%, #1a1025 25%, #0f1729 50%, #1a1025 75%, #0a0a0f 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* الخلفيات المتوهجة */}
      <div style={{
        position: "absolute", top: "5%", left: "15%", width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(80px)", animation: "pulse 4s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "10%", width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(80px)", animation: "pulse 5s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%", width: "300px", height: "300px",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(60px)", transform: "translate(-50%, -50%)"
      }} />

      {/* الهيدر */}
      <nav style={{
        padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "relative", zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "56px", height: "56px",
            background: "linear-gradient(135deg, #8B5CF6, #EC4899, #F59E0B)",
            borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", boxShadow: "0 12px 40px rgba(139, 92, 246, 0.5)",
            animation: "float 3s ease-in-out infinite"
          }}>🎓</div>
          <span style={{
            fontSize: "36px", fontWeight: "900",
            background: "linear-gradient(135deg, #8B5CF6, #EC4899, #F59E0B)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>ميمو</span>
        </div>
        <button onClick={() => setCurrentPage("chat")} style={{
          padding: "16px 36px",
          background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
          border: "none", borderRadius: "14px", color: "white",
          fontSize: "17px", fontWeight: "700", cursor: "pointer",
          boxShadow: "0 12px 40px rgba(139, 92, 246, 0.5)",
          transition: "all 0.3s ease", fontFamily: "inherit"
        }}>ابدأ المذاكرة 🚀</button>
      </nav>

      {/* المحتوى الرئيسي */}
      <main style={{ textAlign: "center", padding: "100px 24px", position: "relative", zIndex: 10 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "10px",
          padding: "12px 28px", background: "rgba(139, 92, 246, 0.2)",
          border: "1px solid rgba(139, 92, 246, 0.4)", borderRadius: "50px",
          marginBottom: "40px", backdropFilter: "blur(10px)"
        }}>
          <span style={{ fontSize: "18px" }}>✨</span>
          <span style={{ color: "#DDD6FE", fontSize: "15px", fontWeight: "600" }}>
انسى الدروس الخصوصية ومصاريفها. ميمو معاك 24 ساعة، بيشرح، بيحل، وبيعملك امتحانات.. وكل ده ببلاش!          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(48px, 10vw, 84px)", fontWeight: "900",
          lineHeight: "1.1", marginBottom: "28px", color: "white"
        }}>
          مدرسك الخصوصي<br />
          <span style={{
            background: "linear-gradient(135deg, #8B5CF6, #EC4899, #F59E0B, #8B5CF6)",
            backgroundSize: "300% 300%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "gradient 5s ease infinite"
          }}>بالذكاء الاصطناعي</span>
        </h1>

        <p style={{
          fontSize: "22px", color: "#A5B4FC", maxWidth: "650px",
          margin: "0 auto 56px", lineHeight: "1.9"
        }}>
          ميمو بيفهمك، بيشرحلك بالمصري، وبيساعدك تجيب أعلى الدرجات!<br />
          <strong style={{ color: "#C4B5FD" }}>متاح 24 ساعة × 7 أيام مجاناً! 🎉</strong>
        </p>

        <button onClick={() => setCurrentPage("chat")} style={{
          padding: "24px 56px", fontSize: "24px", fontWeight: "800",
          background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
          border: "none", borderRadius: "20px", color: "white", cursor: "pointer",
          boxShadow: "0 20px 60px rgba(139, 92, 246, 0.6)",
          transition: "all 0.3s ease", fontFamily: "inherit"
        }}>ابدأ رحلتك مجاناً 🚀</button>

        {/* الإحصائيات */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "60px",
          marginTop: "80px", flexWrap: "wrap"
        }}>
          {[
            { number: "+50,000", label: "طالب سعيد 😊" },
            { number: "4.9 ⭐", label: "تقييم المستخدمين" },
            { number: "98%", label: "نسبة النجاح 🎯" }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "40px", fontWeight: "900",
                background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>{stat.number}</div>
              <div style={{ color: "#94A3B8", fontSize: "15px", marginTop: "8px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* المميزات */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "28px", maxWidth: "1100px", margin: "100px auto 0", padding: "0 20px"
        }}>
          {[
            { icon: "🧠", title: "ذكاء اصطناعي فائق", desc: "بيفهم العامية المصرية ويرد عليك زي المدرس الحقيقي بالظبط!", color: "#8B5CF6" },
            { icon: "📚", title: "المنهج المصري كامل", desc: "من KG لحد ثانوية عامة، كل المواد والدروس متاحة ومحدثة.", color: "#3B82F6" },
            { icon: "🎯", title: "امتحانات ذكية", desc: "بيعملك امتحانات على مستواك ويصححها فوراً ويقولك غلطت فين.", color: "#10B981" },
            { icon: "📖", title: "تحفيظ القرآن", desc: "نظام متكامل لحفظ القرآن الكريم مع متابعة وتصحيح.", color: "#059669" },
            { icon: "📅", title: "جدول مذاكرة ذكي", desc: "بيعملك خطة مذاكرة مخصصة على حسب وقتك ومستواك.", color: "#F59E0B" },
            { icon: "💬", title: "دعم نفسي", desc: "لو حاسس بضغط أو قلق، ميمو موجود يسمعك ويساعدك!", color: "#EC4899" }
          ].map((f, i) => (
            <div key={i} style={{
              background: "rgba(30, 41, 59, 0.7)", backdropFilter: "blur(20px)",
              padding: "36px", borderRadius: "28px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              transition: "all 0.4s ease", cursor: "pointer"
            }}>
              <div style={{
                width: "72px", height: "72px",
                background: `linear-gradient(135deg, ${f.color}50, ${f.color}25)`,
                borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "36px", marginBottom: "24px", boxShadow: `0 8px 32px ${f.color}30`
              }}>{f.icon}</div>
              <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "14px", color: "white" }}>{f.title}</h3>
              <p style={{ color: "#A5B4FC", fontSize: "16px", lineHeight: "1.8" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer style={{
        textAlign: "center", padding: "40px", borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        marginTop: "100px", position: "relative", zIndex: 10
      }}>
        <p style={{ color: "#64748B", fontSize: "15px" }}>
          © 2026 ميمو - صنع بكل ❤️ بواسطة المهندس محمد ربيع
        </p>
      </footer>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 0.4; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>
    </div>
  );

  // ============ صفحة الشات ============
  const ChatPage = () => (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      background: "linear-gradient(180deg, #0a0a0f 0%, #1a1025 50%, #0f1729 100%)"
    }}>
      <div style={{
        padding: "24px 28px", background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(139, 92, 246, 0.3)",
        display: "flex", alignItems: "center", gap: "18px"
      }}>
        <div style={{
          width: "56px", height: "56px",
          background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "28px", boxShadow: "0 8px 32px rgba(139, 92, 246, 0.5)"
        }}>🤖</div>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "white", margin: 0 }}>ميمو - المساعد الذكي</h2>
          <p style={{
            fontSize: "14px", margin: 0, color: isLoading ? "#FBBF24" : "#4ADE80",
            display: "flex", alignItems: "center", gap: "8px"
          }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: isLoading ? "#FBBF24" : "#4ADE80" }} />
            {isLoading ? "بيفكر في الإجابة... 🤔" : "متصل ومستنيك! 💚"}
          </p>
        </div>
      </div>

      <div style={{ flex: 1, padding: "28px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: "flex", alignItems: "flex-start", gap: "14px", justifyContent: msg.isBot ? "flex-start" : "flex-end" }}>
            {msg.isBot && (
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0
              }}>🤖</div>
            )}
            <div style={{
              maxWidth: "75%", padding: "18px 24px",
              borderRadius: msg.isBot ? "24px 24px 24px 6px" : "24px 24px 6px 24px",
              background: msg.isBot
                ? "linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(30, 41, 59, 0.8))"
                : "linear-gradient(135deg, #8B5CF6, #EC4899)",
              color: "white", fontSize: "16px", lineHeight: "1.9",
              boxShadow: msg.isBot ? "0 6px 24px rgba(0, 0, 0, 0.3)" : "0 6px 24px rgba(139, 92, 246, 0.4)",
              border: msg.isBot ? "1px solid rgba(139, 92, 246, 0.2)" : "none", whiteSpace: "pre-wrap"
            }}>{msg.text}</div>
            {!msg.isBot && (
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                background: "linear-gradient(135deg, #EC4899, #F59E0B)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0
              }}>👤</div>
            )}
          </div>
        ))}
        {isLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "50%",
              background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px"
            }}>🤖</div>
            <div style={{
              padding: "18px 28px", borderRadius: "24px 24px 24px 6px",
              background: "rgba(30, 41, 59, 0.9)", border: "1px solid rgba(139, 92, 246, 0.2)"
            }}>
              <div style={{ display: "flex", gap: "8px" }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: "12px", height: "12px", borderRadius: "50%",
                    background: ["#8B5CF6", "#EC4899", "#F59E0B"][i],
                    animation: `bounce 1s infinite ${i * 0.2}s`
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={sendMessage} isLoading={isLoading} />

      <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }`}</style>
    </div>
  );

  // ============ القائمة الجانبية ============
  const Sidebar = () => (
    <aside style={{
      width: "300px", background: "linear-gradient(180deg, rgba(10, 10, 15, 0.98) 0%, rgba(26, 16, 37, 0.98) 100%)",
      backdropFilter: "blur(24px)", borderLeft: "1px solid rgba(139, 92, 246, 0.2)",
      position: "fixed", right: 0, top: 0, bottom: 0, zIndex: 100,
      padding: "28px 20px", display: "flex", flexDirection: "column"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "48px", paddingRight: "10px" }}>
        <div style={{
          width: "52px", height: "52px", background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
          borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "24px", boxShadow: "0 8px 32px rgba(139, 92, 246, 0.4)"
        }}>🎓</div>
        <span style={{
          fontSize: "28px", fontWeight: "900",
          background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>ميمو</span>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        {menuItems.map((item) => (
          <button key={item.id} onClick={() => setCurrentPage(item.id)} style={{
            display: "flex", alignItems: "center", gap: "16px", padding: "16px 18px",
            background: currentPage === item.id ? `linear-gradient(135deg, ${item.color}40, ${item.color}20)` : "transparent",
            border: currentPage === item.id ? `2px solid ${item.color}60` : "2px solid transparent",
            borderRadius: "14px", color: currentPage === item.id ? "white" : "#A5B4FC",
            fontSize: "16px", fontWeight: currentPage === item.id ? "700" : "500",
            cursor: "pointer", transition: "all 0.3s ease", fontFamily: "inherit", textAlign: "right"
          }}>
            <span style={{ fontSize: "22px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={{
        padding: "20px", background: "rgba(139, 92, 246, 0.15)",
        borderRadius: "16px", border: "1px solid rgba(139, 92, 246, 0.3)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "50%",
            background: "linear-gradient(135deg, #EC4899, #F59E0B)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px"
          }}>👨‍🎓</div>
          <div>
            <div style={{ fontWeight: "700", color: "white" }}>محمد ربيع</div>
            <div style={{ color: "#A5B4FC", fontSize: "13px" }}>المؤسس والمطور 🚀</div>
          </div>
        </div>
      </div>
    </aside>
  );

  // ============ صفحات Placeholder ============
  const PlaceholderPage = ({ title, icon, desc }: { title: string; icon: string; desc: string }) => (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(180deg, #0a0a0f 0%, #1a1025 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px"
    }}>
      <div style={{
        width: "120px", height: "120px", background: "linear-gradient(135deg, #8B5CF640, #EC489940)",
        borderRadius: "32px", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "56px", marginBottom: "32px", boxShadow: "0 16px 48px rgba(139, 92, 246, 0.3)"
      }}>{icon}</div>
      <h1 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "16px", color: "white" }}>{title}</h1>
      <p style={{ color: "#A5B4FC", fontSize: "20px", textAlign: "center", maxWidth: "400px" }}>{desc}</p>
      <div style={{
        marginTop: "40px", padding: "16px 32px", background: "rgba(139, 92, 246, 0.2)",
        borderRadius: "12px", border: "1px solid rgba(139, 92, 246, 0.3)"
      }}>
        <span style={{ color: "#DDD6FE" }}>🚀 جاري التطوير - قريباً جداً!</span>
      </div>
    </div>
  );

  // ============ العرض الرئيسي ============
  if (currentPage === "home") return <HomePage />;

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f", color: "white",
      direction: "rtl", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <Sidebar />
      <main style={{ marginRight: "300px" }}>
        {currentPage === "chat" && <ChatPage />}
        {currentPage === "courses" && <PlaceholderPage title="مكتبة الكورسات" icon="📚" desc="كورسات شاملة لكل المواد الدراسية من أفضل المدرسين!" />}
        {currentPage === "exams" && <PlaceholderPage title="الامتحانات الذكية" icon="📝" desc="امتحانات تفاعلية بتتكيف مع مستواك وبتصحح فوراً!" />}
        {currentPage === "quran" && <PlaceholderPage title="تحفيظ القرآن" icon="📖" desc="نظام متكامل لحفظ ومراجعة القرآن الكريم!" />}
        {currentPage === "planner" && <PlaceholderPage title="جدول المذاكرة" icon="📅" desc="خطط مذاكرة ذكية مخصصة ليك على حسب وقتك!" />}
        {currentPage === "settings" && <PlaceholderPage title="الإعدادات" icon="⚙️" desc="تحكم في حسابك وإعدادات المنصة!" />}
      </main>
    </div>
  );
};

export default App;