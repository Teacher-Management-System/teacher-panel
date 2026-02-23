"use client";

import AeroChatUI from "@/features/aero/components/chat-ui";

export default function AeroChatPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Aero AI
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Your personal AI assistant for everything Aerophantom
        </p>
      </div>

      <AeroChatUI />
    </div>
  );
}
