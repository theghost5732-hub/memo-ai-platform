import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, BookOpen, Calendar, Settings, LogOut, Menu } from "lucide-react";
import { useState } from "react";

const DashboardLayout = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { title: "الرئيسية", path: "/dashboard", icon: Home },
    { title: "المساعد الذكي", path: "/dashboard/chat", icon: MessageSquare },
    { title: "المواد الدراسية", path: "/dashboard/subjects", icon: BookOpen },
    { title: "جدول المذاكرة", path: "/dashboard/planner", icon: Calendar },
    { title: "الإعدادات", path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex dir-rtl" dir="rtl">
      {/* Sidebar - القائمة الجانبية */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-64 bg-[#1e293b] border-l border-white/5 transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:static
      `}>
        <div className="p-6 border-b border-white/5">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            ميمو 🎓
          </h1>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/5">
          <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 w-full rounded-xl transition-colors">
            <LogOut className="h-5 w-5" />
            <span>تسجيل خروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content - المحتوى الرئيسي */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden p-4 border-b border-white/5 flex items-center justify-between bg-[#1e293b]">
          <h1 className="text-xl font-bold">ميمو</h1>
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2">
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* الصفحة المتغيرة */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;