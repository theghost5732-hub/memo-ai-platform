import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Chat from "./pages/dashboard/Chat";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* الصفحة الرئيسية */}
        <Route path="/" element={<Index />} />
        
        {/* صفحة تسجيل الدخول */}
        <Route path="/auth" element={<Auth />} />
        
        {/* صفحة الشات */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/dashboard/chat" element={<Chat />} />
        
        {/* أي صفحة مش موجودة */}
        <Route path="*" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;