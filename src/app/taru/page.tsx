'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  Brain,
  Loader2,
  Sparkles,
  MessageCircle // Added this icon
} from 'lucide-react';

// Types
interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
  actions?: string[];
  confidence?: number;
}

const TaruAIPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_TARU_API_URL || 'https://the-switch.onrender.com';

  const checkApiHealth = useCallback(async () => {
    setApiStatus('checking');
    try {
      const response = await fetch(`${API_BASE}/health`);
      setApiStatus(response.ok ? 'connected' : 'disconnected');
    } catch (error) {
      setApiStatus('disconnected');
      console.error('API health check failed:', error);
    }
  }, [API_BASE]);

  // Initial setup effect
  useEffect(() => {
    checkApiHealth();
    setMessages([{
      id: crypto.randomUUID(),
      type: 'assistant',
      content: 'Hello! I\'m Taru, your AI wellness assistant. How can I assist you today?',
      timestamp: new Date(),
      confidence: 1.0
    }]);
  }, [checkApiHealth]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    inputRef.current?.focus();

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: data.answer || 'I apologize, but I couldn\'t generate a response.',
        timestamp: new Date(),
        sources: data.sources,
        actions: data.actions,
        confidence: data.confidence
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: 'I\'m sorry, I\'m having trouble connecting to my services right now.',
        timestamp: new Date(),
        confidence: 0
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, API_BASE]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="w-8 h-8 text-primary" />
                <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Taru AI</h1>
                <p className="text-sm text-muted-foreground">Your Personal Wellness Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* --- NEW TELEGRAM BUTTON --- */}
              <a 
                href="https://t.me/Taru_Comp_Bot" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200">
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Talk in Telegram</span>
                  <span className="sm:hidden">Telegram</span>
                </Button>
              </a>
              {/* --------------------------- */}

              <Badge variant={apiStatus === 'connected' ? 'default' : 'destructive'} className="gap-1">
                <div className={`w-2 h-2 rounded-full ${apiStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                <span className="hidden sm:inline">
                  {apiStatus === 'connected' ? 'Connected' : apiStatus === 'checking' ? 'Connecting...' : 'Disconnected'}
                </span>
                <span className="sm:hidden">
                  {apiStatus === 'connected' ? 'On' : 'Off'}
                </span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Container */}
      <main className="flex-1 flex flex-col items-center py-8 px-4">
        <Card className="w-full max-w-3xl h-full flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              Chat with Taru
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 flex-1 flex flex-col">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type === 'assistant' && (
                      <Avatar className="w-8 h-8 border">
                        <AvatarFallback className="bg-primary/10">
                          <Bot className="w-4 h-4 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[80%] space-y-2 ${message.type === 'user' ? 'order-first' : ''}`}>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground ml-auto' 
                          : 'bg-muted/50 text-foreground'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      <div className={`flex items-center gap-2 text-xs text-muted-foreground ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{formatTime(message.timestamp)}</span>
                        {message.confidence !== undefined && message.type === 'assistant' && (
                          <Badge variant="outline" className="text-xs">
                            {Math.round(message.confidence * 100)}% confident
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {message.type === 'user' && (
                      <Avatar className="w-8 h-8 border">
                        <AvatarFallback className="bg-secondary">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="w-4 h-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted/50 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Taru is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Taru anything..."
                  disabled={isLoading || apiStatus !== 'connected'}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!inputMessage.trim() || isLoading || apiStatus !== 'connected'}
                  size="icon"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              {apiStatus !== 'connected' && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Unable to connect to Taru AI services.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TaruAIPage;