import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // دالة وهمية دلوقتي لحد ما نربط Supabase
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    alert("دي واجهة فقط حالياً.. جاري تحويلك للداشبورد!");
    navigate("/dashboard"); // بيدخلك على الموقع علطول
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 dir-rtl" dir="rtl">
      {/* الخلفية المضيئة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-purple-500/20 rounded-xl mb-4">
            <Sparkles className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? "مرحباً بك في ميمو" : "انضم لعائلة ميمو"}
          </h1>
          <p className="text-gray-400">
            {isLogin ? "سجل دخولك عشان تكمل مذاكرة" : "ابدأ رحلة التفوق بالذكاء الاصطناعي"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">البريد الإلكتروني</label>
            <input 
              type="email" 
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="name@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">كلمة المرور</label>
            <input 
              type="password" 
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            {isLogin ? "دخول" : "إنشاء حساب"}
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            {isLogin ? "معندكش حساب؟ سجل دلوقتي" : "عندك حساب بالفعل؟ سجل دخول"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;