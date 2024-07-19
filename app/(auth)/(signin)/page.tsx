'use client';
import { Metadata } from 'next';
import Link from 'next/link';
import UserAuthForm from '@/components/forms/user-auth-form';
import { Button } from '@/components/ui/button';
import useStore from '@/lib/store';
import Image from 'next/image';
import Logo from '../../../public/speedo.png';
// import { buttonVariants } from '@/components/ui/button';
// import { cn } from '@/lib/utils';

// export const metadata: Metadata = {
//   title: 'Login',
//   description: 'Authentication forms built using the components.'
// };

export default function AuthenticationPage() {
  // Deconstructing data from store.
  const { isUserLoggedin, setIsLogin } = useStore();
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src={Logo}
            width={500}
            height={500}
            alt="Logo"
            className="ml-12"
          />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            {/* <footer className="text-sm">Sofia Davis</footer> */}
          </blockquote>
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isUserLoggedin ? 'Login an account' : 'Create an account'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isUserLoggedin
                ? 'Enter your email & password below to login your account'
                : 'Enter your email & password below to create your account'}
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
