'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from 'axios';


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
          console.log(response);
        // Assuming your API returns a message
        } catch (error) {
          console.error(error);
        } finally {
          setIsCheckingUsername(false);
          console.log(isCheckingUsername);
        }
      }
    };
    checkUserNameUniqueness();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      console.log(data);
      const response = await axios.post('/api/signup',  data );
      console.log("response");
      toast({ title: 'Success', description: response.data.message });
      router.replace(`/verify/${data.username}`); // Use data.username for verification
      // return Response.json({success:true});
    } catch (error) {
      console.log('Error in signup',error);
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
    <div className="flex flex-col h-screen justify-center items-center bg-gradient-to-br from-gray-500 to-gray-300 ">
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md transition-transform transform ">
        <h2 className="text-gray-800 text-2xl font-bold mb-6 text-center">Register</h2>
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter username"
                                    value={field.value} // Control the input value
                                    onChange={(e) => {
                                        field.onChange(e); // update react-hook-form state
                                        debounce(e.target.value); // update local state
                                    }}
                                    className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg transition-all duration-300"
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
                            <FormLabel className="text-gray-700">Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Enter email"
                                    {...field}
                                    className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg transition-all duration-300"
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
                            <FormLabel className="text-gray-700">Password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter password"
                                    type="password"
                                    {...field}
                                    className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg transition-all duration-300"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-300 rounded-lg shadow-md"
                >
                    {isSubmitting ? 'Loading...' : 'Register'}
                </Button>
            </form>
        </Form>
    </div>
</div>

  );
}

export default Page;
