'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) router.replace('/dashboard');
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Register the user
      await api.post('register/', {
        username,
        email,
        password,
      });

      // 2. Auto-login immediately after signup
      const loginRes = await api.post('token/', {
        username,
        password
      });

      // 3. Save tokens
      localStorage.setItem('access_token', loginRes.data.access);
      localStorage.setItem('refresh_token', loginRes.data.refresh);
      
      // 4. Redirect
      router.replace('/dashboard');
      
    } catch (err: any) {
      console.error(err);
      
      if (err.response && err.response.data) {
        // 1. Get the first error message returned by Django
        // Example response: { password: ["This password is too short."] }
        const errorData = err.response.data;
        const firstField = Object.keys(errorData)[0]; // e.g., "password" or "username"
        const message = errorData[firstField][0];     // e.g., "This password is too short."
        
        // 2. Show it to the user
        setError(`${firstField.toUpperCase()}: ${message}`);
      } else {
        setError('Signup failed. Please try again.');
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6">
      <div className="w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          Create Account
        </h2>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-purple-500 transition-colors"
            required
          />
          
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-purple-500 transition-colors"
            required
          />
          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 pr-12 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition mt-2"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-white underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}