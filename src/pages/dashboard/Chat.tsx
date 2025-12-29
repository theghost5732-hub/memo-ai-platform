import { useState } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "أهلاً بيك! أنا ميمو، مدرسك الذكي. 🎓\nاسألني أي سؤال في أي مادة وأنا هساعدك!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // إضافة رسالة المستخدم
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // محاكاة رد ميمو (هنربطه بـ Gemini API بعدين)
    setTimeout(() => {
      const botResponses = [
        "سؤال جميل! خليني أشرحلك بالتفصيل... 📚",
        "تمام يا بطل! الموضوع ده بسيط، بص معايا... ✨",
        "أيوه فهمتك! الإجابة هي... 🎯",
        "ممتاز إنك بتسأل! ده معناه إنك بتذاكر صح 💪"
      ];
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: randomResponse + "\n\n(ده رد تجريبي - هنربط ميمو بالذكاء الاصطناعي قريباً!)",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900" dir="rtl">
      
      {/* الهيدر */}
      <div className="bg-slate-800 border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              ميمو
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </h1>
            <p className="text-sm text-green-400">● متصل الآن</p>
          </div>
        </div>
      </div>

      {/* الرسائل */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isBot ? "" : "flex-row-reverse"}`}
          >
            {/* الأفاتار */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.isBot 
                ? "bg-gradient-to-br from-purple-500 to-pink-500" 
                : "bg-blue-600"
            }`}>
              {message.isBot ? (
                <Bot className="h-5 w-5 text-white" />
              ) : (
                <User className="h-5 w-5 text-white" />
              )}
            </div>

            {/* الرسالة */}
            <div className={`max-w-[75%] rounded-2xl p-4 ${
              message.isBot
                ? "bg-slate-800 text-white rounded-tr-none"
                : "bg-purple-600 text-white rounded-tl-none"
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-2 ${message.isBot ? "text-gray-500" : "text-purple-200"}`}>
                {message.timestamp.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {/* جاري الكتابة */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="bg-slate-800 rounded-2xl rounded-tr-none p-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* مربع الكتابة */}
      <div className="bg-slate-800 border-t border-white/10 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="اكتب سؤالك هنا..."
            className="flex-1 bg-slate-700 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3 bg-gradient-to-l from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 hover:scale-105"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;