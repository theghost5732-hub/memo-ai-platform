const DashboardHome = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">أهلاً يا بطل! 👋</h1>
        <p className="text-purple-100">جاهز نكسر الدنيا النهاردة؟</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5">
          <h3 className="text-gray-400 mb-2">مستواك الحالي</h3>
          <p className="text-2xl font-bold text-white">مبتدئ 🔥</p>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5">
          <h3 className="text-gray-400 mb-2">عدد الساعات</h3>
          <p className="text-2xl font-bold text-white">0 ساعة</p>
        </div>
      </div>
    </div>
  );
};
export default DashboardHome;