import { Bot, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface ChatMessageProps {
  role: "user" | "bot";
  content: string | React.ReactNode;
  image?: string | null;
}

export function ChatMessage({ role, content, image }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4",
        role === "user" && "justify-end"
      )}
    >
      {role === "bot" && (
        <Avatar className="h-9 w-9 border-2 border-primary/50">
          <AvatarFallback className="bg-primary/20">
            <Bot className="h-5 w-5 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-5 py-3 text-base shadow-sm animate-in fade-in zoom-in-95",
          role === "user"
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-secondary rounded-bl-none"
        )}
      >
        {image && (
            <div className="relative w-full h-48 mb-2 rounded-md overflow-hidden">
                <Image src={image} alt="Imagen adjunta" layout="fill" objectFit="cover" />
            </div>
        )}
        <div className="leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
          {content}
        </div>
      </div>
      {role === "user" && (
         <Avatar className="h-9 w-9 border-2 border-foreground/20">
          <AvatarFallback>
            <User className="h-5 w-5 text-foreground/80" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
