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
    "What's the projected profit for 56 Inge King?",
    "Chase builder for C of O",
    "Summarize contract in latest upload",
    "Raise next claim for Whitlam project",
    "Update project stage to Lock-up"
  ];

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      // Connect to backend AI endpoint (ready for OpenAI)
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage })
      });
      const data = await response.json();
      const aiResponse = data.reply;

      // Process response from backend
      setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
      setIsLoading(false);

    } catch (error) {
      setMessages(prev => [...prev, { type: 'ai', content: "Sorry, something went wrong. Please try again." }]);
      setIsLoading(false);
    }
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
                  <div className="mb-3">
                    <Sparkles className="h-5 w-5 mx-auto text-green-600 mb-2" />
                    <p className="font-medium text-gray-700">Lush AI Assistant</p>
                    <p className="text-xs">Connected to your projects & uploads</p>
                  </div>
                  <p className="mb-2 text-xs">Try these commands:</p>
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