import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const examplePrompts = [
    "Upload loan doc for Whitlam 02",
    "Raise claim for Block 15", 
    "Summarize contract",
    "Update project stage to Lock-up",
    "Generate progress report",
    "Check compliance status"
  ];

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInput("");
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      // Mock AI response - later replace with OpenAI integration
      let aiResponse = "I understand your request. ";
      
      if (userMessage.toLowerCase().includes('upload')) {
        aiResponse += "I can help you upload documents. Please navigate to the Uploads section and select your file.";
      } else if (userMessage.toLowerCase().includes('claim')) {
        aiResponse += "I can assist with claim generation. Go to the Claims section to create a new progress claim.";
      } else if (userMessage.toLowerCase().includes('summarize')) {
        aiResponse += "I can analyze and summarize documents once they're uploaded to the system.";
      } else if (userMessage.toLowerCase().includes('stage')) {
        aiResponse += "I can help update project stages. Which project would you like to modify?";
      } else {
        aiResponse += "I'm here to help with project management tasks. Try asking about uploads, claims, or project updates.";
      }

      setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
      setIsLoading(false);
    }, 1000);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-80 h-96 shadow-2xl">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-green-600" />
                AI Assistant
              </CardTitle>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-2 min-h-0">
              {messages.length === 0 && (
                <div className="text-center text-sm text-gray-500 py-4">
                  <p className="mb-3">Try these commands:</p>
                  <div className="space-y-1">
                    {examplePrompts.slice(0, 3).map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handlePromptClick(prompt)}
                        className="block w-full text-left px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-sm ${
                    message.type === 'user'
                      ? 'bg-green-100 text-green-800 ml-4'
                      : 'bg-gray-100 text-gray-800 mr-4'
                  }`}
                >
                  {message.content}
                </div>
              ))}

              {isLoading && (
                <div className="bg-gray-100 text-gray-800 mr-4 p-2 rounded text-sm">
                  <div className="flex items-center gap-1">
                    <div className="animate-bounce">.</div>
                    <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</div>
                    <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="space-y-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your projects..."
                className="min-h-[60px] text-sm resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Send className="h-4 w-4 mr-1" />
                Ask AI
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIChatWidget;