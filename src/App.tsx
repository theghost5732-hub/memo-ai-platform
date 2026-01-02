import React, { useState, useEffect, useRef } from "react";
import { 
  Home, MessageCircle, Book, PenTool, 
  Calendar, Settings, Mic, Brain, 
  ChevronRight, Send, Menu, X 
} from "lucide-react";

// ==========================================
// 1. إعدادات ومكونات التصميم (iOS Style)
// ==========================================

const API_KEY = "AIzaSyA1BNXdW6Wa-RLXG7WtXOzXSR2PtPddE94"; // مفتاحك الجديد

// زرار القائمة (ستايل أيفون)
const MenuButton = ({ icon: Icon, label, isActive, onClick, colorClass }: any) => (
  <button
    onClick={onClick}
    className={`group w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 backdrop-blur-md border 
    ${isActive 
      ? "bg-white/10 border-white/20 shadow-lg shadow-black/20 translate-x-2" 
      : "bg-transparent border-transparent hover:bg-white/5 text-slate-400"}`}
  >
    <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110 ${colorClass}`}>
      <Icon size={20} strokeWidth={2.5} />
    </div>
    <span className={`font-bold text-sm tracking-wide ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}>
      {label}
    </span>
    {isActive && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>}
  </button>
);

// كارت الكورسات (Glass Card)
const CourseCard = ({ title, sub, color }: any) => (
  <div className="relative group overflow-hidden rounded-[24px] bg-[#1c1c1e] border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${color}`}></div>
    <div className="h-32 bg-[#2c2c2e] relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-20`}></div>
      <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10">
        ثانوية عامة
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-slate-500 text-xs leading-relaxed mb-4">{sub}</p>
      <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold border border-white/5 transition-all">
        بدء المذاكرة
      </button>
    </div>
  </div>
);

// ==========================================
// 2. صفحة الشات (The Brain)
// ==========================================

const ChatInterface = ({ messages, input, setInput, handleSend, isLoading }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#000000]">
      {/* Header */}
      <div className="h-20 bg-[#1c1c1e]/80 backdrop-blur-xl border-b border-white/5 flex items-center px-6 sticky top-0 z-20 justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Brain size={24} className="text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1c1c1e] rounded-full"></div>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">المساعد ميمو</h2>
            <p className="text-indigo-400 text-xs font-medium">يعمل بواسطة Gemini AI</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.map((msg: any) => (
          <div key={msg.id} className={`flex ${msg.isBot ? "justify-start" : "justify-end"} animate-fade-in-up`}>
            <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-[20px] text-[15px] leading-7 shadow-sm backdrop-blur-sm relative
              ${msg.isBot 
                ? "bg-[#1c1c1e] text-slate-200 rounded-tl-none border border-white/5" 
                : "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-purple-900/20"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-sm mr-4">
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-[#1c1c1e]/80 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-4xl mx-auto relative flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="اكتب سؤالك هنا..."
            className="flex-1 bg-[#2c2c2e] text-white px-6 py-4 rounded-[20px] border-none focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-500 font-cairo text-sm"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-90"
          >
            <Send size={20} className={isLoading ? "animate-pulse" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. التطبيق الرئيسي
// ==========================================

const App = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "أهلاً بيك يا بطل! 👋 أنا ميمو.. المدرس الشخصي بتاعك. جاهز نذاكر إيه النهاردة؟", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Logic الشات (تم التصحيح لـ gemini-pro) ---
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input;
    setMessages(prev => [...prev, { id: Date.now(), text: userText, isBot: false }]);
    setInput("");
    setIsLoading(true);

    try {
      // استخدام gemini-pro لأنه الأضمن
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `أنت ميمو، مدرس مصري شاطر. رد باللهجة المصرية: ${userText}` }] }]
          })
        }
      );

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "معلش الشبكة قطعت.. قول تاني؟";
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "حصل خطأ في الاتصال، تأكد من النت!", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const navTo = (id: string) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#000000] text-white font-cairo dir-rtl overflow-hidden">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed md:relative z-50 w-[280px] h-full bg-[#1c1c1e] border-l border-white/5 flex flex-col transition-transform duration-300 
        ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}>
        
        <div className="p-8 pb-4">
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
            <span className="text-indigo-500">.</span>ميمو
          </h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1 font-bold">المنصة الذكية</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
          <MenuButton icon={Home} label="الرئيسية" isActive={activeTab === 'home'} onClick={() => navTo('home')} colorClass="bg-gradient-to-br from-blue-500 to-cyan-500" />
          <MenuButton icon={MessageCircle} label="المساعد الذكي" isActive={activeTab === 'chat'} onClick={() => navTo('chat')} colorClass="bg-gradient-to-br from-indigo-500 to-purple-500" />
          <MenuButton icon={Book} label="الكورسات" isActive={activeTab === 'courses'} onClick={() => navTo('courses')} colorClass="bg-gradient-to-br from-orange-500 to-amber-500" />
          <MenuButton icon={PenTool} label="الامتحانات" isActive={activeTab === 'exams'} onClick={() => navTo('exams')} colorClass="bg-gradient-to-br from-emerald-500 to-teal-500" />
          <MenuButton icon={Calendar} label="الجدول" isActive={activeTab === 'planner'} onClick={() => navTo('planner')} colorClass="bg-gradient-to-br from-pink-500 to-rose-500" />
          <MenuButton icon={Settings} label="الإعدادات" isActive={activeTab === 'settings'} onClick={() => navTo('settings')} colorClass="bg-gradient-to-br from-slate-500 to-slate-700" />
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="bg-[#2c2c2e] rounded-2xl p-4 flex items-center gap-3 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold">M</div>
            <div>
              <h4 className="text-sm font-bold text-white">محمد ربيع</h4>
              <p className="text-[10px] text-indigo-400">طالب متميز</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full relative overflow-hidden bg-[#000000]">
        
        {/* Mobile Toggle */}
        {activeTab !== 'home' && (
          <button onClick={() => setSidebarOpen(true)} className="md:hidden absolute top-4 left-4 z-30 p-2 bg-[#1c1c1e] rounded-xl text-white shadow-lg border border-white/10">
            <Menu size={20} />
          </button>
        )}

        {/* --- Home Page --- */}
        {activeTab === 'home' && (
          <div className="h-full overflow-y-auto">
            <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden">
              {/* Animated Background */}
              <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>

              <div className="relative z-10 max-w-3xl">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                  الجيل القادم من التعليم
                </span>
                
                <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                  تعليمك <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient">بذكاء المستقبل</span>
                </h1>
                
                <p className="text-lg text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">
                  منصة ميمو التعليمية.. حيث يجتمع الذكاء الاصطناعي مع المنهج المصري لتقديم تجربة تعليمية لا مثيل لها.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button onClick={() => navTo('chat')} className="px-8 py-4 bg-white text-black font-bold rounded-[18px] hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                    ابدأ المحادثة الآن
                  </button>
                  <button onClick={() => navTo('courses')} className="px-8 py-4 bg-[#1c1c1e] text-white font-bold rounded-[18px] border border-white/10 hover:bg-[#2c2c2e] transition-colors">
                    استعراض الكورسات
                  </button>
                </div>
              </div>

              {/* Footer */}
              <footer className="absolute bottom-6 w-full text-center">
                <p className="text-[10px] text-slate-600 font-mono tracking-widest opacity-60">
                  Developed by Mohamed.Rabia19 @2026 294.empire
                </p>
              </footer>
            </div>
          </div>
        )}

        {/* --- Chat Page --- */}
        {activeTab === 'chat' && (
          <ChatInterface 
            messages={messages} 
            input={input} 
            setInput={setInput} 
            handleSend={handleSend} 
            isLoading={isLoading} 
          />
        )}

        {/* --- Courses Page --- */}
        {activeTab === 'courses' && (
          <div className="h-full overflow-y-auto p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-1 h-8 bg-indigo-500 rounded-full"></span>
                أحدث الكورسات
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CourseCard title="الفيزياء الكهربية" sub="شرح شامل للفصل الأول مع مستر محمد عبد المعبود" color="from-blue-500 to-cyan-500" />
                <CourseCard title="الكيمياء العضوية" sub="تأسيس من الصفر وحل معادلات صعبة" color="from-emerald-500 to-teal-500" />
                <CourseCard title="النحو والصرف" sub="مراجعة نهائية لكل قواعد النحو للثانوية" color="from-orange-500 to-amber-500" />
                <CourseCard title="اللغة الفرنسية" sub="كورس المحادثة والقواعد للمبتدئين" color="from-indigo-500 to-purple-500" />
              </div>
            </div>
          </div>
        )}

        {/* --- Placeholders --- */}
        {['exams', 'quran', 'planner', 'settings'].includes(activeTab) && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-24 h-24 rounded-[24px] bg-[#1c1c1e] border border-white/5 flex items-center justify-center text-5xl mb-6 shadow-2xl">
              🚧
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">جاري العمل على القسم</h2>
            <p className="text-slate-500">الفريق التقني يضع اللمسات الأخيرة..</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;