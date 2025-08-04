'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle Google redirect token
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token); // store in cookie/context
      router.push('/dashboard');
    }
  }, [searchParams, login, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/login', { email, password });
      const jwt = response.data.token;
      login(jwt);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    // This should match the endpoint in your Spring Boot backend
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 text-black">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 border-t border-gray-300 text-center text-sm text-gray-600">
          OR
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}