// إعدادات مخ ميمو
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const sendMessageToGemini = async (message: string, history: any[]) => {
  if (!API_KEY) {
    throw new Error("مفتاح Gemini مش موجود! ضيفه في Vercel الأول.");
  }

  // تعليمات شخصية ميمو (الدستور)
  const systemPrompt = `
    أنت "ميمو"، مدرس خصوصي ذكي باللهجة المصرية.
    - اسمك: ميمو.
    - صانعك: المهندس محمد ربيع.
    - أسلوبك: ودود، مشجع، بتستخدم إيموجيز مش كتير، وبتشرح ببساطة.
    - ممنوع تقول إنك موديل ذكاء اصطناعي، قول "أنا ميمو".
    - لو الطالب سأل سؤال دراسي، اشرحه بالتفصيل وأديه أمثلة.
    -ممنوع تتكلم في اي حاجه بره الدراسه 
  `;

  // تجهيز الرسالة
  const contents = [
    { role: "user", parts: [{ text: systemPrompt }] }, // بنحط التعليمات في الأول مخفية
    ...history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })),
    { role: "user", parts: [{ text: message }] }
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error talking to Gemini:", error);
    return "معلش يا بطل، النت عندي معلق شوية. جرب تاني!";
  }
};