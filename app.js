const { useState, useEffect } = React;

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENTS
// ═══════════════════════════════════════════════════════════════

// Navbar Component
const Navbar = ({ currentPage, setCurrentPage, darkMode, setDarkMode, user, setUser }) => {
    const [mobileMenu, setMobileMenu] = useState(false);
    
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
                    <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-xl">🎓</div>
                    <span className="text-2xl font-bold gradient-text">ميمو</span>
                </div>

                <div className="hidden lg:flex items-center gap-6">
                    {[
                        { id: 'home', label: 'الرئيسية' },
                        { id: 'chat', label: 'المساعد الذكي' },
                        { id: 'courses', label: 'الكورسات' },
                        { id: 'exams', label: 'الامتحانات' },
                        { id: 'leaderboard', label: 'المتصدرين' },
                        { id: 'pricing', label: 'الباقات' },
                    ].map(item => (
                        <button 
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)} 
                            className={`hover:text-primary transition ${currentPage === item.id ? 'text-primary' : 'text-gray-300'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => setDarkMode(!darkMode)} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition">
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                    
                    {user ? (
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage('notifications')} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition relative">
                                🔔
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
                            </button>
                            <button onClick={() => setCurrentPage('profile')} className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                                {user.name?.charAt(0) || '👤'}
                            </button>
                            <button onClick={() => setCurrentPage('dashboard')} className="hidden md:block px-4 py-2 rounded-full glass hover:bg-white/10 transition">
                                لوحة التحكم
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage('login')} className="px-4 py-2 rounded-full glass hover:bg-white/10 transition">دخول</button>
                            <button onClick={() => setCurrentPage('register')} className="px-6 py-2 rounded-full gradient-bg text-white font-bold hover:opacity-90 transition">سجّل مجاناً</button>
                        </div>
                    )}

                    <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden w-10 h-10 rounded-full glass flex items-center justify-center">
                        ☰
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenu && (
                <div className="lg:hidden glass border-t border-white/10 p-4 space-y-2">
                    {['home', 'chat', 'courses', 'exams', 'leaderboard', 'pricing'].map(page => (
                        <button key={page} onClick={() => { setCurrentPage(page); setMobileMenu(false); }} className="block w-full text-right py-2 hover:text-primary">
                            {page === 'home' ? 'الرئيسية' : page === 'chat' ? 'المساعد' : page === 'courses' ? 'الكورسات' : page === 'exams' ? 'الامتحانات' : page === 'leaderboard' ? 'المتصدرين' : 'الباقات'}
                        </button>
                    ))}
                </div>
            )}
        </nav>
    );
};

// ═══════════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════════

const HomePage = ({ setCurrentPage }) => (
    <div className="min-h-screen pt-20">
        <section className="min-h-[90vh] flex items-center justify-center px-4">
            <div className="text-center max-w-4xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-gray-300 mb-6">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    منصة تعليمية مصرية 100%
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                    تعلّم بذكاء مع
                    <span className="gradient-text block">ميمو AI</span>
                </h1>
                <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                    منصة تعليمية ثورية تستخدم الذكاء الاصطناعي عشان تساعدك تفهم، تذاكر، وتتفوق. مصممة خصيصاً للمنهج المصري.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => setCurrentPage('register')} className="px-8 py-4 rounded-full gradient-bg text-white font-bold text-lg hover:opacity-90 transition transform hover:scale-105">
                        🚀 ابدأ رحلتك مجاناً
                    </button>
                    <button onClick={() => setCurrentPage('chat')} className="px-8 py-4 rounded-full glass font-bold text-lg hover:bg-white/10 transition">
                        جرّب المساعد الذكي ←
                    </button>
                </div>
            </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-4">ليه <span className="gradient-text">ميمو</span> مختلف؟</h2>
                <p className="text-gray-400 text-center mb-12">مميزات مش هتلاقيها في أي منصة تانية</p>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { icon: '🤖', title: 'مساعد ذكي 24/7', desc: 'اسأل أي سؤال في أي مادة وميمو هيجاوبك بالتفصيل' },
                        { icon: '📝', title: 'امتحانات تفاعلية', desc: 'امتحانات على المنهج المصري مع تصحيح فوري' },
                        { icon: '🎯', title: 'خطط مذاكرة ذكية', desc: 'جداول مخصصة بناءً على وقتك ومستواك' },
                        { icon: '🎙️', title: 'مساعد صوتي', desc: 'اتكلم مع ميمو بالصوت باللهجة المصرية' },
                        { icon: '📊', title: 'تحليل نقاط الضعف', desc: 'ميمو بيحلل أداءك ويقولك تركز على إيه' },
                        { icon: '🏆', title: 'نظام مكافآت', desc: 'اكسب نقاط وشارات وتنافس مع زملائك' },
                    ].map((f, i) => (
                        <div key={i} className="glass rounded-2xl p-6 hover:bg-white/10 transition transform hover:-translate-y-2 cursor-pointer">
                            <div className="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center text-2xl mb-4">{f.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                            <p className="text-gray-400">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Stats */}
        <section className="py-16 glass">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                    { num: '+10,000', label: 'طالب مسجل' },
                    { num: '+50,000', label: 'سؤال تم حله' },
                    { num: '+1,000', label: 'امتحان' },
                    { num: '98%', label: 'نسبة الرضا' },
                ].map((s, i) => (
                    <div key={i}>
                        <div className="text-4xl font-black gradient-text mb-2">{s.num}</div>
                        <div className="text-gray-400">{s.label}</div>
                    </div>
                ))}
            </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto gradient-bg rounded-3xl p-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">جاهز تبدأ رحلة التفوق؟</h2>
                <p className="text-white/80 text-lg mb-8">انضم لآلاف الطلاب اللي بيستخدموا ميمو يومياً</p>
                <button onClick={() => setCurrentPage('register')} className="px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition transform hover:scale-105">
                    🎓 سجّل دلوقتي مجاناً
                </button>
            </div>
        </section>

        <footer className="py-8 text-center text-gray-500 border-t border-white/10">
            <p>صنع بـ ❤️ بواسطة المهندس محمد ربيع | © 2025 ميمو</p>
        </footer>
    </div>
);

// ═══════════════════════════════════════════════════════════════
// AUTH PAGES
// ═══════════════════════════════════════════════════════════════

const LoginPage = ({ setCurrentPage, setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (email && password) {
            if (email === 'admin@memo.com') {
                setUser({ email, name: 'الأدمن', role: 'admin', points: 0 });
                setCurrentPage('admin');
            } else {
                setUser({ email, name: email.split('@')[0], role: 'student', points: 1250, level: 'متفوق', badges: 5 });
                setCurrentPage('dashboard');
            }
        } else {
            setError('من فضلك املأ كل الخانات');
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-4">
            <div className="w-full max-w-md glass rounded-3xl p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🔐</div>
                    <h1 className="text-3xl font-bold">تسجيل الدخول</h1>
                    <p className="text-gray-400 mt-2">أهلاً بيك تاني في ميمو</p>
                </div>
                {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-center">{error}</div>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-2">البريد الإلكتروني</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition" placeholder="example@email.com" />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">كلمة المرور</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="w-full py-4 rounded-xl gradient-bg text-white font-bold hover:opacity-90 transition">دخول</button>
                </form>
                <p className="text-center text-gray-400 mt-6">
                    مش معاك حساب؟ <button onClick={() => setCurrentPage('register')} className="text-primary hover:underline">سجّل دلوقتي</button>
                </p>
            </div>
        </div>
    );
};

const RegisterPage = ({ setCurrentPage, setUser }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', stage: '' });
    const [error, setError] = useState('');
    const stages = ['الصف الأول الابتدائي', 'الصف الثاني الابتدائي', 'الصف الثالث الابتدائي', 'الصف الرابع الابتدائي', 'الصف الخامس الابتدائي', 'الصف السادس الابتدائي', 'الصف الأول الإعدادي', 'الصف الثاني الإعدادي', 'الصف الثالث الإعدادي', 'الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'];

    const handleRegister = (e) => {
        e.preventDefault();
        if (formData.name && formData.email && formData.password && formData.stage) {
            setUser({ ...formData, role: 'student', points: 0, level: 'مبتدئ', badges: 0 });
            setCurrentPage('dashboard');
        } else {
            setError('من فضلك املأ كل الخانات');
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md glass rounded-3xl p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🎓</div>
                    <h1 className="text-3xl font-bold">إنشاء حساب جديد</h1>
                    <p className="text-gray-400 mt-2">انضم لعيلة ميمو</p>
                </div>
                {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-center">{error}</div>}
                <form onSubmit={handleRegister} className="space-y-4">
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none" placeholder="الاسم" />
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none" placeholder="البريد الإلكتروني" />
                    <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none" placeholder="كلمة المرور" />
                    <select value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none">
                        <option value="">اختار مرحلتك</option>
                        {stages.map((s, i) => <option key={i} value={s}>{s}</option>)}
                    </select>
                    <button type="submit" className="w-full py-4 rounded-xl gradient-bg text-white font-bold hover:opacity-90 transition">إنشاء الحساب</button>
                </form>
                <p className="text-center text-gray-400 mt-6">
                    عندك حساب؟ <button onClick={() => setCurrentPage('login')} className="text-primary hover:underline">سجّل دخول</button>
                </p>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════

const DashboardPage = ({ user, setCurrentPage }) => (
    <div className="min-h-screen pt-20 px-4 py-6">
        <div className="max-w-6xl mx-auto">
            <div className="glass rounded-2xl p-6 mb-6">
                <h1 className="text-3xl font-bold mb-2">أهلاً {user?.name}! 👋</h1>
                <p className="text-gray-400">جاهز تكمل مذاكرة النهاردة؟</p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
                {[
                    { icon: '🤖', title: 'المساعد الذكي', page: 'chat', color: 'from-purple-500 to-blue-500' },
                    { icon: '📚', title: 'الكورسات', page: 'courses', color: 'from-green-500 to-teal-500' },
                    { icon: '📝', title: 'امتحان جديد', page: 'exams', color: 'from-orange-500 to-red-500' },
                    { icon: '📅', title: 'خطة المذاكرة', page: 'planner', color: 'from-pink-500 to-purple-500' },
                ].map((item, i) => (
                    <button key={i} onClick={() => setCurrentPage(item.page)} className="glass rounded-2xl p-6 text-center hover:bg-white/10 transition transform hover:scale-105">
                        <div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3`}>{item.icon}</div>
                        <h3 className="font-bold">{item.title}</h3>
                    </button>
                ))}
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
                {[
                    { icon: '🕌', title: 'تحفيظ القرآن', page: 'quran', color: 'from-emerald-500 to-green-600' },
                    { icon: '💚', title: 'الدعم النفسي', page: 'therapy', color: 'from-teal-500 to-cyan-500' },
                    { icon: '🏆', title: 'المتصدرين', page: 'leaderboard', color: 'from-yellow-500 to-orange-500' },
                    { icon: '🎖️', title: 'الشارات', page: 'badges', color: 'from-indigo-500 to-purple-500' },
                ].map((item, i) => (
                    <button key={i} onClick={() => setCurrentPage(item.page)} className="glass rounded-2xl p-6 text-center hover:bg-white/10 transition transform hover:scale-105">
                        <div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3`}>{item.icon}</div>
                        <h3 className="font-bold">{item.title}</h3>
                    </button>
                ))}
            </div>

            <div className="grid md:grid-cols-4 gap-4">
                <div className="glass rounded-2xl p-6"><h3 className="text-gray-400 mb-2">النقاط</h3><div className="text-4xl font-black gradient-text">{user?.points || 0}</div></div>
                <div className="glass rounded-2xl p-6"><h3 className="text-gray-400 mb-2">المستوى</h3><div className="text-4xl font-black gradient-text">{user?.level || 'مبتدئ'}</div></div>
                <div className="glass rounded-2xl p-6"><h3 className="text-gray-400 mb-2">الشارات</h3><div className="text-4xl font-black gradient-text">{user?.badges || 0}</div></div>
                <div className="glass rounded-2xl p-6"><h3 className="text-gray-400 mb-2">الترتيب</h3><div className="text-4xl font-black gradient-text">#42</div></div>
            </div>
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════════
// CHAT PAGE
// ═══════════════════════════════════════════════════════════════

const ChatPage = ({ user }) => {
    const [messages, setMessages] = useState([{ role: 'ai', content: 'أهلاً بيك يا بطل! 👋 أنا ميمو، مساعدك الذكي. اسألني أي سؤال في أي مادة!' }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { role: 'user', content: input }]);
        setInput('');
        setLoading(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', content: 'سؤال جميل! ده رد تجريبي - هنربط الـ Gemini API قريباً 🚀' }]);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen pt-20 flex flex-col">
            <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
                <div className="glass rounded-2xl p-4 mb-4 flex items-center gap-4">
                    <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center text-2xl">🤖</div>
                    <div><h1 className="text-xl font-bold">المساعد الذكي</h1><p className="text-gray-400 text-sm">متصل ومستعد للمساعدة</p></div>
                </div>
                <div className="glass rounded-2xl p-4 h-[60vh] overflow-y-auto mb-4 space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary/20' : 'bg-white/10'}`}>{msg.content}</div>
                        </div>
                    ))}
                    {loading && <div className="flex justify-end"><div className="bg-white/10 p-4 rounded-2xl"><div className="flex gap-1"><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0.1s'}}></span><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></span></div></div></div>}
                </div>
                <div className="glass rounded-2xl p-4 flex gap-3">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="اكتب سؤالك هنا..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
                    <button onClick={sendMessage} disabled={loading} className="px-6 py-3 gradient-bg rounded-xl font-bold hover:opacity-90 disabled:opacity-50">إرسال</button>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// COURSES PAGE
// ═══════════════════════════════════════════════════════════════

const CoursesPage = ({ setCurrentPage }) => {
    const courses = [
        { id: 1, name: 'الرياضيات', icon: '📐', lessons: 24, duration: '12 ساعة', level: 'متوسط', progress: 60, instructor: 'أ. محمد' },
        { id: 2, name: 'الفيزياء', icon: '⚡', lessons: 18, duration: '9 ساعات', level: 'متقدم', progress: 45, instructor: 'د. أحمد' },
        { id: 3, name: 'الكيمياء', icon: '🧪', lessons: 20, duration: '10 ساعات', level: 'متوسط', progress: 30, instructor: 'أ. سارة' },
        { id: 4, name: 'الأحياء', icon: '🧬', lessons: 22, duration: '11 ساعة', level: 'مبتدئ', progress: 80, instructor: 'د. منى' },
        { id: 5, name: 'اللغة العربية', icon: '📖', lessons: 30, duration: '15 ساعة', level: 'متوسط', progress: 55, instructor: 'أ. فاطمة' },
        { id: 6, name: 'اللغة الإنجليزية', icon: '🔤', lessons: 28, duration: '14 ساعة', level: 'متوسط', progress: 70, instructor: 'Mr. John' },
    ];

    return (
        <div className="min-h-screen pt-20 px-4 py-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-2">الكورسات والدروس 📚</h1>
                <p className="text-gray-400 text-center mb-10">اختار الكورس وابدأ التعلم</p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="glass rounded-2xl overflow-hidden hover:bg-white/10 transition cursor-pointer group">
                            <div className="h-32 gradient-bg flex items-center justify-center text-5xl group-hover:scale-110 transition">
                                {course.icon}
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold">{course.name}</h3>
                                    <span className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary">{course.level}</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-3">المدرب: {course.instructor}</p>
                                <div className="flex justify-between text-sm text-gray-400 mb-4">
                                    <span>📹 {course.lessons} درس</span>
                                    <span>⏱️ {course.duration}</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                                    <div className="gradient-bg h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">{course.progress}% مكتمل</span>
                                    <button className="px-4 py-2 gradient-bg rounded-lg text-sm font-bold">ابدأ</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// EXAMS PAGE
// ═══════════════════════════════════════════════════════════════

const ExamsPage = () => {
    const [stage, setStage] = useState('select');
    const [subject, setSubject] = useState('');
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState([]);

    const subjects = ['الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء', 'اللغة العربية', 'اللغة الإنجليزية'];
    const questions = [
        { q: 'ما هو ناتج 15 × 8؟', options: ['100', '120', '130', '150'], correct: 1 },
        { q: 'ما هي وحدة قياس القوة؟', options: ['متر', 'نيوتن', 'جول', 'واط'], correct: 1 },
        { q: 'ما هو العنصر الأكثر وفرة في الكون؟', options: ['الأكسجين', 'الكربون', 'الهيدروجين', 'النيتروجين'], correct: 2 },
        { q: 'كم عدد كروموسومات الإنسان؟', options: ['23', '46', '44', '48'], correct: 1 },
        { q: 'ما هو جمع كلمة "كتاب"؟', options: ['كتب', 'كتابات', 'كتّاب', 'كل ما سبق'], correct: 3 },
    ];

    const handleAnswer = (index) => {
        const isCorrect = index === questions[currentQ].correct;
        setAnswers([...answers, { q: currentQ, selected: index, correct: isCorrect }]);
        if (isCorrect) setScore(score + 1);
        if (currentQ < questions.length - 1) {
            setCurrentQ(currentQ + 1);
        } else {
            setStage('result');
        }
    };

    const resetExam = () => {
        setStage('select');
        setSubject('');
        setCurrentQ(0);
        setScore(0);
        setAnswers([]);
    };

    if (stage === 'result') {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center px-4">
                <div className="glass rounded-3xl p-10 text-center max-w-md w-full">
                    <div className="text-6xl mb-4">{percentage >= 80 ? '🏆' : percentage >= 50 ? '👍' : '💪'}</div>
                    <h1 className="text-3xl font-bold mb-4">انتهى الامتحان!</h1>
                    <div className="text-6xl font-black gradient-text mb-2">{percentage}%</div>
                    <p className="text-xl mb-6">{score}/{questions.length} إجابة صحيحة</p>
                    <p className="text-gray-400 mb-8">
                        {percentage >= 80 ? 'ممتاز! أداء رائع 🌟' : percentage >= 50 ? 'جيد! كمّل مذاكرة 📚' : 'محتاج تراجع أكتر 💪'}
                    </p>
                    <button onClick={resetExam} className="px-8 py-3 gradient-bg rounded-xl font-bold">امتحان جديد</button>
                </div>
            </div>
        );
    }

    if (stage === 'exam') {
        const q = questions[currentQ];
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center px-4">
                <div className="glass rounded-3xl p-8 max-w-2xl w-full">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-400">السؤال {currentQ + 1} من {questions.length}</span>
                        <span className="px-4 py-2 gradient-bg rounded-full text-sm">{subject}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-6">
                        <div className="gradient-bg h-2 rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}></div>
                    </div>
                    <h2 className="text-2xl font-bold mb-8">{q.q}</h2>
                    <div className="space-y-3">
                        {q.options.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(i)} className="w-full p-4 glass rounded-xl text-right hover:bg-primary/20 transition flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">{['أ', 'ب', 'ج', 'د'][i]}</span>
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 px-4 py-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-2">الامتحانات 📝</h1>
                <p className="text-gray-400 text-center mb-10">اختار المادة وابدأ الامتحان</p>
                <div className="grid md:grid-cols-3 gap-4">
                    {subjects.map((s, i) => (
                        <button key={i} onClick={() => { setSubject(s); setStage('exam'); }} className="glass rounded-2xl p-6 text-center hover:bg-white/10 transition transform hover:scale-105">
                            <div className="text-4xl mb-3">📚</div>
                            <h3 className="font-bold">{s}</h3>
                            <p className="text-gray-400 text-sm mt-2">5 أسئلة</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// PLANNER PAGE
// ═══════════════════════════════════════════════════════════════

const PlannerPage = () => {
    const [tasks, setTasks] = useState([
        { id: 1, subject: 'رياضيات', topic: 'التفاضل والتكامل', time: '09:00', duration: '2 ساعة', done: true },
        { id: 2, subject: 'فيزياء', topic: 'قوانين نيوتن', time: '11:00', duration: '1.5 ساعة', done: true },
        { id: 3, subject: 'كيمياء', topic: 'الجدول الدوري', time: '14:00', duration: '1 ساعة', done: false },
        { id: 4, subject: 'أحياء', topic: 'الخلية', time: '16:00', duration: '1.5 ساعة', done: false },
    ]);
    const [showAdd, setShowAdd] = useState(false);
    const [newTask, setNewTask] = useState({ subject: '', topic: '', time: '', duration: '' });

    const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
    const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
    const addTask = () => {
        if (newTask.subject && newTask.topic) {
            setTasks([...tasks, { ...newTask, id: Date.now(), done: false }]);
            setNewTask({ subject: '', topic: '', time: '', duration: '' });
            setShowAdd(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 px-4 py-10">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold">خطة المذاكرة 📅</h1>
                        <p className="text-gray-400">نظّم وقتك وحقق أهدافك</p>
                    </div>
                    <button onClick={() => setShowAdd(true)} className="px-6 py-3 gradient-bg rounded-xl font-bold">+ إضافة مهمة</button>
                </div>

                {showAdd && (
                    <div className="glass rounded-2xl p-6 mb-6">
                        <h3 className="text-xl font-bold mb-4">إضافة مهمة جديدة</h3>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <input type="text" value={newTask.subject} onChange={(e) => setNewTask({...newTask, subject: e.target.value})} placeholder="المادة" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none" />
                            <input type="text" value={newTask.topic} onChange={(e) => setNewTask({...newTask, topic: e.target.value})} placeholder="الموضوع" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none" />
                            <input type="time" value={newTask.time} onChange={(e) => setNewTask({...newTask, time: e.target.value})} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none" />
                            <input type="text" value={newTask.duration} onChange={(e) => setNewTask({...newTask, duration: e.target.value})} placeholder="المدة" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={addTask} className="px-6 py-2 gradient-bg rounded-lg font-bold">حفظ</button>
                            <button onClick={() => setShowAdd(false)} className="px-6 py-2 glass rounded-lg">إلغاء</button>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div key={task.id} className={`glass rounded-2xl p-4 flex items-center gap-4 ${task.done ? 'opacity-60' : ''}`}>
                            <button onClick={() => toggleTask(task.id)} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${task.done ? 'bg-green-500 border-green-500' : 'border-white/30'}`}>
                                {task.done && '✓'}
                            </button>
                            <div className="flex-1">
                                <h3 className={`font-bold ${task.done ? 'line-through' : ''}`}>{task.subject}: {task.topic}</h3>
                                <p className="text-gray-400 text-sm">🕐 {task.time} • ⏱️ {task.duration}</p>
                            </div>
                            <button onClick={() => deleteTask(task.id)} className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30">×</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// LEADERBOARD PAGE
// ═══════════════════════════════════════════════════════════════

const LeaderboardPage = ({ user }) => {
    const leaders = [
        { rank: 1, name: 'أحمد محمد', points: 5420, level: 'أسطورة', avatar: '👑' },
        { rank: 2, name: 'سارة أحمد', points: 4850, level: 'محترف', avatar: '🥈' },
        { rank: 3, name: 'محمود علي', points: 4200, level: 'محترف', avatar: '🥉' },
        { rank: 4, name: 'نور حسن', points: 3900, level: 'متقدم', avatar: '⭐' },
        { rank: 5, name: 'يوسف كريم', points: 3500, level: 'متقدم', avatar: '⭐' },
        { rank: 6, name: 'مريم سعيد', points: 3200, level: 'متفوق', avatar: '🌟' },
        { rank: 7, name: 'عمر فاروق', points: 2800, level: 'متفوق', avatar: '🌟' },
        { rank: 8, name: 'هدى محمود', points: 2500, level: 'مجتهد', avatar: '💫' },
        { rank: 9, name: 'كريم أشرف', points: 2200, level: 'مجتهد', avatar: '💫' },
        { rank: 10, name: 'لمياء عادل', points: 2000, level: 'مجتهد', avatar: '💫' },
    ];

    return (
        <div className="min-h-screen pt-20 px-4 py-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-2">لوحة المتصدرين 🏆</h1>
                <p className="text-gray-400 text-center mb-10">أفضل الطلاب هذا الأسبوع</p>

                {/* Top 3 */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {leaders.slice(0, 3).map((l, i) => (
                        <div key={i} className={`glass rounded-2xl p-6 text-center ${i === 0 ? 'transform scale-110 border-2 border-yellow-500' : ''}`}>
                            <div className="text-5xl mb-3">{l.avatar}</div>
                            <h3 className="font-bold text-lg">{l.name}</h3>
                            <p className="text-gray-400 text-sm">{l.level}</p>
                            <p className="text-2xl font-black gradient-text mt-2">{l.points}</p>
                        </div>
                    ))}
                </div>

                {/* Rest */}
                <div className="glass rounded-2xl overflow-hidden">
                    {leaders.slice(3).map((l) => (
                        <div key={l.rank} className="flex items-center gap-4 p-4 border-b border-white/10 last:border-0 hover:bg-white/5">
                            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">{l.rank}</span>
                            <span className="text-2xl">{l.avatar}</span>
                            <div className="flex-1">
                                <h3 className="font-bold">{l.name}</h3>
                                <p className="text-gray-400 text-sm">{l.level}</p>
                            </div>
                            <span className="font-bold gradient-text">{l.points}</span>
                        </div>
                    ))}
                </div>

                {/* Current User */}
                <div className="glass rounded-2xl p-4 mt-6 flex items-center gap-4 border-2 border-primary">
                    <span className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center font-bold">42</span>
                    <span className="text-2xl">🎯</span>
                    <div className="flex-1">
                        <h3 className="font-bold">أنت ({user?.name || 'ضيف'})</h3>
                        <p className="text-gray-400 text-sm">{user?.level || 'مبتدئ'}</p>
                    </div>
                    <span className="font-bold gradient-text">{user?.points || 0}</span>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// BADGES PAGE
// ═══════════════════════════════════════════════════════════════

const BadgesPage = () => {
    const badges = [
        { icon: '🚀', name: 'بداية الرحلة', desc: 'أكملت أول درس', earned: true },
        { icon: '📝', name: 'محارب الامتحانات', desc: 'أكملت 10 امتحانات', earned: true },
        { icon: '🔥', name: 'متحمس', desc: '7 أيام متتالية', earned: true },
        { icon: '💯', name: 'الكمال', desc: 'درجة 100% في امتحان', earned: true },
        { icon: '🏆', name: 'البطل', desc: 'وصلت للمتصدرين', earned: true },
        { icon: '🌟', name: 'نجم المذاكرة', desc: '50 ساعة مذاكرة', earned: false },
        { icon: '📚', name: 'القارئ', desc: 'أكملت 5 كورسات', earned: false },
        { icon: '🎯', name: 'الدقة', desc: '95%+ في 5 امتحانات', earned: false },
        { icon: '👑', name: 'الأسطورة', desc: 'وصلت للمركز الأول', earned: false },
        { icon: '💎', name: 'الماسي', desc: '10,000 نقطة', earned: false },
    ];

    return (
        <div className="min-h-screen pt-20 px-4 py-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-2">الشارات والإنجازات 🎖️</h1>
                <p className="text-gray-400 text-center mb-10">اجمع الشارات وأثبت تفوقك</p>

                <div className="grid md:grid-cols-2 gap-4">
                    {badges.map((b, i) => (
                        <div key={i} className={`glass rounded-2xl p-4 flex items-center gap-4 ${!b.earned ? 'opacity-50' : ''}`}>
                            <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${b.earned ? 'gradient-bg' : 'bg-white/10'}`}>
                                {b.earned ? b.icon : '🔒'}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">{b.name}</h3>
                                <p className="text-gray-400 text-sm">{b.desc}</p>
                            </div>
                            {b.earned && <span className="text-green-500 text-2xl">✓</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// PRICING PAGE
// ═══════════════════════════════════════════════════════════════

const PricingPage = ({ setCurrentPage }) => {
    const plans = [
        { name: 'مجاني', price: '0', period: 'للأبد', features: ['المساعد الذكي (محدود)', '5 امتحانات/شهر', 'المواد الأساسية', 'الدعم بالإيميل'], color: 'from-gray-500 to-gray-600', popular: false },
        { name: 'الطالب', price: '49', period: '/شهر', features: ['المساعد الذكي (غير محدود)', 'امتحانات غير محدودة', 'كل المواد', 'خطط مذاكرة ذكية', 'تحليل نقاط الضعف', 'الدعم الفني'], color: 'from-purple-500 to-blue-500', popular: true },
        { name: 'المتفوق', price: '99', period: '/شهر', features: ['كل مميزات الطالب', 'المساعد الصوتي', 'جلسات خاصة', 'تقارير للأهل', 'أولوية الدعم', 'شهادات معتمدة'], color: 'from-yellow-500 to-orange-500', popular: false },
    ];

    return (
        <div className="min-h-screen pt-20 px-4 py-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-2">الباقات والأسعار 💎</h1>
                <p className="text-gray-400 text-center mb-10">اختار الباقة المناسبة ليك</p>

                <div className="grid md:grid-cols-3 gap-6">
                    {plans.map((plan, i) => (
                        <div key={i} className={`glass rounded-3xl p-6 relative ${plan.popular ? 'border-2 border-primary transform scale-105' : ''}`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 gradient-bg rounded-full text-sm font-bold">
                                    الأكثر شيوعاً ⭐
                                </div>
                            )}
                            <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto`}>
                                {i === 0 ? '🎁' : i === 1 ? '🎓' : '👑'}
                            </div>
                            <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>
                            <div className="text-center mb-6">
                                <span className="text-4xl font-black gradient-text">{plan.price}</span>
                                <span className="text-gray-400"> جنيه{plan.period}</span>
                            </div>
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-500">✓</span> {f}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => setCurrentPage('register')} className={`w-full py-3 rounded-xl font-bold transition ${plan.popular ? 'gradient-bg text-white' : 'glass hover:bg-white/10'}`}>
                                {plan.price === '0' ? 'ابدأ مجاناً' : 'اشترك الآن'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════════════════════════

const ProfilePage = ({ user, setUser, setCurrentPage }) => {
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', stage: user?.stage || '' });

    const handleSave = () => {
        setUser({ ...user, ...formData });
        setEditing(false);
    };

    return (
        <div className="min-h-screen pt-20 px-4 py-10">
            <div className="max-w-2xl mx-auto">
                <div className="glass rounded-3xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-24 h-24 gradient-bg rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                            {user?.name?.charAt(0) || '👤'}
                        </div>
                        <h1 className="text-3xl font-bold">{user?.name || 'الاسم'}</h1>
                        <p className="text-gray-400">{user?.stage || 'المرحلة الدراسية'}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="text-center p-4 glass rounded-xl"><div className="text-2xl font-bold gradient-text">{user?.points || 0}</div><div className="text-gray-400 text-sm">نقطة</div></div>
                        <div className="text-center p-4 glass rounded-xl"><div className="text-2xl font-bold gradient-text">{user?.badges || 0}</div><div className="text-gray-400 text-sm">شارة</div></div>
                        <div className="text-center p-4 glass rounded-xl"><div className="text-2xl font-bold gradient-text">#42</div><div className="text-gray-400 text-sm">الترتيب</div></div>
                    </div>

                    {editing ? (
                        <div className="space-y-4">
                            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none" placeholder="الاسم" />
                            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none" placeholder="البريد" />
                            <div className="flex gap-2">
                                <button onClick={handleSave} className="flex-1 py-3 gradient-bg rounded-xl font-bold">حفظ</button>
                                <button onClick={() => setEditing(false)} className="flex-1 py-3 glass rounded-xl">إلغاء</button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between p-4 glass rounded-xl"><span className="text-gray-400">البريد</span><span>{user?.email}</span></div>
                            <div className="flex justify-between p-4 glass rounded-xl"><span className="text-gray-400">المرحلة</span><span>{user?.stage}</span></div>
                            <div className="flex justify-between p-4 glass rounded-xl"><span className="text-gray-400">المستوى</span><span>{user?.level}</span></div>
                            <button onClick={() => setEditing(true)} className="w-full py-3 gradient-bg rounded-xl font-bold">تعديل البيانات</button>
                            <button onClick={() => setCurrentPage('settings')} className="w-full py-3 glass rounded-xl">الإعدادات</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ═══════════════════════════════════════════════════════════════

const SettingsPage = ({ darkMode, setDarkMode, setUser, setCurrentPage }) => {
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(true);
    const [language, setLanguage] = useState('ar');

    return (
        <div className="min-h-screen pt-20 px-4 py-10">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">الإعدادات ⚙️</h1>

                <div className="space-y-4">
                    <div className="glass rounded-2xl p-4 flex justify-between items-center">
                        <div><h3 className="font-bold">الوضع الليلي</h3><p className="text-gray-400 text-sm">تفعيل المظهر الداكن</p></div>
                        <button onClick={() => setDarkMode(!darkMode)} className={`w-14 h-8 rounded-full transition ${darkMode ? 'bg-primary' : 'bg-white/20'}`}>
                            <div className={`w-6 h-6 bg-white rounded-full transition transform ${darkMode ? 'translate-x-1' : 'translate-x-7'}`}></div>
                        </button>
                    </div>

                    <div className="glass rounded-2xl p-4 flex justify-between items-center">
                        <div><h3 className="font-bold">الإشعارات</h3><p className="text-gray-400 text-sm">استلام التنبيهات</p></div>
                        <button onClick={() => setNotifications(!notifications)} className={`w-14 h-8 rounded-full transition ${notifications ? 'bg-primary' : 'bg-white/20'}`}>
                            <div className={`w-6 h-6 bg-white rounded-full transition transform ${notifications ? 'translate-x-1' : 'translate-x-7'}`}></div>
                        </button>
                    </div>

                    <div className="glass rounded-2xl p-4 flex justify-between items-center">
                        <div><h3 className="font-bold">الصوت</h3><p className="text-gray-400 text-sm">تفعيل الأصوات</p></div>
                        <button onClick={() => setSound(!sound)} className={`w-14 h-8 rounded-full transition ${sound ? 'bg-primary' : 'bg-white/20'}`}>
                            <div className={`w-6 h-6 bg-white rounded-full transition transform ${sound ? 'translate-x-1' : 'translate-x-7'}`}></div>
                        </button>
                    </div>

                    <div className="glass rounded-2xl p-4">
                        <h3 className="font-bold mb-2">اللغة</h3>
                        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none">
                            <option value="ar">العربية</option>
                            <option value="en">English</option>
                        </select>
                    </div>

                    <button onClick={() => { setUser(null); setCurrentPage('home'); }} className="w-full py-4 bg-red-500/20 text-red-400 rounded-xl font-bold hover:bg-red-500/30 transition">
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS PAGE
// ═══════════════════════════════════════════════════════════════

const NotificationsPage = () => {
    const notifications = [
        { id: 1, type: 'achievement', title: 'شارة جديدة! 🏆', desc: 'حصلت على شارة "محارب الامتحانات"', time: 'منذ 5 دقائق', read: false },
        { id: 2, type: 'reminder', title: 'تذكير بالمذاكرة 📚', desc: 'حان وقت مذاكرة الفيزياء', time: 'منذ ساعة', read: false },
        { id: 3, type: 'points', title: 'نقاط جديدة! ⭐', desc: 'كسبت 50 نقطة من الامتحان', time: 'منذ 3 ساعات', read: false },
        { id: 4, type: 'update', title: 'تحديث جديد 🎉', desc: 'تم إضافة كورس الكيمياء الجديد', time: 'أمس', read: true },
        { id: 5, type: 'leaderboard', title: 'ترتيبك تحسن! 📈', desc: 'أنت الآن في المركز 42', time: 'أمس', read: true },
    ];

    return (
        <div className="min-h-screen pt-20 px-4 py-10">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">الإشعارات 🔔</h1>
                <div className="space-y-4">
                    {notifications.map((n) => (
                        <div key={n.id} className={`glass rounded-2xl p-4 flex gap-4 ${!n.read ? 'border-r-4 border-primary' : ''}`}>
                            <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center text-xl">
                                {n.type === 'achievement' ? '🏆' : n.type === 'reminder' ? '⏰' : n.type === 'points' ? '⭐' : n.type === 'update' ? '🎉' : '📈'}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">{n.title}</h3>
                                <p className="text-gray-400 text-sm">{n.desc}</p>
                                <p className="text-gray-500 text-xs mt-1">{n.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// QURAN PAGE
// ═══════════════════════════════════════════════════════════════

const QuranPage = () => {
    const surahs = [
        { name: 'الفاتحة', verses: 7, memorized: true },
        { name: 'البقرة', verses: 286, memorized: false },
        { name: 'آل عمران', verses: 200, memorized: false },
        { name: 'النساء', verses: 176, memorized: false },
        { name: 'الناس', verses: 6, memorized: true },
        { name: 'الفلق', verses: 5, memorized: true },
        { name: 'الإخلاص', verses: 4, memorized: true },
    ];

    return (
        <div className="min-h-screen pt-20 px-4 py-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-2">تحفيظ القرآن الكريم 🕌</h1>
                <p className="text-gray-400 text-center mb-10">احفظ القرآن مع ميمو</p>

                <div className="grid md:grid-cols-2 gap-4">
                    {surahs.map((s, i) => (
                        <div key={i} className={`glass rounded-2xl p-4 flex items-center gap-4 ${s.memorized ? 'border-2 border-green-500' : ''}`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${s.memorized ? 'bg-green-500' : 'bg-emerald-500/20'}`}>
                                {s.memorized ? '✓' : '📖'}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">سورة {s.name}</h3>
                                <p className="text-gray-400 text-sm">{s.verses} آية</p>
                            </div>
                            <button className="px-4 py-2 gradient-bg rounded-lg text-sm font-bold">
                                {s.memorized ? 'مراجعة' : 'ابدأ'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// THERAPY PAGE
// ═══════════════════════════════════════════════════════════════

const TherapyPage = () => {
    const [mood, setMood] = useState('');
    const [started, setStarted] = useState(false);

    const moods = [
        { emoji: '😊', label: 'سعيد' },
        { emoji: '😐', label: 'عادي' },
        { emoji: '😔', label: 'حزين' },
        { emoji: '😰', label: 'قلقان' },
        { emoji: '😤', label: 'متوتر' },
    ];

    if (started) {
        return (
            <div className="min-h-screen pt-20 px-4 py-10">
                <div className="max-w-2xl mx-auto">
                    <div className="glass rounded-3xl p-8 text-center">
                        <div className="text-6xl mb-4">💚</div>
                        <h1 className="text-3xl font-bold mb-4">جلسة الدعم النفسي</h1>
                        <p className="text-gray-400 mb-6">أنت اخترت إنك حاسس: {mood}</p>
                        <div className="glass rounded-2xl p-6 text-right mb-6">
                            <p className="leading-relaxed">
                                أهلاً بيك يا بطل 💚 عارف إن الفترة دي ممكن تكون صعبة، بس تأكد إنك مش لوحدك.
                                كل اللي بتحس بيه ده طبيعي ومؤقت. خد نفس عميق معايا...
                            </p>
                        </div>
                        <button onClick={() => setStarted(false)} className="px-8 py-3 gradient-bg rounded-xl font-bold">رجوع</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 px-4 py-10">
            <div className="max-w-2xl mx-auto">
                <div className="glass rounded-3xl p-8 text-center">
                    <div className="text-6xl mb-4">💚</div>
                    <h1 className="text-3xl font-bold mb-4">الدعم النفسي</h1>
                    <p className="text-gray-400 mb-8">إزي حاسس النهاردة؟</p>
                    <div className="flex justify-center gap-4 mb-8">
                        {moods.map((m, i) => (
                            <button key={i} onClick={() => setMood(m.label)} className={`w-16 h-16 rounded-2xl text-3xl transition ${mood === m.label ? 'gradient-bg scale-110' : 'glass hover:bg-white/10'}`}>
                                {m.emoji}
                            </button>
                        ))}
                    </div>
                    {mood && (
                        <button onClick={() => setStarted(true)} className="px-8 py-3 gradient-bg rounded-xl font-bold">ابدأ الجلسة</button>
                    )}
                </div>
            </div>
        </div>
    );
};

//
