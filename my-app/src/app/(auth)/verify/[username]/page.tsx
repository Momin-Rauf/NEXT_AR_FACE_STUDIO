'use client';

import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from "react-hook-form";
import * as z from 'zod';
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
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/schemas/verifySchema";

const VerifyAccount = () => {
    const router = useRouter();
    const { toast } = useToast();
    const params = useParams<{ username: string }>();

    const form = useForm({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const res = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            });

            toast({
                title: "Success",
                description: res.data.message
            });
          

            router.push('/SignIn');
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Verification failed. Please try again.",
                variant: "destructive"
            });
        }
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-white ">
            <h1 className="text-Black text-4xl font-bold mb-6">AR Face Studio</h1>
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md transition-transform shadow-[#ff275b] transform hover:scale-105">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Verify Account</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Verification Code"
                                            {...field}
                                            className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff275b] rounded-lg transition-all duration-300"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-[#ff275b] hover:bg-[#ff4971] text-white transition-colors duration-300 rounded-lg shadow-md">
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default VerifyAccount;
