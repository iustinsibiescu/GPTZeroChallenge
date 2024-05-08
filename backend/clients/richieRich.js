const WebSocket = require("ws");
const axios = require("axios");

async function getRichieRichResponse(prompt) {
  try {
    const response = await axios.post(
      "http://localhost:8082/v1/chat/completions",
      {
        prompt,
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getRichieRichResponse,
};
