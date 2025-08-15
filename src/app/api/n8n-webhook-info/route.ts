import { NextResponse } from 'next/server';

export async function GET() {
  const webhookInfo = {
    description: "n8n Webhook Integration for WhatsApp AI Demo",
    expectedRequestFormat: {
      sessionId: "Unique persistent identifier for the user/conversation",
      systemPrompt: "The system prompt for the AI assistant",
      messages: [
        {
          role: "user or assistant",
          content: "Message content"
        }
      ],
      userMessage: "The latest user message"
    },
    expectedResponseFormat: {
      aiMessage: "The AI response message to display in the chat"
    },
    sessionIdDetails: {
      format: "user-{timestamp}-{random string}",
      persistence: "Stored in browser localStorage",
      purpose: "Allows n8n to maintain conversation state across messages and sessions",
      usage: "Can be used to retrieve conversation history, user preferences, or context from a database"
    },
    n8nWorkflowSetupSteps: [
      "1. Create a new workflow in n8n",
      "2. Add a 'Webhook' node as the trigger",
      "3. Configure the webhook to receive POST requests",
      "4. Add a 'Function' node to process the incoming data and extract the sessionId",
      "5. Add a 'Switch' node to check if this is a new or existing session",
      "6. Add an 'HTTP Request' node to call your preferred LLM API",
      "7. Format the request to the LLM using the incoming data",
      "8. Add a 'Set' node to format the response with an 'aiMessage' field",
      "9. Connect the nodes and activate the workflow",
      "10. Copy the webhook URL and paste it in the WhatsApp n8n demo"
    ]
  };

  return NextResponse.json(webhookInfo);
} 