'use client';

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function Landing() {
  const router = useRouter();
  const { status } = useSession();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-300 to-green-200 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-7xl rounded-2xl bg-white/30 backdrop-blur-3xl shadow-2xl p-6 md:p-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div className="text-2xl font-bold text-gray-800">AnonMessage</div>
          <div className="flex gap-4 flex-wrap">
            {status === 'authenticated' ? (
              <Button onClick={() => router.push('/u/messages')}>
                See all Messages
              </Button>
            ) : (
              <>
                <button
                  onClick={() => router.push('/sign-in')}
                  className="px-5 py-2 text-sm font-semibold text-gray-800 bg-white bg-opacity-70 border border-gray-300 rounded-xl shadow-sm hover:bg-opacity-90 hover:shadow-md transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/sign-up')}
                  className="px-6 py-2 text-sm font-semibold text-white bg-blue-700 rounded-xl shadow-md hover:bg-blue-800 hover:shadow-lg transition-all"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Section */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          {/* Text Section */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Send Messages Without Revealing Your Identity
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Our anonymous messaging app lets you express your thoughts freely. No sign-up, no tracking — just honest, secure communication.
            </p>
            <button
              onClick={() =>
                router.push(status === 'authenticated' ? '/dashboard' : '/sign-up')
              }
              className="px-6 py-3 bg-purple-700 text-white rounded-xl font-semibold shadow-md hover:bg-purple-800 hover:shadow-lg transition duration-200"
            >
              {status === 'authenticated' ? 'Go to Dashboard' : 'Start Now'}
            </button>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2 flex justify-center">
            <Image
              src="/landing-image.png"
              alt="landing-image"
              width={450}
              height={450}
              className="rounded-xl w-full max-w-[350px] md:max-w-[450px]"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
