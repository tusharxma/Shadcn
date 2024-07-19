'use client';
import { Button } from '@/components/ui/button';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../../utils/firebase';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import GoogleSignInButton from '../github-auth-button';
import useStore from '@/lib/store';
import { useRouter } from 'next/navigation';
import { collection, addDoc, Firestore } from 'firebase/firestore';
import { db } from '../../utils/firebase';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .max(10, { message: 'Password cannot be more than 10' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  // Deconstructing data from store.
  const { isUserLoggedin, setIsLogin } = useStore();
  // assigning userouter() to a valribale
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    email: '',
    password: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    {
      isUserLoggedin
        ? signInWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
              const user = userCredential.user;
              console.log('🚀 ~ .then ~ user login:', user);

              router.push('/dashboard');
            })
            .catch((error) => {
              console.log(error);
              const errorMessage = error.message;
              console.log('🚀 ~ onSubmit ~ errorMessage:', errorMessage);
            })
        : createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
              const user = userCredential.user;
              console.log('🚀 ~ .then ~ user sign up:', user);

              const docRef = addDoc(collection(db, 'users'), user);

              console.log('🚀 ~ .then ~ docRef:', docRef);
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              // ..
            });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={loading}
            className="ml-auto w-full"
            type="submit"
            variant="default"
            size="default"
          >
            {isUserLoggedin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {isUserLoggedin
              ? "Don't have an account"
              : 'Already have an account'}
          </span>
        </div>
      </div>
      {/* <GoogleSignInButton /> */}
      <Button
        // disabled={loading}
        className="w-full"
        variant="outline"
        type="button"
        onClick={() => {
          setIsLogin(!isUserLoggedin);
        }}
      >
        {isUserLoggedin ? 'Sign Up' : 'Sign In'}
      </Button>
    </>
  );
}
