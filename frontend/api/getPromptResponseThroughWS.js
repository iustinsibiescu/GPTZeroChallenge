import { backendStreamingUrl } from "./constants";

export const getPromptResponseThroughWS = async (prompt, onMessageCallback, onCloseConnectionCallback) => {
    const socket = new WebSocket(backendStreamingUrl);
    let response = '';

    socket.addEventListener('open', function (event) {
      console.log('WebSocket is open now.');
      socket.send(prompt);
    });

    socket.addEventListener('message', function (event) {
      console.log('Message from server ', event.data); 
      response += event.data;
      onMessageCallback(response);
    });

    socket.addEventListener('close', function (event) {
      console.log('WebSocket is closed now.');
      onCloseConnectionCallback();
    });

    socket.addEventListener('error', function (event) {
        console.error('WebSocket error observed:', event);
    });
};