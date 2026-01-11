'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // 1. Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('token/', {
        username,
        password,
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // Use replace instead of push to prevent "Back" button loops
      router.replace('/dashboard');
      
    } catch (err) {
      console.error(err);
      setError('Invalid username or password.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6">
      <div className="w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 pr-12 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-purple-500 transition-colors"
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
            Login
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500">
          Don't have an account?{' '}
          <Link href="/signup" className="text-white underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}