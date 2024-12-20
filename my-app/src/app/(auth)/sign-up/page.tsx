'use client';
import Image from 'next/image'
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDebounceCallback } from 'usehooks-ts';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";

const SignUpPage = () => {
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
        console.log(isCheckingUsername);
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          console.log(response);
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
      const response = await axios.post('/api/signup', data);
      toast({ title: 'Success', description: response.data.message });
      router.replace(`/verify/${data.username}`); // Use data.username for verification
    } catch (error) {
      console.log('Error in signup', error);
      toast({
        title: "Failed",
        description: "User sign up failed. Try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-row h-screen justify-center items-center border-red-700 border-2">
      <Image
      src="/Assets/pictures/signup.jpg"
      alt="Sign-up illustration"
      width={500}
      height={500}
      className="w-[40%]"
    />
      <div className="bg-white  hover:shadow-sm rounded-xl p-4 w-full max-w-md mt-10 shadow-black transform transition-all duration-500">
        <h2 className="text-[#6631f7] text-4xl font-bold mb-8 text-center tracking-tight">Create an Account</h2>
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
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        debounce(e.target.value);
                      }}
                      className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6631f7] rounded-lg transition-all duration-300"
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
                      className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6631f7] rounded-lg transition-all duration-300"
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
                      className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6631f7] rounded-lg transition-all duration-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#ff275b] hover:bg-[#ff4971] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-xl transform transition-all duration-300 hover:scale-105"
            >
              {isSubmitting ? 'Loading...' : 'Register'}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-6">
          <p className="text-gray-600">Already have an account?
            <a href="/SignIn" className="text-[#6631f7] hover:text-[#ff275b] font-semibold ml-2 transition-all duration-300">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
