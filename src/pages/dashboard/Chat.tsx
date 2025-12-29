import { useState, useRef, useEffect } from "react";
import { sendMessageToGemini } from "@/services/gemini";
import { Send, User, Bot, Loader2, Sparkles } from "lucide-react";

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

  // النزول لآخر الشات تلقائياً
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // نبعت الكلام لميمو
      const aiResponseText = await sendMessageToGemini(input, messages);
      
      const aiMessage = { id: Date.now() + 1, role: 'ai' as const, content: aiResponseText };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now(), role: 'ai', content: "حصل مشكلة صغيرة.. حاول تاني!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-[#1e293b] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      
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
              className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-tr-none'
                  : 'bg-[#1e293b] text-gray-100 border border-white/10 rounded-tl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-full"><Bot className="h-5 w-5 text-white" /></div>
            <div className="bg-[#1e293b] p-4 rounded-2xl rounded-tl-none border border-white/10">
              <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
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
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white p-3 rounded-xl transition-all"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
