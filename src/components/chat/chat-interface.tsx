"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, LoaderCircle, Sparkles, Paperclip, X } from "lucide-react";
import { ChatMessage, type ChatMessageProps } from "./chat-message";
import { generateAnswer } from "@/ai/flows/generate-answer";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../ui/card";

interface ChatInterfaceProps {
  topic: string;
}

export function ChatInterface({ topic }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    setMessages([
        {
            role: "bot",
            content: "¡Hola! Soy tu Asistente CloudChat, listo para responder tus preguntas. ¿Cómo puedo ayudarte hoy?",
        },
    ]);
    setImagePreview(null);
    setImageDataUri(null);
  }, [topic]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(URL.createObjectURL(file));
        setImageDataUri(dataUri);
      };
      reader.readAsDataURL(file);
    } else {
        toast({
            variant: "destructive",
            title: "Archivo no válido",
            description: "Por favor, selecciona un archivo de imagen.",
        });
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((!input.trim() && !imageDataUri) || isLoading) return;
    if (!topic) {
        toast({
            variant: "destructive",
            title: "No se ha definido un tema",
            description: "Por favor, define un tema en la barra lateral antes de iniciar el chat.",
        });
        return;
    }

    const userMessage: ChatMessageProps = { role: "user", content: input, image: imagePreview };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setImagePreview(null);
    setImageDataUri(null);
    setIsLoading(true);

    try {
      const chatHistory = messages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n");
      const result = await generateAnswer({
        question: input,
        topic,
        chatHistory,
        imageDataUri: imageDataUri || undefined,
      });
      
      if (result.answer) {
        const botMessage: ChatMessageProps = {
          role: "bot",
          content: result.answer,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("La IA no devolvió una respuesta.");
      }
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessageProps = {
        role: "bot",
        content: "Lo siento, encontré un error. Por favor, inténtalo de nuevo.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        variant: "destructive",
        title: "Ocurrió un error",
        description: "No se pudo obtener una respuesta del chatbot.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-14rem)] md:h-[calc(100vh-12rem)]" ref={scrollAreaRef}>
          <div className="space-y-6 p-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}
            {isLoading && (
              <ChatMessage role="bot" content={
                <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" />
              } />
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="p-4 border-t border-border/20">
        {imagePreview && (
          <div className="relative mb-2 w-24 h-24 rounded-md overflow-hidden border">
            <Image src={imagePreview} alt="Vista previa de imagen" layout="fill" objectFit="cover" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-6 w-6 rounded-full bg-black/50 hover:bg-black/75 text-white"
              onClick={() => {
                setImagePreview(null);
                setImageDataUri(null);
                if(fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="relative flex w-full items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute left-2 text-muted-foreground"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Adjuntar archivo</span>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <Sparkles className="absolute left-12 h-5 w-5 text-muted-foreground" />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Haz una pregunta o adjunta una imagen..."
            disabled={isLoading || !topic}
            className="flex-1 pl-20 pr-12 rounded-full h-12"
            aria-label="Entrada de chat"
          />
          <Button type="submit" size="icon" disabled={isLoading || (!input.trim() && !imageDataUri)} aria-label="Enviar mensaje" className="absolute right-2 rounded-full w-9 h-9">
            {isLoading ? (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
