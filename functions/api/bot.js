export async function onRequestPost(context) {
  const env = context.env;
  const MACRODROID_BASE_URL = "https://trigger.macrodroid.com/YOUR_UUID_HERE"; // Thay UUID của bạn vào
  const TELEGRAM_TOKEN = "YOUR_BOT_TOKEN_HERE"; // Thay Token Bot của bạn vào
  const MY_CHAT_ID = 123456789; // Thay ID Telegram của bạn để bảo mật

  const payload = await context.request.json();

  if (payload.message && payload.message.text) {
    const chatId = payload.message.chat.id;
    const text = payload.message.text;

    // Bảo mật: Chỉ xử lý nếu đúng ID của bạn
    if (chatId !== MY_CHAT_ID) return new Response("Unauthorized");

    let targetUrl = "";
    let responseText = "";

    if (text === "/shizuku") {
      targetUrl = `${MACRODROID_BASE_URL}/shizuku_on`;
      responseText = "⏳ Đang kích hoạt Shizuku...";
    } else if (text === "/turn_on_wifi_debug") {
      targetUrl = `${MACRODROID_BASE_URL}/wifi_debug_on`;
      responseText = "🛠 Đang bật Gỡ lỗi không dây...";
    }

    if (targetUrl) {
      // Gọi sang MacroDroid
      await fetch(targetUrl);

      // Phản hồi lại Telegram
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: responseText }),
      });
    }
  }

  return new Response("OK");
}
