import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const faqResponses: { patterns: string[]; response: string }[] = [
  {
    patterns: [
      "clinical and non-clinical",
      "clinical vs non-clinical",
      "difference between clinical and non-clinical",
      "what is clinical",
      "what is non-clinical",
      "non-clinical questions",
      "clinical questions",
    ],
    response: `**Clinical vs non-clinical questions**

In this questionnaire, the terms clinical and non-clinical describe who is qualified to provide the information.

**Clinical questions** are those that require clinical judgement or medical expertise and must be completed by a qualified healthcare professional (e.g. neurologist, MS nurse).

**Non-clinical questions** do not require clinical judgement and can be completed by a non-healthcare professional, such as a researcher. In many cases, this information can be obtained from the patient's medical record and transcribed into the data collection tool.

This distinction helps ensure data is collected accurately and by the appropriate person.`,
  },
];

const getResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  for (const faq of faqResponses) {
    for (const pattern of faq.patterns) {
      if (lowerMessage.includes(pattern.toLowerCase())) {
        return faq.response;
      }
    }
  }
  
  return "I'm sorry, I don't have information about that specific topic yet. Please try asking about clinical vs non-clinical questions, or contact your administrator for more help.";
};

const ChatbotPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content: "👋 Hello! I'm here to help you with the questionnaire.\n\nIf you have any questions about filling in the form, understanding specific fields, or need clarification on medical terminology, feel free to ask!\n\nTry asking: \"What is the difference between clinical and non-clinical questions?\"",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: messages.length,
      role: "user",
      content: message.trim(),
    };

    const assistantResponse: Message = {
      id: messages.length + 1,
      role: "assistant",
      content: getResponse(message.trim()),
    };

    setMessages((prev) => [...prev, userMessage, assistantResponse]);
    setMessage("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-card border border-border rounded-lg shadow-xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Need Help?</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary-foreground/10 rounded-full p-1 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-72 p-4 overflow-y-auto bg-muted/30 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${
                  msg.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground"
                } rounded-lg p-3 text-sm max-w-[85%] whitespace-pre-wrap`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-border bg-card">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type your question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && message.trim()) {
                    handleSend();
                  }
                }}
              />
              <Button
                size="icon"
                className="shrink-0"
                disabled={!message.trim()}
                onClick={handleSend}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default ChatbotPopup;
