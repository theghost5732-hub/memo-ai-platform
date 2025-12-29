const { useState, useEffect } = React;

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

// Navigation Component
const Navbar = ({ currentPage, setCurrentPage, darkMode, setDarkMode, user, setUser }) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
                    <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-xl">
                        🎓
                    </div>
                    <span className="text-2xl font-bold gradient-text">ميمو</span>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <button onClick={() => setCurrentPage('home')} className={`hover:text-primary transition ${currentPage === 'home' ? 'text-primary' : 'text-gray-300'}`}>الرئيسية</button>
                    <button onClick={() => setCurrentPage('chat')} className={`hover:text-primary transition ${currentPage === 'chat' ? 'text-primary' : 'text-gray-300'}`}>المساعد الذكي</button>
                    <button onClick={() => setCurrentPage('exams')} className={`hover:text-primary transition ${currentPage === 'exams' ? 'text-primary' : 'text-gray-300'}`}>الامتحانات</button>
                    <button onClick={() => setCurrentPage('subjects')} className={`hover:text-primary transition ${currentPage === 'subjects' ? 'text-primary' : 'text-gray-300'}`}>المواد</button>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition"
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                    
                    {user ? (
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage('dashboard')} className="px-4 py-2 rounded-full glass hover:bg-white/10 transition">
                                لوحة التحكم
                            </button>
                            <button onClick={() => setUser(null)} className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition">
                                خروج
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage('login')} className="px-4 py-2 rounded-full glass hover:bg-white/10 transition">
                                دخول
                            </button>
                            <button onClick={() => setCurrentPage('register')} className="px-6 py-2 rounded-full gradient-bg text-white font-bold hover:opacity-90 transition">
                                سجّل مجاناً
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

// Home Page
const HomePage = ({ setCurrentPage }) => {
    return (
        <div className="min-h-screen pt-20">
            {/* Hero Section */}
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
                        منصة تعليمية ثورية تستخدم الذكاء الاصطناعي عشان تساعدك تفهم، تذاكر، وتتفوق.
                        مصممة خصيصاً للمنهج المصري.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => setCurrentPage('register')}
                            className="px-8 py-4 rounded-full gradient-bg text-white font-bold text-lg hover:opacity-90 transition transform hover:scale-105"
                        >
                            🚀 ابدأ رحلتك مجاناً
                        </button>
                        <button 
                            onClick={() => setCurrentPage('chat')}
                            className="px-8 py-4 rounded-full glass font-bold text-lg hover:bg-white/10 transition"
                        >
                            جرّب المساعد الذكي ←
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-4">
                        ليه <span className="gradient-text">ميمو</span> مختلف؟
                    </h2>
                    <p className="text-gray-400 text-center mb-12">مميزات مش هتلاقيها في أي منصة تانية</p>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: '🤖', title: 'مساعد ذكي 24/7', desc: 'اسأل أي سؤال في أي مادة وميمو هيجاوبك بالتفصيل' },
                            { icon: '📝', title: 'امتحانات تفاعلية', desc: 'امتحانات على المنهج المصري مع تصحيح فوري' },
                            { icon: '🎯', title: 'خطط مذاكرة ذكية', desc: 'جداول مخصصة بناءً على وقتك ومستواك' },
                            { icon: '🎙️', title: 'مساعد صوتي', desc: 'اتكلم مع ميمو بالصوت باللهجة المصرية' },
                            { icon: '📊', title: 'تحليل نقاط الضعف', desc: 'ميمو بيحلل أداءك ويقولك تركز على إيه' },
                            { icon: '🏆', title: 'نظام مكافآت', desc: 'اكسب نقاط وشارات وتنافس مع زملائك' },
                        ].map((feature, i) => (
                            <div key={i} className="glass rounded-2xl p-6 hover:bg-white/10 transition transform hover:-translate-y-2 cursor-pointer">
                                <div className="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center text-2xl mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 glass">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { num: '+10,000', label: 'طالب مسجل' },
                            { num: '+50,000', label: 'سؤال تم حله' },
                            { num: '+1,000', label: 'امتحان' },
                            { num: '98%', label: 'نسبة الرضا' },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-4xl font-black gradient-text mb-2">{stat.num}</div>
                                <div className="text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="gradient-bg rounded-3xl p-10 text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                جاهز تبدأ رحلة التفوق؟
                            </h2>
                            <p className="text-white/80 text-lg mb-8">
                                انضم لآلاف الطلاب اللي بيستخدموا ميمو يومياً
                            </p>
                            <button 
                                onClick={() => setCurrentPage('register')}
                                className="px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition transform hover:scale-105"
                            >
                                🎓 سجّل دلوقتي مجاناً
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-500 border-t border-white/10">
                <p>صنع بـ ❤️ بواسطة المهندس محمد ربيع | © 2025 ميمو</p>
            </footer>
        </div>
    );
};

// Login Page
const LoginPage = ({ setCurrentPage, setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (email && password) {
            // Admin check
            if (email === 'admin@memo.com') {
                setUser({ email, name: 'الأدمن', role: 'admin' });
                setCurrentPage('admin');
            } else {
                setUser({ email, name: 'طالب', role: 'student' });
                setCurrentPage('dashboard');
            }
        } else {
            setError('من فضلك املأ كل الخانات');
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="glass rounded-3xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                            🔐
                        </div>
                        <h1 className="text-3xl font-bold">تسجيل الدخول</h1>
                        <p className="text-gray-400 mt-2">أهلاً بيك تاني في ميمو</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-2">البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition"
                                placeholder="example@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">كلمة المرور</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl gradient-bg text-white font-bold hover:opacity-90 transition"
                        >
                            دخول
                        </button>
                    </form>

                    <p className="text-center text-gray-400 mt-6">
                        مش معاك حساب؟{' '}
                        <button onClick={() => setCurrentPage('register')} className="text-primary hover:underline">
                            سجّل دلوقتي
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Register Page
const RegisterPage = ({ setCurrentPage, setUser }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [stage, setStage] = useState('');
    const [error, setError] = useState('');

    const stages = [
        'الصف الأول الابتدائي', 'الصف الثاني الابتدائي', 'الصف الثالث الابتدائي',
        'الصف الرابع الابتدائي', 'الصف الخامس الابتدائي', 'الصف السادس الابتدائي',
        'الصف الأول الإعدادي', 'الصف الثاني الإعدادي', 'الصف الثالث الإعدادي',
        'الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي',
    ];

    const handleRegister = (e) => {
        e.preventDefault();
        if (name && email && password && stage) {
            setUser({ name, email, stage, role: 'student' });
            setCurrentPage('dashboard');
        } else {
            setError('من فضلك املأ كل الخانات');
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="glass rounded-3xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                            🎓
                        </div>
                        <h1 className="text-3xl font-bold">إنشاء حساب جديد</h1>
                        <p className="text-gray-400 mt-2">انضم لعيلة ميمو</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-2">الاسم</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition"
                                placeholder="محمد أحمد"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition"
                                placeholder="example@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">كلمة المرور</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">المرحلة الدراسية</label>
                            <select
                                value={stage}
                                onChange={(e) => setStage(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition"
                            >
                                <option value="">اختار مرحلتك</option>
                                {stages.map((s, i) => (
                                    <option key={i} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl gradient-bg text-white font-bold hover:opacity-90 transition"
                        >
                            إنشاء الحساب
                        </button>
                    </form>

                    <p className="text-center text-gray-400 mt-6">
                        عندك حساب؟{' '}
                        <button onClick={() => setCurrentPage('login')} className="text-primary hover:underline">
                            سجّل دخول
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Chat Page (AI Assistant)
const ChatPage = ({ user }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'أهلاً بيك يا بطل! 👋 أنا ميمو، مساعدك الذكي. اسألني أي سؤال في أي مادة وأنا هساعدك!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        // Simulate AI response (replace with real Gemini API later)
        setTimeout(() => {
            const responses = [
                'سؤال جميل! خليني أشرحلك بالتفصيل...',
                'تمام يا بطل، ده سؤال مهم. الإجابة هي...',
                'أيوه فاهمك، بص معايا كده...',
                'ممتاز إنك بتسأل! الموضوع ده بسيط...',
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            setMessages(prev => [...prev, { role: 'ai', content: randomResponse + ' (ده رد تجريبي - هنربط الـ API قريباً)' }]);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen pt-20 flex flex-col">
            <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
                {/* Chat Header */}
                <div className="glass rounded-2xl p-4 mb-4 flex items-center gap-4">
                    <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center text-2xl">
                        🤖
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">المساعد الذكي</h1>
                        <p className="text-gray-400 text-sm">متصل ومستعد للمساعدة</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="glass rounded-2xl p-4 h-[60vh] overflow-y-auto mb-4 space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${
                                msg.role === 'user' 
                                    ? 'bg-primary/20 text-white' 
                                    : 'bg-white/10 text-white'
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-end">
                            <div className="bg-white/10 p-4 rounded-2xl">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="glass rounded-2xl p-4 flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="اكتب سؤالك هنا..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading}
                        className="px-6 py-3 gradient-bg rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50"
                    >
                        إرسال
                    </button>
                </div>
            </div>
        </div>
    );
};

// Dashboard Page
const DashboardPage = ({ user, setCurrentPage }) => {
    return (
        <div className="min-h-screen pt-20 px-4 py-6">
            <div className="max-w-6xl mx-auto">
                {/* Welcome */}
                <div className="glass rounded-2xl p-6 mb-6">
                    <h1 className="text-3xl font-bold mb-2">أهلاً {user?.name || 'بيك'}! 👋</h1>
                    <p className="text-gray-400">جاهز تكمل مذاكرة النهاردة؟</p>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                    {[
                        { icon: '🤖', title: 'المساعد الذكي', page: 'chat', color: 'from-purple-500 to-blue-500' },
                        { icon: '📝', title: 'امتحان جديد', page: 'exams', color: 'from-green-500 to-teal-500' },
                        { icon: '📚', title: 'المواد', page: 'subjects', color: 'from-orange-500 to-red-500' },
                        { icon: '📅', title: 'خطة المذاكرة', page: 'planner', color: 'from-pink-500 to-purple-500' },
                    ].map((item, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(item.page)}
                            className="glass rounded-2xl p-6 text-center hover:bg-white/10 transition transform hover:scale-105"
                        >
                            <div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3`}>
                                {item.icon}
                            </div>
                            <h3 className="font-bold">{item.title}</h3>
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="glass rounded-2xl p-6">
                        <h3 className="text-gray-400 mb-2">النقاط</h3>
                        <div className="text-4xl font-black gradient-text">1,250</div>
                    </div>
                    <div className="glass rounded-2xl p-6">
                        <h3 className="text-gray-400 mb-2">الامتحانات</h3>
                        <div className="text-4xl font-black gradient-text">23</div>
                    </div>
                    <div className="glass rounded-2xl p-6">
                        <h3 className="text-gray-400 mb-2">المستوى</h3>
                        <div className="text-4xl font-black gradient-text">متفوق 🏆</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Exams Page
const ExamsPage = () => {
    const [selectedSubject, setSelectedSubject] = useState('');
    const [examStarted, setExamStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const subjects = ['الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء', 'اللغة العربية', 'اللغة الإنجليزية'];
    
    const sampleQuestions = [
        { q: 'ما هو ناتج 15 × 8؟', options: ['100', '120', '130', '150'], correct: 1 },
        { q: 'ما هي عاصمة مصر؟', options: ['الإسكندرية', 'القاهرة', 'الأقصر', 'أسوان'], correct: 1 },
        { q: 'كم عدد أيام السنة الكبيسة؟', options: ['365', '366', '364', '367'], correct: 1 },
    ];

    const handleAnswer = (index) => {
        if (index === sampleQuestions[currentQuestion].correct) {
            setScore(score + 1);
        }
        if (currentQuestion < sampleQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResult(true);
        }
    };

    if (showResult) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center px-4">
                <div className="glass rounded-3xl p-10 text-center max-w-md">
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="text-3xl font-bold mb-4">انتهى الامتحان!</h1>
                    <div className="text-5xl font-black gradient-text mb-4">
                        {score}/{sampleQuestions.length}
                    </div>
                    <p className="text-gray-400 mb-6">
                        {score === sampleQuestions.length ? 'ممتاز! درجة كاملة 🏆' : 'شغل حلو، كمّل مذاكرة! 💪'}
                    </p>
                    <button
                        onClick={() => { setExamStarted(false); setShowResult(false); setCurrentQuestion(0); setScore(0); }}
                        className="px-8 py-3 gradient-bg rounded-xl font-bold"
                    >
                        امتحان جديد
                    </button>
                </div>
            </div>
        );
    }

    if (examStarted) {
        const question = sampleQuestions[currentQuestion];
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center px-4">
                <div className="glass rounded-3xl p-8 max-w-2xl w-full">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-400">السؤال {currentQuestion + 1} من {sampleQuestions.length}</span>
                        <span className="px-4 py-2 gradient-bg rounded-full text-sm">{selectedSubject}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-8">{question.q}</h2>
                    <div className="space-y-3">
                        {question.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                className="w-full p-4 glass rounded-xl text-right hover:bg-primary/20 transition"
                            >
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
                    {subjects.map((subject, i) => (
                        <button
                            key={i}
                            onClick={() => { setSelectedSubject(subject); setExamStarted(true); }}
                            className="glass rounded-2xl p-6 text-center hover:bg-white/10 transition transform hover:scale-105"
                        >
                            <div className="text-4xl mb-3">📚</div>
                            <h3 className="font-bold">{subject}</h3>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Subjects Page
const SubjectsPage = () => {
    const subjects = [
        { name: 'الرياضيات', icon: '📐', lessons: 24, progress: 60 },
        { name: 'الفيزياء', icon: '⚡', lessons: 18, progress: 45 },
        { name: 'الكيمياء', icon: '🧪', lessons: 20, progress: 30 },
        { name: 'الأحياء', icon: '🧬', lessons: 22, progress: 80 },
        { name: 'اللغة العربية', icon: '📖', lessons: 30, progress: 55 },
        { name: 'اللغة الإنجليزية', icon: '🔤', lessons: 28, progress: 70 },
    ];

    return (
        <div className="min-h-screen pt-20 px-4 py-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-2">المواد الدراسية 📚</h1>
                <p className="text-gray-400 text-center mb-10">اختار المادة وابدأ المذاكرة</p>

                <div className="grid md:grid-cols-3 gap-6">
                    {subjects.map((subject, i) => (
                        <div key={i} className="glass rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center text-2xl">
                                    {subject.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{subject.name}</h3>
                                    <p className="text-gray-400 text-sm">{subject.lessons} درس</p>
                                </div>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                                <div 
                                    className="gradient-bg h-2 rounded-full transition-all"
                                    style={{ width: `${subject.progress}%` }}
                                ></div>
                            </div>
                            <p className="text-gray-400 text-sm mt-2">{subject.progress}% مكتمل</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Admin Page
const AdminPage = ({ user }) => {
    const [subjects, setSubjects] = useState([
        { id: 1, name: 'الرياضيات', icon: '📐', active: true },
        { id: 2, name: 'الفيزياء', icon: '⚡', active: true },
        { id: 3, name: 'الكيمياء', icon: '🧪', active: true },
    ]);
    const [newSubject, setNewSubject] = useState('');

    const addSubject = () => {
        if (newSubject.trim()) {
            setSubjects([...subjects, { id: Date.now(), name: newSubject, icon: '📚', active: true }]);
            setNewSubject('');
        }
    };

    const toggleSubject = (id) => {
        setSubjects(subjects.map(s => s.id === id ? { ...s, active: !s.active } : s));
    };

    const deleteSubject = (id) => {
        setSubjects(subjects.filter(s => s.id !== id));
    };

    return (
        <div className="min-h-screen pt-20 px-4 py-6">
            <div className="max-w-6xl mx-auto">
                <div className="glass rounded-2xl p-6 mb-6">
                    <h1 className="text-3xl font-bold mb-2">لوحة تحكم الأدمن ⚙️</h1>
                    <p className="text-gray-400">أهلاً {user?.name}، من هنا تقدر تتحكم في كل حاجة</p>
                </div>

                {/* Add Subject */}
                <div className="glass rounded-2xl p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">إضافة مادة جديدة</h2>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            placeholder="اسم المادة"
                            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none"
                        />
                        <button onClick={addSubject} className="px-6 py-3 gradient-bg rounded-xl font-bold">
                            + إضافة
                        </button>
                    </div>
                </div>

                {/* Subjects List */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-4">المواد الحالية</h2>
                    <div className="space-y-3">
                        {subjects.map((subject) => (
                            <div key={subject.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{subject.icon}</span>
                                    <span className="font-bold">{subject.name}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${subject.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {subject.active ? 'مفعّل' : 'متوقف'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleSubject(subject.id)}
                                        className="px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                                    >
                                        {subject.active ? 'إيقاف' : 'تفعيل'}
                                    </button>
                                    <button
                                        onClick={() => deleteSubject(subject.id)}
                                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                    >
                                        حذف
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════

const App = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [darkMode, setDarkMode] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    const renderPage = () => {
        switch (currentPage) {
            case 'home': return <HomePage setCurrentPage={setCurrentPage} />;
            case 'login': return <LoginPage setCurrentPage={setCurrentPage} setUser={setUser} />;
            case 'register': return <RegisterPage setCurrentPage={setCurrentPage} setUser={setUser} />;
            case 'chat': return <ChatPage user={user} />;
            case 'dashboard': return <DashboardPage user={user} setCurrentPage={setCurrentPage} />;
            case 'exams': return <ExamsPage />;
            case 'subjects': return <SubjectsPage />;
            case 'admin': return <AdminPage user={user} />;
            default: return <HomePage setCurrentPage={setCurrentPage} />;
        }
    };

    return (
        <div className={`min-h-screen bg-dark text-white ${darkMode ? '' : 'bg-gray-100 text-gray-900'}`}>
            <Navbar 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage} 
                darkMode={darkMode} 
                setDarkMode={setDarkMode}
                user={user}
                setUser={setUser}
            />
            {renderPage()}
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
