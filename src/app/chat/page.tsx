"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Send, Loader2, User, Bot, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuthStore();
  const { 
    messages, 
    loading: messagesLoading, 
    sending, 
    error: chatError,
    subscribeMessages, 
    sendMessage 
  } = useChatStore();
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auth Protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Subscribe to messages
  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeMessages(user.uid);
      return () => unsubscribe();
    }
  }, [user, subscribeMessages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (authLoading || !user) {
    return (
      <div suppressHydrationWarning style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '12px' }}>
        <Loader2 className="animate-spin" size={24} />
        <span>Securing connection...</span>
      </div>
    );
  }

  return (
    <div className="chat-layout">
      {/* Header */}
      <header className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="avatar-bot">
             <Bot size={20} />
          </div>
          <div>
            <h3>AI Assistant</h3>
            <p className="status-badge">Online & Ready</p>
          </div>
        </div>
        
        <button onClick={handleSignOut} className="btn-secondary">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Messages Area */}
      <main className="chat-messages">
        {chatError && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-banner"
          >
            <AlertCircle size={18} />
            <span>{chatError}</span>
          </motion.div>
        )}

        {messagesLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin" size={24} color="var(--primary-color)" />
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-state">
            <Bot size={48} opacity={0.3} />
            <p>No messages yet. Say hi to start the conversation!</p>
          </div>
        ) : (
          <div className="messages-grid">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`message-bubble ${msg.role === 'user' ? 'user' : 'bot'}`}
                >
                  <div className="message-content">
                    <div className="message-header">
                      {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                      <span>{msg.role === 'user' ? 'You' : 'Assistant'}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}

        {sending && (
          <div className="typing-indicator">
            <Bot size={14} />
            <span>AI is thinking...</span>
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="chat-input-area">
        <form onSubmit={handleSend} className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={sending || !!chatError}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || sending || !!chatError}
            className="btn-primary"
          >
            {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            <span>Send</span>
          </button>
        </form>
      </footer>
    </div>
  );
}
