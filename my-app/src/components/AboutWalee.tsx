'use client';

import Link from "next/link";

const AboutWalee = () => {
  return (
    <div className='flex flex-row p-12 h-[100vh] bg-white justify-center items-center'>
      <div className='flex w-[50%] gap-6 text-black flex-col'>
        <h1 className='font-bold text-4xl mb-4 text-[#6f40f9]'>About Walee</h1>
        
        <p className='m-2 text-lg leading-relaxed text-gray-700'>
          Founded in 2019, Walee is Pakistans largest influencer marketing platform, boasting over 70 thousand registered users. We empower your voice, whether youre an influencer or a business. Our solutions are crafted to deliver winning experiences and opportunities.
        </p>

        <p className='m-2 text-lg leading-relaxed text-gray-700'>
          Our solutions encompass Automated Influencer Marketing, Influencer Insights, Social Listening, Social Commerce, Payment Gateway, and Mobility Marketing.
        </p>

        <p className='m-2 text-lg leading-relaxed text-gray-700'>
          If you are an influencer looking to collaborate with brands, download our app from the Google Play Store or Apple App Store. Alternatively, if you're a business owner aiming to reach your audience, please fill out the form below.
        </p>

        <Link 
          className="btn border-0 w-[200px] shadow-lg hover:scale-105 transition-all duration-300 ease-in-out bg-[#6530f8] text-white hover:bg-[#6f40f9]"
          href={"https://www.walee.pk/"}
        >
          Know More
        </Link>
      </div>

      <img className='w-[40%] m-2 rounded-lg shadow-lg' src='/Assets/myassets/about.jpg' alt="About Walee" />
    </div>
  );
};

export default AboutWalee;
