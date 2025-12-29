import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Brain, 
  BookOpen, 
  Shield, 
  Star, 
  Moon, 
  Sun, 
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Users,
  Trophy,
  HeadphonesIcon
} from "lucide-react";

const Index = () => {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? 'bg-slate-900 text-white' : 'bg-gray-50 text-slate-900'}`} dir="rtl">
      
      {/* الخلفية المتحركة */}
      {isDark && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px]" />
        </div>
      )}

      {/* ======== الهيدر ======== */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white/80 border-gray-200'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            
            {/* الشعار */}
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ميمو
                </h1>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>منصة التعليم الذكي</p>
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex items-center gap-4">
              {/* زرار الوضع الليلي/النهاري */}
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'bg-white/10 hover:bg-white/20 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-orange-500'}`}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <Link to="/auth">
                <button className={`px-4 py-2 rounded-lg font-medium transition-all ${isDark ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'}`}>
                  دخول
                </button>
              </Link>

              <Link to="/auth">
                <button className="px-6 py-2 bg-gradient-to-l from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
                  ابدأ مجاناً
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ======== القسم الرئيسي (Hero) ======== */}
      <section className="relative container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* شارة صغيرة */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              أول منصة تعليمية بالذكاء الاصطناعي في مصر 🇪🇬
            </span>
          </div>

          {/* العنوان الرئيسي */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            مدرسك الخصوصي
            <br />
            <span className="bg-gradient-to-l from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              بالذكاء الاصطناعي
            </span>
          </h1>

          {/* الوصف */}
          <p className={`text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            ميمو بيفهمك، بيشرحلك بالمصري، وبيساعدك تجيب أعلى الدرجات.
            <br />
            متاح 24 ساعة، وبيعرف منهجك كويس!
          </p>

          {/* الأزرار الرئيسية */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/auth">
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-l from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 flex items-center justify-center gap-2">
                <span>ابدأ رحلتك مجاناً</span>
                <ArrowLeft className="h-5 w-5" />
              </button>
            </Link>

            <button className={`w-full sm:w-auto px-8 py-4 text-xl font-bold rounded-xl border-2 transition-all duration-300 hover:scale-105 ${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
              شوف الفيديو التعريفي
            </button>
          </div>

          {/* إحصائيات سريعة */}
          <div className={`flex flex-wrap justify-center gap-8 pt-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              <span>+10,000 طالب</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span>4.9 تقييم</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-orange-400" />
              <span>نسبة نجاح 95%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======== المميزات ======== */}
      <section className={`py-20 ${isDark ? 'bg-slate-800/50' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">ليه ميمو مختلف؟</h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              مش مجرد شات بوت، ده مدرس فاهم ومتخصص
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group ${isDark ? 'bg-slate-800 border-white/10 hover:border-purple-500/50' : 'bg-gray-50 border-gray-200 hover:border-purple-300'}`}>
              <div className="w-14 h-14 mb-6 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain className="h-7 w-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">ذكاء اصطناعي متقدم</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                بيفهم سؤالك حتى لو كتبته بالعامية، وبيرد عليك بطريقة سهلة ومبسطة.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group ${isDark ? 'bg-slate-800 border-white/10 hover:border-pink-500/50' : 'bg-gray-50 border-gray-200 hover:border-pink-300'}`}>
              <div className="w-14 h-14 mb-6 rounded-xl bg-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="h-7 w-7 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">المنهج المصري كامل</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                من KG لحد ثانوية عامة، كل المواد والدروس متاحة ومشروحة.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group ${isDark ? 'bg-slate-800 border-white/10 hover:border-blue-500/50' : 'bg-gray-50 border-gray-200 hover:border-blue-300'}`}>
              <div className="w-14 h-14 mb-6 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">امتحانات ذكية</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                بيعملك امتحانات على مستواك، ويصححلك ويقولك غلطت في إيه.
              </p>
            </div>

            {/* Feature 4 */}
            <div className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group ${isDark ? 'bg-slate-800 border-white/10 hover:border-green-500/50' : 'bg-gray-50 border-gray-200 hover:border-green-300'}`}>
              <div className="w-14 h-14 mb-6 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="h-7 w-7 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">متابعة مستمرة</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                بيتابع تقدمك ويعرفك نقاط ضعفك عشان تشتغل عليها.
              </p>
            </div>

            {/* Feature 5 */}
            <div className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group ${isDark ? 'bg-slate-800 border-white/10 hover:border-yellow-500/50' : 'bg-gray-50 border-gray-200 hover:border-yellow-300'}`}>
              <div className="w-14 h-14 mb-6 rounded-xl bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HeadphonesIcon className="h-7 w-7 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">دعم نفسي</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                لو حاسس بضغط أو قلق، ميمو موجود يسمعك ويساعدك.
              </p>
            </div>

            {/* Feature 6 */}
            <div className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group ${isDark ? 'bg-slate-800 border-white/10 hover:border-orange-500/50' : 'bg-gray-50 border-gray-200 hover:border-orange-300'}`}>
              <div className="w-14 h-14 mb-6 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy className="h-7 w-7 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">نظام نقاط ومكافآت</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                اجمع نقاط، افتح شارات، ونافس زمايلك على الصدارة!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======== الفوتر ======== */}
      <footer className={`py-12 border-t ${isDark ? 'bg-slate-900 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-500" />
              <span className="font-bold text-lg">ميمو</span>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              © 2024 ميمو - صنع بـ ❤️ بواسطة المهندس محمد ربيع
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;