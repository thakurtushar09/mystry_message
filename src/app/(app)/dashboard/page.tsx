'use client';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { messageSchema } from "@/schemas/messageSchema";
import { toast } from "sonner";
import Switch from "@/components/Switch";
type Message = z.infer<typeof messageSchema> & { _id: string };

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const isAcceptingMessages = session?.user?.isAcceptingMessages ?? true;


  useEffect(() => {
    if (status === "unauthenticated") router.replace("/sign-in");
  }, [status, router]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(res.data.messages??[]);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    if (status === "authenticated") getMessages();
  }, [status]);

  if (status === "loading")
    return <div className="text-center mt-10">Loading your dashboard...</div>;
  if (!session?.user) return null;

  // Soft pastel colors
  const cardColors = [
    "bg-gradient-to-br from-rose-100 to-pink-200",
    "bg-gradient-to-br from-blue-100 to-cyan-100",
    "bg-gradient-to-br from-emerald-100 to-lime-100",
    "bg-gradient-to-br from-orange-100 to-yellow-100",
    "bg-gradient-to-br from-slate-100 to-zinc-100"
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-300 to-green-200 flex items-center justify-center">
      <div className="w-[90%] max-w-6xl h-[90%] rounded-2xl bg-white/30 backdrop-blur-3xl shadow-2xl p-8 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {session.user.username}
          </h1>
          <Button
            variant="outline"
            className="bg-white/70 hover:bg-white text-gray-800 border border-gray-300"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Logout
          </Button>
        </div>
        <div className="bg-white bg-opacity-60 rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Your Mystery Messages</h2>
            {messages.length > 2 && (
              <Button
                variant="ghost"
                className="text-sm text-blue-600 hover:underline"
                onClick={() => router.push("/u/messages")}
              >
                See All
              </Button>
            )}
          </div>
          <p className="text-gray-700 mb-4">Here are a few anonymous messages you've received.</p>

          {messages.length > 0 ? (
            <div className="flex space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 pb-2">
              {messages.slice(0, 3).map((msg, idx) => (
                <div
                  key={msg._id}
                  className={`min-w-[250px] h-[250px] ${cardColors[idx % cardColors.length]} rounded-2xl shadow-lg p-4 flex flex-col justify-between text-gray-800 hover:scale-[1.02] transition-transform`}
                >
                  <p className="text-md font-medium break-words line-clamp-6">{msg.content}</p>
                  {/* <p className="text-sm text-gray-600 mt-4">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p> */}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No messages yet.</p>
          )}
        </div>

        <div className="bg-white bg-opacity-60 rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Share Your Message Link
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/send/${session.user.username}`}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700"
            />
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/send/${session.user.username}`
                );
                toast("Copy to clipboard");
              }}
            >
              Copy Link
            </Button>
          </div>
        </div>

        {/* Profile */}
        <div className="bg-white bg-opacity-60 rounded-xl shadow-md p-6">
          <h1>Are you accepting messages?</h1>
          <Switch/>

        </div>

      </div>
    </div>
  );
}
