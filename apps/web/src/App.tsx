import { useState, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Send, Bot, User, Loader2 } from 'lucide-react'

function App() {
  const [agentName, setAgentName] = useState<string>('Support')
  
  // Debug: Test fetch manually
  useEffect(() => {
    const testFetch = async () => {
      try {
        console.log('🧪 Starting manual fetch test...');
        const res = await fetch('http://localhost:3000/api/chat/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [{ role: 'user', content: 'test' }] })
        });
        console.log('🧪 Manual fetch status:', res.status);
        const reader = res.body?.getReader();
        if (reader) {
          const { value, done } = await reader.read();
          console.log('🧪 First chunk:', new TextDecoder().decode(value));
        }
      } catch (e) {
        console.error('🧪 Manual fetch error:', e);
      }
    };
    testFetch(); // Run the test on mount
  }, []);
  
  console.log('useChat hook initializing...');
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    // Bypass Vite proxy to avoid any streaming issues
    api: 'http://localhost:3000/api/chat/messages',
    headers: {
      'Content-Type': 'application/json',
    },
    onResponse: (response) => {
      console.log('✅ Response received:', response);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      const type = response.headers.get('X-Agent-Type');
      if (type) {
        console.log('Agent type:', type);
        setAgentName(type.charAt(0).toUpperCase() + type.slice(1));
      }
    },
    onError: (error) => {
      console.error('❌ Chat error:', error);
    },
    onFinish: (message) => {
      console.log('✅ Message finished:', message);
    }
  });

  console.log('Current messages:', messages);
  console.log('Current isLoading:', isLoading);
  console.log('Current error:', error);

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl w-full mx-auto bg-white shadow-xl overflow-hidden flex flex-col h-full border-x">
        <header className="bg-slate-900 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 p-2 rounded-lg">
                <Bot size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold">Swadesh AI Support</h1>
                <p className="text-xs text-gray-300">Connected to: {agentName} Agent</p>
            </div>
          </div>
          <div className="text-xs px-2 py-1 bg-slate-800 rounded border border-slate-700">
             Model: Groq (Llama 3)
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
                <p>Hello! How can I help you today?</p>
                <div className="flex gap-2 justify-center mt-4 text-sm">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">Check my order</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">Billing issue</span>
                </div>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'
                }`}>
                    {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                </div>
                
                <div className={`p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
              <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none flex items-center gap-2 text-gray-500 text-sm ml-11">
                      <Loader2 size={14} className="animate-spin" />
                      <span>{agentName} Agent is thinking...</span>
                  </div>
              </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border-t flex gap-3">
          <input
            value={input}
            onChange={handleInputChange}
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
            placeholder="Type your message..."
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium flex items-center gap-2"
          >
            <Send size={18} />
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
