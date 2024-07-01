const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const url = require("url");
const cors = require("cors");

const { getRichieRichResponse } = require("./clients/richieRich");
const RRML2HTML = require("./utils/RRML2HTML");

const PORT = 8081;
const app = express();
const server = http.createServer(app);
const wsServer = new WebSocket.Server({ noServer: true });

app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
  const requestPrompt = req.body.prompt;
  const response = await getRichieRichResponse(requestPrompt);
  const responseHTML = RRML2HTML(response);
  res.send(responseHTML);
});

wsServer.on("connection", async (ws) => {
  ws.on("message", async (prompt) => {
    console.log("Received prompt: ", prompt);
    const modelOutputGenerator = getModelResponseGenerator(prompt);
    let result = await modelOutputGenerator.next();
    while (!result.done) {
      ws.send(result.value);
      result = await modelOutputGenerator.next();
    }
    ws.close();
  });
});

server.on("upgrade", (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  if (pathname === "/v1/stream") {
    wsServer.handleUpgrade(request, socket, head, (ws) => {
      wsServer.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


const getModelResponseGenerator = async function* (prompt) {
  try {
    const choice = 'This is a test message that needs to be streamed word for word. This is a test message that needs to be streamed word for word This is a test message that needs to be streamed word for word This is a test message that needs to be streamed word for word This is a test message that needs to be streamed word for word This is a test message that needs to be streamed word for word This is a test message that needs to be streamed word for word This is a test message that needs to be streamed word for word This is a test message that needs to be streamed word for word This is a test message that needs to be streamed word for word This is a test message that needs to be streamed word for word';
    const words = choice.split(" ");
    for (let word of words) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      yield word + " ";
    }
  } catch (error) {
    console.error(error);
  }
};