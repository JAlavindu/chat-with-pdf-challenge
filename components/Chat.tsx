/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2Icon } from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { askQuestion } from "@/actions/askQuestion";
import { useToast } from "@/hooks/use-toast";
import { title } from "process";

export type Message = {
  id?: string;
  role: "human" | "ai" | "placeholder";
  message: string;
  createdAt: Date;
};

const ChatMessage = ({ message }: { message: Message }) => {
  return (
    <div className={`message ${message.role}`}>
      <p>{message.message}</p>
      <span>{message.createdAt.toLocaleString()}</span>
    </div>
  );
};

function Chat({ id }: { id: string }) {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [snapshot, loading, error] = useCollection(
    user &&
      query(
        collection(db, "users", user?.id, "files", id, "chat"),
        orderBy("createdAt", "asc")
      )
  );

  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!snapshot) return;
    console.log("updated snapshot", snapshot.docs);
    const lastMessage = messages.pop();

    if (lastMessage?.role === "ai" && lastMessage.message === "Thinking...") {
      //return as this is a dummy placeholer message
      return;
    }

    const newMessages = snapshot.docs.map((doc) => {
      const { role, message, createdAt } = doc.data();

      return {
        id: doc.id,
        role,
        message,
        createdAt: createdAt.toDate(),
      };
    });
    setMessages(newMessages);
    //ignore messages dependency warning here... we dont want an infinite loop
  }, [snapshot]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const q = input;

    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        role: "human",
        message: q,
        createdAt: new Date(),
      },
      {
        role: "ai",
        message: "Thinking...",
        createdAt: new Date(),
      },
    ]);

    startTransition(async () => {
      const { success, messages } = await askQuestion(id, q);

      if (!success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: messages,
        });

        setMessages((prev) =>
          prev.slice(0, prev.length - 1).concat([
            {
              role: "ai",
              message: `whoops... ${messages}`,
              createdAt: new Date(),
            },
          ])
        );
      }
    });
  };

  return (
    <div className="fex flex-col h-full overflow-scroll">
      {/* chat contents */}
      <div className="flex-1 w-full">
        {/* chat messages...*/}

        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2Icon className="animate-spin text-indigo-600 mt-20" />
          </div>
        ) : (
          <div className="P-5">
            {messages.length === 0 && (
              <ChatMessage
                key={"placeholder"}
                message={{
                  role: "ai",
                  message: "ask me anything about the document!",
                  createdAt: new Date(),
                }}
              />
            )}

            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}

            <div ref={bottomOfChatRef}></div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex sticky bottom-0 space-x-2 p-5 bg-indigo-600/75"
      >
        <Input
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <Button type="submit" disabled={!input || isPending}>
          {isPending ? (
            <Loader2Icon className="animate-spin text-indigo-600" />
          ) : (
            "Ask"
          )}
        </Button>
      </form>
    </div>
  );
}

export default Chat;
