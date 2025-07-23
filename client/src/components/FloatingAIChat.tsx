import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  HelpCircle,
  FileText,
  TrendingUp
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIResponse {
  reply: string;
}

const FloatingAIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatContext, setChatContext] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist chat state locally
  useEffect(() => {
    const lastChat = localStorage.getItem('aiChatContext');
    if (lastChat) {
      try {
        const parsedContext = JSON.parse(lastChat);
        setChatContext(parsedContext);
        if (parsedContext.messages) {
          setMessages(parsedContext.messages);
        }
      } catch (error) {
        console.error('Failed to parse chat context:', error);
      }
    }
  }, []);

  // Save chat context when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const contextData = {
        messages: messages.slice(-20), // Keep last 20 messages
        lastUpdated: new Date().toISOString(),
        userRole: getUserRole()
      };
      localStorage.setItem('aiChatContext', JSON.stringify(contextData));
      setChatContext(contextData);
    }
  }, [messages]);

  // Get user role for context-aware responses
  const getUserRole = () => {
    const user = localStorage.getItem('lush_user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.role || 'user';
    }
    return 'user';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const userRole = getUserRole();
      const welcomeMessage = getWelcomeMessage(userRole);
      setMessages([{
        id: 'welcome',
        text: welcomeMessage,
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  const getWelcomeMessage = (role: string) => {
    switch (role) {
      case 'admin':
        return '👋 Hi! I\'m your AI assistant. I can help with project management, user administration, financial analysis, and system insights. How can I assist you today?';
      case 'builder':
        return '🔨 Hello! I\'m here to help with construction updates, progress tracking, claim submissions, and project timelines. What would you like to know?';
      case 'client':
        return '🏡 Welcome! I can help you track your project progress, understand construction phases, and answer questions about your build. How can I help?';
      case 'investor':
        return '📊 Greetings! I can provide insights on project profitability, market analysis, funding opportunities, and ROI calculations. What interests you?';
      default:
        return '👋 Hello! I\'m your Lush Properties AI assistant. I can help with project questions, document summaries, and progress estimates. How can I assist you?';
    }
  };

  const getQuickActions = (role: string) => {
    switch (role) {
      case 'admin':
        return [
          { text: 'Show project overview', icon: <FileText className="h-4 w-4" /> },
          { text: 'User activity summary', icon: <TrendingUp className="h-4 w-4" /> },
          { text: 'Financial dashboard', icon: <TrendingUp className="h-4 w-4" /> }
        ];
      case 'builder':
        return [
          { text: 'Next milestone deadline', icon: <FileText className="h-4 w-4" /> },
          { text: 'Upload progress photos', icon: <FileText className="h-4 w-4" /> },
          { text: 'Submit payment claim', icon: <TrendingUp className="h-4 w-4" /> }
        ];
      case 'client':
        return [
          { text: 'Project progress update', icon: <TrendingUp className="h-4 w-4" /> },
          { text: 'Construction timeline', icon: <FileText className="h-4 w-4" /> },
          { text: 'Request upgrade quote', icon: <HelpCircle className="h-4 w-4" /> }
        ];
      case 'investor':
        return [
          { text: 'ROI analysis', icon: <TrendingUp className="h-4 w-4" /> },
          { text: 'Market insights', icon: <FileText className="h-4 w-4" /> },
          { text: 'Funding opportunities', icon: <HelpCircle className="h-4 w-4" /> }
        ];
      default:
        return [
          { text: 'How can I help?', icon: <HelpCircle className="h-4 w-4" /> },
          { text: 'Project status', icon: <FileText className="h-4 w-4" /> },
          { text: 'Get started guide', icon: <TrendingUp className="h-4 w-4" /> }
        ];
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Make API call to your existing AI chat endpoint
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          context: {
            role: getUserRole(),
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data: AIResponse = await response.json();

      // Add AI response
      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        text: data.reply,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      // Add error message
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        text: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickAction = (actionText: string) => {
    sendMessage(actionText);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 right-4 z-40 lg:bottom-6 lg:right-6">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-[#007144] hover:bg-[#00a060] text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center lg:w-14 lg:h-14"
          title="AI Assistant"
        >
          <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6" />
        </Button>
        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center lg:w-4 lg:h-4">
          <Bot className="h-1.5 w-1.5 text-white lg:h-2 lg:w-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 lg:bottom-6 lg:right-6">
      <Card className={`w-80 shadow-2xl transition-all duration-300 lg:w-96 ${isMinimized ? 'h-16' : 'h-[450px] lg:h-[600px]'}`}>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 bg-[#007144] rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              AI Assistant
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-lush-primary text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'ai' && (
                        <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="text-sm">{message.text}</div>
                    </div>
                    <div className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <div className="text-xs text-gray-500 mb-2">Quick actions:</div>
                <div className="flex flex-wrap gap-2">
                  {getQuickActions(getUserRole()).map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.text)}
                      className="text-xs h-8 px-3 flex items-center gap-2"
                    >
                      {action.icon}
                      {action.text}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 text-sm"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  size="sm"
                  className="bg-lush-primary hover:bg-lush-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default FloatingAIChat;