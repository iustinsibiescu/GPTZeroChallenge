const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const url = require("url");

const {
  getModelResponse,
  getModelResponseGenerator,
} = require("./services/llmModel");

const app = express();
const server = http.createServer(app);
const wsServer = new WebSocket.Server({ noServer: true });
app.use(express.json());
const PORT = 8082;

app.post("/v1/chat/completions", async (req, res) => {
  const requestPrompt = req.body.prompt;
  const response = await getModelResponse(requestPrompt);
  res.send(response);
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
