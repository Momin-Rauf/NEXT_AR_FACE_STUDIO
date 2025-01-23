'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuroraBackground } from "./ui/aurora-background";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

const HeroSection = () => {
    const [sessionData, setSessionData] = useState<Session | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        setSessionData(session);
    }, [session]);

    return (
        <>
            <AuroraBackground>
                <motion.div
                    initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="relative flex flex-col gap-4 items-center justify-center px-4"
                >
                    <div className="text-[50px] md:text-7xl font-bold text-[#662ff3] dark:text-white text-center">
                        AR FACE STUDIO
                    </div>
                    <div className="sm:font-extralight font-light text-base md:text-4xl text-center dark:text-neutral-200 py-4">
                        <TextGenerateEffect className="font-extralight" words="Real-time face filter app with dynamic effects" />
                    </div>

                    <div className="py-4 px-2">
                        {sessionData ? (
                            <Link href={"/FaceStudio"} className="px-2 py-4 relative">
                                <div className="px-6 text-[20px] py-6 focus:bg-white active:bg-white active:border-2 active:text-[#401d98] text-sm bg-[#401d98] rounded-[4px] relative group transition duration-200 text-white">
                                    AR Face Studio
                                </div>
                            </Link>
                        ) : (
                            <div className="flex flex-row gap-2">
                                <Link href={"/sign-up"} className="p-[3px] relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#662ff3] to-[#ff275b] rounded-lg" />
                                    <div className="px-6 text-[20px] py-2  bg-[#401d98] rounded-[4px] relative group transition duration-200 text-white hover:bg-transparent">
                                        Sign up
                                    </div>
                                </Link>
                                <Link
                                    href={"/SignIn"}
                                    className="px-6 text-[20px] py-2 rounded-md border border-black bg-white text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>
            </AuroraBackground>
        </>
    );
};

export default HeroSection;



