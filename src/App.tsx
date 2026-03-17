import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, X, Send } from 'lucide-react';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `[ROLE AND PERSONA]
You are the "Original You Skin Expert," an exclusive, highly knowledgeable, and warm AI booking assistant for Original You, a premium MedSpa located in Las Vegas, Nevada.
Your tone is luxurious, empathetic, professional, and welcoming. You speak like a high-end medical aesthetician. You never sound robotic. You never say "I am an AI."

[CORE OBJECTIVE]
Your primary goal is to answer visitor questions accurately and then smoothly guide them to book a free consultation or call the clinic at (702) 838-2455.

[KNOWLEDGE BASE]
Clinic: Original You (Las Vegas, NV)
Specialty Service: PicoGenesis. It is an industry-leading laser treatment for skin revitalization, targeting melasma, hyperpigmentation, sun damage, and uneven skin tone. It is safe for all skin types and requires virtually zero downtime.
Pricing: 
- Pay-as-you-go: $800 per single session
- Package Deal: 4 treatments for $1,600 (Buy 3, get 1 free).
- Membership: New monthly membership at an introductory price of $249/month (Saves over $500 compared to pay-as-you-go).

[BEHAVIORAL RULES & CONTEXT MEMORY]
Maintain Context: Always remember the previous messages in the conversation. If a user says "Tell me more about that," refer to the specific service or price you just discussed. Do not reset the conversation.
No Dead Ends: Never give a purely informational answer and stop. Every single response MUST end with a gentle question that moves them toward booking. (e.g., "Does that price range fit your current skincare budget?" or "Would you like me to help you set up a free consultation to see if PicoGenesis is right for your skin?")
Out of Bounds: If a user asks for medical advice, gently decline. (e.g., "While I know everything about our laser technologies, a formal assessment requires seeing your skin. Would you like to schedule a quick, free consultation with our clinical team?")
Short & Punchy: People read chats on their phones. Keep your answers to a maximum of 3 short sentences.
The Demo Booking Link (Closing the Sale): When a user explicitly agrees to schedule a consultation (e.g., they say "Yes," "Sure," "Let's do it," or "Okay"), stop asking questions. You must immediately provide the booking link to close the interaction. Reply exactly with: "Perfect! You can select a date and time that works best for you on our live calendar right here: [Original You Booking Calendar Link]. We look forward to seeing you at the clinic!"`;

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
    { role: 'model', text: "Hi! I'm your Original You Skin Expert. Ask me anything about PicoGenesis, pricing, or memberships!" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chatRef = useRef<any>(null);

  useEffect(() => {
    // Initialize chat session
    chatRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userText = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userText });
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm having trouble connecting right now. Please call us at (702) 838-2455 to book your consultation." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] font-sans relative overflow-hidden flex items-center justify-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px] z-0"></div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center p-8 max-w-2xl bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white mx-4">
        <h1 className="font-serif text-4xl md:text-5xl text-[#0F766E] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Original You MedSpa</h1>
        <p className="text-lg text-gray-600 mb-8">Experience the future of skincare with PicoGenesis. <br/>The first provider in the Las Vegas Valley.</p>
        <p className="text-sm text-gray-500 italic">Look at the bottom right to chat with our AI Skin Expert.</p>
      </div>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        {/* Chat Window */}
        <div className={`transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom-right w-80 sm:w-96 bg-[#F8F1E9] rounded-2xl shadow-2xl border border-[#D4AF77]/30 mb-4 overflow-hidden flex flex-col h-[500px] max-h-[80vh] ${isOpen ? 'opacity-100 scale-100 pointer-events-auto translate-y-0' : 'opacity-0 scale-80 pointer-events-none translate-y-5'}`}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#D4AF77] to-[#c49f67] p-4 text-white flex justify-between items-center shadow-md relative z-10">
            <div>
              <h3 className="font-serif text-lg font-semibold tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>Original You Skin Expert</h3>
              <p className="text-xs text-white/90 flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Online <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider ml-1">Powered by AI</span>
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
              <X size={20} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F1E9]/50 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-white border border-gray-100 text-gray-800 rounded-tr-sm' 
                    : 'bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/10 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#0F766E]/10 text-[#0F766E] rounded-2xl rounded-tl-none px-4 py-3 inline-block">
                  <div className="flex space-x-1 items-center h-4">
                    <div className="w-1.5 h-1.5 bg-[#0F766E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-[#0F766E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-[#0F766E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-[#D4AF77]/20">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about PicoGenesis..." 
                className="flex-1 bg-[#F8F1E9]/50 border border-[#D4AF77]/30 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF77] focus:border-[#D4AF77] transition-all text-gray-700 placeholder-gray-400" 
                autoComplete="off"
              />
              <button type="submit" disabled={isTyping || !inputText.trim()} className="bg-[#D4AF77] hover:bg-[#c49f67] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2.5 transition-colors shadow-sm flex-shrink-0">
                <Send size={18} className="ml-0.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Floating Button */}
        <button 
          onClick={() => setIsOpen(true)} 
          className={`relative bg-white border border-[#D4AF77] text-[#0F766E] rounded-full px-5 py-3 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <div className="absolute inset-0 rounded-full shadow-[0_0_15px_0_rgba(15,118,110,0.2)] animate-[pulseGlow_2.5s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
          <Sparkles size={20} className="group-hover:scale-110 transition-transform relative z-10" />
          <span className="font-medium text-sm tracking-wide relative z-10">Ask an Expert</span>
        </button>
      </div>
    </div>
  );
}
