'use client';

import Link from "next/link";
const AboutWalee = () => {
 

  return (
   <div className='flex flex-row p-12 h-[100vh] bg-white justify-center items-center' >
        <div className='flex w-[50%] text-black flex-col' >
            <h1 className='font-bold text-2xl' >About Walee</h1>

            <p className='m-2' >
            Founded in 2019, Walee is Pakistan’s largest influencer marketing platform having more than 70 thousand registered users. We are here to make your voice heard by the world. Whether you are an influencer or a business, our solutions have been designed to provide you with winning experiences and opportunities.
            </p>

            <p className='m-2'  >
            Our solutions include Automated Influencer Marketing, Influencer Insights, Social Listening, Social Commerce, Payment Gateway, and Mobility Marketing.

If you are an influencer and looking to collaborate with brands, download our app from the Google Play Store or Apple App Store. Or, if you own a business and want to reach your audience using the convenience of our solutions, please fill out the form below.
            </p>
            <Link className="btn btn-active border-0 w-[200px] shadow-mg hover:scale-105 shadow-black bg-[#6530f8] text-white hover:bg-blue-800" href={"https://www.walee.pk/"}>
                Know more
            </Link>
        </div>

        <img className='w-[40%] m-2' src='/Assets/myassets/about.jpg' ></img>
   </div>
    
  );
};

export default AboutWalee;
