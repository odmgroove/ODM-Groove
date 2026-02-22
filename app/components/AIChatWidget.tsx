"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User } from "lucide-react";
import Image from "next/image";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

const INITIAL_MESSAGE: Message = {
  id: "1",
  sender: "bot",
  text: "Welcome to ODM Groove Hotel! 🌟 I'm your AI concierge. How can I assist you today?",
};

const SUGGESTIONS = [
  "How much is a room?",
  "Where are you located?",
  "Event hall capacity?",
  "Do you have a pool?",
];

// Simple rule-based logic for AI Chat
function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  
  if (lower.includes("price") || lower.includes("cost") || lower.includes("how much") || lower.includes("room")) {
    return "Our Standard Room is ₦30,000 per night, and our Deluxe Room (which includes pool access) is ₦50,000 per night. Both include free breakfast, WiFi, DSTV & Netflix.";
  }
  if (lower.includes("location") || lower.includes("where") || lower.includes("address")) {
    return "We are located at Shonekan Street, Ola-Oparun, After Aboki Ifa Villa in Ijoko Ogbayo, Ogun State, just minutes away from Lagos.";
  }
  if (lower.includes("event") || lower.includes("hall") || lower.includes("wedding") || lower.includes("capacity")) {
    return "Our expansive Event Hall can accommodate over 200 guests. It's perfect for weddings, birthdays, and corporate seminars. Please contact our front desk for rates.";
  }
  if (lower.includes("pool") || lower.includes("swim") || lower.includes("bar") || lower.includes("club")) {
    return "Yes! We have an outdoor swimming pool, a rooftop VIP lounge, an outdoor bar, a nightclub, and a sports lounge for snooker and football viewing.";
  }
  if (lower.includes("book") || lower.includes("reserve") || lower.includes("contact")) {
    return "You can book directly via WhatsApp using the buttons on our site, or call our front desk. We offer a 10% discount for stays of 3 nights or more!";
  }
  
  return "I'm not exactly sure about that. Please feel free to call our front desk or message us on WhatsApp for more detailed assistance!";
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const responseText = getBotResponse(text);
      const botMessage: Message = { id: (Date.now() + 1).toString(), sender: "bot", text: responseText };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Tooltip prompt (only visible when closed after a few seconds) */}
        {!isOpen && (
          <div 
            className={`mb-3 bg-[var(--gold)] text-black px-4 py-2 rounded-t-xl rounded-bl-xl rounded-br-sm shadow-xl transition-all duration-500 transform origin-bottom-right ${
              isHovered ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <p className="text-xs font-medium">Need help? Ask our AI!</p>
          </div>
        )}

        <button
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 overflow-hidden group border border-[var(--gold)]/30 ${
            isOpen ? "opacity-0 scale-50 pointer-events-none translate-y-10" : "opacity-100 scale-100 translate-y-0"
          }`}
          aria-label="Open AI Chat Assistant"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold-dark)] via-[var(--gold)] to-[var(--gold-light)] group-hover:opacity-90 transition-opacity" />
          <MessageSquare size={24} className="text-black relative z-10" />
        </button>
      </div>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[350px] md:w-[400px] h-[500px] max-h-[85vh] bg-[#111] rounded-2xl border border-[var(--dark-border)] shadow-2xl flex flex-col transition-all duration-300 transform origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-[#1a1a1a] px-4 py-3 flex items-center justify-between border-b border-[var(--dark-border)] rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-black border border-[var(--gold)]">
              <Image src="/bot.png" alt="Bot Logo" fill className="object-cover p-1" />
            </div>
            <div>
              <h3 className="text-[var(--gold)] font-semibold text-sm">ODM Groove Assistant</h3>
              <p className="text-[var(--gold)] text-[10px] uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[var(--warm-gray)] hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin font-sans text-sm">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "bot" && (
                <div className="relative w-6 h-6 rounded-full overflow-hidden bg-black border border-[var(--gold)] mr-2 shrink-0 self-end">
                  <Image src="/bot.png" alt="Bot Icon" fill className="object-cover p-0.5" />
                </div>
              )}
              
              <div 
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.sender === "user" 
                    ? "bg-[var(--gold)] text-black rounded-br-sm" 
                    : "bg-[#222] text-[var(--off-white)] rounded-bl-sm border border-white/5"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>

              {msg.sender === "user" && (
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center ml-2 shrink-0 self-end">
                  <User size={12} className="text-white/60" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#222] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && !isTyping && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                onClick={() => handleSend(sug)}
                className="text-xs bg-[#1a1a1a] text-[var(--warm-gray)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 border border-[var(--dark-border)] px-3 py-1.5 rounded-full transition-colors text-left"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 bg-[#111] border-t border-[var(--dark-border)] rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-[#1a1a1a] text-[var(--off-white)] text-sm rounded-full pl-4 pr-10 py-3 outline-none focus:ring-1 focus:ring-[var(--gold)] border border-[var(--dark-border)] placeholder:text-[var(--warm-gray)]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--gold)] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={14} className="text-black -ml-0.5 mt-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}