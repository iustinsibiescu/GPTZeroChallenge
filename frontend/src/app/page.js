"use client";
import React, { useState, useEffect, useRef } from "react";
import { getPromptResponse } from "../../api/getPromptResponse";
import { ChatResponse, ChatPrompt, TextArea } from "../components/chat";

const agentTypes = {
  user: "User",
  richieRich: "RichieRich",
};

export default function Home() {
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

  const handleTextAreaChange = (event) => {
    setPrompt(event.target.value);
  };

  const addMessage = (message, agent, isNewMessage = true) => {
    setMessages(isNewMessage ? 
        (prev) => [
        ...prev,
        {
          agent,
          contents: message,
        },
        ] 
        : 
        (prev) => {
          const messages = [...prev];
          const updatedMessage = {
            agent,
            contents: message,
          };
          messages[messages.length - 1] = updatedMessage;
          return messages;
        } 
    );
  };

  const handleSubmit = async () => {
    if (!prompt) {
      setError("Please enter a prompt.");
      return;
    }
    setError(null);
    try {
      setIsLoadingResponse(true);
      addMessage(prompt, agentTypes.user);
      const response = await getPromptResponse(prompt);
      addMessage(response, agentTypes.richieRich);
      setPrompt("");
      setIsLoadingResponse(false);
    } catch (error) {
      setError("An error occurred. Please try again.");
      setIsLoadingResponse(false);
    }
  };

  const handleSubmitWS = async () => {
    if (!prompt) {
      setError("Please enter a prompt.");
      return;
    }
    setError(null);

    try {
      const socket = new WebSocket('ws://localhost:8082/v1/stream');
      let response = '';
  
      // Event listener for when the connection is open
      socket.addEventListener('open', function (event) {
          setIsLoadingResponse(true);
          // Post the user prompt
          addMessage(prompt, agentTypes.user, true);
          // Start the answer prompt 
          addMessage(response, agentTypes.richieRich, true);
          console.log('WebSocket is open now.');

          // Send data to the server
          socket.send(prompt);
      });
  
      // Event listener for when a message is received from the server
      socket.addEventListener('message', function (event) {
          response += event.data;
          // Update the gpt prompt
          addMessage(response, agentTypes.richieRich, false);
          console.log('Message from server ', event.data);
      });
  
      // Event listener for when the connection is closed
      socket.addEventListener('close', function (event) {
          setPrompt("");
          setIsLoadingResponse(false);
          console.log('WebSocket is closed now.');
      });
  
      // Event listener for when there is an error
      socket.addEventListener('error', function (event) {
          console.error('WebSocket error observed:', event);
      });
    } catch (error) {
      setError("An error occurred. Please try again.");
      setIsLoadingResponse(false);
    }
  }

  useEffect(() => {
    scrollContainerRef.current.scrollTop =
      scrollContainerRef.current.scrollHeight;
  }, [messages]);

  return (
    <main className="flex flex-col items-center w-full bg-gray-100 h-[93vh]">
      <div
        ref={scrollContainerRef}
        className="flex flex-col overflow-y-scroll p-20 w-full mb-40"
      >
        {messages.map((message, index) =>
          message.agent === agentTypes.user ? (
            <ChatPrompt key={index} prompt={message.contents} />
          ) : (
            <ChatResponse key={index} response={message.contents} />
          ),
        )}
      </div>
      <TextArea
        onChange={handleTextAreaChange}
        onSubmit={handleSubmitWS}
        isLoading={isLoadingResponse}
        hasError={error !== null}
      />
      {error && (
        <div className="absolute bottom-0 mb-2 text-red-500">{error}</div>
      )}
    </main>
  );
}
