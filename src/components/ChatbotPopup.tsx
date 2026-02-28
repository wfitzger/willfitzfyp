import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const SUPABASE_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co`;
const CHAT_URL = `${SUPABASE_URL}/functions/v1/chat`;

const TypingIndicator = () => (
  <div className="bg-card border border-border rounded-lg p-3 max-w-[85%] flex items-center gap-1">
    <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
    <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
    <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
  </div>
);

const ChatbotPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content:
        "👋 Hello! I'm here to help you with the questionnaire.\n\nIf you have any questions about filling in the form, understanding specific fields, or need clarification on medical terminology, feel free to ask!",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSend = async () => {
    if (!message.trim() || isStreaming) return;

    const userMessage: Message = {
      id: messages.length,
      role: "user",
      content: message.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessage("");
    setIsStreaming(true);

    // Prepare conversation history for the API (exclude the welcome message id=0 system-like message)
    const apiMessages = updatedMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    abortControllerRef.current = new AbortController();

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errData.error || `Request failed with status ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let assistantContent = "";
      let assistantId = updatedMessages.length;

      // Add an empty assistant message to fill in as tokens arrive
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      setIsStreaming(false); // hide typing indicator once the assistant message exists

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const chunk = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (chunk) {
              assistantContent += chunk;
              const captured = assistantContent;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: captured } : m
                )
              );
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const chunk = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (chunk) {
              assistantContent += chunk;
              const captured = assistantContent;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: captured } : m
                )
              );
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") return;
      console.error("Chat error:", e);
      setIsStreaming(false);
      toast({
        title: "Something went wrong",
        description:
          e instanceof Error ? e.message : "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    }
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
                } rounded-lg p-3 text-sm max-w-[85%]`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                )}
              </div>
            ))}
            {isStreaming && <TypingIndicator />}
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
                disabled={isStreaming}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && message.trim() && !isStreaming) {
                    handleSend();
                  }
                }}
              />
              <Button
                size="icon"
                className="shrink-0"
                disabled={!message.trim() || isStreaming}
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
