import { useState, useRef, useEffect } from "react";

// شلنا استدعاء الأيقونات خالص عشان ميعملش مشاكل
// import { Send, User, Bot ... } from "lucide-react"; 

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'ai', content: "أهلاً يا بطل! 👋 أنا ميمو.. جاهز نذاكر إيه النهاردة؟" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { id: Date.now(), role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("مفتاح ناقص");

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `رد باللهجة المصرية: ${input}` }] }]
          })
        }
      );

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "مش سامعك كويس..";

      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: aiResponse }]);

    } catch (error: any) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: "حصل خطأ في الاتصال.." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-2xl mx-auto max-w-4xl mt-4">
      
      {/* Header */}
      <div className="p-4 bg-purple-700 flex items-center gap-3">
        <span className="text-2xl">🤖</span>
        <div>
          <h2 className="text-white font-bold">المساعد الذكي ميمو</h2>
          <p className="text-purple-200 text-xs">متصل الآن 🟢</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* استبدلنا الأيقونات بإيموجي */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${msg.role === 'user' ? 'bg-purple-600' : 'bg-indigo-600'}`}>
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            
            <div className={`max-w-[85%] p-4 rounded-2xl text-white ${msg.role === 'user' ? 'bg-purple-600' : 'bg-slate-700'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="text-gray-400 text-center text-sm">ميمو بيكتب... ✍️</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-slate-800 border-t border-slate-700 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="flex-1 bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-purple-500 outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold"
        >
          إرسال 🚀
        </button>
      </form>
    </div>
  );
};

export default Chat;