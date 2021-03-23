require('dotenv').config();
const express = require("express")
const line = require("@line/bot-sdk")

const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET
}

const PORT = process.env.PORT || 7777

const app = express()
const processMessage = require("./process")
app.post("/webhook", line.middleware(config), (req, res) => {
  async function handleEvent(event) {
    if (event.type !== "message" || event.message.type !== "text") {
      return null;
    }

    const responseMessage = await processMessage(event.message.text, event.source);
    if (responseMessage) {
      const client = new line.Client(config)

      function getResponseMsg(m) {
        if (typeof m === "string") {
          return {
            type: "text",
            text: m
          }
        }
        if (m.type) {
          if (m.type === "image") {
            return {
              type: m.type,
              originalContentUrl: m.image,
              previewImageUrl: m.image,
              sender: m.sender || null
            }
          }

          if (m.type === "video") {
            return {
              type: m.type,
              originalContentUrl: m.video,
              previewImageUrl: m.video,
              sender: m.sender || null
            }
          }

          return {
            type: m.type,
            text: m.text || "Null",
            sender: m.sender || null
          }
        }
      }

      const f = Array.isArray(responseMessage) ? responseMessage.map(r => getResponseMsg(r)) : getResponseMsg(responseMessage)

      return client.replyMessage(event.replyToken, f)
    }

    return null;
  }

  Promise.all(req.body.events.map(handleEvent)).then(result =>
    res.json(result)
  );
});

app.use((err, req, res, next) => {
  if (err instanceof line.SignatureValidationFailed) {
    res.status(401).send(err.signature)
    return
  } else if (err instanceof line.JSONParseError) {
    res.status(400).send(err.raw)
    return
  }
  next(err)
})

app.listen(PORT, () =>
  console.log(`Process bro-bot webhook server is listening on port ${PORT}.`)
)
