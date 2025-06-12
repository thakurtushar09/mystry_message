'use client';

import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const VerifyPage = () => {
  const params = useParams<{ username: string }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post('/api/verify-code', {
        username: params.username,
        code: data.code,
      });

      toast.success('Success', {
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const msg = axiosError.response?.data.message || 'Something went wrong';
      toast.error('Verification failed', { description: msg });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-2">
          Verify Your Account
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the 6-digit verification code sent to your email.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="123456"
                      maxLength={6}
                      className="tracking-widest text-center font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    Code is valid for a limited time.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Verify Account
            </Button>
          </form>
        </Form>

        <p className="text-xs text-center text-gray-400 mt-4">
          Didn’t receive the code? Check your spam folder.
        </p>
      </div>
    </div>
  );
};

export default VerifyPage;
