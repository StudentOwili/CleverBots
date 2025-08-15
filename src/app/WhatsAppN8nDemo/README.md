# WhatsApp AI with n8n Integration

This demo showcases how to integrate WhatsApp AI chat with n8n workflows for more flexible LLM processing and business automations.

## How It Works

1. The WhatsApp mockup generates a persistent session ID for each user
2. The mockup sends messages to an n8n webhook, including the session ID
3. n8n processes the messages and can:
   - Track conversation state using the session ID
   - Call any LLM provider (OpenAI, Anthropic, etc.)
   - Access business data from databases or APIs
   - Trigger other automations based on user messages
   - Log conversations to CRM systems
4. n8n returns the AI response to be displayed in the chat

## Session Management

- Each user gets a unique session ID in the format `user-{timestamp}-{random string}`
- The session ID is stored in the browser's localStorage
- The session ID persists across page reloads until localStorage is cleared
- You can reset the session by clicking the refresh icon in the WhatsApp header
- The last 4 characters of the session ID are displayed in the UI for debugging

## Expected Request Format

```json
{
  "sessionId": "user-1234567890-abc123",
  "systemPrompt": "The system prompt for the AI assistant",
  "messages": [
    {
      "role": "user or assistant",
      "content": "Message content"
    }
  ],
  "userMessage": "The latest user message"
}
```

## Expected Response Format

```json
{
  "aiMessage": "The AI response message to display in the chat"
}
```

## Setting Up n8n Workflow

1. Create a new workflow in n8n
2. Add a 'Webhook' node as the trigger
3. Configure the webhook to receive POST requests
4. Add a 'Function' node to process the incoming data and extract the sessionId
5. Add a 'Switch' node to check if this is a new or existing session
6. Optionally add database nodes to store/retrieve conversation history by sessionId
7. Add an 'HTTP Request' node to call your preferred LLM API
8. Format the request to the LLM using the incoming data
9. Add a 'Set' node to format the response with an 'aiMessage' field
10. Connect the nodes and activate the workflow
11. Copy the webhook URL and paste it in the WhatsApp n8n demo

For more information, visit the API endpoint at `/api/n8n-webhook-info` 