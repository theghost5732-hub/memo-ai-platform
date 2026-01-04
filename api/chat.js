// api/chat.js (Vercel Backend Function)
export default async function handler(req, res) {
  // السماح بمرور الطلب (حل مشكلة CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { message, modelId } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, // المفتاح مخفي هنا
        "HTTP-Referer": "https://memo-ai.app",
        "X-Title": "Memo AI"
      },
      body: JSON.stringify({
        model: modelId || "google/gemini-2.0-flash-001",
        messages: [
          { role: "system", content: "أنت ميمو، مساعد تعليمي مصري خارق. صانعك المهندس محمد ربيع. رد بالعامية المصرية." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Backend Error" });
  }
}