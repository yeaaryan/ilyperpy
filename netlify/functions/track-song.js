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

  try {
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

    const body = JSON.parse(event.body || "{}");

    const title = body.title || "Unknown song";
    const artist = body.artist || "Unknown artist";

    const time = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true
    });

    const message =
`🎵 Song played

Song: ${title}
Artist: ${artist}
Time: ${time}`;

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

    if (!telegramResponse.ok || !data.ok) {
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