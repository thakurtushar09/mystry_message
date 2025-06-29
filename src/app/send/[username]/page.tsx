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
import { useState } from "react";
import * as z from "zod";
import { messageSchema } from "@/schemas/messageSchema";

const SendMessage = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/send-message", {
        username,
        content: data.content,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Message sent!");
        form.reset();
      } else {
        toast.error(res.data.message || "Failed to send.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!username) {
    return <div className="text-center mt-10 text-red-600">Username not found in URL</div>;
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-300 to-green-200 flex items-center justify-center">
      <div className="h-[90%] w-[90%] max-w-xl rounded-2xl bg-white/30 backdrop-blur-3xl shadow-2xl p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Send Message to <span className="font-bold">{username}</span>
        </h1>

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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {loading ? "Sending..." : "Send"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SendMessage;
