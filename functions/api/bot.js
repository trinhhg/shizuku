export async function onRequestPost(context) {
  const env = context.env;
  
  // Thông tin bạn đã cung cấp
  const MACRODROID_BASE_URL = "https://trigger.macrodroid.com/92db6fa0-7025-4a66-b789-c17cf5e1be36";
  const TELEGRAM_TOKEN = "8261076722:AAFaEqamJEJAZi6nexoIh_STt_GHa6oVKuI";
  const MY_CHAT_ID = 5524168349; 

  let payload;
  try {
    payload = await context.request.json();
  } catch (e) {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (payload.message && payload.message.text) {
    const chatId = payload.message.chat.id;
    const text = payload.message.text;

    // Bảo mật: Chỉ xử lý nếu đúng ID của bạn gửi
    if (chatId === MY_CHAT_ID) {
      let targetUrl = "";
      let responseText = "";

      if (text === "/shizuku") {
        targetUrl = `${MACRODROID_BASE_URL}/shizuku_on`;
        responseText = "🚀 Đã gửi lệnh kích hoạt Shizuku tới điện thoại!";
      } 
      else if (text === "/turn_on_wifi_debug") {
        targetUrl = `${MACRODROID_BASE_URL}/wifi-debug-on`;
        responseText = "🛠 Đang gửi lệnh bật Gỡ lỗi không dây...";
      }

      if (targetUrl) {
        // 1. Gọi sang MacroDroid trên điện thoại
        await fetch(targetUrl);

        // 2. Gửi phản hồi lại cho bạn trên Telegram
        const tgApiUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        await fetch(tgApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: responseText,
          }),
        });
      }
    }
  }

  return new Response("OK", { status: 200 });
}
