'use client';

import { useParams } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import * as z from "zod";
import { messageSchema } from "@/schemas/messageSchema";

const SendMessage = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [loading, setLoading] = useState(false);
  const [userAcceptsMessages, setUserAcceptsMessages] = useState(true);
  const [userExists, setUserExists] = useState(true);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });


  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    console.log("form submitted");
    
    setLoading(true);
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content: data.content,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Message sent successfully!");
        form.reset();
      } else {
        toast.error(response.data.message || "Failed to send message");
        if (response.data.debug?.convertedValue === false) {
          setUserAcceptsMessages(false);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error details:", error.response?.data);
        
        if (error.response?.status === 403) {
          setUserAcceptsMessages(false);
          const debugInfo = error.response.data?.debug || {};
          toast.error(
            `User is not accepting messages. ` +
            `(Server received: ${debugInfo.actualValue}, type: ${debugInfo.type})`
          );
        } else if (error.response?.status === 404) {
          setUserExists(false);
          toast.error("User not found");
        } else {
          toast.error(error.response?.data?.message || "An error occurred while sending the message");
        }
      } else {
        toast.error("An unexpected error occurred");
        console.error("Non-Axios error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!username) {
    return <div className="text-center mt-10 text-red-600">Username not found in URL</div>;
  }

  if (!userExists) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">User Not Found</h1>
          <p>The username "{username}" doesn't exist or couldn't be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-300 to-green-200 flex items-center justify-center">
      <div className="h-[90%] w-[90%] max-w-xl rounded-2xl bg-white/30 backdrop-blur-3xl shadow-2xl p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Send Message to <span className="font-bold">{username}</span>
        </h1>

        {!userAcceptsMessages && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
            <p className="font-medium">This user is not currently accepting messages</p>
            <p className="text-sm mt-1">Any messages sent will not be delivered.</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Message</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Type your message here..."
                      className="h-60 text-lg"
                      disabled={!userAcceptsMessages || loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={!userAcceptsMessages || loading}
                className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : "Send Message"}
              </Button>
              
              <Button
                type="button"
                onClick={() => form.reset()}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Clear
              </Button>
            </div>
          </form>
        </Form>

        <div className="text-xs text-gray-500 mt-4">
          <p>Note: Messages are private and can only be viewed by the recipient.</p>
        </div>
      </div>
    </div>
  );
};

export default SendMessage;