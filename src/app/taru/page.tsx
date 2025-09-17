// // 'use client';
// // import { useState, useRef, useEffect } from 'react';
// // import axios from 'axios';
// // import { WellnessDashboard } from '@/components/taru/WellnessDashboard';
// // import { SendHorizonal, Bot } from 'lucide-react';

// // const API_BASE_URL = 'http://127.0.0.1:5001/api';

// // interface Message {
// //   role: 'user' | 'assistant';
// //   content: string;
// //   actions?: string[];
// // }

// // export default function Home() {
// //   const [messages, setMessages] = useState<Message[]>([
// //     { role: 'assistant', content: "How are you feeling today? What's on your mind?" }
// //   ]);
// //   const [input, setInput] = useState('');
// //   const [isLoading, setIsLoading] = useState(false);
// //   const messagesEndRef = useRef<HTMLDivElement>(null);

// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   };

// //   useEffect(scrollToBottom, [messages]);

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!input.trim() || isLoading) return;

// //     const userMessage: Message = { role: 'user', content: input };
// //     setMessages(prev => [...prev, userMessage]);
// //     setInput('');
// //     setIsLoading(true);

// //     try {
// //       const response = await axios.post(`${API_BASE_URL}/chat`, { prompt: input });
// //       const { answer, actions } = response.data;
// //       const assistantMessage: Message = { role: 'assistant', content: answer, actions: actions || [] };
// //       setMessages(prev => [...prev, assistantMessage]);
// //     } catch (error) {
// //       console.error("Error fetching chat response:", error);
// //       const errorMessage: Message = { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again later." };
// //       setMessages(prev => [...prev, errorMessage]);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <main className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
// //       <div className="flex-1 flex flex-col">
// //         <header className="p-4 border-b border-slate-200 dark:border-slate-800">
// //           <h1 className="text-2xl font-bold">Taru AI</h1>
// //           <p className="text-sm text-slate-500 dark:text-slate-400">Your empathetic micro-habit recovery coach</p>
// //         </header>

// //         <div className="flex-1 overflow-y-auto p-6 space-y-6">
// //           {messages.map((msg, index) => (
// //             <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
// //               {msg.role === 'assistant' && (
// //                 <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
// //                   <Bot className="w-5 h-5 text-slate-500" />
// //                 </div>
// //               )}
// //               <div className={`max-w-xl p-4 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
// //                 <p>{msg.content}</p>
// //                 {msg.actions && msg.actions.length > 0 && (
// //                   <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-3">
// //                     <h4 className="font-semibold text-sm mb-2">Suggested Actions:</h4>
// //                     <ul className="list-disc list-inside space-y-1 text-sm">
// //                       {msg.actions.map((action, i) => <li key={i}>{action}</li>)}
// //                     </ul>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           ))}
// //           {isLoading && (
// //              <div className="flex items-start gap-4">
// //                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
// //                   <Bot className="w-5 h-5 text-slate-500" />
// //                 </div>
// //                 <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
// //                     <div className="flex items-center space-x-2">
// //                       <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
// //                       <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
// //                       <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
// //                     </div>
// //                 </div>
// //              </div>
// //           )}
// //           <div ref={messagesEndRef} />
// //         </div>

// //         <div className="p-4 border-t border-slate-200 dark:border-slate-800">
// //           <form onSubmit={handleSubmit} className="flex items-center gap-4">
// //             <input
// //               type="text"
// //               value={input}
// //               onChange={(e) => setInput(e.target.value)}
// //               placeholder="I'm feeling..."
// //               className="flex-1 p-2 rounded-md bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               disabled={isLoading}
// //             />
// //             <button type="submit" className="p-2 bg-blue-500 text-white rounded-md disabled:bg-slate-400" disabled={isLoading}>
// //               <SendHorizonal className="w-5 h-5" />
// //             </button>
// //           </form>
// //         </div>
// //       </div>
// //       <WellnessDashboard />
// //     </main>
// //   );
// // }

// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { 
//   Send, 
//   Bot, 
//   User, 
//   AlertTriangle, 
//   CheckCircle, 
//   Brain,
//   Heart,
//   TrendingUp,
//   MessageSquare,
//   Loader2,
//   Sparkles,
//   Shield,
//   BookOpen,
//   Activity
// } from 'lucide-react';

// // Types
// interface ChatMessage {
//   id: string;
//   type: 'user' | 'assistant';
//   content: string;
//   timestamp: Date;
//   sources?: string[];
//   actions?: string[];
//   confidence?: number;
// }

// interface RiskAssessment {
//   risk_probability: number;
//   reason: string;
// }

// const TaruAIPage = () => {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [riskData, setRiskData] = useState<RiskAssessment | null>(null);
//   const [isLoadingRisk, setIsLoadingRisk] = useState(false);
//   const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // API base URL - adjust this to match your Flask API
//   const API_BASE = process.env.NEXT_PUBLIC_TARU_API_URL || 'http://localhost:8000';

//   // Check API health on mount
//   useEffect(() => {
//     checkApiHealth();
//     fetchRiskAssessment();
    
//     // Add welcome message
//     setMessages([{
//       id: '1',
//       type: 'assistant',
//       content: 'Hello! I\'m Taru, your AI wellness assistant. I can help you with mental health resources, academic support, and personal wellness guidance. How can I assist you today?',
//       timestamp: new Date(),
//       confidence: 1.0
//     }]);
//   }, []);

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const checkApiHealth = async () => {
//     setApiStatus('checking');
//     try {
//       const response = await fetch(`${API_BASE}/health`);
//       if (response.ok) {
//         setApiStatus('connected');
//       } else {
//         setApiStatus('disconnected');
//       }
//     } catch (error) {
//       setApiStatus('disconnected');
//       console.error('API health check failed:', error);
//     }
//   };

//   const fetchRiskAssessment = async () => {
//     setIsLoadingRisk(true);
//     try {
//       const response = await fetch(`${API_BASE}/risk`);
//       if (response.ok) {
//         const data = await response.json();
//         setRiskData(data);
//       }
//     } catch (error) {
//       console.error('Failed to fetch risk assessment:', error);
//     } finally {
//       setIsLoadingRisk(false);
//     }
//   };

//   const sendMessage = async () => {
//     if (!inputMessage.trim() || isLoading) return;

//     const userMessage: ChatMessage = {
//       id: Date.now().toString(),
//       type: 'user',
//       content: inputMessage.trim(),
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage('');
//     setIsLoading(true);

//     try {
//       const response = await fetch(`${API_BASE}/chat`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: userMessage.content }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
      
//       const assistantMessage: ChatMessage = {
//         id: (Date.now() + 1).toString(),
//         type: 'assistant',
//         content: data.answer || 'I apologize, but I couldn\'t generate a response. Please try again.',
//         timestamp: new Date(),
//         sources: data.sources,
//         actions: data.actions,
//         confidence: data.confidence
//       };

//       setMessages(prev => [...prev, assistantMessage]);
//     } catch (error) {
//       console.error('Chat error:', error);
//       const errorMessage: ChatMessage = {
//         id: (Date.now() + 1).toString(),
//         type: 'assistant',
//         content: 'I\'m sorry, but I\'m having trouble connecting to my services right now. Please check your connection and try again.',
//         timestamp: new Date(),
//         confidence: 0
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const getRiskLevel = (probability: number) => {
//     if (probability < 0.3) return { level: 'Low', color: 'text-green-500', icon: CheckCircle };
//     if (probability < 0.7) return { level: 'Moderate', color: 'text-yellow-500', icon: AlertTriangle };
//     return { level: 'High', color: 'text-red-500', icon: AlertTriangle };
//   };

//   const formatTime = (date: Date) => {
//     return date.toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       hour12: true 
//     });
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <Brain className="w-8 h-8 text-primary" />
//                 <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-foreground">Taru AI</h1>
//                 <p className="text-sm text-muted-foreground">Your Personal Wellness Assistant</p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <Badge variant={apiStatus === 'connected' ? 'default' : 'destructive'} className="gap-1">
//                 <div className={`w-2 h-2 rounded-full ${apiStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
//                 {apiStatus === 'connected' ? 'Connected' : apiStatus === 'checking' ? 'Connecting...' : 'Disconnected'}
//               </Badge>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="container mx-auto px-4 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
//           {/* Sidebar - Risk Assessment & Info */}
//           <div className="lg:col-span-4 space-y-6">
            
//             {/* Risk Assessment Card */}
//             <Card>
//               <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center gap-2">
//                   <Activity className="w-5 h-5" />
//                   Wellness Check
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {isLoadingRisk ? (
//                   <div className="flex items-center justify-center py-8">
//                     <Loader2 className="w-6 h-6 animate-spin text-primary" />
//                   </div>
//                 ) : riskData ? (
//                   <div className="space-y-4">
//                     <div className="text-center">
//                       <div className={`inline-flex items-center gap-2 text-lg font-semibold ${getRiskLevel(riskData.risk_probability).color}`}>
//                         {React.createElement(getRiskLevel(riskData.risk_probability).icon, { className: "w-5 h-5" })}
//                         {getRiskLevel(riskData.risk_probability).level} Risk
//                       </div>
//                       <div className="text-sm text-muted-foreground mt-1">
//                         {Math.round(riskData.risk_probability * 100)}% probability
//                       </div>
//                     </div>
                    
//                     <div className="bg-muted/50 rounded-lg p-3">
//                       <p className="text-sm text-foreground">
//                         <strong>Analysis:</strong> {riskData.reason}
//                       </p>
//                     </div>
                    
//                     <Button 
//                       onClick={fetchRiskAssessment} 
//                       variant="outline" 
//                       size="sm" 
//                       className="w-full"
//                     >
//                       <TrendingUp className="w-4 h-4 mr-2" />
//                       Refresh Assessment
//                     </Button>
//                   </div>
//                 ) : (
//                   <Alert>
//                     <AlertTriangle className="h-4 w-4" />
//                     <AlertDescription>
//                       Unable to load risk assessment. Please try again later.
//                     </AlertDescription>
//                   </Alert>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Features Card */}
//             <Card>
//               <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center gap-2">
//                   <Heart className="w-5 h-5" />
//                   What I Can Help With
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex items-start gap-3">
//                   <Shield className="w-5 h-5 text-primary mt-0.5" />
//                   <div>
//                     <p className="font-medium text-sm">Mental Health Support</p>
//                     <p className="text-xs text-muted-foreground">Coping strategies and emotional wellness</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-start gap-3">
//                   <BookOpen className="w-5 h-5 text-primary mt-0.5" />
//                   <div>
//                     <p className="font-medium text-sm">Academic Guidance</p>
//                     <p className="text-xs text-muted-foreground">Study tips and academic resources</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-start gap-3">
//                   <Activity className="w-5 h-5 text-primary mt-0.5" />
//                   <div>
//                     <p className="font-medium text-sm">Wellness Tracking</p>
//                     <p className="text-xs text-muted-foreground">Burnout prevention and self-care</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-start gap-3">
//                   <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
//                   <div>
//                     <p className="font-medium text-sm">24/7 Chat Support</p>
//                     <p className="text-xs text-muted-foreground">Always here when you need to talk</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Main Chat Interface */}
//           <div className="lg:col-span-8">
//             <Card className="h-[calc(100vh-12rem)]">
//               <CardHeader className="border-b">
//                 <CardTitle className="flex items-center gap-2">
//                   <Bot className="w-5 h-5 text-primary" />
//                   Chat with Taru
//                 </CardTitle>
//               </CardHeader>
              
//               <CardContent className="p-0 h-full flex flex-col">
//                 {/* Messages Area */}
//                 <ScrollArea className="flex-1 p-4">
//                   <div className="space-y-4">
//                     {messages.map((message) => (
//                       <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
//                         {message.type === 'assistant' && (
//                           <Avatar className="w-8 h-8 border">
//                             <AvatarFallback className="bg-primary/10">
//                               <Bot className="w-4 h-4 text-primary" />
//                             </AvatarFallback>
//                           </Avatar>
//                         )}
                        
//                         <div className={`max-w-[80%] space-y-2 ${message.type === 'user' ? 'order-first' : ''}`}>
//                           <div className={`rounded-2xl px-4 py-3 ${
//                             message.type === 'user' 
//                               ? 'bg-primary text-primary-foreground ml-auto' 
//                               : 'bg-muted/50 text-foreground'
//                           }`}>
//                             <p className="text-sm whitespace-pre-wrap">{message.content}</p>
//                           </div>
                          
//                           <div className={`flex items-center gap-2 text-xs text-muted-foreground ${
//                             message.type === 'user' ? 'justify-end' : 'justify-start'
//                           }`}>
//                             <span>{formatTime(message.timestamp)}</span>
//                             {message.confidence !== undefined && message.type === 'assistant' && (
//                               <Badge variant="outline" className="text-xs">
//                                 {Math.round(message.confidence * 100)}% confident
//                               </Badge>
//                             )}
//                           </div>
                          
//                           {/* Actions */}
//                           {message.actions && message.actions.length > 0 && (
//                             <div className="flex flex-wrap gap-1 mt-2">
//                               {message.actions.map((action, idx) => (
//                                 <Badge key={idx} variant="secondary" className="text-xs">
//                                   {action}
//                                 </Badge>
//                               ))}
//                             </div>
//                           )}
                          
//                           {/* Sources */}
//                           {message.sources && message.sources.length > 0 && (
//                             <div className="mt-2">
//                               <p className="text-xs text-muted-foreground mb-1">Sources:</p>
//                               <div className="flex flex-wrap gap-1">
//                                 {message.sources.map((source, idx) => (
//                                   <Badge key={idx} variant="outline" className="text-xs">
//                                     {source}
//                                   </Badge>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
                        
//                         {message.type === 'user' && (
//                           <Avatar className="w-8 h-8 border">
//                             <AvatarFallback className="bg-secondary">
//                               <User className="w-4 h-4" />
//                             </AvatarFallback>
//                           </Avatar>
//                         )}
//                       </div>
//                     ))}
                    
//                     {isLoading && (
//                       <div className="flex gap-3">
//                         <Avatar className="w-8 h-8 border">
//                           <AvatarFallback className="bg-primary/10">
//                             <Bot className="w-4 h-4 text-primary" />
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="bg-muted/50 rounded-2xl px-4 py-3">
//                           <div className="flex items-center gap-2">
//                             <Loader2 className="w-4 h-4 animate-spin" />
//                             <span className="text-sm text-muted-foreground">Taru is thinking...</span>
//                           </div>
//                         </div>
//                       </div>
//                     )}
                    
//                     <div ref={messagesEndRef} />
//                   </div>
//                 </ScrollArea>

//                 {/* Input Area */}
//                 <div className="border-t p-4">
//                   <div className="flex gap-2">
//                     <Input
//                       ref={inputRef}
//                       value={inputMessage}
//                       onChange={(e) => setInputMessage(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       placeholder="Ask Taru anything about wellness, academics, or mental health..."
//                       disabled={isLoading || apiStatus !== 'connected'}
//                       className="flex-1"
//                     />
//                     <Button 
//                       onClick={sendMessage} 
//                       disabled={!inputMessage.trim() || isLoading || apiStatus !== 'connected'}
//                       size="icon"
//                     >
//                       {isLoading ? (
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                       ) : (
//                         <Send className="w-4 h-4" />
//                       )}
//                     </Button>
//                   </div>
                  
//                   {apiStatus !== 'connected' && (
//                     <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
//                       <AlertTriangle className="w-3 h-3" />
//                       Unable to connect to Taru AI services. Please check your connection.
//                     </p>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaruAIPage;



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
  Sparkles
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

  const API_BASE = process.env.NEXT_PUBLIC_TARU_API_URL || 'http://localhost:8000';

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
            
            <div className="flex items-center gap-2">
              <Badge variant={apiStatus === 'connected' ? 'default' : 'destructive'} className="gap-1">
                <div className={`w-2 h-2 rounded-full ${apiStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                {apiStatus === 'connected' ? 'Connected' : apiStatus === 'checking' ? 'Connecting...' : 'Disconnected'}
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
                      
                      {/* Actions & Sources */}
                      {/* {message.actions && message.actions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.actions.map((action, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">{action}</Badge>
                          ))}
                        </div>
                      )} */}

                      {/* {message.sources && message.sources.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Sources:</p>
                          <div className="flex flex-wrap gap-1">
                            {message.sources.map((source, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">{source}</Badge>
                            ))}
                          </div>
                        </div>
                      )} */}
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