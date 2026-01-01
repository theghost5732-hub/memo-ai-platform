import { useState } from "react";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [messages, setMessages] = useState<{id: number; text: string; isBot: boolean}[]>([
    { id: 1, text: "أهلاً بيك يا بطل! 👋 أنا ميمو، مدرسك الخصوصي. اسألني أي سؤال وأنا جاهز أساعدك!", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userText = inputValue;
    const newUserMessage = { id: Date.now(), text: userText, isBot: false };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const apiKey = "AIzaSyBpvU_qU7ocojaPCh3hPY4mLmgnHNezTOs";
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `أنت "ميمو" - مدرس مصري ودود وذكي. رد دايماً باللهجة المصرية العامية بطريقة بسيطة ومفهومة. لو حد سألك مين عملك قول "المهندس محمد ربيع". السؤال: ${userText}`
              }]
            }]
          })
        }
      );

      const data = await response.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "معلش مفهمتش السؤال، ممكن تقوله تاني؟";
      
      const newBotMessage = { id: Date.now() + 1, text: aiText, isBot: true };
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
      
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = { id: Date.now() + 1, text: "في مشكلة في الاتصال، جرب تاني! 🔄", isBot: true };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
      background: "linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 25%, #16213E 50%, #1A1A2E 75%, #0F0F1A 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* الخلفية المتوهجة */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "20%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        animation: "pulse 4s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute",
        bottom: "20%",
        right: "10%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        animation: "pulse 5s ease-in-out infinite"
      }} />

      {/* الهيدر */}
      <nav style={{
        padding: "24px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        zIndex: 10
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <div style={{
            width: "50px",
            height: "50px",
            background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            boxShadow: "0 8px 32px rgba(139, 92, 246, 0.4)"
          }}>
            🎓
          </div>
          <span style={{
            fontSize: "32px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #8B5CF6, #EC4899, #8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% 200%"
          }}>
            ميمو
          </span>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <button
            onClick={() => setCurrentPage("chat")}
            style={{
              padding: "14px 32px",
              background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(139, 92, 246, 0.4)",
              transition: "all 0.3s ease",
              fontFamily: "inherit"
            }}
          >
            ابدأ المذاكرة 🚀
          </button>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <main style={{
        textAlign: "center",
        padding: "80px 24px",
        position: "relative",
        zIndex: 10
      }}>
        {/* الشارة */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 24px",
          background: "rgba(139, 92, 246, 0.15)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          borderRadius: "50px",
          marginBottom: "32px",
          backdropFilter: "blur(10px)"
        }}>
          <span style={{ fontSize: "16px" }}>✨</span>
          <span style={{ color: "#C4B5FD", fontSize: "14px", fontWeight: "500" }}>
            أول منصة تعليمية بالذكاء الاصطناعي في مصر
          </span>
        </div>

        {/* العنوان */}
        <h1 style={{
          fontSize: "clamp(40px, 8vw, 72px)",
          fontWeight: "900",
          lineHeight: "1.1",
          marginBottom: "24px",
          color: "white"
        }}>
          مدرسك الخصوصي
          <br />
          <span style={{
            background: "linear-gradient(135deg, #8B5CF6, #EC4899, #F59E0B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            بالذكاء الاصطناعي
          </span>
        </h1>

        {/* الوصف */}
        <p style={{
          fontSize: "20px",
          color: "#94A3B8",
          maxWidth: "600px",
          margin: "0 auto 48px",
          lineHeight: "1.8"
        }}>
          ميمو بيفهمك، بيشرحلك بالمصري، وبيساعدك تجيب أعلى الدرجات.
          <br />
          متاح 24 ساعة في اليوم، 7 أيام في الأسبوع!
        </p>

        {/* الزرار الرئيسي */}
        <button
          onClick={() => setCurrentPage("chat")}
          style={{
            padding: "20px 48px",
            fontSize: "22px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
            border: "none",
            borderRadius: "16px",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 16px 48px rgba(139, 92, 246, 0.5)",
            transition: "all 0.3s ease",
            fontFamily: "inherit"
          }}
        >
          ابدأ رحلتك مجاناً 🚀
        </button>

        {/* الإحصائيات */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "48px",
          marginTop: "64px",
          flexWrap: "wrap"
        }}>
          {[
            { number: "+10,000", label: "طالب" },
            { number: "4.9 ⭐", label: "تقييم" },
            { number: "95%", label: "نسبة نجاح" }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "32px",
                fontWeight: "800",
                background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                {stat.number}
              </div>
              <div style={{ color: "#64748B", fontSize: "14px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* المميزات */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          maxWidth: "1000px",
          margin: "80px auto 0",
          padding: "0 20px"
        }}>
          {[
            { icon: "🧠", title: "ذكاء اصطناعي متقدم", desc: "بيفهم العامية المصرية ويرد عليك زي المدرس بالظبط", color: "#8B5CF6" },
            { icon: "📚", title: "المنهج المصري كامل", desc: "من KG لحد ثانوية عامة، كل المواد متاحة", color: "#3B82F6" },
            { icon: "🎯", title: "امتحانات ذكية", desc: "بيعملك امتحانات على مستواك ويصححها فوراً", color: "#10B981" }
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                background: "rgba(30, 41, 59, 0.6)",
                backdropFilter: "blur(20px)",
                padding: "32px",
                borderRadius: "24px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s ease"
              }}
            >
              <div style={{
                width: "64px",
                height: "64px",
                background: `linear-gradient(135deg, ${feature.color}40, ${feature.color}20)`,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                marginBottom: "20px"
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px", color: "white" }}>
                {feature.title}
              </h3>
              <p style={{ color: "#94A3B8", fontSize: "15px", lineHeight: "1.7" }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* الفوتر */}
      <footer style={{
        textAlign: "center",
        padding: "32px",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        marginTop: "80px",
        position: "relative",
        zIndex: 10
      }}>
        <p style={{ color: "#64748B", fontSize: "14px" }}>
          © 2026 ميمو - صنع بـ  بواسطة المهندس محمد ربيع
        </p>
      </footer>
    </div>
  );

  // ============ صفحة الشات ============
  const ChatPage = () => (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 100%)"
    }}>
      {/* هيدر الشات */}
      <div style={{
        padding: "20px 24px",
        background: "rgba(30, 41, 59, 0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        alignItems: "center",
        gap: "16px"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          boxShadow: "0 4px 16px rgba(139, 92, 246, 0.4)"
        }}>
          🤖
        </div>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "white", margin: 0 }}>ميمو</h2>
          <p style={{
            fontSize: "13px",
            margin: 0,
            color: isLoading ? "#FBBF24" : "#4ADE80",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <span style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: isLoading ? "#FBBF24" : "#4ADE80"
            }} />
            {isLoading ? "بيكتب..." : "متصل الآن"}
          </p>
        </div>
      </div>

      {/* الرسائل */}
      <div style={{
        flex: 1,
        padding: "24px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.isBot ? "flex-start" : "flex-end"
            }}
          >
            <div style={{
              maxWidth: "75%",
              padding: "16px 20px",
              borderRadius: msg.isBot ? "20px 20px 20px 4px" : "20px 20px 4px 20px",
              background: msg.isBot
                ? "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(30, 41, 59, 0.7))"
                : "linear-gradient(135deg, #8B5CF6, #EC4899)",
              color: "white",
              fontSize: "15px",
              lineHeight: "1.8",
              boxShadow: msg.isBot
                ? "0 4px 16px rgba(0, 0, 0, 0.2)"
                : "0 4px 16px rgba(139, 92, 246, 0.3)",
              border: msg.isBot ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
              whiteSpace: "pre-wrap"
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "16px 24px",
              borderRadius: "20px 20px 20px 4px",
              background: "rgba(30, 41, 59, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}>
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#8B5CF6",
                  animation: "bounce 1s infinite"
                }} />
                <span style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#EC4899",
                  animation: "bounce 1s infinite 0.2s"
                }} />
                <span style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#F59E0B",
                  animation: "bounce 1s infinite 0.4s"
                }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* صندوق الكتابة */}
      <div style={{
        padding: "20px 24px",
        background: "rgba(30, 41, 59, 0.8)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        gap: "12px"
      }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="اكتب سؤالك هنا..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: "16px 20px",
            background: "rgba(51, 65, 85, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "14px",
            color: "white",
            fontSize: "16px",
            outline: "none",
            fontFamily: "inherit",
            transition: "all 0.3s ease"
          }}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !inputValue.trim()}
          style={{
            padding: "16px 32px",
            background: isLoading || !inputValue.trim()
              ? "rgba(107, 114, 128, 0.5)"
              : "linear-gradient(135deg, #8B5CF6, #EC4899)",
            border: "none",
            borderRadius: "14px",
            color: "white",
            fontSize: "16px",
            fontWeight: "700",
            cursor: isLoading || !inputValue.trim() ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "all 0.3s ease",
            boxShadow: isLoading || !inputValue.trim()
              ? "none"
              : "0 4px 16px rgba(139, 92, 246, 0.4)"
          }}
        >
          {isLoading ? "⏳" : "إرسال 🚀"}
        </button>
      </div>
    </div>
  );

  // ============ القائمة الجانبية ============
  const Sidebar = () => (
    <aside style={{
      width: "280px",
      background: "linear-gradient(180deg, rgba(15, 15, 26, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)",
      backdropFilter: "blur(20px)",
      borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
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
        gap: "12px",
        marginBottom: "40px",
        paddingRight: "8px"
      }}>
        <div style={{
          width: "44px",
          height: "44px",
          background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px"
        }}>
          🎓
        </div>
        <span style={{
          fontSize: "24px",
          fontWeight: "800",
          background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          ميمو
        </span>
      </div>

      {/* القائمة */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "14px 16px",
              background: currentPage === item.id
                ? `linear-gradient(135deg, ${item.color}30, ${item.color}10)`
                : "transparent",
              border: currentPage === item.id
                ? `1px solid ${item.color}50`
                : "1px solid transparent",
              borderRadius: "12px",
              color: currentPage === item.id ? "white" : "#94A3B8",
              fontSize: "15px",
              fontWeight: currentPage === item.id ? "600" : "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "inherit",
              textAlign: "right"
            }}
          >
            <span style={{ fontSize: "20px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );

  // ============ صفحات أخرى ============
  const PlaceholderPage = ({ title, icon }: { title: string; icon: string }) => (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "40px"
    }}>
      <div style={{
        width: "100px",
        height: "100px",
        background: "linear-gradient(135deg, #8B5CF630, #EC489930)",
        borderRadius: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "48px",
        marginBottom: "24px"
      }}>
        {icon}
      </div>
      <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "12px", color: "white" }}>
        {title}
      </h1>
      <p style={{ color: "#94A3B8", fontSize: "18px" }}>
        الصفحة دي تحت التطوير وهتكون جاهزة قريباً! 🚧
      </p>
    </div>
  );

  // ============ العرض الرئيسي ============
  if (currentPage === "home") {
    return <HomePage />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0F0F1A",
      color: "white",
      direction: "rtl",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
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
};

export default App;