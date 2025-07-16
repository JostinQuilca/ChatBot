"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ChatInterface } from "@/components/chat/chat-interface";
import { TopicManager } from "@/components/chat/topic-manager";
import { Icons } from "@/components/icons";

export default function Home() {
  const [topics, setTopics] = useState<string[]>(["Computación en la Nube"]);
  const [activeTopic, setActiveTopic] = useState<string>("Computación en la Nube");

  return (
    <div className="dark">
      <SidebarProvider defaultOpen={true}>
        <Sidebar variant="sidebar" side="left" collapsible="icon">
          <SidebarHeader className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                  <Icons.logo className="w-8 h-8 text-primary" />
                  <h1 className="text-xl font-semibold">CloudChat</h1>
              </div>
              <div className="hidden items-center gap-2 group-data-[collapsible=icon]:flex">
                   <Icons.logo className="w-8 h-8 text-primary" />
              </div>
              <SidebarTrigger />
          </SidebarHeader>
          <SidebarContent>
              <TopicManager 
                topics={topics}
                setTopics={setTopics}
                activeTopic={activeTopic}
                setActiveTopic={setActiveTopic}
              />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="p-2 flex justify-between items-center md:hidden border-b mb-2">
              <div className="flex items-center gap-2">
                   <Icons.logo className="w-8 h-8 text-primary" />
                   <h1 className="text-xl font-semibold">CloudChat</h1>
              </div>
              <SidebarTrigger />
          </div>
          <ChatInterface topic={activeTopic} />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
