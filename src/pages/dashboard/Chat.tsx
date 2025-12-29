import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2, Sparkles, AlertCircle } from "lucide-react";

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
}

const Chat = () => {
  // إعدادات الرسائل
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'ai', content: "أهلاً يا بطل! 👋 أنا ميمو.. جاهز نذاكر إيه النهاردة؟" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // دالة النزول لآخر الشات
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // دالة إرسال الرسالة لـ Gemini (مدمجة هنا عشان الأخطاء)
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    // 1. عرض رسالة المستخدم فوراً
    const userMsg = { id: Date.now(), role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // 2. التحقق من المفتاح
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("مفتاح API ناقص! تأكد إنك ضفته في Vercel.");
      }

      // 3. تجهيز الطلب لـ Google API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `أنت ميمو، مدرس مصري ذكي وودود. جاوب على السؤال ده باللهجة المصرية: ${input}`
              }]
            }]
          })
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "خطأ من جوجل");
      }

      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "معلش، مسمعتش كويس.. قول تاني؟";

      // 4. عرض رد ميمو
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: aiResponse }]);

    } catch (error: any) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'ai', 
        content: `حصل مشكلة: ${error.message || "تأكد من النت أو المفتاح"}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-[#1e293b] rounded-2xl border border-white/10 overflow-hidden shadow-2xl mx-auto max-w-4xl">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center gap-3 shadow-md">
        <div className="p-2 bg-white/20 rounded-full">
          <Sparkles className="h-6 w-6 text-yellow-300" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">المساعد الذكي ميمو</h2>
          <p className="text-purple-200 text-xs flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            متصل الآن
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f172a]/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`p-2 rounded-full shrink-0 ${msg.role === 'user' ? 'bg-purple-600' : 'bg-indigo-500'}`}>
              {msg.role === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
            </div>
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-tr-none'
                  : 'bg-[#2d3748] text-gray-100 border border-white/5 rounded-tl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-full"><Bot className="h-5 w-5 text-white" /></div>
            <div className="bg-[#2d3748] p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-2 items-center">
              <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
              <span className="text-gray-400 text-xs">ميمو بيفكر...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-[#1e293b] border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اسأل ميمو في أي حاجة..."
          className="flex-1 bg-[#0f172a] text-white rounded-xl px-4 py-3 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-lg"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default Chat;