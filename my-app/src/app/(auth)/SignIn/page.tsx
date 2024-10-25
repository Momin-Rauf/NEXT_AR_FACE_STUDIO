'use client';

import { signIn } from "next-auth/react";
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
      redirect: false,
      identifier: data.email,
      password: data.password,
    });

    if (result?.error) {
      toast({
        title: "Login Failed",
        description: "Incorrect email or password",
        variant: "destructive",
      });
      return;
    }

    if (result?.url) {
      router.replace('/FaceStudio');
    } 
  };

  return (
    <div className="flex flex-row h-screen justify-center items-center border-red-700 border-2 ">
      <img src="/Assets/pictures/login.jpg" className = 'w-[40%]  '  />
      <div className="bg-white hover:shadow-sm rounded-xl p-8 w-full max-w-md mt-4 shadow-black  transform transition-all duration-500 ">
        <h2 className="text-[#6631f7] text-4xl font-bold mb-8 text-center tracking-tight">Welcome Back</h2>
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
                      className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6631f7] rounded-lg transition-all duration-300 p-4"
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
                      className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6631f7] rounded-lg transition-all duration-300 p-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-[#ff275b] hover:bg-[#ff4971] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-xl transform transition-all duration-300 hover:scale-105"
            >
              Login
            </Button>
          </form>
        </Form>
        <div className="text-center mt-6">
  <p className="text-gray-600">
    Don't have an account? 
    <a href="/sign-up" className="text-[#6631f7] hover:text-[#ff275b] font-semibold ml-2 transition-all duration-300">Sign Up</a>
  </p>
</div>

      </div>
    </div>
  );
};

export default LoginPage;


