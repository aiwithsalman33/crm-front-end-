import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Brain, TrendingUp, Zap, MessageSquare, ListTodo, Mail } from 'lucide-react';
import { useLeads } from '../../contexts/LeadsContext';
import { useTasks } from '../../contexts/TasksContext';
import { useDeals } from '../../contexts/DealsContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistantPage: React.FC = () => {
  const { leads } = useLeads();
  const { tasks } = useTasks();
  const { deals } = useDeals();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your Ziya AI. I've analyzed your CRM data. How can I assist you in hitting your targets today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    { label: 'Priority Tasks', icon: ListTodo, prompt: 'Summarize my high-priority tasks and deadlines.' },
    { label: 'Follow-up Email', icon: Mail, prompt: 'Draft a professional follow-up email for my hottest lead.' },
    { label: 'Pipeline Analysis', icon: TrendingUp, prompt: 'What are my biggest deals currently in negotiation?' },
    { label: 'Productivity', icon: Zap, prompt: 'Give me a productivity snapshot for the current period.' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const generateResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('task')) {
      const highPriorityTasks = tasks.filter(task => task.priority === 'High');
      if (highPriorityTasks.length === 0) return "You're all clear! No high-priority tasks pending.";
      return `You have ${highPriorityTasks.length} urgent tasks:\n${highPriorityTasks.map(t => `• ${t.title} (Due: ${t.dueDate})`).join('\n')}`;
    }

    if (lowerInput.includes('lead') || lowerInput.includes('email')) {
      const hotLead = leads.sort((a, b) => b.score - a.score)[0];
      return `Follow-up needed for ${hotLead.firstName} (${hotLead.company}).\n\nDraft: "Hi ${hotLead.firstName}, I'm reaching out to see if you had any thoughts on our last discussion..."`;
    }

    if (lowerInput.includes('deal') || lowerInput.includes('negotiation')) {
      const bigDeals = deals.filter(d => d.stage === 'Negotiation').sort((a, b) => b.value - a.value);
      if (bigDeals.length === 0) return "No deals currently in the negotiation phase.";
      return `Your top negotiation: "${bigDeals[0].name}" with ${bigDeals[0].accountName} ($${bigDeals[0].value.toLocaleString()}).`;
    }

    return `I can help with that! I have access to your ${leads.length} leads, ${tasks.length} tasks, and ${deals.length} active deals. What specific insight do you need?`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const response = generateResponse(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ziya AI Assistant</h1>
            <p className="text-gray-500 font-medium">Hyper-personalized CRM intelligence powered by Ziya Brain.</p>
          </div>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="lg:col-span-12 flex flex-col h-[750px] bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">

        {/* Chat Header */}
        <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <p className="font-bold text-gray-900">Ziya Intelligence</p>
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-tighter">Online • Reading CRM Context</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-colors cursor-pointer">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Messages Window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}>
              <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${m.role === 'user' ? 'bg-primary' : 'bg-white border text-gray-400'
                  }`}>
                  {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user'
                  ? 'bg-primary text-white rounded-tr-none font-medium'
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}>
                  <p className="whitespace-pre-line">{m.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border flex items-center justify-center text-gray-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-50">

          {/* Instant Suggestions */}
          {messages.length < 5 && !isLoading && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInput(s.prompt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-primary/5 text-gray-600 hover:text-primary border border-gray-100 rounded-lg text-xs font-bold transition-all"
                >
                  <s.icon className="w-3 h-3" />
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <div className="relative flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message Ziya Intelligence..."
              rows={1}
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-5 pr-14 text-sm focus:ring-2 focus:ring-primary/20 resize-none transition-all placeholder:text-gray-400 font-medium"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-3 p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all disabled:opacity-50 disabled:shadow-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-3 text-center font-medium">Ziya AI Assistant uses real-time CRM encryption. Always verify critical deal data.</p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;