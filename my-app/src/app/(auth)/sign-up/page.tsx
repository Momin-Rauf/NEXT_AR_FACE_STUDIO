'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from 'axios';
import {ApiResponse} from '@/types/ApiResponse';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Ensure Button is imported
import { useToast } from "@/hooks/use-toast";
import { useDebounceCallback } from 'usehooks-ts';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";

const Page = () => {
  const [username, setUsername] = useState('');
  const debounce = useDebounceCallback(setUsername, 300);
  const [usernameResponse, setUsernameResponse] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  // Zod implementation
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUserNameUniqueness = async () => {
      if (username) {
        setIsCheckingUsername(true);
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          setUsernameResponse(response.data.message); // Assuming your API returns a message
        } catch (error) {
          console.error(error);
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUserNameUniqueness();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      console.log(data);
      const response = await axios.post<ApiResponse>('/api/sign-up', { data });
      toast({ title: 'Success', description: response.data.message });
      router.replace(`/verify/${data.username}`); // Use data.username for verification
    } catch (error) {
      console.log('Error in signup');
      toast({
        title: "Failed",
        description: "User sign up failed. Try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='flex flex-col h-screen justify-center items-center bg-blue-300'>
      <div>
        <Form {...form}>
          <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      value={field.value} // Control the input value
                      onChange={(e) => {
                        field.onChange(e); // update react-hook-form state
                        debounce(e.target.value); // update local state
                      }} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="password"
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Loading...' : 'Register'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;
