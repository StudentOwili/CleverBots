'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface WhatsAppMockupProps {
  initialMessage?: string;
  webhookUrl?: string;
  systemPrompt?: string;
  businessName?: string;
}

// Generate a unique session ID
const generateSessionId = (): string => {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export default function WhatsAppMockupN8n({
  initialMessage = "👋 Hey there! This is how the automation will look like. You can try me here before you get the real thing.",
  webhookUrl = "https://tekoteko125.app.n8n.cloud/webhook/333352e9-d18f-4389-a937-1b0b0c178273",
  systemPrompt = "",
  businessName = "Your Business"
}: WhatsAppMockupProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [customBusinessName, setCustomBusinessName] = useState(businessName);
  const [isEditingName, setIsEditingName] = useState(false);
  const businessNameInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize or retrieve session ID on component mount
  useEffect(() => {
    let storedSessionId = localStorage.getItem('whatsapp_session_id');
    
    if (!storedSessionId) {
      storedSessionId = generateSessionId();
      localStorage.setItem('whatsapp_session_id', storedSessionId);
    }
    
    setSessionId(storedSessionId);
    
    // Check for stored business name
    const storedBusinessName = localStorage.getItem('whatsapp_business_name');
    if (storedBusinessName) {
      setCustomBusinessName(storedBusinessName);
    }
  }, []);

  // Initial greeting message
  useEffect(() => {
    if (sessionId) {
      setMessages([
        {
          id: "initial-message",
          content: initialMessage,
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    }
  }, [initialMessage, sessionId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when editing business name
  useEffect(() => {
    if (isEditingName && businessNameInputRef.current) {
      businessNameInputRef.current.focus();
    }
  }, [isEditingName]);

  // Function to call n8n webhook
  const fetchAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    try {
      // Check if webhook URL is available
      if (!webhookUrl) {
        console.error("n8n webhook URL is not set. Please provide a valid webhook URL.");
        return "Sorry, the AI service is not properly configured. Please contact the administrator.";
      }
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId, // Include the session ID in the payload
          businessName: customBusinessName,
          systemPrompt: systemPrompt,
          messages: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          userMessage: userMessage
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: `HTTP error ${response.status}` } }));
        throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      // Assuming the n8n webhook returns a response with an aiMessage field
      const aiResponseContent = data.aiMessage || "Sorry, I couldn't process that request.";
      
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

  // Reset session ID function
  const resetSession = () => {
    const newSessionId = generateSessionId();
    localStorage.setItem('whatsapp_session_id', newSessionId);
    setSessionId(newSessionId);
    setMessages([
      {
        id: "initial-message",
        content: initialMessage,
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  };

  // Handle business name change
  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBusinessName(e.target.value);
  };

  // Save business name
  const saveBusinessName = () => {
    if (customBusinessName.trim()) {
      localStorage.setItem('whatsapp_business_name', customBusinessName);
    } else {
      setCustomBusinessName(businessName);
    }
    setIsEditingName(false);
  };

  // Handle key press for business name input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveBusinessName();
    }
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
          <button 
            className="mr-4"
            onClick={resetSession}
            title="Reset session"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="flex items-center flex-1">
            <div className="w-10 h-10 rounded-full bg-[#128C7E] mr-3 flex items-center justify-center">
              <span className="text-white text-lg font-bold">
                {customBusinessName.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              {isEditingName ? (
                <div className="flex items-center">
                  <input
                    ref={businessNameInputRef}
                    type="text"
                    value={customBusinessName}
                    onChange={handleBusinessNameChange}
                    onBlur={saveBusinessName}
                    onKeyPress={handleKeyPress}
                    className="font-medium text-base bg-[#075E54] border-b border-white text-white w-full focus:outline-none"
                    placeholder="Enter business name"
                  />
                  <button 
                    onClick={saveBusinessName}
                    className="ml-1 text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <h3 
                  className="font-medium text-base cursor-pointer flex items-center"
                  onClick={() => setIsEditingName(true)}
                  title="Click to edit business name"
                >
                  {customBusinessName}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </h3>
              )}
              <p className="text-xs text-gray-100">
                Online
                {sessionId && <span className="ml-1 opacity-50 text-[8px]">({sessionId.slice(-4)})</span>}
              </p>
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