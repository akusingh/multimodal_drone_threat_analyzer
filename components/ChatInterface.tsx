import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Scenario } from '../types';
import { Send, Bot, User, Cpu, AlertTriangle, Trash2 } from 'lucide-react';

interface ChatInterfaceProps {
  scenario: Scenario;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isThinking: boolean;
  onClearChat?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ scenario, messages, onSendMessage, isThinking, onClearChat }) => {
  const [inputValue, setInputValue] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const renderStyledText = (text: string) => {
    // Split by bold markdown syntax **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Strip the asterisks and apply neon styling
        return (
          <span key={index} className="text-neon-blue font-bold drop-shadow-[0_0_5px_rgba(0,243,255,0.3)]">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  const renderMessageContent = (msg: ChatMessage) => {
    // Error Handling Styling
    if (msg.text.startsWith('ACCESS DENIED') || msg.text.startsWith('ERR:') || msg.text.startsWith('SYSTEM ERROR')) {
       return (
         <div className="flex items-start gap-2 text-neon-red font-bold animate-pulse">
            <AlertTriangle className="w-4 h-4 mt-1 flex-shrink-0" />
            <div>{msg.text}</div>
         </div>
       );
    }

    // System Log Formatting (Strictly for the simulated system messages)
    if (msg.sender === 'system') {
      return (
        <div className="space-y-1">
          {msg.text.split('\n').map((line, i) => {
            if (line.includes('Step')) {
              return <div key={i} className="text-neon-blue font-bold mt-2 border-b border-slate-700 pb-1">{line}</div>;
            }
            if (line.includes('✓')) {
               return <div key={i} className="text-neon-green flex items-start gap-2 pl-2"><span className="opacity-80">{line}</span></div>;
            }
            if (line.includes('⚠️') || line.includes('MISMATCH')) {
               return <div key={i} className="text-neon-amber flex items-start gap-2 pl-2 font-semibold"><span className="opacity-100">{line}</span></div>;
            }
            if (line.includes('🚨') || line.includes('HIGH THREAT')) {
               return <div key={i} className="text-neon-red font-bold flex items-start gap-2 pl-2 animate-pulse">{line}</div>;
            }
            if (line.includes('RECOMMENDED ACTION')) {
               return <div key={i} className="bg-slate-800 p-2 rounded mt-2 text-center font-bold text-slate-100 border border-slate-600">{line}</div>;
            }
            if (line.trim() === '') return <div key={i} className="h-2"></div>;
            
            return <div key={i} className="text-slate-300 pl-2">{line}</div>;
          })}
        </div>
      );
    }

    // Standard AI/User Message Rendering (with Markdown Support)
    return <div className="whitespace-pre-wrap leading-relaxed">{renderStyledText(msg.text)}</div>;
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800">
      <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-neon-blue" />
            <h2 className="font-mono text-sm font-bold text-slate-200">AGENTIC REASONING ANALYSIS</h2>
        </div>
        <div className="flex items-center gap-3">
             <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
                <span className="text-[10px] text-slate-500 font-mono">MODEL: GEMINI-3-PRO-PREVIEW</span>
            </div>
            {onClearChat && (
              <button 
                onClick={onClearChat}
                className="text-slate-500 hover:text-neon-red transition-colors"
                title="Reset Terminal / Clear Context"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-center gap-2 mb-1 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.sender === 'user' ? <User className="w-3 h-3 text-slate-400"/> : <Bot className="w-3 h-3 text-neon-blue"/>}
              <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
            </div>
            <div className={`max-w-[90%] p-3 rounded-lg border ${
              msg.sender === 'user' 
                ? 'bg-slate-800 border-slate-700 text-slate-200' 
                : 'bg-slate-950 border-slate-800 text-slate-300 shadow-lg'
            }`}>
              {renderMessageContent(msg)}
            </div>
          </div>
        ))}
        
        {isThinking && (
          <div className="flex items-start gap-2 animate-pulse">
            <Bot className="w-3 h-3 text-neon-blue mt-1"/>
            <div className="text-xs text-neon-blue font-mono">Gemini is analyzing context...</div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 bg-slate-950">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ask about ${scenario.id}...`}
            className="w-full bg-slate-900 border border-slate-700 rounded p-3 pr-10 text-sm text-slate-200 focus:outline-none focus:border-neon-blue font-mono transition-colors"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isThinking}
            className="absolute right-2 top-2.5 text-slate-400 hover:text-neon-blue disabled:opacity-50 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="text-[10px] text-slate-600 mt-2 text-center font-mono">
            AI can make mistakes. Verify with raw telemetry.
        </div>
      </form>
    </div>
  );
};