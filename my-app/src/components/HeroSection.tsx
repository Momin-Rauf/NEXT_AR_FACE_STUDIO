    import React, { useEffect, useRef } from "react";
    import Link from "next/link";
    import { gsap } from "gsap";
    import Image from "next/image";
    import { FaAngleDoubleDown } from "react-icons/fa";
    const HeroSection = () => {
    const textRef = useRef(null);

    // GSAP animations
    useEffect(() => {
        gsap.fromTo(
        textRef.current.querySelectorAll("h1, p, button,span"),
        {
            opacity: 0,
            y: -50,
        },
        {
            opacity: 1,
            y: 0,
            duration: .7,
            ease: "power3.out",
            stagger: 0.1,
        }
        );
    }, []);

    return (
        <div className="hero bg-white text-content min-h-screen">
        <div className="hero-content text-[#fd275d] flex-col lg:flex-row-reverse">
            <div className="relative flex flex-row  max-w-sm mr-24 rounded-lg ">
                <span className='animate-pulse' ><FaAngleDoubleDown size={32} /></span>
            <div className="carousel w-96 carousel-vertical rounded-box h-96">
    
    <div className="carousel-item h-full">
    <Image
                src={`/Assets/myassets/a2.png`}
                alt="AR Face Filter"
                layout="responsive"
                width={700}  // Set desired width
                height={700} // Set desired height
            
            />
    </div>
    <div className="carousel-item h-full">
    <Image
                src={`/Assets/myassets/a1.png`}
                alt="AR Face Filter"
                layout="responsive"
                width={700}  // Set desired width
                height={700} // Set desired height
            
            />
    </div>
    <div className="carousel-item h-full">
    <Image
                src={`/Assets/myassets/a3.png`}
                alt="AR Face Filter"
                layout="responsive"
                width={700}  // Set desired width
                height={700} // Set desired height
            
            />
    </div>
    <div className="carousel-item h-full">
    <Image
                src={`/Assets/myassets/a4.png`}
                alt="AR Face Filter"
                layout="responsive"
                width={700}  // Set desired width
                height={700} // Set desired height
            
            />
    </div>
    </div>
            
            </div>
            <div ref={textRef}>
            <h1 className="text-5xl font-bold">AR Face Studio</h1>
            <p className="py-6">
                Transform your look in real-time with our AI-powered face filters.
                Explore endless possibilities for creativity, fun, and magic—all in
                your browser!
            </p>
            <Link className="btn btn-active border-0 shadow-mg hover:scale-105 shadow-black w-[100px] bg-[#6530f8] text-white hover:bg-blue-800" href={"/FaceStudio"}>
                Demo
            </Link>
            </div>
        </div>
        </div>
    );
    };

    export default HeroSection;


