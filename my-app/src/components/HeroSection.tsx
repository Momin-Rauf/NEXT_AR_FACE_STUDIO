'use client';
import React, { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import { AuroraBackground } from "./ui/aurora-background";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

const HeroSection = () => {
    const [sessionData, setSessionData] = useState<Session | null>(null);
    const { data: session } = useSession();
    const textRef = useRef<HTMLDivElement | null>(null);

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
                    <div className="text-3xl md:text-7xl font-bold text-[#662ff3] dark:text-white text-center">
                        AR FACE STUDIO
                    </div>
                    <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
                        <TextGenerateEffect className="font-extralight" words={'Real-time face filter app with dynamic effects'} />
                       
                    </div>

                    <div className='py-4 px-2' >
                        {sessionData ? (
                            <Link href={"/FaceStudio"} className="px-2 py-4 relative">
                                
                                
                                    <div className="px-6 py-1.5 text-sm bg-[#401d98] rounded-[6px] relative group transition duration-200 text-white">
                                    Ar Face studio
                                    </div>
                               
                            </Link>
                        ) : (
                            <div className="flex flex-row gap-2">
                                <Link href={"/FaceStudio"} className="p-[3px] relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#662ff3] to-[#ff275b] rounded-lg" />
                                    <div className="px-6 py-1.5 text-sm bg-[#401d98] rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                                    Sign up
                                    </div>
                                </Link>
                                <Link
                                    href={"/SignIn"}
                                    className="px-4 py-1.5 text-sm rounded-md border border-black bg-white text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
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
