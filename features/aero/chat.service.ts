import BaseService from "@/lib/api.service";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  tokens?: number;
}

export interface MessageData {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  tokens: number | null;
  model: string | null;
  created_at: number | string;
}

export interface SendMessageData {
  user_message?: MessageData;
  assistant_message?: MessageData;
  message?: MessageData; // Support old format too
}

export interface MessagesData {
  messages?: MessageData[];
  user_message?: MessageData;
  assistant_message?: MessageData;
}

export class AeroChatService extends BaseService {
  constructor() {
    super("conversations");
  }

  getMessages(): Promise<any> {
    return this.get("messages");
  }

  sendMessage(content: string): Promise<SendMessageData | undefined> {
    return this.post("send", { content }) as Promise<
      SendMessageData | undefined
    >;
  }
}

const aeroChatService = new AeroChatService();
export default aeroChatService;
