'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6">
      <div className="text-center max-w-md w-full">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          HabitFlow
        </h1>
        <p className="text-gray-400 mb-8 text-lg">
          Build habits that stick. Track your progress. Level up your life.
        </p>
        
        <div className="flex flex-col gap-4">
          <Link 
            href="/signup" 
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition text-center"
          >
            Get Started
          </Link>
          <Link 
            href="/login" 
            className="w-full border border-gray-700 text-white font-bold py-4 rounded-xl hover:border-gray-500 transition text-center"
          >
            I already have an account
          </Link>
        </div>
      </div>
    </main>
  );
}