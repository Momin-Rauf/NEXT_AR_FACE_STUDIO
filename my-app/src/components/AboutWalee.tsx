'use client';

import Link from "next/link";
import Image from "next/image";

const AboutWalee = () => {
  return (
    <div className='sm:flex sm:flex-row flex-col p-4 items-center justify-center sm:p-12 sm:h-[100vh] bg-white sm:justify-center sm:items-center'>
      {/* Image Section */}
      <Image 
        className='sm:w-[40%] w-full my-2 rounded-lg shadow-lg order-1 sm:order-2' 
        src='/Assets/myassets/about.jpg' 
        alt="About Walee" 
        width={500} // Adjust width according to your design
        height={500} // Adjust height according to your design
      />

      {/* Text Section */}
      <div className='flex sm:w-[50%] w-[100%] gap-6 text-black flex-col order-2 sm:order-1'>
        <h1 className='font-bold text-4xl mb-4 text-[#6f40f9]'>About Walee</h1>

        <p className='m-2 text-lg leading-relaxed text-gray-700'>
          Founded in 2019, Walee is Pakistan&apos;s largest influencer marketing platform, boasting over 70 thousand registered users. We empower your voice, whether you&apos;re an influencer or a business. Our solutions are crafted to deliver winning experiences and opportunities.
        </p>

        <p className='m-2 text-lg md:block hidden leading-relaxed text-gray-700'>
          Our solutions encompass Automated Influencer Marketing, Influencer Insights, Social Listening, Social Commerce, Payment Gateway, and Mobility Marketing.
        </p>

        <p className='m-2 text-lg md:block hidden leading-relaxed text-gray-700'>
          If you are an influencer looking to collaborate with brands, download our app from the Google Play Store or Apple App Store. Alternatively, if you are a business owner aiming to reach your audience, please fill out the form below.
        </p>

        <Link 
          className="btn border-0 w-[200px] shadow-lg hover:scale-105 transition-all duration-300 ease-in-out bg-[#6530f8] text-white hover:bg-[#6f40f9]"
          href={"https://www.walee.pk/"}
        >
          Know More
        </Link>
      </div>
    </div>
  );
};

export default AboutWalee;
