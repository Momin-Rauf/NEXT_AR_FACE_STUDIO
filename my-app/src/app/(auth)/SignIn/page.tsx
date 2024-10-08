'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";

const LoginPage = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  // Zod schema implementation
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false, // Prevent redirection
      identifier: data.email, // Assuming 'identifier' refers to email
      password: data.password,
    });

    // Check if result.error exists, display an error toast if login fails
    if (result?.error) {
      toast({
        title: "Login Failed",
        description: "Incorrect email or password",
        variant: "destructive",
      });
      return;
    }
  
    // Redirect on successful login
    if (result?.url) {
      console.log("Redirecting to:", result.url);  // Log the redirection URL
      router.replace('/AssetsPage'); // Redirect to '/AssetsPage' after successful login
    } else {
      console.log("No redirection URL provided.");  // Log if URL is not present
    }
  };

 

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gradient-to-br from-gray-500 to-gray-300">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md transition-transform transform">
        <h2 className="text-gray-800 text-2xl font-bold mb-6 text-center">Login</h2>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
              className="w-full bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-300 rounded-lg shadow-md"
            >
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
