'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Type from schema + _id
type Message = z.infer<typeof messageSchema> & { _id: string };

const cardColors = [
  "bg-gradient-to-br from-rose-100 to-pink-200",
  "bg-gradient-to-br from-blue-100 to-cyan-100",
  "bg-gradient-to-br from-emerald-100 to-lime-100",
  "bg-gradient-to-br from-orange-100 to-yellow-100",
  "bg-gradient-to-br from-slate-100 to-zinc-100"
];

const AllMessages = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const getAllMessages = async () => {
    try {
      const res = await axios.get<ApiResponse>("/api/get-messages");

      setMessages(res.data.messages ?? []); 

    } catch (err) {
      console.error("Error loading messages", err);
      setMessages([]); 
    } finally {
      setLoading(false);
    }
  };
  getAllMessages();
}, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">All Messages</h1>
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-black flex gap-2 items-center"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center mt-10">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-600 text-center">No messages found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((msg, idx) => (
              <div
                key={msg._id}
                className={`rounded-xl shadow-lg p-5 min-h-[200px] flex flex-col justify-between text-gray-800 ${cardColors[idx % cardColors.length]}`}
              >
                <p className="text-md font-medium break-words whitespace-pre-line">
                  {msg.content}
                </p>
                <p className="text-sm text-gray-600 mt-4">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMessages;
