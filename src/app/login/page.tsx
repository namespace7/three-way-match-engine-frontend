'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { getErrorMessage } from '@/utils/error';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    try {
      await login({
        username: data.username,
        email: data.username,
        password: data.password,
      });
      router.push('/dashboard');
    } catch (err: unknown) {
      setErrorMessage(getErrorMessage(err, 'Authentication failed. Please verify your credentials.'));
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-950 mb-3">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">Three-Way Match Engine</h2>
          <p className="mt-1 text-xs text-zinc-400">Reconciliation & Accounting Verification Portal</p>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Sign In</CardTitle>
            <CardDescription className="text-xs">
              Enter your system username and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="mb-4 flex items-start gap-2 rounded-md border border-rose-800 bg-rose-950/60 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Username"
                placeholder="Enter username"
                autoComplete="username"
                {...register('username')}
                error={errors.username?.message}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password')}
                error={errors.password?.message}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
