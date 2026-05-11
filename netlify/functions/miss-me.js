exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        ok: false,
        error: "Method not allowed"
      })
    };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: "Telegram environment variables are missing"
      })
    };
  }

  const time = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: true
  });

const body = JSON.parse(event.body || "{}");
const action = body.action;

let message = `😭 She pressed the button.

"press this when you miss me and want to talk"

Time: ${time}

Maybe she wants to talk. Don’t overthink it.`;

if (action === "whatsapp_button_clicked") {
  message =
`💚 She pressed the WhatsApp button.

Time: ${time}

maybe she wants to contact you.`;
}

if (action === "letter_opened") {
  message =
`💌 She opened the letter.

Time: ${time}

she is reading your words rn.`;
}

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    const data = await telegramResponse.json();

    if (!data.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          ok: false,
          error: "Telegram failed",
          details: data
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: "Server error"
      })
    };
  }
};