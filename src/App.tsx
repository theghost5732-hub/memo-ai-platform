import React, { useState, useEffect, useRef } from "react";

// --- 1. المكونات الفرعية (لازم تكون برة الدالة الرئيسية عشان الكتابة متقطعش) ---

// زرار القائمة الجانبية
const SidebarItem = ({ icon, label, id, active, onClick }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
    ${active 
      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25" 
      : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
  >
    <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
    <span className="font-semibold">{label}</span>
  </button>
);

// صفحة الشات (تم إصلاح مشكلة الكتابة)
const ChatPage = ({ messages, input, setInput, sendMessage, isLoading }: any) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-darker">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg: any) => (
          <div key={msg.id} className={`flex items-start gap-4 ${msg.isBot ? "flex-row" : "flex-row-reverse"}`}>
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 shadow-lg
              ${msg.isBot ? "bg-gradient-to-br from-blue-500 to-cyan-500" : "bg-gradient-to-br from-violet-500 to-fuchsia-500"}`}>
              {msg.isBot ? "🤖" : "👤"}
            </div>
            
            {/* Bubble */}
            <div className={`max-w-[80%] p-4 md:p-5 rounded-2xl text-base leading-relaxed shadow-md
              ${msg.isBot 
                ? "bg-surface border border-slate-700 text-slate-100 rounded-tl-none" 
                : "bg-violet-600 text-white rounded-tr-none"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 mr-14">
            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface border-t border-slate-800">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="اسأل ميمو في أي حاجة..."
            className="flex-1 bg-darker text-white px-5 py-4 rounded-xl border border-slate-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder:text-slate-500"
            disabled={isLoading}
          />
          <button 
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
          >
            إرسال 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

// صفحة الكورسات (تصميم كروت)
const CoursesPage = () => (
  <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-surface rounded-2xl overflow-hidden border border-slate-800 hover:border-violet-500/50 transition-all group hover:shadow-2xl hover:shadow-violet-500/10">
        <div className="h-48 bg-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg text-xs text-white border border-white/10">ثانوية عامة</div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-white group-hover:text-violet-400 transition-colors">كورس الفيزياء الحديثة</h3>
          <p className="text-slate-400 text-sm mb-4 line-clamp-2">شرح تفصيلي للباب الأول مع حل مسائل مستويات عليا وتوقعات الامتحان.</p>
          <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-violet-600 text-white font-medium transition-colors border border-slate-700 hover:border-violet-500">
            ابدأ المذاكرة الآن
          </button>
        </div>
      </div>
    ))}
  </div>
);

// --- 2. التطبيق الرئيسي ---

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [isSidebarOpen, setSidebarOpen] = useState(true); // للتحكم في القائمة
  
  // Chat State
  const [messages, setMessages] = useState([
    { id: 1, text: "أهلاً يا بطل! 👋 أنا ميمو.. جاهز نكسر الدنيا في المذاكرة؟", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Logic Sending
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userInput = input;
    
    setMessages(prev => [...prev, { id: Date.now(), text: userInput, isBot: false }]);
    setInput("");
    setIsLoading(true);

    try {
      const apiKey = "AIzaSyBpvU_qU7ocojaPCh3hPY4mLmgnHNezTOs"; // مفتاحك

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `رد باللهجة المصرية العامية كأنك مدرس خصوصي شاطر: ${userInput}` }] }]
          })
        }
      );

      const data = await response.json();
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "معلش النت قطع.. قول تاني؟";
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiReply, isBot: true }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "مشكلة في الاتصال.. جرب تاني!", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white font-cairo dir-rtl flex overflow-hidden">
      
      {/* Sidebar */}
      {currentPage !== 'home' && (
        <aside className={`fixed md:relative z-50 w-72 bg-surface border-l border-slate-800 h-full flex flex-col transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}>
          <div className="p-8 text-center border-b border-slate-800">
            <h1 className="text-3xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">ميمو 🎓</h1>
            <p className="text-slate-500 text-xs mt-2">منصتك التعليمية الشاملة</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <SidebarItem id="home" icon="🏠" label="الرئيسية" active={currentPage === 'home'} onClick={setCurrentPage} />
            <SidebarItem id="chat" icon="🤖" label="المساعد الذكي" active={currentPage === 'chat'} onClick={setCurrentPage} />
            <SidebarItem id="courses" icon="📚" label="الكورسات" active={currentPage === 'courses'} onClick={setCurrentPage} />
            <SidebarItem id="exams" icon="📝" label="الامتحانات" active={currentPage === 'exams'} onClick={setCurrentPage} />
            <SidebarItem id="quran" icon="📖" label="القرآن الكريم" active={currentPage === 'quran'} onClick={setCurrentPage} />
          </nav>

          <div className="p-4 border-t border-slate-800">
             <div className="bg-darker rounded-xl p-4 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-lg">👨‍🎓</div>
               <div>
                 <h4 className="font-bold text-sm">محمد ربيع</h4>
                 <p className="text-slate-500 text-xs">طالب متميز</p>
               </div>
             </div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative bg-dark">
        
        {/* Mobile Toggle */}
        {currentPage !== 'home' && (
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden absolute top-4 left-4 z-40 p-2 bg-surface rounded-lg border border-slate-700">
            ☰
          </button>
        )}

        {currentPage === 'home' && (
          <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 max-w-3xl">
              <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-violet-300 text-sm mb-6 backdrop-blur-md">
                ✨ الذكاء الاصطناعي وصل التعليم المصري
              </span>
              <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
                مدرسك <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">الخصوصي</span>
              </h1>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                ذاكر بذكاء مش بجهد. ميمو موجود 24 ساعة عشان يشرحلك، يحل معاك، ويعمل لك امتحانات.. كل ده ببلاش!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setCurrentPage('chat')}
                  className="px-8 py-4 bg-white text-darker font-bold text-lg rounded-xl hover:scale-105 transition-transform shadow-xl shadow-white/10"
                >
                  جرب الشات دلوقتي ⚡
                </button>
                <button 
                  onClick={() => setCurrentPage('courses')}
                  className="px-8 py-4 bg-white/5 text-white font-bold text-lg rounded-xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md"
                >
                  استكشف الكورسات
                </button>
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

        {currentPage === 'courses' && (
            <div className="h-full overflow-y-auto">
                <div className="p-8 pb-0"><h2 className="text-3xl font-bold">المواد الدراسية</h2></div>
                <CoursesPage />
            </div>
        )}

        {/* باقي الصفحات (Placeholders) */}
        {['exams', 'quran', 'planner'].includes(currentPage) && (
           <div className="h-full flex flex-col items-center justify-center text-slate-500">
             <div className="text-6xl mb-4">🚧</div>
             <h2 className="text-2xl font-bold text-white">جاري بناء القسم ده</h2>
             <p>المهندسين شغالين عليه دلوقتي!</p>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;