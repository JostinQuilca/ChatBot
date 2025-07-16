"use client";

import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { Plus, X, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";

interface TopicManagerProps {
  topics: string[];
  setTopics: Dispatch<SetStateAction<string[]>>;
  activeTopic: string;
  setActiveTopic: Dispatch<SetStateAction<string>>;
}

export function TopicManager({
  topics,
  setTopics,
  activeTopic,
  setActiveTopic,
}: TopicManagerProps) {
  const [newTopic, setNewTopic] = useState("");

  const handleAddTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      const updatedTopics = [...topics, newTopic.trim()];
      setTopics(updatedTopics);
      setActiveTopic(newTopic.trim());
      setNewTopic("");
    }
  };
  
  const handleRemoveTopic = (topicToRemove: string) => {
    const updatedTopics = topics.filter(t => t !== topicToRemove);
    setTopics(updatedTopics);

    if (activeTopic === topicToRemove) {
      setActiveTopic(updatedTopics.length > 0 ? updatedTopics[0] : "");
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Temas</SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Input
              id="new-topic"
              aria-label="Nuevo Tema"
              placeholder="Añadir tema..."
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
              className="bg-card group-data-[collapsible=icon]:hidden"
            />
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleAddTopic} 
                className="group-data-[collapsible=icon]:hidden" 
                aria-label="Añadir nuevo tema"
            >
                <Plus className="h-4 w-4" />
            </Button>
          </div>
          <SidebarMenu>
            {topics.map((topic) => (
              <SidebarMenuItem key={topic}>
                <SidebarMenuButton
                  onClick={() => setActiveTopic(topic)}
                  isActive={activeTopic === topic}
                  className="group/menu-button justify-start"
                  tooltip={topic}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="truncate group-data-[collapsible=icon]:hidden">{topic}</span>
                </SidebarMenuButton>
                {topics.length > 1 && (
                  <SidebarMenuAction
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTopic(topic);
                    }}
                    showOnHover={true}
                  >
                    <X />
                  </SidebarMenuAction>
                 )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
