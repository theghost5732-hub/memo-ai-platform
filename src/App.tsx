import React, { useState, useEffect, useRef } from "react";

// ==========================================
// 1. المكونات الفرعية (مفصولة عشان الشات ميهنجش)
// ==========================================

const SidebarItem = ({ icon, label, id, active, onClick }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group font-cairo
    ${active 
      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 border border-white/10" 
      : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
  >
    <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
    <span className="font-bold text-sm md:text-base">{label}</span>
  </button>
);

const ChatPage = ({ messages, input, setInput, sendMessage, isLoading }: any) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#020617]">
      {/* هيدر الشات */}
      <div className="p-4 bg-[#1e293b]/50 backdrop-blur-md border-b border-white/5 flex items-center gap-3 sticky top-0 z-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-xl shadow-lg">🤖</div>
        <div>
          <h3 className="font-bold text-white">المساعد ميمو</h3>
          <p className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> متصل الآن
          </p>
        </div>
      </div>

      {/* منطقة الرسائل */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg: any) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.isBot ? "flex-row" : "flex-row-reverse"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 border border-white/10
              ${msg.isBot ? "bg-[#1e293b]" : "bg-violet-600"}`}>
              {msg.isBot ? "🤖" : "👤"}
            </div>
            
            <div className={`max-w-[85%] p-4 rounded-2xl text-base leading-relaxed shadow-lg backdrop-blur-sm
              ${msg.isBot 
                ? "bg-[#1e293b]/80 border border-white/5 text-slate-200 rounded-tl-none" 
                : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-tr-none"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 mr-12 text-sm">
             ميمو بيكتب...
             <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
             <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* منطقة الكتابة */}
      <div className="p-4 bg-[#020617] border-t border-white/5">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="اسأل ميمو في أي مادة..."
            className="flex-1 bg-[#1e293b] text-white px-5 py-4 rounded-xl border border-white/5 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder:text-slate-600 font-cairo"
            disabled={isLoading}
            autoFocus
          />
          <button 
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🚀
          </button>
        </div>
      </div>
    </div>
  );
};

const CoursesPage = () => (
  <div className="p-6 md:p-8 animate-fade-in pb-20">
    <h2 className="text-3xl font-black text-white mb-8 border-r-4 border-violet-500 pr-4">📚 المواد الدراسية</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { title: "الفيزياء الحديثة", level: "3 ثانوي", color: "from-blue-500 to-cyan-500" },
        { title: "الكيمياء العضوية", level: "3 ثانوي", color: "from-emerald-500 to-teal-500" },
        { title: "اللغة العربية", level: "عام", color: "from-orange-500 to-amber-500" }
      ].map((course, i) => (
        <div key={i} className="bg-[#1e293b]/50 border border-white/5 rounded-2xl overflow-hidden group hover:border-violet-500/50 transition-all hover:-translate-y-1">
          <div className={`h-40 bg-gradient-to-br ${course.color} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs text-white border border-white/10">{course.level}</span>
          </div>
          <div className="p-5">
            <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
            <p className="text-slate-400 text-sm mb-4">شرح وافي للمنهج مع حل تدريبات وامتحانات سابقة.</p>
            <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-violet-600 text-white font-bold transition-all border border-white/5">
              ابدأ المذاكرة
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PlaceholderPage = ({ title, icon }: any) => (
  <div className="h-screen flex flex-col items-center justify-center text-center p-6">
    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-6xl mb-6 border border-white/10 backdrop-blur-md">
      {icon}
    </div>
    <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
    <p className="text-slate-400">المهندسين شغالين على القسم ده.. انتظرونا! 🚧</p>
  </div>
);

// ==========================================
// 2. التطبيق الرئيسي (بالمفتاح الجديد)
// ==========================================

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const [messages, setMessages] = useState([
    { id: 1, text: "أهلاً يا بطل! 👋 أنا ميمو.. اسألني في أي حاجة وقفت معاك!", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // دالة الإرسال (تم تحديث المفتاح والرابط)
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userInput = input;
    
    setMessages(prev => [...prev, { id: Date.now(), text: userInput, isBot: false }]);
    setInput("");
    setIsLoading(true);

    try {
      // ✅ المفتاح الجديد بتاعك (Hardcoded)
      const apiKey = "AIzaSyA1BNXdW6Wa-RLXG7WtXOzXSR2PtPddE94";

      // ✅ استخدام موديل 1.5-flash (الأسرع والأدق)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: `أنت ميمو، مدرس مصري شاطر وودود. رد على الطالب ده باللهجة المصرية العامية، وبسط المعلومة جداً: ${userInput}` 
              }] 
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "معلش مسمعتش كويس.. ممكن تقول تاني؟";
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiReply, isBot: true }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "فيه مشكلة في الاتصال.. تأكد من النت وجرب تاني!", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = (page: string) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-cairo dir-rtl flex overflow-hidden selection:bg-violet-500 selection:text-white">
      
      {/* Sidebar */}
      {currentPage !== 'home' && (
        <>
          {isSidebarOpen && <div className="fixed inset-0 bg-black/80 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}
          
          <aside className={`fixed md:relative z-50 w-72 bg-[#0f172a] border-l border-white/5 h-full flex flex-col transition-transform duration-300 shadow-2xl ${isSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}>
            <div className="p-8 text-center border-b border-white/5">
              <h1 className="text-4xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent filter drop-shadow-lg">ميمو 🎓</h1>
            </div>
            
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <SidebarItem id="home" icon="🏠" label="الرئيسية" active={currentPage === 'home'} onClick={navigate} />
              <SidebarItem id="chat" icon="🤖" label="المساعد الذكي" active={currentPage === 'chat'} onClick={navigate} />
              <SidebarItem id="courses" icon="📚" label="الكورسات" active={currentPage === 'courses'} onClick={navigate} />
              <SidebarItem id="exams" icon="📝" label="الامتحانات" active={currentPage === 'exams'} onClick={navigate} />
              <SidebarItem id="quran" icon="📖" label="القرآن الكريم" active={currentPage === 'quran'} onClick={navigate} />
              <SidebarItem id="planner" icon="📅" label="الجدول" active={currentPage === 'planner'} onClick={navigate} />
            </nav>

            <div className="p-4 border-t border-white/5">
               <div className="bg-[#1e293b] rounded-xl p-3 flex items-center gap-3 border border-white/5">
                 <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-lg">👨‍🎓</div>
                 <div>
                   <h4 className="font-bold text-sm text-white">طالب متميز</h4>
                   <p className="text-slate-400 text-xs">الباقة المجانية</p>
                 </div>
               </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative bg-[#020617] scroll-smooth">
        
        {/* Toggle Button */}
        {currentPage !== 'home' && (
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="md:hidden absolute top-4 left-4 z-40 p-3 bg-[#1e293b] rounded-xl border border-white/10 text-white shadow-lg active:scale-95 transition-transform"
          >
            ☰
          </button>
        )}

        {/* Landing Page */}
        {currentPage === 'home' && (
          <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 max-w-4xl animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-violet-300 text-sm mb-8 backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                أذكى منصة تعليمية في مصر 🇪🇬
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
                مدرسك <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 animate-gradient">الخصوصي</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto">
                انسى الدروس الخصوصية ومصاريفها. ميمو معاك 24 ساعة، بيشرح، بيحل، وبيعملك امتحانات.. وكل ده ببلاش!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <button 
                  onClick={() => navigate('chat')}
                  className="px-10 py-5 bg-white text-[#020617] font-bold text-xl rounded-2xl hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all shadow-xl"
                >
                  جرب الشات دلوقتي ⚡
                </button>
                <button 
                  onClick={() => navigate('courses')}
                  className="px-10 py-5 bg-[#1e293b]/50 text-white font-bold text-xl rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md"
                >
                  استكشف المواد
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-right">
                 {[
                   { icon: "🧠", title: "ذكاء خارق", desc: "بيفهم كلامك بالعامية ويرد عليك." },
                   { icon: "📚", title: "مناهج مصرية", desc: "محتوى مطابق لمنهج الوزارة." },
                   { icon: "💸", title: "مجاني تماماً", desc: "تعليم بجودة عالمية للكل." }
                 ].map((feat, i) => (
                   <div key={i} className="p-6 rounded-2xl bg-[#1e293b]/30 border border-white/5 hover:bg-[#1e293b]/50 transition-colors backdrop-blur-sm">
                     <div className="text-4xl mb-4">{feat.icon}</div>
                     <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                     <p className="text-slate-400">{feat.desc}</p>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'chat' && (
          <ChatPage 
            messages={messages} 
            input={input} 
            setInput={setInput} 
            sendMessage={sendMessage} 
            isLoading={isLoading} 
          />
        )}

        {currentPage === 'courses' && <CoursesPage />}
        {['exams', 'quran', 'planner', 'settings'].includes(currentPage) && (
           <PlaceholderPage title={
             currentPage === 'exams' ? "الامتحانات" : 
             currentPage === 'quran' ? "القرآن الكريم" :
             currentPage === 'planner' ? "جدول المذاكرة" : "الإعدادات"
           } icon={
             currentPage === 'exams' ? "📝" : 
             currentPage === 'quran' ? "📖" :
             currentPage === 'planner' ? "📅" : "⚙️"
           } />
        )}
      </main>
    </div>
  );
};

export default App;