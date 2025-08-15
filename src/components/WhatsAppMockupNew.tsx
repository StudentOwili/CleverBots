'use client';

import React, { useState, useEffect, useRef } from 'react';

// Configuration
const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL_ID = "x-ai/grok-3-mini-beta";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface WhatsAppMockupProps {
  initialMessage?: string;
  systemPrompt?: string;
}

export default function WhatsAppMockupNew({
  initialMessage = "👋 Hey there! This is how the automation will look like. You can try me here before you get the real thing.",
  systemPrompt = "You are a helpful customer service AI assistant for a business. Respond in a friendly, professional manner. Keep responses concise and helpful, typical of WhatsApp business messages (short and to the point). You should act like a WhatsApp business assistant for a company called 'LFG Tech'. If asked about pricing, mention that the WhatsApp AI service starts at $299/month and custom solutions are tailored to business needs. If asked about products, mention AI solutions for WhatsApp, websites, and custom business automations."
}: WhatsAppMockupProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initial greeting message
  useEffect(() => {
    setMessages([
      {
        id: "initial-message",
        content: initialMessage,
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  }, [initialMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to call OpenRouter API
  const fetchAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    try {
      // Check if API key is available
      if (!OPENROUTER_API_KEY) {
        console.error("OpenRouter API key is not set. Please add NEXT_PUBLIC_OPENROUTER_API_KEY to your environment variables.");
        return "Sorry, the AI service is not properly configured. Please contact the administrator.";
      }
      
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
          'X-Title': 'WhatsApp Customer Service AI'
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL_ID,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: "user", content: userMessage }
          ]
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: `HTTP error ${response.status}` } }));
        throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      const aiResponseContent = data.choices[0]?.message?.content || "Sorry, I couldn't process that request.";
      
      return aiResponseContent;
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Sorry, there was an error connecting to the AI service. Please try again later.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userInput = inputValue.trim();
    setInputValue('');

    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);

    // Get AI response
    const aiContent = await fetchAIResponse(userInput);
    
    // Add AI response
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: aiContent,
      sender: 'ai',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiResponse]);
  };

  // Format timestamp to display only hours and minutes
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-[300px] mx-auto h-[600px] rounded-[40px] overflow-hidden shadow-2xl relative border-4 border-white">
      {/* Phone body background */}
      <div className="absolute inset-0 bg-black rounded-[36px]"></div>
      
      {/* Top notch area - making it the same green color */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-[#075E54] rounded-t-[36px] z-10">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[40%] h-7 bg-black rounded-b-xl z-20"></div>
      </div>
      
      {/* WhatsApp Interface */}
      <div className="absolute inset-0 pt-12 flex flex-col">
        {/* Header */}
        <div className="bg-[#075E54] text-white px-4 py-3 flex items-center">
          <button className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#128C7E] mr-3 flex items-center justify-center">
              <span className="text-white text-lg font-bold">YB</span>
            </div>
            <div>
              <h3 className="font-medium text-base">Your Business</h3>
              <p className="text-xs text-gray-100">Online</p>
            </div>
          </div>
        </div>
        
        {/* Chat area with WhatsApp background pattern */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-3"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(229, 221, 213, 0.9),
                rgba(229, 221, 213, 0.9)
              ),
              repeating-linear-gradient(
                -45deg,
                #0000 0px, 
                #0000 20px, 
                rgba(0, 0, 0, 0.02) 20px, 
                rgba(0, 0, 0, 0.02) 40px
              )
            `,
            backgroundSize: '100% 100%, 40px 40px'
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-2 rounded-lg max-w-[80%] ${
                  message.sender === 'user'
                    ? 'bg-[#DCF8C6] rounded-tr-none'
                    : 'bg-white rounded-tl-none'
                }`}
              >
                <p className="text-sm text-gray-800">{message.content}</p>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500">{formatTime(message.timestamp)}</span>
                  {message.sender === 'user' && (
                    <span className="ml-1 text-xs text-[#075E54]">✓✓</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-center mb-2 justify-start">
              <div className="bg-white p-2 rounded-lg rounded-tl-none max-w-[80%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="bg-[#F0F2F5] px-3 py-2">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message"
                className="flex-1 text-sm bg-transparent focus:outline-none text-gray-700 min-w-0"
                disabled={isLoading}
              />
              <button
                type="button"
                className="text-gray-500 p-1 flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            <button
              type="submit"
              className="bg-[#128C7E] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0"
              disabled={!inputValue.trim() || isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
      
      {/* iPhone home indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-white rounded-full opacity-30 z-20"></div>
    </div>
  );
} 