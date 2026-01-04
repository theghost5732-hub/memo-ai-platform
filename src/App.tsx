import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { 
  Home, MessageCircle, Book, PenTool, Calendar, Settings, 
  Brain, Send, Menu, Zap, Cpu, Layers, Star, Volume2, Shield, Award 
} from "lucide-react";

// ============ 1. المفاتيح الرسمية (Nuclear Keys) ============
const KEYS = {
  OPENROUTER: "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",
  GROQ: "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",
  GEMINI: "AIzaSyBCbD9ZkznXnGpF7v5TgM9TT9aPyrp3_0I",
  OPENAI: "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",
  ELEVEN_LABS: "sk_edcd37d939cfda90e6f62c972a830362948b5ee87b0fda0c"
};

const SYSTEM_PROMPT = `أنت "ميمو" - المساعد التعليمي المصري الخارق. صانعك المهندس محمد ربيع. رد دايماً بالعامية المصرية الراقية وبسط المعلومات جداً.`;

// ============ 2. المكونات (UI Components) ============

function ChatInputBox({ onSendMessage, loading }: { onSendMessage: (msg: string) => void; loading: boolean }) {
  const [text, setText] = useState("");
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && text.trim() && !loading) {
      onSendMessage(text.trim());
      setText("");
    }
  };
  return (
    <div className="p-5 bg-[#0a0a0f]/95 border-t border-violet-500/20 flex gap-3 backdrop-blur-xl">
      <input
        type="text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyPress}
        placeholder="اسأل ميمو في أي مادة..." disabled={loading}
        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-violet-500 transition-all font-cairo"
      />
      <button 
        onClick={() => { onSendMessage(text); setText(""); }} disabled={loading || !text.trim()}
        className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 rounded-2xl font-bold text-white shadow-lg shadow-violet-500/30 hover:scale-105 active:scale-95 transition-all"
      >
        {loading ? "⌛" : "إرسال 🚀"}
      </button>
    </div>
  );
}

// ============ 3. التطبيق الرئيسي (The Core) ============

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [messages, setMessages] = useState([{ id: 1, text: "أهلاً بيك يا بطل! 👋 أنا ميمو.. اخترتلك أقوى عقول الذكاء الاصطناعي عشان أساعدك.", isBot: true, model: "System" }]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // --- دالة تحويل النص لصوت (ElevenLabs) ---
  const speakText = async (text: string) => {
    try {
      const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", {
        method: "POST",
        headers: { "Content-Type": "application/json", "xi-api-key": KEYS.ELEVEN_LABS },
        body: JSON.stringify({ text, model_id: "eleven_multilingual_v2" })
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      new Audio(url).play();
    } catch (e) { console.error("Voice Error", e); }
  };

  // --- الموجه الذكي للموديلات (The Router) ---
  const handleSendMessage = async (userText: string) => {
    setMessages(prev => [...prev, { id: Date.now(), text: userText, isBot: false, model: "" }]);
    setIsLoading(true);

    try {
      // إرسال الطلب لـ OpenRouter كـ Proxy (يحل مشكلة الـ CORS والـ 403)
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${KEYS.OPENROUTER}`,
          "HTTP-Referer": "https://memo-ai.app",
          "X-Title": "Memo AI"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001", // الموديل الأقوى حالياً
          messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: userText }]
        })
      });

      const data = await response.json();
      const aiReply = data.choices[0].message.content || "معلش مسمعتش، قول تاني؟";
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiReply, isBot: true, model: "Gemini 2.0 (via OpenRouter)" }]);
      // تشغيل الصوت (اختياري)
      // speakText(aiReply); 

    } catch (err) {
      // Fallback to Groq if OpenRouter fails
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${KEYS.GROQ}` },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: userText }]
        })
      });
      const groqData = await groqRes.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, text: groqData.choices[0].message.content, isBot: true, model: "Groq Fallback" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const HomePage = () => (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex flex-col items-center justify-center text-center p-6 font-cairo">
      <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px]" />
      
      <div className="relative z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl mx-auto mb-8 shadow-violet-500/40">🎓</div>
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6">ميمو <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">PRO</span></h1>
        <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">المنصة التعليمية الوحيدة في مصر اللي بتشغل 4 عقول صناعية في وقت واحد عشان تضمن لك التفوق.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => setCurrentPage("chat")} className="px-10 py-5 bg-white text-black font-bold text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all">ابدأ المحادثة ⚡</button>
          <button onClick={() => setCurrentPage("features")} className="px-10 py-5 bg-white/5 text-white font-bold text-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md">ليه ميمو؟ 🌟</button>
        </div>
      </div>
      <footer className="absolute bottom-6 w-full opacity-40 text-[10px] text-slate-500 font-mono tracking-widest uppercase">
        Developed by Mohamed.Rabia19 @2026 294.empire
      </footer>
    </div>
  );

  const WhyMemo = () => (
    <div className="min-h-screen bg-[#020617] p-8 md:p-16 h-screen overflow-y-auto font-cairo">
      <h2 className="text-4xl font-black text-white mb-12 text-center">إمبراطورية ميمو التعليمية 🌟</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {[
          { title: "عقول متعددة", desc: "بنشغل Llama 3 و Gemini و GPT-4 مع بعض.", icon: <Brain /> },
          { title: "مدرس افتراضي", desc: "مكالمات صوتية وشرح حصص كاملة.", icon: <Volume2 /> },
          { title: "بنك الأخطاء", desc: "ميمو بيحفظ غلطاتك عشان يراجعها معاك.", icon: <Shield /> },
          { title: "مود التركيز", desc: "موسيقى Lofi و Pomodoro للمذاكرة.", icon: <Zap /> },
          { title: "منهج الوزارة", desc: "مطابق تماماً للمناهج المصرية 2024.", icon: <Book /> },
          { title: "لوحة المتصدرين", desc: "نافس أوائل الجمهورية واكسب جوائز.", icon: <Award /> }
        ].map((item, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-all backdrop-blur-md group">
            <div className="w-12 h-12 bg-violet-600/20 rounded-xl flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-slate-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
      <button onClick={() => setCurrentPage("home")} className="block mx-auto mt-12 text-violet-400 font-bold underline">← العودة للرئيسية</button>
    </div>
  );

  const ChatPage = () => (
    <div className="flex h-screen bg-[#0a0a0f] font-cairo">
      {/* Sidebar (Desktop) */}
      <aside className="w-72 bg-[#0a0a0f] border-l border-white/5 hidden md:flex flex-col p-6">
        <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-2">🎓 ميمو <span className="text-[10px] bg-violet-600 px-2 rounded">PRO</span></h2>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setCurrentPage("home")} className="w-full flex items-center gap-3 p-4 rounded-2xl text-slate-400 hover:bg-white/5"> <Home size={18}/> الرئيسية </button>
          <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20"> <MessageCircle size={18}/> المساعد الذكي </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col h-full relative">
        <div className="p-4 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center text-2xl shadow-lg">🤖</div>
          <div>
            <h3 className="text-white font-bold">ميمو التعليمي</h3>
            <p className="text-xs text-green-400 font-mono">ALL SYSTEMS ACTIVE 🟢</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.isBot ? "justify-start" : "justify-end"} animate-fade-in`}>
              <div className={`max-w-[80%] p-5 rounded-3xl text-[15px] leading-relaxed shadow-xl
                ${msg.isBot ? "bg-[#1e293b] text-slate-200 rounded-tl-none border border-white/5" : "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-tr-none"}`}>
                {msg.text}
                {msg.model && <div className="text-[8px] mt-2 opacity-30 font-mono uppercase">{msg.model}</div>}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-violet-400 animate-pulse text-xs font-bold">ميمو يستدعي أقوى الموديلات...</div>}
          <div ref={messagesEndRef} />
        </div>

        <ChatInputBox onSendMessage={handleSendMessage} loading={isLoading} />
      </div>
    </div>
  );

  if (currentPage === "home") return <HomePage />;
  if (currentPage === "features") return <WhyMemo />;
  return <ChatPage />;
}

export default App;
