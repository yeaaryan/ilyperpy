exports.handler = async function () {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const time = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: true
  });

  const message =
`🎁 She opened the Wednesday Update gift box.

Time: ${time}

She’s inside the memories again.`;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  };
};