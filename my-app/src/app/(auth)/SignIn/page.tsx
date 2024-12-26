'use client';
import Image from "next/image";
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
import { FaGoogle, FaTwitter, FaDiscord } from "react-icons/fa";

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
    console.log(data.email, data.password);
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
    <div className="flex flex-row h-[110vh] justify-center items-center border-red-700 border-2 ">
      <Image 
        src="/Assets/pictures/login.jpg" 
        alt="Login illustration" 
        width={500} 
        height={500} 
        className="w-[40%]" 
      />

      <div className="bg-white hover:shadow-sm mt-20 rounded-xl p-8 w-full max-w-md mt-4 shadow-black  transform transition-all duration-500 ">
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

        {/* Sign in with social accounts */}
        <div className="mt-6  space-y-4">
          <Button
            onClick={() => signIn('google')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-xl transform transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FaGoogle className="text-lg" /> Sign in with Google
          </Button>
         
          <Button
            onClick={() => signIn('discord')}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-xl transform transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FaDiscord className="text-lg" /> Sign in with Discord
          </Button>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            No account? 
            <a href="/sign-up" className="text-[#6631f7] hover:text-[#ff275b] font-semibold ml-2 transition-all duration-300">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
