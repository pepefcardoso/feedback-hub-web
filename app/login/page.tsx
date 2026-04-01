'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient, AppError } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function LoginPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      setServerError(null);

      const res = await apiClient<{ data: { user: AuthUser } }>('/users/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      setUser(res.data.user);
      router.push('/');
    } catch (error) {
      setServerError(error instanceof AppError ? error.message : 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-manrope">Welcome back</h1>
        <p className="text-on-surface/60 mt-2">Log in to vote and submit feedback.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div className="p-4 bg-red-500/10 text-red-600 rounded-sm font-medium">
            {serverError}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase tracking-wider text-on-surface/80">Email</label>
          <input
            type="email"
            className="w-full bg-[#e1e3e4] text-on-surface border-none border-b-2 border-transparent focus:border-[#004d75] focus:outline-none transition-all rounded-sm p-4"
            {...register('email')}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase tracking-wider text-on-surface/80">Password</label>
          <input
            type="password"
            className="w-full bg-[#e1e3e4] text-on-surface border-none border-b-2 border-transparent focus:border-[#004d75] focus:outline-none transition-all rounded-sm p-4"
            {...register('password')}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#004d75] text-white p-4 font-bold rounded-sm transition-all hover:shadow-[0_0_32px_rgba(0,77,117,0.06)] hover:opacity-90 disabled:opacity-50 mt-4"
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-on-surface/60">
        Don&apos;t have an account? <Link href="/register" className="font-bold text-[#004d75] hover:underline">Register</Link>
      </p>
    </div>
  );
}