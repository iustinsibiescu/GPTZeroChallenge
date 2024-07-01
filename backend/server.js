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

wsServer.on("connection", async (wsClient) => {
  wsClient.on("message", async (prompt) => {
    console.log("Received prompt: ", prompt);
    
    try{
      const wsForApi = new WebSocket('ws://localhost:8082/v1/stream');
      wsForApi.onopen = () => {
        console.log('Connected to the WebSocket server');
        wsForApi.send(prompt);
      };

      wsForApi.onmessage = (event) => {
        console.log('Received:', event.data);
        wsClient.send(event.data);
      };

      wsForApi.onclose = () => {
        console.log('Disconnected from the WebSocket server');
        wsClient.close();
      };
    } catch(error){
      console.log(error);
      wsClient.close();
    }
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