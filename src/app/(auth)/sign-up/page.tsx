'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpValidation } from "@/schemas/signUpSchema";
import * as z from "zod";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";

const SignupPage = () => {
  const router = useRouter();
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);

  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const checkUsernameUnique = async (username: string) => {
    if (!username) return;
    setIsCheckingUsername(true);
    setUsernameMessage("");

    try {
      const res = await axios.get(`/api/check-username-unique?username=${username}`);
      setUsernameMessage(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setUsernameMessage(
        axiosError.response?.data.message || "Error checking username"
      );
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const debouncedCheckUsername = useDebounceCallback((value: string) => {
    checkUsernameUnique(value);
  }, 500);

  const onSubmit = async (data: z.infer<typeof signUpValidation>) => {
    setIsCheckingUsername(true);
    try {
      const res = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.success("Success", { description: res.data.message });
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const msg = axiosError.response?.data.message || "Something went wrong";
      toast.error("Signup failed", { description: msg });
    } finally {
      setIsCheckingUsername(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter a unique username"
                    onChange={(e) => {
                      field.onChange(e);
                      setHasTyped(true);
                      debouncedCheckUsername(e.target.value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  {hasTyped && (isCheckingUsername ? "Checking..." : usernameMessage)}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="you@example.com" type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="••••••••" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isCheckingUsername} className="w-full">
            {isCheckingUsername ? "Creating Account..." : "Signup"}
          </Button>
        </form>
      </Form>

      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
