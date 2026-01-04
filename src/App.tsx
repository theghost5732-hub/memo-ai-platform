import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";

// ============ Types ============
interface Message {
  id: number;
  text: string;
  isBot: boolean;
  model: string;
  timestamp: Date;
}

interface ConversationHistory {
  role: "system" | "user" | "assistant";
  content: string;
}

// ============ API Configuration ============
// ⚠️ في Production استخدم Environment Variables
const getAPIKeys = () => ({
  groq: import.meta.env.VITE_GROQ_API_KEY || "YOUR_GROQ_KEY",
  gemini: import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_KEY",
  openrouter: import.meta.env.VITE_OPENROUTER_API_KEY || "YOUR_OPENROUTER_KEY",
  openai: import.meta.env.VITE_OPENAI_API_KEY || "YOUR_OPENAI_KEY",
});

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

// ============ Glassmorphism Theme ============
const theme = {
  colors: {
    primary: "#8B5CF6",
    secondary: "#EC4899",
    accent: "#F59E0B",
    success: "#4ADE80",
    warning: "#FBBF24",
    error: "#EF4444",
    background: {
      dark: "#0a0a0f",
      medium: "#1a1025",
      light: "#0f1729"
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#A5B4FC",
      muted: "#64748B"
    }
  },
  glass: {
    background: "rgba(30,41,59,0.7)",
    border: "rgba(139,92,246,0.3)",
    blur: "blur(20px)"
  },
  gradients: {
    primary: "linear-gradient(135deg, #8B5CF6, #EC4899)",
    secondary: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
    background: "linear-gradient(135deg, #0a0a0f, #1a1025, #0f1729)"
  },
  shadows: {
    glow: "0 8px 32px rgba(139,92,246,0.5)",
    card: "0 4px 20px rgba(0,0,0,0.3)"
  }
};

// ============ Utility: Fetch with Timeout ============
const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 30000): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// ============ AI Model Callers ============
const callGroq = async (history: ConversationHistory[]): Promise<string> => {
  const response = await fetchWithTimeout(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getAPIKeys().groq}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: history,
        temperature: 0.7,
        max_tokens: 2048
      })
    },
    25000
  );
  
  if (!response.ok) throw new Error(`Groq error: ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
};

const callGemini = async (history: ConversationHistory[]): Promise<string> => {
  const formattedHistory = history.map(msg => ({
    role: msg.role === "assistant" ? "model" : msg.role === "system" ? "user" : "user",
    parts: [{ text: msg.content }]
  }));
  
  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${getAPIKeys().gemini}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: formattedHistory })
    },
    25000
  );
  
  if (!response.ok) throw new Error(`Gemini error: ${response.status}`);
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

const callOpenRouter = async (history: ConversationHistory[]): Promise<string> => {
  const response = await fetchWithTimeout(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getAPIKeys().openrouter}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Memo AI"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
        messages: history
      })
    },
    30000
  );
  
  if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
};

const callOpenAI = async (history: ConversationHistory[]): Promise<string> => {
  const response = await fetchWithTimeout(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getAPIKeys().openai}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: history
      })
    },
    30000
  );
  
  if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
};

// ============ Smart Router with Retry ============
const getAIResponse = async (
  message: string,
  conversationHistory: ConversationHistory[],
  onModelChange: (model: string) => void
): Promise<{ text: string; model: string }> => {
  
  const history: ConversationHistory[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...conversationHistory.slice(-10), // آخر 10 رسائل للـ context
    { role: "user", content: message }
  ];

  const models = [
    { name: "Groq (Llama 3.3)", fn: () => callGroq(history), icon: "🦙" },
    { name: "Gemini 2.0", fn: () => callGemini(history), icon: "✨" },
    { name: "Claude 3.5", fn: () => callOpenRouter(history), icon: "🧠" },
    { name: "GPT-4o", fn: () => callOpenAI(history), icon: "🤖" }
  ];

  for (const model of models) {
    try {
      onModelChange(`${model.icon} جاري الاتصال بـ ${model.name}...`);
      const response = await model.fn();
      
      if (response && response.length > 10) {
        return { text: response, model: model.name };
      }
    } catch (error) {
      console.log(`${model.name} failed:`, error);
      onModelChange(`⚠️ ${model.name} فشل، جاري تجربة موديل تاني...`);
      await new Promise(r => setTimeout(r, 500));
    }
  }

  return { 
    text: "معلش كل الموديلات مشغولة دلوقتي 😅\nجرب تاني كمان شوية! 🔄", 
    model: "None" 
  };
};

// ============ Local Storage Helpers ============
const saveMessages = (messages: Message[]) => {
  try {
    localStorage.setItem("memo_messages", JSON.stringify(messages));
  } catch (e) {
    console.error("Failed to save messages:", e);
  }
};

const loadMessages = (): Message[] => {
  try {
    const saved = localStorage.getItem("memo_messages");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) }));
    }
  } catch (e) {
    console.error("Failed to load messages:", e);
  }
  return [];
};

// ============ Chat Input Component ============
function ChatInputBox({ 
  onSendMessage, 
  loading 
}: { 
  onSendMessage: (msg: string) => void; 
  loading: boolean 
}) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (text.trim() && !loading) {
      onSendMessage(text.trim());
      setText("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  return (
    <div style={{
      padding: "20px 24px",
      background: "rgba(15,23,42,0.98)",
      backdropFilter: theme.glass.blur,
      borderTop: `1px solid ${theme.glass.border}`,
      display: "flex",
      gap: "12px"
    }}>
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="اسأل ميمو أي سؤال... 💭"
        disabled={loading}
        autoComplete="off"
        style={{
          flex: 1,
          padding: "18px 24px",
          background: "rgba(30,41,59,0.9)",
          border: `2px solid ${theme.glass.border}`,
          borderRadius: "16px",
          color: "white",
          fontSize: "17px",
          outline: "none",
          fontFamily: "inherit",
          transition: "border-color 0.3s, box-shadow 0.3s"
        }}
        onFocus={(e) => {
          e.target.style.borderColor = theme.colors.primary;
          e.target.style.boxShadow = `0 0 20px ${theme.colors.primary}40`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = theme.glass.border;
          e.target.style.boxShadow = "none";
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
        style={{
          padding: "18px 40px",
          background: loading || !text.trim() ? "#475569" : theme.gradients.primary,
          border: "none",
          borderRadius: "16px",
          color: "white",
          fontSize: "17px",
          fontWeight: "700",
          cursor: loading || !text.trim() ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          boxShadow: loading || !text.trim() ? "none" : theme.shadows.glow,
          transition: "all 0.3s",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        {loading ? (
          <>
            <span className="spinner">⏳</span>
          </>
        ) : (
          <>إرسال 🚀</>
        )}
      </button>
    </div>
  );
}

// ============ Message Bubble Component ============
function MessageBubble({ message }: { message: Message }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (message.isBot && message.model !== "System") {
      setIsTyping(true);
      let index = 0;
      const interval = setInterval(() => {
        if (index < message.text.length) {
          setDisplayedText(message.text.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 15);
      return () => clearInterval(interval);
    } else {
      setDisplayedText(message.text);
    }
  }, [message]);

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      justifyContent: message.isBot ? "flex-start" : "flex-end",
      animation: "fadeIn 0.3s ease-out"
    }}>
      {message.isBot && (
        <div style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: theme.gradients.secondary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          flexShrink: 0,
          boxShadow: theme.shadows.glow
        }}>
          🤖
        </div>
      )}
      
      <div style={{ maxWidth: "75%" }}>
        <div style={{
          padding: "16px 20px",
          borderRadius: message.isBot ? "20px 20px 20px 6px" : "20px 20px 6px 20px",
          background: message.isBot ? theme.glass.background : theme.gradients.primary,
          backdropFilter: message.isBot ? theme.glass.blur : "none",
          color: "white",
          fontSize: "15px",
          lineHeight: "1.8",
          boxShadow: message.isBot ? theme.shadows.card : theme.shadows.glow,
          border: message.isBot ? `1px solid ${theme.glass.border}` : "none",
          whiteSpace: "pre-wrap"
        }}>
          {displayedText}
          {isTyping && <span className="cursor">|</span>}
        </div>
        
        {message.isBot && message.model && message.model !== "System" && (
          <div style={{
            marginTop: "6px",
            fontSize: "11px",
            color: theme.colors.text.muted,
            paddingRight: "8px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <span style={{ color: theme.colors.success }}>⚡</span>
            {message.model}
          </div>
        )}
      </div>
      
      {!message.isBot && (
        <div style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #EC4899, #F59E0B)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          flexShrink: 0
        }}>
          👤
        </div>
      )}
    </div>
  );
}

// ============ Main App ============
function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = loadMessages();
    if (saved.length > 0) return saved;
    return [{
      id: 1,
      text: "أهلاً بيك يا بطل! 👋\n\nأنا ميمو، مدرسك الخصوصي بالذكاء الاصطناعي.\n\n🧠 بستخدم 4 موديلات AI عشان أديك أدق إجابة!\n\n📚 اسألني أي سؤال في أي مادة!",
      isBot: true,
      model: "System",
      timestamp: new Date()
    }];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save messages
  useEffect(() => {
    if (messages.length > 1) {
      saveMessages(messages);
    }
  }, [messages]);

  // Build conversation history for AI
  const getConversationHistory = (): ConversationHistory[] => {
    return messages
      .filter(m => m.model !== "System")
      .map(m => ({
        role: m.isBot ? "assistant" as const : "user" as const,
        content: m.text
      }));
  };

  const handleSendMessage = async (userText: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text: userText,
      isBot: false,
      model: "",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setCurrentModel("🔍 جاري البحث عن أفضل موديل...");

    try {
      const { text, model } = await getAIResponse(
        userText,
        getConversationHistory(),
        setCurrentModel
      );
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text,
        isBot: true,
        model,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "حصل مشكلة غير متوقعة 😅\nجرب تاني! 🔄",
        isBot: true,
        model: "Error",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setCurrentModel("");
    }
  };

  const clearChat = () => {
    if (confirm("متأكد إنك عايز تمسح المحادثة؟")) {
      const welcomeMessage: Message = {
        id: Date.now(),
        text: "تم مسح المحادثة! 🧹\n\nازيك؟ عايز تسأل عن إيه النهارده؟ 📚",
        isBot: true,
        model: "System",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      localStorage.removeItem("memo_messages");
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

  // ============ Global Styles ============
  const globalStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes cursor {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    
    .cursor {
      animation: cursor 0.8s infinite;
      color: ${theme.colors.primary};
    }
    
    .spinner {
      animation: pulse 1s infinite;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Segoe UI', 'Cairo', sans-serif;
      background: ${theme.colors.background.dark};
      color: white;
      direction: rtl;
    }
    
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: rgba(0,0,0,0.2);
    }
    
    ::-webkit-scrollbar-thumb {
      background: ${theme.colors.primary}50;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: ${theme.colors.primary};
    }
    
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(100%);
        transition: transform 0.3s;
      }
      .sidebar.open {
        transform: translateX(0);
      }
      .main-content {
        margin-right: 0 !important;
      }
    }
  `;

  // ============ Home Page ============
  const HomePage = () => (
    <div style={{
      minHeight: "100vh",
      background: theme.gradients.background,
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated Background Orbs */}
      <div style={{
        position: "absolute",
        top: "5%",
        left: "15%",
        width: "500px",
        height: "500px",
        background: `radial-gradient(circle, ${theme.colors.primary}40, transparent 70%)`,
        borderRadius: "50%",
        filter: "blur(80px)",
        animation: "float 6s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "10%",
        width: "400px",
        height: "400px",
        background: `radial-gradient(circle, ${theme.colors.secondary}35, transparent 70%)`,
        borderRadius: "50%",
        filter: "blur(80px)",
        animation: "float 8s ease-in-out infinite reverse"
      }} />

      {/* Navigation */}
      <nav style={{
        padding: "28px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            background: theme.gradients.primary,
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            boxShadow: theme.shadows.glow
          }}>
            🎓
          </div>
          <span style={{
            fontSize: "36px",
            fontWeight: "900",
            background: theme.gradients.primary,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            ميمو
          </span>
        </div>
        <button
          onClick={() => setCurrentPage("chat")}
          style={{
            padding: "16px 36px",
            background: theme.gradients.primary,
            border: "none",
            borderRadius: "14px",
            color: "white",
            fontSize: "17px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: theme.shadows.glow,
            transition: "transform 0.3s, box-shadow 0.3s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ابدأ المذاكرة 🚀
        </button>
      </nav>

      {/* Hero Section */}
      <main style={{
        textAlign: "center",
        padding: "80px 24px",
        position: "relative",
        zIndex: 10
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 28px",
          background: `${theme.colors.primary}20`,
          border: `1px solid ${theme.colors.primary}40`,
          borderRadius: "50px",
          marginBottom: "40px",
          animation: "fadeIn 0.5s ease-out"
        }}>
          <span>🔥</span>
          <span style={{ color: "#DDD6FE", fontSize: "15px", fontWeight: "600" }}>
            يعمل بـ 4 نماذج ذكاء اصطناعي معاً!
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(42px, 10vw, 76px)",
          fontWeight: "900",
          lineHeight: "1.1",
          marginBottom: "28px",
          color: "white",
          animation: "fadeIn 0.7s ease-out"
        }}>
          مدرسك الخصوصي<br />
          <span style={{
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary}, ${theme.colors.accent})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            بالذكاء الاصطناعي
          </span>
        </h1>

        <p style={{
          fontSize: "20px",
          color: theme.colors.text.secondary,
          maxWidth: "650px",
          margin: "0 auto 50px",
          lineHeight: "1.9",
          animation: "fadeIn 0.9s ease-out"
        }}>
          ميمو بيستخدم <strong style={{ color: "white" }}>Claude + GPT + Gemini + Llama</strong><br />
          عشان يديك أدق وأفضل إجابة! 🎯
        </p>

        <button
          onClick={() => setCurrentPage("chat")}
          style={{
            padding: "22px 52px",
            fontSize: "22px",
            fontWeight: "800",
            background: theme.gradients.primary,
            border: "none",
            borderRadius: "18px",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 20px 60px rgba(139,92,246,0.6)",
            transition: "transform 0.3s",
            animation: "fadeIn 1.1s ease-out"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          ابدأ رحلتك مجاناً 🚀
        </button>

        {/* AI Models Badges */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "60px",
          flexWrap: "wrap"
        }}>
          {[
            { name: "Claude 3.5", color: "#E87B35", icon: "🧠" },
            { name: "GPT-4o", color: "#10B981", icon: "🤖" },
            { name: "Gemini 2.0", color: "#4285F4", icon: "✨" },
            { name: "Llama 3.3", color: "#8B5CF6", icon: "🦙" }
          ].map((m, i) => (
            <div
              key={i}
              style={{
                padding: "12px 24px",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: theme.glass.blur,
                border: `1px solid ${m.color}50`,
                borderRadius: "12px",
                color: m.color,
                fontWeight: "600",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                animation: `fadeIn ${1 + i * 0.1}s ease-out`
              }}
            >
              <span>{m.icon}</span>
              {m.name} ✓
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          maxWidth: "1000px",
          margin: "80px auto 0",
          padding: "0 20px"
        }}>
          {[
            { icon: "🧠", title: "Multi-Model AI", desc: "4 موديلات بتشتغل معاً عشان أدق إجابة", color: theme.colors.primary },
            { icon: "⚡", title: "Auto Fallback", desc: "لو موديل وقع، التاني بيشتغل تلقائي", color: theme.colors.accent },
            { icon: "💾", title: "حفظ المحادثات", desc: "محادثاتك محفوظة ومش هتضيع!", color: theme.colors.success }
          ].map((f, i) => (
            <div
              key={i}
              style={{
                background: theme.glass.background,
                backdropFilter: theme.glass.blur,
                padding: "32px",
                borderRadius: "24px",
                border: `1px solid ${theme.glass.border}`,
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "default"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = `0 20px 40px ${f.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                width: "64px",
                height: "64px",
                background: `linear-gradient(135deg, ${f.color}50, ${f.color}25)`,
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                marginBottom: "20px"
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontSize: "20px",
                fontWeight: "700",
                marginBottom: "12px",
                color: "white"
              }}>
                {f.title}
              </h3>
              <p style={{
                color: theme.colors.text.secondary,
                fontSize: "15px",
                lineHeight: "1.7"
              }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "40px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        marginTop: "80px",
        position: "relative",
        zIndex: 10
      }}>
        <p style={{ color: theme.colors.text.muted }}>
          Developed with ❤️ by Mohamed.Rabia19 | @2025 294.empire
        </p>
      </footer>
    </div>
  );

  // ============ Chat Page ============
  const ChatPage = () => (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: `linear-gradient(180deg, ${theme.colors.background.dark}, ${theme.colors.background.medium})`
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 28px",
        background: "rgba(15,23,42,0.98)",
        backdropFilter: theme.glass.blur,
        borderBottom: `1px solid ${theme.glass.border}`,
        display: "flex",
        alignItems: "center",
        gap: "18px"
      }}>
        <div style={{
          width: "52px",
          height: "52px",
          background: theme.gradients.primary,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "26px",
          boxShadow: theme.shadows.glow
        }}>
          🤖
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "white", margin: 0 }}>
            ميمو - Multi-Model AI
          </h2>
          <p style={{
            fontSize: "13px",
            margin: 0,
            color: isLoading ? theme.colors.warning : theme.colors.success,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: isLoading ? theme.colors.warning : theme.colors.success,
              animation: isLoading ? "pulse 1s infinite" : "none"
            }} />
            {isLoading ? currentModel || "بيفكر..." : "Claude + GPT + Gemini + Llama"}
          </p>
        </div>
        <button
          onClick={clearChat}
          style={{
            padding: "10px 16px",
            background: "rgba(239,68,68,0.2)",
            border: `1px solid ${theme.colors.error}50`,
            borderRadius: "10px",
            color: theme.colors.error,
            cursor: "pointer",
            fontSize: "14px",
            marginLeft: "10px"
          }}
        >
          🗑️ مسح
        </button>
        <button
          onClick={() => setCurrentPage("home")}
          style={{
            padding: "10px 20px",
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: "10px",
            color: "white",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          ← رجوع
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: "24px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {isLoading && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            animation: "fadeIn 0.3s ease-out"
          }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: theme.gradients.secondary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              boxShadow: theme.shadows.glow
            }}>
              🤖
            </div>
            <div style={{
              padding: "16px 24px",
              borderRadius: "20px 20px 20px 6px",
              background: theme.glass.background,
              backdropFilter: theme.glass.blur,
              border: `1px solid ${theme.glass.border}`
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: theme.colors.text.secondary
              }}>
                <span className="spinner">🔍</span>
                <span>{currentModel || "بيدور على أفضل إجابة..."}</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <ChatInputBox onSendMessage={handleSendMessage} loading={isLoading} />
    </div>
  );

  // ============ Sidebar ============
  const Sidebar = () => (
    <aside
      className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}
      style={{
        width: "260px",
        background: `linear-gradient(180deg, rgba(10,10,15,0.98), rgba(26,16,37,0.98))`,
        backdropFilter: theme.glass.blur,
        borderLeft: `1px solid ${theme.glass.border}`,
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Logo */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "40px"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          background: theme.gradients.primary,
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          boxShadow: theme.shadows.glow
        }}>
          🎓
        </div>
        <span style={{
          fontSize: "24px",
          fontWeight: "900",
          background: theme.gradients.primary,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          ميمو
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentPage(item.id);
              setIsMobileMenuOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "14px 16px",
              background: currentPage === item.id
                ? `linear-gradient(135deg, ${theme.colors.primary}30, ${theme.colors.secondary}20)`
                : "transparent",
              border: currentPage === item.id
                ? `1px solid ${theme.colors.primary}50`
                : "1px solid transparent",
              borderRadius: "12px",
              color: currentPage === item.id ? "white" : theme.colors.text.secondary,
              fontSize: "15px",
              fontWeight: currentPage === item.id ? "600" : "500",
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "right",
              transition: "all 0.3s"
            }}
          >
            <span style={{ fontSize: "20px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Active Models Status */}
      <div style={{
        padding: "16px",
        background: `${theme.colors.primary}10`,
        borderRadius: "12px",
        border: `1px solid ${theme.colors.primary}20`
      }}>
        <div style={{
          fontSize: "12px",
          color: theme.colors.text.secondary,
          marginBottom: "8px"
        }}>
          🔥 Active Models
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {["Claude", "GPT", "Gemini", "Llama"].map((m, i) => (
            <span
              key={i}
              style={{
                padding: "4px 8px",
                background: `${theme.colors.success}20`,
                borderRadius: "6px",
                fontSize: "10px",
                color: theme.colors.success
              }}
            >
              {m} ✓
            </span>
          ))}
        </div>
      </div>
    </aside>
  );

  // ============ Placeholder Page ============
  const PlaceholderPage = ({ title, icon }: { title: string; icon: string }) => (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(180deg, ${theme.colors.background.dark}, ${theme.colors.background.medium})`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px"
    }}>
      <div style={{
        width: "100px",
        height: "100px",
        background: `linear-gradient(135deg, ${theme.colors.primary}30, ${theme.colors.secondary}20)`,
        borderRadius: "28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "48px",
        marginBottom: "28px",
        animation: "float 3s ease-in-out infinite"
      }}>
        {icon}
      </div>
      <h1 style={{
        fontSize: "32px",
        fontWeight: "800",
        marginBottom: "14px",
        color: "white"
      }}>
        {title}
      </h1>
      <p style={{ color: theme.colors.text.secondary, fontSize: "18px" }}>
        🚀 جاري التطوير - قريباً!
      </p>
    </div>
  );

  // ============ Mobile Menu Button ============
  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: theme.gradients.primary,
        border: "none",
        color: "white",
        fontSize: "24px",
        cursor: "pointer",
        zIndex: 101,
        display: "none",
        boxShadow: theme.shadows.glow
      }}
      className="mobile-menu-btn"
    >
      {isMobileMenuOpen ? "✕" : "☰"}
    </button>
  );

  // ============ Render ============
  if (currentPage === "home") {
    return (
      <>
        <style>{globalStyles}</style>
        <HomePage />
      </>
    );
  }

  return (
    <>
      <style>{globalStyles}</style>
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
      <div style={{
        minHeight: "100vh",
        background: theme.colors.background.dark,
        color: "white",
        direction: "rtl",
        fontFamily: "'Segoe UI', 'Cairo', sans-serif"
      }}>
        <Sidebar />
        <MobileMenuButton />
        <main className="main-content" style={{ marginRight: "260px" }}>
          {currentPage === "chat" && <ChatPage />}
          {currentPage === "courses" && <PlaceholderPage title="مكتبة الكورسات" icon="📚" />}
          {currentPage === "exams" && <PlaceholderPage title="الامتحانات الذكية" icon="📝" />}
          {currentPage === "quran" && <PlaceholderPage title="تحفيظ القرآن" icon="📖" />}
          {currentPage === "planner" && <PlaceholderPage title="جدول المذاكرة" icon="📅" />}
          {currentPage === "settings" && <PlaceholderPage title="الإعدادات" icon="⚙️" />}
        </main>
      </div>
    </>
  );
}

export default App;