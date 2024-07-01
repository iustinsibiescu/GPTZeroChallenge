"use client";
import React, { useState, useEffect, useRef } from "react";
import { getPromptResponseThroughWS } from "../../api/getPromptResponseThroughWS";
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

  const handleSubmitWS = async () => {
    const onMessageCallback = function(message){
      addMessage(message, agentTypes.richieRich, false);
    }

    const onCloseConnectionCallback = function(message){
      setPrompt("");
      setIsLoadingResponse(false);
    }

    if (!prompt) {
      setError("Please enter a prompt.");
      return;
    }
    
    setError(null);
    try {
      setIsLoadingResponse(true);
      addMessage(prompt, agentTypes.user, true);          
      addMessage('', agentTypes.richieRich, true);
      getPromptResponseThroughWS(prompt, onMessageCallback, onCloseConnectionCallback);
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
